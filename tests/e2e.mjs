// 端到端自测：node tests/e2e.mjs
// 无头 Chrome，交互走调试协议；浏览器文件夹用页面内的内存实现替身；桌面服务用临时的用户目录；截图放进 preview/。
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, DEEP } from './cdp.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shots = join(root, 'preview');
mkdirSync(shots, { recursive: true });
const timer = readFileSync(join(root, 'tests', 'fixtures', 'timer.zh.md'), 'utf8');

let pass = 0;
const fails = [];
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  ✔ ' + name); } else { fails.push(name + (detail !== undefined ? '：' + JSON.stringify(detail) : '')); console.log('  ✖ ' + name + (detail !== undefined ? '  ' + JSON.stringify(detail) : '')); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 浏览器文件夹替身
const MOCK_FS = `
(function () {
  var files = {};
  window.__fs = files;
  function nf() { var e = new Error('not found'); e.name = 'NotFoundError'; return e; }
  function FileH(path) { this.kind = 'file'; this.path = path; }
  FileH.prototype.getFile = function () {
    var path = this.path;
    return Promise.resolve().then(function () {
      if (!(path in files)) throw nf();
      var v = files[path];
      return { text: function () { return Promise.resolve(typeof v === 'string' ? v : '[blob]'); } };
    });
  };
  FileH.prototype.createWritable = function () {
    var path = this.path; var buf = '';
    return Promise.resolve({ write: function (d) { buf = d; return Promise.resolve(); }, close: function () { files[path] = buf; return Promise.resolve(); } });
  };
  function DirH(prefix, name) { this.kind = 'directory'; this.prefix = prefix; this.name = name; }
  DirH.prototype.getFileHandle = function (n, o) {
    var p = this.prefix + n;
    return Promise.resolve().then(function () { if (!(p in files) && !(o && o.create)) throw nf(); return new FileH(p); });
  };
  DirH.prototype.queryPermission = function () { return Promise.resolve('granted'); };
  DirH.prototype.requestPermission = function () { return Promise.resolve('granted'); };
  window.showDirectoryPicker = function () { return Promise.resolve(new DirH('', '示例项目文件夹')); };
})();
`;

// 桌面服务：临时用户目录里放一个「最近在用的文件夹」
const tmpHome = mkdtempSync(join(tmpdir(), 'shupian-home-'));
const projDir = join(tmpHome, '番茄钟项目');
mkdirSync(projDir, { recursive: true });
writeFileSync(join(projDir, 'plan.md'), timer);
const enc = projDir.replace(/[^A-Za-z0-9]/g, '-');
mkdirSync(join(tmpHome, '.claude', 'projects', enc), { recursive: true });
writeFileSync(join(tmpHome, '.claude', 'projects', enc, 'a.jsonl'), '{}\n');
utimesSync(join(tmpHome, '.claude', 'projects', enc, 'a.jsonl'), new Date(), new Date());
// 第二个文件夹没有计划书，会话记录比第一个旧
const emptyDir = join(tmpHome, '空文件夹');
mkdirSync(emptyDir, { recursive: true });
const encEmpty = emptyDir.replace(/[^A-Za-z0-9]/g, '-');
mkdirSync(join(tmpHome, '.claude', 'projects', encEmpty), { recursive: true });
writeFileSync(join(tmpHome, '.claude', 'projects', encEmpty, 'b.jsonl'), '{}\n');
const hourAgo = new Date(Date.now() - 3600 * 1000);
utimesSync(join(tmpHome, '.claude', 'projects', encEmpty, 'b.jsonl'), hourAgo, hourAgo);
writeFileSync(join(tmpHome, '.claude.json'), JSON.stringify({ projects: { [projDir]: {}, [emptyDir]: {} } }));
const srvPort = 14500 + Math.floor(Math.random() * 400);
const appSrv = spawn(process.execPath, [join(root, 'tools', 'app-server.mjs')], {
  stdio: 'ignore',
  env: Object.assign({}, process.env, { USERPROFILE: tmpHome, HOME: tmpHome, PORT: String(srvPort) }),
});
let srvInfo = null;
for (let i = 0; i < 40 && !srvInfo; i++) {
  await sleep(150);
  try { const j = JSON.parse(readFileSync(join(tmpHome, '.shupian', 'server.json'), 'utf8')); if (j.port) srvInfo = j; } catch (e) { /* 还没写出来 */ }
}

