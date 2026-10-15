// Windows 桌面版：托盘常驻，快捷键 Ctrl+Alt+S 弹出小窗口；本机服务只监听 127.0.0.1，网页文件嵌在 exe 里。
// 用 .NET Framework 自带的 csc 编译（tools/build-exe.mjs），不需要安装别的东西。
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using Microsoft.Win32;
using System.Net;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Forms;

static class Program
{
    // 自测时带上后缀，不和真正在运行的那一个抢
    public static readonly string Suffix = Environment.GetEnvironmentVariable("PLAN_HELPER_TEST") ?? "";
    static readonly string SingleName = "prompt-plan-helper-single" + Suffix;
    static readonly string OpenEventName = "prompt-plan-helper-open" + Suffix;

    [STAThread]
    static void Main(string[] args)
    {
        bool created;
        using (var mutex = new Mutex(true, SingleName, out created))
        {
            if (!created)
            {
                // 已经在运行：让它把窗口拿到最前面（没有窗口就新开一个），并允许它抢到前台
                WinApi.AllowSetForegroundWindow(-1);
                try { EventWaitHandle.OpenExisting(OpenEventName).Set(); } catch (Exception) { }
                return;
            }
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Host(OpenEventName));
        }
    }
}

// 语言文件（locales/*.json）嵌在 exe 里：菜单文字和计划书格式里的固定词都从这里取，代码里不写任何一种语言的原文。
static class Vocab
{
    static readonly JavaScriptSerializer Json = new JavaScriptSerializer { MaxJsonLength = int.MaxValue };
    // 按语言代号排序，和命令行、网页里的顺序一致
    public static readonly SortedDictionary<string, Dictionary<string, object>> Locales = Load();

    static SortedDictionary<string, Dictionary<string, object>> Load()
    {
        var all = new SortedDictionary<string, Dictionary<string, object>>(StringComparer.Ordinal);
        var asm = Assembly.GetExecutingAssembly();
        foreach (var name in asm.GetManifestResourceNames())
        {
            if (!name.StartsWith("locale/") || !name.EndsWith(".json")) continue;
            using (var s = asm.GetManifestResourceStream(name))
            using (var r = new StreamReader(s, Encoding.UTF8))
                all[name.Substring(7, name.Length - 12)] = (Dictionary<string, object>)Json.DeserializeObject(r.ReadToEnd());
        }
        return all;
    }

    // 当前系统界面语言；没有对应的语言文件就用 en
    public static string Lang
    {
        get
        {
            var l = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
            return Locales.ContainsKey(l) ? l : "en";
        }
    }

    static Dictionary<string, object> Part(string lang, string part)
    {
        return (Dictionary<string, object>)Locales[lang][part];
    }

    // 桌面版自己的文字
    public static string Text(string key)
    {
        return Convert.ToString(Part(Lang, "exe")[key]);
    }

    // 每种语言里页面标题的文字，用来找已经打开的小窗口
    public static string[] Titles()
    {
        return Locales.Keys.Select(k => Convert.ToString(Part(k, "ui")["prompt_plan_helper"])).ToArray();
    }

    public static IEnumerable<Dictionary<string, object>> Docs
    {
        get { return Locales.Keys.Select(k => Part(k, "doc")); }
    }

    public static string Word(Dictionary<string, object> doc, string key)
    {
        return Convert.ToString(doc[key]);
    }

    public static string Sub(Dictionary<string, object> doc, string group, string key)
    {
        return Convert.ToString(((Dictionary<string, object>)doc[group])[key]);
    }

    // 一组词：doc[key] 本身是数组
    public static IEnumerable<string> Items(Dictionary<string, object> doc, string key)
    {
        var o = doc[key] as System.Collections.IEnumerable;
        return o.Cast<object>().Select(Convert.ToString);
    }

    public static IEnumerable<string> List(Dictionary<string, object> doc, string group, string key)
    {
        var o = ((Dictionary<string, object>)doc[group])[key] as System.Collections.IEnumerable;
        return o.Cast<object>().Select(Convert.ToString);
    }

    // 各语言里同一个意思的词，拼成正则里的「或」
    public static string Alt(Func<Dictionary<string, object>, IEnumerable<string>> pick)
    {
        return "(?:" + string.Join("|", Docs.SelectMany(pick).Select(Regex.Escape)) + ")";
    }
}

static class WinApi
{
    delegate bool EnumProc(IntPtr h, IntPtr l);
    [DllImport("user32.dll")] static extern bool EnumWindows(EnumProc p, IntPtr l);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetClassName(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll")] static extern bool IsIconic(IntPtr h);
    [DllImport("user32.dll")] static extern bool ShowWindow(IntPtr h, int cmd);
    [DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] static extern void keybd_event(byte vk, byte scan, uint flags, UIntPtr extra);
    [DllImport("user32.dll")] public static extern bool AllowSetForegroundWindow(int pid);

    // 找已经打开的小窗口：浏览器应用窗口，标题是页面标题
    public static IntPtr FindWindow(string[] titles)
    {
        IntPtr found = IntPtr.Zero;
        EnumWindows((h, l) =>
        {
            if (!IsWindowVisible(h)) return true;
            var cls = new StringBuilder(64);
            GetClassName(h, cls, 64);
            if (cls.ToString() != "Chrome_WidgetWin_1") return true;
            var text = new StringBuilder(256);
            GetWindowText(h, text, 256);
            var s = text.ToString();
            if (titles.Any(t => s == t)) { found = h; return false; }
            return true;
        }, IntPtr.Zero);
        return found;
    }

    public static void Raise(IntPtr h)
    {
        if (IsIconic(h)) ShowWindow(h, 9);
        // 按一下 Alt，系统才允许后台进程把窗口提到前台
        keybd_event(0x12, 0, 0, UIntPtr.Zero);
        keybd_event(0x12, 0, 2, UIntPtr.Zero);
        SetForegroundWindow(h);
    }
}

class HotkeyWindow : NativeWindow, IDisposable
{
    [DllImport("user32.dll")] static extern bool RegisterHotKey(IntPtr hWnd, int id, uint modifiers, uint vk);
    [DllImport("user32.dll")] static extern bool UnregisterHotKey(IntPtr hWnd, int id);
    const int WM_HOTKEY = 0x0312;
    public event Action Pressed;
    public bool Registered;

