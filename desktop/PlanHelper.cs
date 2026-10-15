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
    readonly bool zh = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName == "zh";
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
        var show = menu.Items.Add(zh ? "显示窗口" : "Show window", null, delegate { OpenHub(); });
        show.Font = new Font(show.Font, FontStyle.Bold);
        menu.Items.Add(zh ? "退出" : "Exit", null, delegate { ExitThread(); });
        tray.Icon = Server.AppIcon();
        tray.Text = zh ? "prompt 计划书助手" : "Prompt plan helper";
        tray.ContextMenuStrip = menu;
        tray.Visible = true;
        tray.MouseClick += (s, e) => { if (e.Button == MouseButtons.Left) OpenHub(); };
        tray.BalloonTipTitle = tray.Text;
        tray.BalloonTipText = hotkey.Registered
            ? (zh ? "已在托盘运行，按 Ctrl+Alt+S 打开。" : "Running in the tray. Press Ctrl+Alt+S to open.")
            : (zh ? "已在托盘运行。快捷键 Ctrl+Alt+S 被占用，请点击托盘图标打开。" : "Running in the tray. Ctrl+Alt+S is taken; click the tray icon to open.");
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
                tray.BalloonTipText = zh ? "托盘图标在任务栏右下角「^」里，可以拖到任务栏上固定显示。" : "The tray icon is under the ^ at the right of the taskbar. Drag it onto the taskbar to keep it visible.";
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
        var existing = WinApi.FindWindow(new[] { "prompt 计划书助手", "Prompt plan helper" });
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
    static readonly string[] PlanNames = { "plan.md", "计划书.md" };
    readonly string home = Environment.GetEnvironmentVariable("USERPROFILE") ?? Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
    readonly HashSet<string> connected = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
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
        if (path == "/api/pick" && ctx.Request.HttpMethod == "POST")
        {
            var picked = PickFolder();
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
            SendJson(ctx, 200, new { path = full, name = Path.GetFileName(full), summary = Summary(full) });
            return;
        }
        if (path == "/api/file")
        {
            var file = PlanPath(Query(url, "root"), Query(url, "p"));
            if (file == null) { SendJson(ctx, 400, new { error = "path" }); return; }
            if (ctx.Request.HttpMethod == "GET")
            {
                if (File.Exists(file)) SendJson(ctx, 200, new { exists = true, text = File.ReadAllText(file, Encoding.UTF8) });
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

    string PickFolder()
    {
        string result = "";
        var t = new Thread(() =>
        {
            using (var d = new FolderBrowserDialog())
            {
                d.ShowNewFolderButton = true;
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
        if (connected.Contains(full)) return true;
        return ClaudeFolders().Any(x => string.Equals(x.path, full, StringComparison.OrdinalIgnoreCase))
            || History().Any(x => string.Equals(x.path, full, StringComparison.OrdinalIgnoreCase));
    }

    string PlanPath(string root, string rel)
    {
        if (string.IsNullOrEmpty(root) || !Known(root)) return null;
        if (Array.IndexOf(PlanNames, rel) < 0) return null;
        return Path.Combine(Path.GetFullPath(root), rel);
    }

    object Projects()
    {
        var claude = ClaudeFolders();
        var now = ToMs(DateTime.Now);
        Func<Folder, Dictionary<string, object>> shape = f => new Dictionary<string, object>
        {
            { "path", f.path }, { "name", f.name }, { "last", f.last },
            { "active", now - f.last < 10 * 60 * 1000 }, { "summary", Summary(f.path) },
        };
        var seen = new HashSet<string>(claude.Select(x => x.path), StringComparer.OrdinalIgnoreCase);
        return new Dictionary<string, object>
        {
            { "claude", claude.Select(shape).ToList() },
            { "history", History().Where(x => !seen.Contains(x.path)).Select(shape).ToList() },
        };
    }

    // ---------- 计划书摘要（和 src/core.js 里的统计一致） ----------

    object Summary(string root)
    {
        var name = PlanNames.FirstOrDefault(n => File.Exists(Path.Combine(root, n)));
        if (name == null) return null;
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
                var pm = Regex.Match(l.Trim(), @"^(?:进度|Progress)[：:]\s*(.*)$", RegexOptions.IgnoreCase);
                if (pm.Success)
                {
                    var v = pm.Groups[1].Value.Trim();
                    if (Regex.IsMatch(v, @"^(?:已完成|Done)", RegexOptions.IgnoreCase)) progress = "done";
                    else if (Regex.IsMatch(v, @"^(?:进行中|In progress)", RegexOptions.IgnoreCase)) progress = "doing";
                    else progress = "todo";
                }
            }
        }
        flush();
        var tm = Regex.Match(string.Join("\n", lines.Where(x => Regex.IsMatch(x, @"^#\s+"))).Split('\n').FirstOrDefault() ?? "", @"^#\s+(?:(?:计划书|修改单|Plan|Change)[：:]\s*)?(.*)$");
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
            var m = Regex.Match(l, @"^(?:状态|Status)[：:]\s*(.*?)(?:　+|\s{2,}|$)");
            if (!m.Success) continue;
            var w = m.Groups[1].Value.Trim();
            if (Regex.IsMatch(w, "^(?:草稿|draft)$", RegexOptions.IgnoreCase)) return "draft";
            if (Regex.IsMatch(w, "^(?:整理中|in progress)$", RegexOptions.IgnoreCase)) return "doing";
            if (Regex.IsMatch(w, "^(?:已通过|approved)$", RegexOptions.IgnoreCase)) return "approved";
        }
        return "";
    }

    static int Pending(string[] lines)
    {
        var footer = FooterStart(lines);
        var count = 0;
        var quoted = new Regex("[「\"“](?:待补|TBD)[^」\"”]*[」\"”]");
        for (var i = 0; i < footer; i++)
        {
            var text = lines[i];
            var trimmed = text.Trim();
            if (trimmed == "" || Regex.IsMatch(trimmed, @"^(?:已通过|Approved)\s*(?:=|is)")) continue;
            var t = quoted.Replace(text, "");
            count += Regex.Matches(t, @"(?:待补|TBD)[：:]").Count;
            count += Regex.Matches(t, "〈[^〉]*〉").Count;
            if (Regex.IsMatch(trimmed, @"^#{1,6}\s")) continue;
            var bullet = Regex.IsMatch(text, @"^\s*(?:[-*+]|\d+[.)])\s+");
            var body = bullet ? Regex.Replace(text, @"^\s*(?:[-*+]|\d+[.)])\s+", "") : trimmed;
            var lv = Regex.Match(body, @"^([^：:。，；]{1,40}?)(?:：|:\s|:$)\s*(.*)$");
            if (lv.Success && lv.Groups[2].Value.Trim() == "" && !Regex.IsMatch(lv.Groups[1].Value.Trim(), @"^(?:待补|TBD|问题|Issues)$", RegexOptions.IgnoreCase))
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