// 静态服务（模拟被开发的页面和整页）：自己挑空闲端口
const staticPort = 14900 + Math.floor(Math.random() * 400);
const staticSrv = spawn(process.execPath, [join(root, 'tools', 'serve.mjs'), '.'], { stdio: ['ignore', 'pipe', 'inherit'], env: Object.assign({}, process.env, { PORT: String(staticPort) }) });
const base = await new Promise((resolve) => staticSrv.stdout.once('data', (d) => resolve(String(d).trim())));

const chrome = await launch(join(shots, '_chrome.json'));
const Q = (sel, text, exact) => '__one(' + JSON.stringify(sel) + ',' + JSON.stringify(text === undefined ? null : text) + ',' + (exact ? 'true' : 'false') + ')';
function helpers(page) {
  return {
    exists: async (sel, text, exact) => page.eval('!!' + Q(sel, text, exact)),
    count: async (sel, text) => page.eval('__deep(' + JSON.stringify(sel) + ',' + JSON.stringify(text === undefined ? null : text) + ').length'),
    text: async (sel, t) => page.eval('(function(){var e=' + Q(sel, t) + ';return e?e.textContent.trim():null})()'),
    wait: async (fn, n) => { for (let i = 0; i < (n || 30); i++) { if (await fn()) return true; await sleep(100); } return false; },
  };
}
const btn = (label) => Q('button', label, true);