    public HotkeyWindow()
    {
        CreateHandle(new CreateParams());
        // MOD_ALT = 1, MOD_CONTROL = 2
        Registered = RegisterHotKey(Handle, 1, 1 | 2, (uint)Keys.S);
    }

    protected override void WndProc(ref Message m)
    {
        if (m.Msg == WM_HOTKEY && Pressed != null) Pressed();
        base.WndProc(ref m);
    }

    public void Dispose()
    {
        UnregisterHotKey(Handle, 1);
        DestroyHandle();
    }
}

class Host : ApplicationContext
{
    readonly NotifyIcon tray = new NotifyIcon();
    readonly HotkeyWindow hotkey = new HotkeyWindow();
    readonly Server server = new Server();
    readonly EventWaitHandle openEvent;
    readonly Control sync = new Control();

    public Host(string openEventName)
    {
        sync.CreateControl();
        openEvent = new EventWaitHandle(false, EventResetMode.AutoReset, openEventName);
        var t = new Thread(() =>
        {
            while (true)
            {
                openEvent.WaitOne();
                try { sync.BeginInvoke(new Action(OpenHub)); } catch (Exception) { return; }
            }
        });
        t.IsBackground = true;
        t.Start();

        server.Start();
        hotkey.Pressed += OpenHub;

        var menu = new ContextMenuStrip();
        var show = menu.Items.Add(Vocab.Text("show_window"), null, delegate { OpenHub(); });
        show.Font = new Font(show.Font, FontStyle.Bold);
        menu.Items.Add(Vocab.Text("exit"), null, delegate { ExitThread(); });
        tray.Icon = Server.AppIcon();
        tray.Text = Vocab.Titles()[Array.IndexOf(Vocab.Locales.Keys.ToArray(), Vocab.Lang)];
        tray.ContextMenuStrip = menu;
        tray.Visible = true;
        tray.MouseClick += (s, e) => { if (e.Button == MouseButtons.Left) OpenHub(); };
        tray.BalloonTipTitle = tray.Text;
        tray.BalloonTipText = hotkey.Registered ? Vocab.Text("tray_running") : Vocab.Text("tray_hotkey_taken");
        tray.ShowBalloonTip(4000);
        PromoteTray();
        // 自己启动时直接打开小窗口；自测时不弹
        if (Program.Suffix == "") OpenHub();
    }

    // Windows 11 默认把新的托盘图标收进「^」里；条目出现后，把它设为直接显示在任务栏
    // 用户自己改过的设置（已有 IsPromoted 值）不动
    void PromoteTray()
    {
        var tries = 0;
        var timer = new System.Windows.Forms.Timer { Interval = 800 };
        timer.Tick += delegate
        {
            tries++;
            var state = TrayPromotion();
            if (state == 0 && tries < 6) return;
            timer.Stop();
            timer.Dispose();
            if (state == 0)
            {
                tray.BalloonTipText = Vocab.Text("tray_hidden");
                tray.ShowBalloonTip(6000);
            }
        };
        timer.Start();
    }

    // 1：已设为显示或用户有自己的设置；0：还没有找到条目或不能写入
    int TrayPromotion()
    {
        try
        {
            var exe = Application.ExecutablePath;
            var hit = 0;
            using (var root = Registry.CurrentUser.OpenSubKey(@"Control Panel\NotifyIconSettings", true))
            {
                if (root == null) return 0;
                foreach (var name in root.GetSubKeyNames())
                {
                    using (var k = root.OpenSubKey(name, true))
                    {
                        var p = k.GetValue("ExecutablePath") as string;
                        if (p == null || !string.Equals(p, exe, StringComparison.OrdinalIgnoreCase)) continue;
                        if (k.GetValue("IsPromoted") == null) k.SetValue("IsPromoted", 1, RegistryValueKind.DWord);
                        hit++;
                    }
                }
            }
            return hit > 0 ? 1 : 0;
        }
        catch (Exception)
        {
            return 0;
        }
    }

    void OpenHub()
    {
        var existing = WinApi.FindWindow(Vocab.Titles());
        if (existing != IntPtr.Zero)
        {
            WinApi.Raise(existing);
            return;
        }
        var url = server.Url("&win=1&view=hub");
        var browser = Server.FindBrowser();
        if (browser == null)
        {
            Process.Start(url);
            return;
        }
        Process.Start(browser, "--app=\"" + url + "\" --window-size=360,480");
    }

    protected override void ExitThreadCore()
    {
        tray.Visible = false;
        tray.Dispose();
        hotkey.Dispose();
        server.Stop();
        base.ExitThreadCore();
    }
}

class Server
{
    static readonly JavaScriptSerializer Json = new JavaScriptSerializer { MaxJsonLength = int.MaxValue };
    // 计划书文件：默认的名字，以及同一个文件夹里的多份（前缀加名称）；名字都来自语言文件
    static readonly string[] PlanNames = Vocab.Docs.Select(d => Vocab.Word(d, "planFile")).ToArray();
    static readonly Regex PlanFileRe = new Regex("^(?:" + string.Join("|", PlanNames.Select(n => Regex.Escape(Path.GetFileNameWithoutExtension(n)))) + ")(?:-[^\\\\/:*?\"<>|]{1,60})?\\.md$", RegexOptions.IgnoreCase);
    static readonly string Seps = "[：:]";
    static readonly string TbdAlt = Vocab.Alt(d => new[] { Vocab.Word(d, "tbd") });
    static readonly Regex ProgressLabelRe = new Regex("^" + Vocab.Alt(d => Vocab.List(d, "labels", "progress")) + Seps + "\\s*(.*)$", RegexOptions.IgnoreCase);
    static readonly Regex DoneRe = new Regex("^" + Vocab.Alt(d => new[] { Vocab.Sub(d, "progress", "done") }), RegexOptions.IgnoreCase);
    static readonly Regex DoingRe = new Regex("^" + Vocab.Alt(d => new[] { Vocab.Sub(d, "progress", "doing") }), RegexOptions.IgnoreCase);
    static readonly Regex TitleRe = new Regex("^#\\s+(?:" + Vocab.Alt(d => new[] { Vocab.Word(d, "title") }.Concat(Vocab.Items(d, "titleAlt"))) + Seps + "\\s*)?(.*)$");
    static readonly Regex StatusLineRe = new Regex("^" + Vocab.Alt(d => new[] { Vocab.Word(d, "status") }) + Seps + "\\s*(.*?)(?:　+|\\s{2,}|$)");
    static readonly Regex QuotedTbdRe = new Regex("[「\"“]" + TbdAlt + "[^」\"”]*[」\"”]");
    static readonly Regex TbdMarkRe = new Regex(TbdAlt + Seps);
    static readonly Regex ApprovedNoteRe = new Regex("^" + Vocab.Alt(d => new[] { Vocab.Sub(d, "states", "approved") }) + "\\s*(?:=|is)", RegexOptions.IgnoreCase);
    static readonly Regex NotAFieldRe = new Regex("^(?:" + TbdAlt.Substring(3, TbdAlt.Length - 4) + "|" + Vocab.Alt(d => Vocab.List(d, "labels", "issues")) + ")$", RegexOptions.IgnoreCase);
    static Regex StateRe(string code) { return new Regex("^" + Vocab.Alt(d => new[] { Vocab.Sub(d, "states", code) }) + "$", RegexOptions.IgnoreCase); }
    readonly string home = Environment.GetEnvironmentVariable("USERPROFILE") ?? Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
    // 浏览器扩展联系过本服务
    volatile bool extensionSeen;
    readonly HashSet<string> connected = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    // 拖入的文件夹按名字找到的候选，用户已经明确要打开它，可以连接
    readonly HashSet<string> offered = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    readonly string token;
    HttpListener listener;
    int port;

    public Server()
    {
        var bytes = new byte[12];
        new RNGCryptoServiceProvider().GetBytes(bytes);
        token = BitConverter.ToString(bytes).Replace("-", "").ToLowerInvariant();
    }

    public string Url(string extra)
    {
        return "http://127.0.0.1:" + port + "/index.html?k=" + token + extra;
    }

    public static Icon AppIcon()
    {
        using (var s = Assembly.GetExecutingAssembly().GetManifestResourceStream("shupian.ico"))
        {
            return s == null ? SystemIcons.Application : new Icon(s);
        }
    }

    public static string FindBrowser()
    {
        var pf86 = Environment.GetEnvironmentVariable("ProgramFiles(x86)") ?? "";
        var pf = Environment.GetEnvironmentVariable("ProgramFiles") ?? "";
        var list = new[]
        {
            Path.Combine(pf86, @"Microsoft\Edge\Application\msedge.exe"),
            Path.Combine(pf, @"Microsoft\Edge\Application\msedge.exe"),
            Path.Combine(pf, @"Google\Chrome\Application\chrome.exe"),
            Path.Combine(pf86, @"Google\Chrome\Application\chrome.exe"),
        };
        return list.FirstOrDefault(File.Exists);
    }