try {
  // ================= 计划书页（浏览器里，文件夹替身） =================
  console.log('计划书页');
  const page = await chrome.newPage();
  await page.init(MOCK_FS);
  await page.init(DEEP);
  await page.resize(1280, 800);
  const H = helpers(page);
  await page.goto(base + 'web/index.html');
  ok('已挂载为计划书页', (await page.eval('window.Shupian && window.Shupian.mode')) === 'plan');
  ok('页面标题、语言和图标', (await page.eval('document.title')) === 'prompt 计划书助手' && (await page.eval('document.documentElement.lang')) === 'zh-CN' && (await page.eval('!!document.querySelector("link[rel=apple-touch-icon]")')));
  ok('页面描述不是旧的', !/薯片|修改单|投递/.test(await page.eval('document.querySelector("meta[name=description]").content')));
  ok('空状态有入口', (await H.exists('button', '新建空白计划书', true)) && (await H.exists('button', '导入', true)) && (await H.exists('button', '查看示例', true)));
  const headH = await page.eval('__one(".head").getBoundingClientRect().height');
  ok('顶栏加标签栏不超过 100 像素', headH <= 100, headH);
  ok('没有「投递」入口', !(await H.exists('button', '投递', true)));
  await page.shot(join(shots, '01-空状态-1280.png'));

  console.log('导入计划书（番茄钟）');
  await page.click(btn('导入'));
  await page.click(Q('.modal textarea'));
  await page.insert(timer);
  await page.click(Q('.modal-foot button', '导入', true));
  await page.sleep(300);
  ok('项目情况：已完成 1 / 2', /已完成 1 \/ 2/.test((await H.text('.status-head .muted')) || ''), await H.text('.status-head .muted'));
  ok('标题是项目情况', (await H.text('.status-head h2')) === '项目情况');
  ok('没有虚线', !(await page.eval('(function(){var bad=0;__deep("*").forEach(function(e){var cs=getComputedStyle(e);if(/dashed|dotted/.test(cs.borderTopStyle+cs.borderBottomStyle+cs.borderLeftStyle+cs.borderRightStyle+cs.textDecorationStyle))bad++});return bad})()')));
  await page.shot(join(shots, '02-项目情况-1280.png'));

  console.log('标签页和语言下拉');
  ok('有一个项目标签', (await H.count('.tabbar .tab')) === 1);
  await page.click(Q('.tabbar .chip.add'));
  await page.sleep(300);
  ok('加号新开一个标签', (await H.count('.tabbar .tab')) === 2);
  await page.click(Q('.tabbar .tab:nth-of-type(1) .tab-name'));
  await page.sleep(300);
  ok('切回第一个标签，内容还在', /已完成 1 \/ 2/.test((await H.text('.status-head .muted')) || ''));
  await page.click(Q('.tabbar .tab:nth-of-type(2) .tab-x'));
  await page.sleep(300);
  ok('关闭标签', (await H.count('.tabbar .tab')) === 1);
  await page.click(Q('button.lang'));
  ok('语言是下拉，有两项', (await H.count('.pop button')) === 2);
  await page.click(Q('.pop button', 'English', true));
  await page.sleep(300);
  ok('选 English 后界面变成英文', await H.exists('.status-head h2', 'Project status'));
  await page.click(Q('button.lang'));
  await page.click(Q('.pop button', '中文', true));
  await page.sleep(300);

  console.log('确认之后变成功能清单');
  await page.click(Q('.statusline .btn.primary'));
  await page.sleep(300);
  ok('状态变成已通过', /已通过/.test((await H.text('.state')) || ''));
  ok('项目情况变成功能清单', (await H.text('.status-head h2')) === '功能清单');
  ok('各部分默认收起', (await H.count('.sec.closed')) >= 5, await H.count('.sec.closed'));
  ok('每个功能旁有 ＋', (await H.count('.status-row .btn.sm', '＋')) === 2);
  await page.shot(join(shots, '03-功能清单-1280.png'));

  console.log('写问题的小弹窗');
  await page.click(Q('.status-row .btn.sm', '＋'));
  ok('弹出小窗', await H.exists('.modal.small'));
  const mw = await page.eval('__one(".modal.small").getBoundingClientRect().width');
  ok('弹窗是小的', mw <= 400, mw);
  ok('默认选中第一个功能', /4\.1 倒计时/.test((await H.text('.modal.small .target')) || ''), await H.text('.modal.small .target'));
  await page.click(Q('.modal.small textarea'));
  await page.insert('点暂停后数字仍在走@');
  await page.sleep(200);
  ok('输入 @ 弹出功能列表', (await H.count('.pop button')) === 2);
  await page.click(Q('.pop button', '4.2 今天完成几轮'));
  await page.sleep(150);
  ok('选择后目标换成 4.2', /4\.2 今天完成几轮/.test((await H.text('.modal.small .target')) || ''), await H.text('.modal.small .target'));
  ok('输入框里的 @ 被去掉', (await page.eval('__one(".modal.small textarea").value')) === '点暂停后数字仍在走');
  await page.click(Q('.modal-foot button', '添加', true));
  await page.sleep(300);
  ok('问题出现在功能清单里', await H.exists('.issue .issue-text', '点暂停后数字仍在走'));
  ok('未处理的问题计数', /未处理的问题 1 条/.test((await H.text('.status-head .muted')) || ''));
  await page.click(Q('.issue .btn.sm', '已修', true));
  await page.sleep(300);
  ok('标记已修后从列表消失', !(await H.exists('.issue')));

  console.log('浏览器文件夹：连接、保存、自动读回');
  await page.click(btn('⋯'));
  await page.click(btn('连接文件夹'));
  await H.wait(async () => (await page.eval('Object.keys(__fs).length')) > 0, 30);
  const saved = await page.eval('__fs["plan.md"] || ""');
  ok('计划书写进了文件夹（plan.md），带问题', /进度：已完成/.test(saved) && /已修：点暂停后数字仍在走/.test(saved), saved.slice(0, 80));
  await page.eval('__fs["plan.md"] = __fs["plan.md"].replace(/(### 4\\.2[\\s\\S]*?进度：)[^\\n]*/, "$1已完成")');
  const t0 = Date.now();
  await H.wait(async () => /已完成 2 \/ 2/.test((await H.text('.status-head .muted')) || ''), 80);
  ok('文件夹里的进度一改，页面几秒内自动更新', /已完成 2 \/ 2/.test((await H.text('.status-head .muted')) || '') && Date.now() - t0 < 6500, Date.now() - t0);

  console.log('各屏幕宽度');
  for (const [w, hh] of [[1280, 800], [820, 1100], [390, 844], [320, 640], [280, 560]]) {
    await page.resize(w, hh, w < 700);
    await page.sleep(200);
    const m = await page.eval('(function(){var b=__one(".body");var app=__one(".app").getBoundingClientRect();var bad=[];__deep("button,.pend,h2,.blk,.box,.status-box,textarea.in,input.in").forEach(function(e){var r=e.getBoundingClientRect();if(r.width&&(r.right>app.right+1||r.left<app.left-1)&&!e.closest(".tabbar"))bad.push((e.textContent||e.className).slice(0,20))});return {page:document.documentElement.scrollWidth-innerWidth,body:b.scrollWidth-b.clientWidth,doc:document.scrollingElement.scrollHeight-document.scrollingElement.clientHeight,head:__one(".head").getBoundingClientRect().height,bad:bad.slice(0,5)}})()');
    ok('宽 ' + w + '：不溢出、整页不滚动、顶栏不过高', m.page <= 0 && m.body <= 0 && m.doc <= 0 && m.bad.length === 0 && m.head <= 110, m);
    await page.shot(join(shots, '04-功能清单-' + w + '.png'));
  }
  await page.resize(1280, 800);

  // ================= 桌面服务 =================
  console.log('桌面服务：最近标签和文件夹');
  ok('服务已启动', !!srvInfo, srvInfo);
  const url = 'http://127.0.0.1:' + srvInfo.port + '/index.html?k=' + srvInfo.token + '&win=1';
  const win = await chrome.newPage();
  await win.init(DEEP);
  await win.init('window.__sizeCalls = []; window.resizeTo = function (w, h) { window.__sizeCalls.push(["resize", w, h]); }; window.moveTo = function (x, y) { window.__sizeCalls.push(["move", x, y]); };');
  await win.resize(420, 640);
  const HW = helpers(win);
  await win.goto(url + '&view=hub');
  await HW.wait(async () => HW.exists('.frow'), 40);
  ok('先显示「最近」标签', await HW.exists('.tabbar .chip.on', '最近', true));
  ok('列出最近在用的文件夹', await HW.exists('.frow .fname', '番茄钟项目'), await win.eval('__one(".folders") && __one(".folders").textContent'));
  ok('标出「使用中」', await HW.exists('.badge', '使用中'));
  ok('显示完整地址', (await HW.text('.fpath')) === projDir, await HW.text('.fpath'));
  ok('显示进度摘要', /已完成 1 \/ 2，待补 0 处/.test((await HW.text('.frow .muted')) || ''), await HW.text('.frow .muted'));
  ok('最近里只写「复制地址」，不写「方便打开 CLI」', (await HW.exists('.frow button', '复制地址', true)) && !/方便打开 CLI/.test(await win.eval('__one(".frow").textContent')));
  ok('界面里没有 Claude 字样', !/Claude/.test(await win.eval('__one(".app").textContent')));
  const sizeAtOpen = JSON.stringify(await win.eval('window.__sizeCalls'));
  ok('打开时只设置一次小窗口大小和位置', /^\[\["resize",360,480\],\["move",\d+,\d+\]\]$/.test(sizeAtOpen), sizeAtOpen);
  await win.shot(join(shots, '05-最近-420.png'));
  await win.click(Q('.frow .btn.primary'));
  await HW.wait(async () => HW.exists('.status-box'), 40);
  ok('点打开计划书：在新标签里打开', (await HW.exists('.tabbar .tab .tab-name', '番茄钟（示例）')) || (await HW.count('.tabbar .tab')) === 1, await HW.text('.tabbar'));
  ok('读到了 plan.md 的内容', /番茄钟/.test((await HW.text('.title')) || ''), await HW.text('.title'));
  ok('显示文件夹名和复制地址', (await HW.exists('.statusline button', '复制地址', true)) && (await HW.exists('.statusline .muted', '方便打开 CLI')));
  await win.click(Q('.status-row:nth-of-type(4) .prog'));
  await sleep(900);
  ok('点进度后，磁盘上的 plan.md 改了', /进度：已完成/.test(readFileSync(join(projDir, 'plan.md'), 'utf8').split('### 4.2')[1] || ''));
  writeFileSync(join(projDir, 'plan.md'), readFileSync(join(projDir, 'plan.md'), 'utf8').replace(/(### 4\.2[\s\S]*?进度：)已完成/, '$1未做'));
  const t1 = Date.now();
  await HW.wait(async () => /已完成 1 \/ 2/.test((await HW.text('.status-head .muted')) || ''), 80);
  ok('磁盘上的计划书被改了，页面自动更新', /已完成 1 \/ 2/.test((await HW.text('.status-head .muted')) || '') && Date.now() - t1 < 7000, Date.now() - t1);
  const bad = await win.eval('fetch("/api/file?root=" + encodeURIComponent("C:\\\\Windows") + "&p=plan.md", { headers: { "x-shupian-token": "' + srvInfo.token + '" } }).then(function(r){return r.status})');
  ok('服务不读未知文件夹', bad === 400, bad);
  const noTok = await win.eval('fetch("/api/projects").then(function(r){return r.status})');
  ok('没有口令的接口请求被拒绝', noTok === 401, noTok);
  await win.shot(join(shots, '06-桌面打开计划书-420.png'));
  await win.click(Q('.tabbar .chip', '最近', true));
  await win.sleep(300);
  ok('可以切回「最近」', await HW.exists('.frow'));
  ok('打开计划书和切回最近都没有改窗口大小', JSON.stringify(await win.eval('window.__sizeCalls')) === sizeAtOpen, await win.eval('window.__sizeCalls'));

  console.log('桌面服务：没有计划书的文件夹');
  await win.click('(function(){var r=Array.from(__deep(".frow")).filter(function(x){return x.textContent.indexOf("空文件夹")>=0})[0];return r&&r.querySelector(".btn.primary")})()');
  await HW.wait(async () => HW.exists('.doc.empty h1'), 40);
  ok('空文件夹：显示文件夹名作为标题', (await HW.text('.doc.empty h1')) === '空文件夹', await HW.text('.doc.empty h1'));
  ok('空文件夹：有一句说明和新建入口', (await HW.exists('.doc.empty p', '还没有计划书。', true)) && (await HW.exists('.doc.empty button', '新建空白计划书', true)));
  ok('空文件夹：窗口大小没变', JSON.stringify(await win.eval('window.__sizeCalls')) === sizeAtOpen, await win.eval('window.__sizeCalls'));
  await win.shot(join(shots, '09-空文件夹-420.png'));

  // ================= 悬浮窗 =================
  console.log('小悬浮窗');
  const fpage = await chrome.newPage();
  await fpage.init(DEEP);
  await fpage.resize(1280, 800);
  const HP = helpers(fpage);
  await fpage.goto(base + 'tests/fixtures/host.html');
  const fq = (sel, t, e) => '__one(' + JSON.stringify(sel) + ',' + JSON.stringify(t === undefined ? null : t) + ',' + (e ? 'true' : 'false') + ')';
  ok('悬浮按钮出现', await fpage.eval('!!' + fq('.fab')));
  await fpage.eval('setTimeout(function(){ throw new Error("宿主页面里的测试报错"); }, 0)');
  await fpage.sleep(100);
  await fpage.key('S', 1 | 8);
  await fpage.sleep(300);
  ok('Alt+Shift+S 打开小窗', (await fpage.eval('__one(".win").style.display')) !== 'none');
  const win1 = await fpage.rectOf(fq('.win'));
  ok('悬浮窗是小窗：宽不超过 330、高不超过 330', win1.w <= 330 && win1.h <= 330, win1);
  ok('三个动作按钮', (await HP.exists('button', '选取元素', true)) && (await HP.exists('button', '区域截图', true)) && (await HP.exists('button', '当前页面', true)));
  await fpage.shot(join(shots, '07-悬浮窗-1280.png'));
  const hdr = await fpage.rectOf(fq('.head .brand'));
  await fpage.drag(hdr.x, hdr.y, hdr.x - 300, hdr.y + 100);
  const win2 = await fpage.rectOf(fq('.win'));
  ok('窗口可以拖动', Math.abs(win2.l - win1.l) > 200, [win1.l, win2.l]);
  await fpage.drag(win2.l + 20, win2.t + 15, -400, 5);
  const win3 = await fpage.rectOf(fq('.win'));
  ok('拖出屏幕最多出去一半', win3.l >= -win3.w / 2 - 2 && win3.r > 0, win3);
  await fpage.key('S', 1 | 8);
  await fpage.eval('window.Shupian.open()');
  await fpage.sleep(200);

  await fpage.click(fq('button', '当前页面', true));
  await HP.wait(async () => fpage.eval('__deep(".chipline img.shot").length === 1'), 40);
  ok('当前页面：一下记下页面信息，并带一张整页截图', (await HP.exists('.chipline', '当前页面：')) && (await fpage.eval('__deep(".chipline img.shot").length')) === 1, await HP.text('.fb-body'));
  await fpage.click(fq('button', '区域截图', true));
  await fpage.sleep(300);
  await fpage.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 100, y: 100 });
  await fpage.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 100, y: 100, button: 'left', clickCount: 1 });
  await fpage.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 400, y: 260, button: 'left' });
  await fpage.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 400, y: 260, button: 'left', clickCount: 1 });
  await fpage.sleep(800);
  const dims = await fpage.eval('(function(){var i=__one(".chipline img.shot");return new Promise(function(r){function done(){r([i.naturalWidth,i.naturalHeight])}if(i.complete&&i.naturalWidth)return done();i.onload=done;setTimeout(done,3000)})})()');
  ok('区域截图：图的大小是框出来的区域', dims[0] === 300 && dims[1] === 160, dims);
  await fpage.click(fq('button', '选取元素', true));
  await fpage.sleep(150);
  const target = await fpage.eval('(function(){var r=document.querySelector("h1").getBoundingClientRect();return {x:r.left+20,y:r.top+10}})()');
  await fpage.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: target.x, y: target.y });
  await fpage.sleep(100);
  await fpage.clickAt(target.x, target.y);
  await fpage.sleep(300);
  ok('选取的元素显示出来', /h1/.test((await HP.text('.fb-body')) || ''), await HP.text('.fb-body'));
  await fpage.click(fq('textarea.in'));
  await fpage.insert('标题字号太小');
  await fpage.eval('window.__clip = null; Object.defineProperty(navigator, "clipboard", { value: { writeText: function (t) { window.__clip = t; return Promise.resolve(); }, write: function () { return Promise.resolve(); } }, configurable: true });');
  await fpage.click(fq('button', '复制文字', true));
  await fpage.sleep(300);
  const clip = await fpage.eval('window.__clip');
  ok('复制出来的话带页面、标题、元素、样式、说明、报错', clip && /h1/.test(clip) && /页面标题：示例项目页面/.test(clip) && /标题字号太小/.test(clip) && /font-size/.test(clip) && /测试报错/.test(clip) && /host\.html/.test(clip) && /1280×800/.test(clip), clip);
  ok('没有口语化的提示词', !/随手|就行/.test(await fpage.eval('__one(".win").textContent') + (await fpage.eval('__one("textarea.in").placeholder'))));
  await fpage.click(fq('button.x[title="关闭"]'));
  ok('关闭后回到悬浮按钮', (await fpage.eval('!!' + fq('.fab') + ' && ' + fq('.fab') + '.style.display !== "none"')));
  await fpage.resize(390, 700, true);
  await fpage.eval('window.Shupian.open()');
  await fpage.sleep(250);
  const wm = await fpage.rectOf(fq('.win'));
  ok('手机宽度下窗口完整在屏幕内', wm.l >= -1 && wm.r <= 391 && wm.t >= -1 && wm.b <= 701, wm);
  await fpage.shot(join(shots, '08-悬浮窗-390.png'));

  console.log('旧内核：去掉新接口后仍可使用');
  const p4 = await chrome.newPage();
  await p4.init('delete Array.prototype.flatMap; delete Object.fromEntries; delete Element.prototype.replaceChildren; delete window.structuredClone; delete String.prototype.replaceAll;');
  await p4.init(DEEP);
  await p4.goto(base + 'web/index.html');
  await p4.sleep(300);
  ok('页面能打开且没有报错', (await p4.eval('!!window.Shupian')) && p4.logs.length === 0, p4.logs);

  const errs = page.logs.concat(win.logs);
  ok('页面形态全程没有脚本报错', errs.length === 0, errs.slice(0, 5));
} catch (e) {
  fails.push('测试中断：' + (e && e.stack ? e.stack : e));
  console.log('中断：' + (e && e.stack ? e.stack : e));
} finally {
  await chrome.close();
  staticSrv.kill();
  appSrv.kill();
  await sleep(300);
  try { rmSync(tmpHome, { recursive: true, force: true }); } catch (e) { /* 临时目录下次再清 */ }
}
console.log('\n通过 ' + pass + ' 项，失败 ' + fails.length + ' 项');
fails.forEach((f) => console.log('  失败：' + f));
process.exit(fails.length ? 1 : 0);