    // 本机装了的浏览器：代号、名称、程序路径、扩展页地址
    public static List<string[]> Browsers()
    {
        var pf86 = Environment.GetEnvironmentVariable("ProgramFiles(x86)") ?? "";
        var pf = Environment.GetEnvironmentVariable("ProgramFiles") ?? "";
        var all = new[]
        {
            new[] { "edge", "Edge", Path.Combine(pf86, "Microsoft", "Edge", "Application", "msedge.exe"), "edge://extensions/" },
            new[] { "edge", "Edge", Path.Combine(pf, "Microsoft", "Edge", "Application", "msedge.exe"), "edge://extensions/" },
            new[] { "chrome", "Chrome", Path.Combine(pf, "Google", "Chrome", "Application", "chrome.exe"), "chrome://extensions/" },
            new[] { "chrome", "Chrome", Path.Combine(pf86, "Google", "Chrome", "Application", "chrome.exe"), "chrome://extensions/" },
            new[] { "firefox", "Firefox", Path.Combine(pf, "Mozilla Firefox", "firefox.exe"), "about:debugging#/runtime/this-firefox" },
            new[] { "firefox", "Firefox", Path.Combine(pf86, "Mozilla Firefox", "firefox.exe"), "about:debugging#/runtime/this-firefox" },
        };
        var found = new List<string[]>();
        foreach (var b in all)
            if (File.Exists(b[2]) && !found.Any(x => x[0] == b[0])) found.Add(b);
        return found;
    }

    // 浏览器扩展：嵌在 exe 里的文件放到固定的文件夹（内容有变才写），浏览器里「加载解压缩的扩展」选这个文件夹
    string SyncExtension()
    {
        var dir = Path.Combine(home, ".shupian", "extension");
        var asm = Assembly.GetExecutingAssembly();
        foreach (var name in asm.GetManifestResourceNames())
        {
            if (!name.StartsWith("ext/")) continue;
            var to = Path.Combine(dir, name.Substring(4).Replace('/', Path.DirectorySeparatorChar));
            byte[] data;
            using (var s = asm.GetManifestResourceStream(name))
            using (var ms = new MemoryStream())
            {
                s.CopyTo(ms);
                data = ms.ToArray();
            }
            if (File.Exists(to) && File.ReadAllBytes(to).SequenceEqual(data)) continue;
            Directory.CreateDirectory(Path.GetDirectoryName(to));
            File.WriteAllBytes(to, data);
        }
        return dir;
    }

    public void Start()
    {
        var start = 14165;
        var env = Environment.GetEnvironmentVariable("PORT");
        int parsed;
        if (env != null && int.TryParse(env, out parsed)) start = parsed;
        for (var p = start; p < start + 60; p++)
        {
            var l = new HttpListener();
            l.Prefixes.Add("http://127.0.0.1:" + p + "/");
            try
            {
                l.Start();
                listener = l;
                port = p;
                break;
            }
            catch (Exception) { l.Close(); }
        }
        if (listener == null) throw new InvalidOperationException("no free port");
        var th = new Thread(Loop);
        th.IsBackground = true;
        th.Start();
        WriteState();
    }

    public void Stop()
    {
        try { listener.Stop(); } catch (Exception) { }
    }

    void WriteState()
    {
        var dir = Path.Combine(home, ".shupian");
        Directory.CreateDirectory(dir);
        var info = new Dictionary<string, object> { { "port", port }, { "token", token }, { "pid", Process.GetCurrentProcess().Id } };
        File.WriteAllText(Path.Combine(dir, "server.json"), Json.Serialize(info));
    }

    void Loop()
    {
        while (listener.IsListening)
        {
            HttpListenerContext ctx;
            try { ctx = listener.GetContext(); } catch (Exception) { return; }
            ThreadPool.QueueUserWorkItem(delegate { Handle(ctx); });
        }
    }

    void Send(HttpListenerContext ctx, int code, string type, byte[] data)
    {
        ctx.Response.StatusCode = code;
        ctx.Response.ContentType = type;
        ctx.Response.AddHeader("Cache-Control", "no-store");
        ctx.Response.ContentLength64 = data.Length;
        ctx.Response.OutputStream.Write(data, 0, data.Length);
        ctx.Response.OutputStream.Close();
    }

    void SendJson(HttpListenerContext ctx, int code, object obj)
    {
        Send(ctx, code, "application/json; charset=utf-8", Encoding.UTF8.GetBytes(Json.Serialize(obj)));
    }

    static string Query(Uri url, string key)
    {
        foreach (var part in url.Query.TrimStart('?').Split(new[] { '&' }, StringSplitOptions.RemoveEmptyEntries))
        {
            var kv = part.Split(new[] { '=' }, 2);
            if (Uri.UnescapeDataString(kv[0]) == key && kv.Length > 1) return Uri.UnescapeDataString(kv[1].Replace('+', ' '));
        }
        return "";
    }

    void Handle(HttpListenerContext ctx)
    {
        try
        {
            var url = ctx.Request.Url;
            if (ctx.Request.Headers["Host"] != "127.0.0.1:" + port) { SendJson(ctx, 403, new { error = "host" }); return; }
            var path = url.AbsolutePath;
            if (path == "/api/pair" && ctx.Request.HttpMethod == "POST")
            {
                // 只有扩展发来的请求（来源是扩展自己的地址）能拿到口令，网页拿不到
                var origin = ctx.Request.Headers["Origin"] ?? "";
                if (!origin.StartsWith("chrome-extension://") && !origin.StartsWith("moz-extension://")) { SendJson(ctx, 403, new { error = "origin" }); return; }
                extensionSeen = true;
                SendJson(ctx, 200, new { token = token });
                return;
            }
            if (path.StartsWith("/api/"))
            {
                if (ctx.Request.Headers["x-shupian-token"] != token) { SendJson(ctx, 401, new { error = "token" }); return; }
                Api(ctx, path, url);
                return;
            }
            if (path == "/") path = "/index.html";
            var name = "web" + path;
            using (var s = Assembly.GetExecutingAssembly().GetManifestResourceStream(name))
            {
                if (s == null) { Send(ctx, 404, "text/plain", Encoding.UTF8.GetBytes("not found")); return; }
                var ms = new MemoryStream();
                s.CopyTo(ms);
                Send(ctx, 200, ContentType(path), ms.ToArray());
            }
        }
        catch (Exception e)
        {
            try { SendJson(ctx, 500, new { error = e.Message }); } catch (Exception) { }
        }
    }

    static string ContentType(string path)
    {
        switch (Path.GetExtension(path).ToLowerInvariant())
        {
            case ".html": return "text/html; charset=utf-8";
            case ".js": return "text/javascript; charset=utf-8";
            case ".css": return "text/css; charset=utf-8";
            case ".json": return "application/json";
            case ".svg": return "image/svg+xml";
            case ".png": return "image/png";
            case ".ico": return "image/x-icon";
            case ".webmanifest": return "application/manifest+json";
            case ".xml": return "application/xml";
            default: return "application/octet-stream";
        }
    }

    // ---------- 接口 ----------

    void Api(HttpListenerContext ctx, string path, Uri url)
    {
        if (path == "/api/ping") { SendJson(ctx, 200, new { ok = true }); return; }
        if (path == "/api/projects") { SendJson(ctx, 200, Projects()); return; }
        if (path == "/api/mkdir" && ctx.Request.HttpMethod == "POST")
        {
            var obj = Json.DeserializeObject(Encoding.UTF8.GetString(ReadBody(ctx))) as Dictionary<string, object>;
            var parent = obj != null && obj.ContainsKey("parent") ? Convert.ToString(obj["parent"]) : "";
            var name = obj != null && obj.ContainsKey("name") ? Convert.ToString(obj["name"]) : "";
            var bad = FolderNameError(name);
            if (bad != "") { SendJson(ctx, 400, new { error = bad }); return; }
            if (parent == "" || !Directory.Exists(parent) || !Known(parent)) { SendJson(ctx, 404, new { error = "folder" }); return; }
            var target = Path.Combine(Path.GetFullPath(parent), name.Trim());
            if (Directory.Exists(target) || File.Exists(target)) { SendJson(ctx, 409, new { error = "exists" }); return; }
            Directory.CreateDirectory(target);
            var made = Remember(target);
            SendJson(ctx, 200, new { path = made, name = Path.GetFileName(made) });
            return;
        }
        if (path == "/api/extension")
        {
            if (ctx.Request.HttpMethod == "GET")
            {
                SendJson(ctx, 200, new { path = SyncExtension(), seen = extensionSeen, browsers =Browsers().Select(b => new { id = b[0], name = b[1] }).ToList() });
                return;
            }
            if (ctx.Request.HttpMethod == "POST")
            {
                var obj = Json.DeserializeObject(Encoding.UTF8.GetString(ReadBody(ctx))) as Dictionary<string, object>;
                var id = obj != null && obj.ContainsKey("browser") ? Convert.ToString(obj["browser"]) : "";
                var b = Browsers().FirstOrDefault(x => x[0] == id);
                if (b == null) { SendJson(ctx, 404, new { error = "browser" }); return; }
                Process.Start(b[2], b[3]);
                SendJson(ctx, 200, new { ok = true });
                return;
            }
        }
        if (path == "/api/current" && ctx.Request.HttpMethod == "POST")
        {
            var obj = Json.DeserializeObject(Encoding.UTF8.GetString(ReadBody(ctx))) as Dictionary<string, object>;
            var root = obj != null && obj.ContainsKey("path") ? Convert.ToString(obj["path"]) : "";
            var file = obj != null && obj.ContainsKey("file") ? Convert.ToString(obj["file"]) : "";
            if (root == "" || !Known(root)) { SendJson(ctx, 404, new { error = "folder" }); return; }
            if (!PlanFileRe.IsMatch(file) || !File.Exists(Path.Combine(Path.GetFullPath(root), file))) { SendJson(ctx, 404, new { error = "file" }); return; }
            SetCurrent(root, file);
            SendJson(ctx, 200, new { ok = true });
            return;
        }
        if (path == "/api/locate" && ctx.Request.HttpMethod == "POST")
        {
            var obj = Json.DeserializeObject(Encoding.UTF8.GetString(ReadBody(ctx))) as Dictionary<string, object>;
            var name = obj != null && obj.ContainsKey("name") ? Convert.ToString(obj["name"]) : "";
            if (FolderNameError(name) != "") { SendJson(ctx, 400, new { error = "name" }); return; }
            var entries = new List<string>();
            var arr = obj.ContainsKey("entries") ? obj["entries"] as System.Collections.IEnumerable : null;
            if (arr != null) foreach (var e in arr) entries.Add(Convert.ToString(e));
            SendJson(ctx, 200, new { candidates = LocateFolder(name.Trim(), entries) });
            return;
        }
        if (path == "/api/pick" && ctx.Request.HttpMethod == "POST")
        {
            var pickBody = Json.DeserializeObject(Encoding.UTF8.GetString(ReadBody(ctx))) as Dictionary<string, object>;
            var description = pickBody != null && pickBody.ContainsKey("description") ? Convert.ToString(pickBody["description"]) : "";
            var picked = PickFolder(description);
            if (string.IsNullOrEmpty(picked) || !Directory.Exists(picked)) { SendJson(ctx, 200, new { path = "" }); return; }
            var full = Remember(picked);
            SendJson(ctx, 200, new { path = full, name = Path.GetFileName(full) });
            return;
        }
        if (path == "/api/connect" && ctx.Request.HttpMethod == "POST")
        {
            var body = ReadBody(ctx);
            var obj = Json.DeserializeObject(Encoding.UTF8.GetString(body)) as Dictionary<string, object>;
            var p = obj != null && obj.ContainsKey("path") ? Convert.ToString(obj["path"]) : "";
            if (p == "" || !Directory.Exists(p) || !Known(p)) { SendJson(ctx, 404, new { error = "folder" }); return; }
            var full = Remember(p);
            SendJson(ctx, 200, new { path = full, name = Path.GetFileName(full), file = CurrentFile(full), plans = PlanFiles(full).Select(n => Summary(full, n)).ToList(), summary = Summary(full) });
            return;
        }
        if (path == "/api/file")
        {
            var file = PlanPath(Query(url, "root"), Query(url, "p"));
            if (file == null) { SendJson(ctx, 400, new { error = "path" }); return; }
            if (ctx.Request.HttpMethod == "GET")
            {
                if (File.Exists(file)) SendJson(ctx, 200, new { exists = true, text = File.ReadAllText(file, Encoding.UTF8), mtime = ToMs(File.GetLastWriteTime(file)) });
                else SendJson(ctx, 200, new { exists = false });
                return;
            }
            if (ctx.Request.HttpMethod == "PUT")
            {
                File.WriteAllBytes(file, ReadBody(ctx));
                SendJson(ctx, 200, new { ok = true });
                return;
            }
        }
        SendJson(ctx, 404, new { error = "api" });
    }

    static byte[] ReadBody(HttpListenerContext ctx)
    {
        var ms = new MemoryStream();
        ctx.Request.InputStream.CopyTo(ms);
        return ms.ToArray();
    }

    // 文件夹名里不能有这些字符，也不能以点或空格结尾
    static string FolderNameError(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return "empty";
        if (name.Length > 100 || Regex.IsMatch(name, "[\\\\/:*?\"<>|]") || Regex.IsMatch(name, "[. ]$") || name == "." || name == "..") return "name";
        return "";
    }

    // 按名字和里面的文件找一个拖进来的文件夹的地址：只在已知文件夹的上一级和已知文件夹本身里找
    List<string> LocateFolder(string name, List<string> entries)
    {
        var parents = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var own = new List<string>();
        foreach (var f in ClaudeFolders().Concat(History()))
        {
            var full = Path.GetFullPath(f.path);
            own.Add(full);
            var up = Path.GetDirectoryName(full);
            if (!string.IsNullOrEmpty(up)) parents.Add(up);
        }
        foreach (var c in connected)
        {
            own.Add(c);
            var up = Path.GetDirectoryName(c);
            if (!string.IsNullOrEmpty(up)) parents.Add(up);
        }
        var found = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        Action<string> check = dir =>
        {
            if (!Directory.Exists(dir)) return;
            var have = new HashSet<string>(Directory.GetFileSystemEntries(dir).Select(Path.GetFileName), StringComparer.OrdinalIgnoreCase);
            if (entries.All(e => have.Contains(e))) found[dir] = dir;
        };
        foreach (var p in parents) check(Path.Combine(p, name));
        foreach (var p in own.Where(x => string.Equals(Path.GetFileName(x), name, StringComparison.OrdinalIgnoreCase))) check(p);
        foreach (var f in found.Values) offered.Add(Path.GetFullPath(f));
        return found.Values.ToList();
    }

    string PickFolder(string description)
    {
        string result = "";
        var t = new Thread(() =>
        {
            using (var d = new FolderBrowserDialog())
            {
                d.ShowNewFolderButton = true;
                d.Description = description ?? "";
                if (d.ShowDialog() == DialogResult.OK) result = d.SelectedPath;
            }
        });
        t.SetApartmentState(ApartmentState.STA);
        t.Start();
        t.Join();
        return result;
    }

    // ---------- 文件夹 ----------

    string StateDir { get { return Path.Combine(home, ".shupian"); } }

    class Folder
    {
        public string path, name;
        public double last;
    }

    static double ToMs(DateTime t)
    {
        return (t.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds;
    }

    List<Folder> ClaudeFolders()
    {
        var list = new List<Folder>();
        var file = Path.Combine(home, ".claude.json");
        if (!File.Exists(file)) return list;
        var root = Json.DeserializeObject(File.ReadAllText(file, Encoding.UTF8)) as Dictionary<string, object>;
        var projects = root != null && root.ContainsKey("projects") ? root["projects"] as Dictionary<string, object> : null;
        if (projects == null) return list;
        foreach (var key in projects.Keys)
        {
            string full;
            try { full = Path.GetFullPath(key); } catch (Exception) { continue; }
            if (!Directory.Exists(full)) continue;
            var dir = Path.Combine(home, ".claude", "projects", Regex.Replace(full, "[^A-Za-z0-9]", "-"));
            double last = 0;
            if (Directory.Exists(dir))
            {
                foreach (var f in Directory.GetFiles(dir, "*.jsonl")) last = Math.Max(last, ToMs(File.GetLastWriteTime(f)));
            }
            if (last > 0) list.Add(new Folder { path = full, name = Path.GetFileName(full), last = last });
        }
        return list.OrderByDescending(x => x.last).Take(20).ToList();
    }

    List<Folder> History()
    {
        var list = new List<Folder>();
        var file = Path.Combine(StateDir, "history.json");
        if (!File.Exists(file)) return list;
        try
        {
            var arr = Json.DeserializeObject(File.ReadAllText(file, Encoding.UTF8)) as object[];
            if (arr == null) return list;
            foreach (var o in arr)
            {
                var d = o as Dictionary<string, object>;
                if (d == null || !d.ContainsKey("path")) continue;
                var p = Convert.ToString(d["path"]);
                if (!Directory.Exists(p)) continue;
                list.Add(new Folder { path = p, name = Path.GetFileName(p), last = d.ContainsKey("last") ? Convert.ToDouble(d["last"]) : 0 });
            }
        }
        catch (Exception) { }
        return list;
    }

    string Remember(string path)
    {
        var full = Path.GetFullPath(path);
        connected.Add(full);
        Directory.CreateDirectory(StateDir);
        var list = History().Where(x => !string.Equals(x.path, full, StringComparison.OrdinalIgnoreCase)).ToList();
        list.Insert(0, new Folder { path = full, last = ToMs(DateTime.Now) });
        var plain = list.Take(30).Select(x => new Dictionary<string, object> { { "path", x.path }, { "last", x.last } }).ToList();
        File.WriteAllText(Path.Combine(StateDir, "history.json"), Json.Serialize(plain));
        return full;
    }

    bool Known(string path)
    {
        string full;
        try { full = Path.GetFullPath(path); } catch (Exception) { return false; }
        if (connected.Contains(full) || offered.Contains(full)) return true;
        return ClaudeFolders().Any(x => string.Equals(x.path, full, StringComparison.OrdinalIgnoreCase))
            || History().Any(x => string.Equals(x.path, full, StringComparison.OrdinalIgnoreCase));
    }

    string PlanPath(string root, string rel)
    {
        if (string.IsNullOrEmpty(root) || !Known(root)) return null;
        if (rel == null || !PlanFileRe.IsMatch(rel)) return null;
        return Path.Combine(Path.GetFullPath(root), rel);
    }

    object Projects()
    {
        var claude = ClaudeFolders();
        var now = ToMs(DateTime.Now);
        Func<Folder, Dictionary<string, object>> shape = f =>
        {
            var plans = PlanFiles(f.path).Select(n => Summary(f.path, n)).ToList();
            var file = CurrentFile(f.path);
            return new Dictionary<string, object>
            {
                { "path", f.path }, { "name", f.name }, { "last", f.last },
                { "active", now - f.last < 10 * 60 * 1000 },
                { "plans", plans }, { "file", file },
                { "summary", file == "" ? null : Summary(f.path, file) },
            };
        };
        var seen = new HashSet<string>(claude.Select(x => x.path), StringComparer.OrdinalIgnoreCase);
        return new Dictionary<string, object>
        {
            { "claude", claude.Select(shape).ToList() },
            { "history", History().Where(x => !seen.Contains(x.path)).Select(shape).ToList() },
            { "last", ReadCurrent().ContainsKey("last") ? ReadCurrent()["last"] : null },
        };
    }

    // ---------- 同一个文件夹里的多份计划书 ----------

    string CurrentPath { get { return Path.Combine(StateDir, "current.json"); } }

    Dictionary<string, object> ReadCurrent()
    {
        try
        {
            if (File.Exists(CurrentPath))
            {
                var d = Json.DeserializeObject(File.ReadAllText(CurrentPath, Encoding.UTF8)) as Dictionary<string, object>;
                if (d != null) return d;
            }
        }
        catch (Exception) { }
        return new Dictionary<string, object>();
    }

    // 默认的两个名字排在前面，其余按名字排
    List<string> PlanFiles(string root)
    {
        var have = new List<string>();
        if (Directory.Exists(root))
        {
            foreach (var f in Directory.GetFiles(root))
            {
                var n = Path.GetFileName(f);
                if (PlanFileRe.IsMatch(n)) have.Add(n);
            }
        }
        var first = PlanNames.Where(n => have.Any(h => string.Equals(h, n, StringComparison.OrdinalIgnoreCase))).ToList();
        var rest = have.Where(n => !first.Any(f => string.Equals(f, n, StringComparison.OrdinalIgnoreCase))).OrderBy(n => n, StringComparer.Ordinal).ToList();
        return first.Concat(rest).ToList();
    }

    string CurrentFile(string root)
    {
        var list = PlanFiles(root);
        var cur = ReadCurrent();
        var files = cur.ContainsKey("files") ? cur["files"] as Dictionary<string, object> : null;
        var key = Path.GetFullPath(root).ToLowerInvariant();
        if (files != null && files.ContainsKey(key))
        {
            var want = Convert.ToString(files[key]);
            if (list.Contains(want)) return want;
        }
        return list.Count > 0 ? list[0] : "";
    }

    void SetCurrent(string root, string file)
    {
        var cur = ReadCurrent();
        var files = cur.ContainsKey("files") ? cur["files"] as Dictionary<string, object> : null;
        if (files == null) files = new Dictionary<string, object>();
        files[Path.GetFullPath(root).ToLowerInvariant()] = file;
        cur["files"] = files;
        cur["last"] = new Dictionary<string, object> { { "path", Path.GetFullPath(root) }, { "file", file } };
        Directory.CreateDirectory(StateDir);
        File.WriteAllText(CurrentPath, Json.Serialize(cur));
    }

    // ---------- 计划书摘要（和 src/core.js 里的统计一致） ----------

    object Summary(string root, string file = null)
    {
        var name = file ?? CurrentFile(root);
        if (string.IsNullOrEmpty(name) || !File.Exists(Path.Combine(root, name))) return null;
        var md = File.ReadAllText(Path.Combine(root, name), Encoding.UTF8).Replace("\r\n", "\n").Replace("\r", "\n");
        var lines = md.Split('\n');
        var pending = Pending(lines);
        int total = 0, done = 0, doing = 0;
        var sec = "";
        var inFeature = false;
        string progress = null;
        Action flush = () =>
        {
            if (!inFeature) return;
            total++;
            if (progress == "done") done++;
            else if (progress == "doing") doing++;
            inFeature = false;
            progress = null;
        };
        var footer = FooterStart(lines);
        for (var i = 0; i < footer; i++)
        {
            var l = lines[i];
            var m = Regex.Match(l, @"^(#{1,6})\s+(.*)$");
            if (m.Success)
            {
                flush();
                var level = m.Groups[1].Length;
                if (level == 2)
                {
                    var sm = Regex.Match(m.Groups[2].Value, @"^(\d+)\b");
                    sec = sm.Success ? sm.Groups[1].Value : "";
                }
                else if (level == 3 && sec == "4") inFeature = true;
                continue;
            }
            if (inFeature)
            {
                var pm = ProgressLabelRe.Match(l.Trim());
                if (pm.Success)
                {
                    var v = pm.Groups[1].Value.Trim();
                    if (DoneRe.IsMatch(v)) progress = "done";
                    else if (DoingRe.IsMatch(v)) progress = "doing";
                    else progress = "todo";
                }
            }
        }
        flush();
        var tm = TitleRe.Match(string.Join("\n", lines.Where(x => Regex.IsMatch(x, @"^#\s+"))).Split('\n').FirstOrDefault() ?? "");
        var title = tm.Success ? tm.Groups[1].Value.Trim() : "";
        if (Regex.IsMatch(title, "〈[^〉]*〉")) title = "";
        return new Dictionary<string, object>
        {
            { "file", name }, { "title", title }, { "status", Status(lines) },
            { "total", total }, { "done", done }, { "doing", doing }, { "pending", pending },
        };
    }

    static int FooterStart(string[] lines)
    {
        for (var i = lines.Length - 1; i >= 0; i--)
            if (Regex.IsMatch(lines[i], @"^\s*([-*_])(\s*\1){2,}\s*$")) return i;
        return lines.Length;
    }

    static string Status(string[] lines)
    {
        foreach (var l in lines.Take(14))
        {
            var m = StatusLineRe.Match(l);
            if (!m.Success) continue;
            var w = m.Groups[1].Value.Trim();
            foreach (var code in new[] { "draft", "doing", "approved" })
                if (StateRe(code).IsMatch(w)) return code;
        }
        return "";
    }

    static int Pending(string[] lines)
    {
        var footer = FooterStart(lines);
        var count = 0;
                for (var i = 0; i < footer; i++)
        {
            var text = lines[i];
            var trimmed = text.Trim();
            if (trimmed == "" || ApprovedNoteRe.IsMatch(trimmed)) continue;
            var t = QuotedTbdRe.Replace(text, "");
            count += TbdMarkRe.Matches(t).Count;
            count += Regex.Matches(t, "〈[^〉]*〉").Count;
            if (Regex.IsMatch(trimmed, @"^#{1,6}\s")) continue;
            var bullet = Regex.IsMatch(text, @"^\s*(?:[-*+]|\d+[.)])\s+");
            var body = bullet ? Regex.Replace(text, @"^\s*(?:[-*+]|\d+[.)])\s+", "") : trimmed;
            var lv = Regex.Match(body, @"^([^：:。，；]{1,40}?)(?:：|:\s|:$)\s*(.*)$");
            if (lv.Success && lv.Groups[2].Value.Trim() == "" && !NotAFieldRe.IsMatch(lv.Groups[1].Value.Trim()))
            {
                var next = i + 1;
                while (next < footer && lines[next].Trim() == "") next++;
                var hasList = next < footer && Regex.IsMatch(lines[next], @"^\s*(?:[-*+]|\d+[.)])\s+");
                if (!hasList) count++;
            }
        }
        // 第 1 到 7 部分里没有内容的
        for (var i = 0; i < footer; i++)
        {
            var m = Regex.Match(lines[i], @"^##\s+(\d+)\b");
            if (!m.Success) continue;
            var n = int.Parse(m.Groups[1].Value);
            if (n < 1 || n > 7) continue;
            var j = i + 1;
            var hasBody = false;
            while (j < footer && !Regex.IsMatch(lines[j], @"^#{1,6}\s"))
            {
                if (lines[j].Trim() != "") hasBody = true;
                j++;
            }
            var hasChild = j < footer && Regex.IsMatch(lines[j], @"^#{3,6}\s");
            if (!hasBody && !hasChild) count++;
        }
        return count;
    }
}
