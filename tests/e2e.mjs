// 端到端自测：node tests/e2e.mjs
// 无头 Chrome，交互走调试协议；浏览器文件夹用页面内的内存实现替身；桌面服务用临时的用户目录；截图放进 preview/。
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, utimesSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, DEEP } from './cdp.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shots = join(root, 'preview');
mkdirSync(shots, { recursive: true });
const exZh = readFileSync(join(root, 'templates', 'zh', 'example.md'), 'utf8');

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

// ---- 桌面服务：临时用户目录里放一个「最近用 Claude 的文件夹」
const tmpHome = mkdtempSync(join(tmpdir(), 'shupian-home-'));
const projDir = join(tmpHome, '番茄钟项目');
mkdirSync(projDir, { recursive: true });
writeFileSync(join(projDir, 'plan.md'), exZh);
const enc = projDir.replace(/[^A-Za-z0-9]/g, '-');
mkdirSync(join(tmpHome, '.claude', 'projects', enc), { recursive: true });
writeFileSync(join(tmpHome, '.claude', 'projects', enc, 'a.jsonl'), '{}\n');
utimesSync(join(tmpHome, '.claude', 'projects', enc, 'a.jsonl'), new Date(), new Date());
writeFileSync(join(tmpHome, '.claude.json'), JSON.stringify({ projects: { [projDir]: {} } }));
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

// 静态服务（模拟被开发的页面和整页）
const staticSrv = spawn(process.execPath, [join(root, 'tools', 'serve.mjs'), '.'], { stdio: ['ignore', 'pipe', 'inherit'] });
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
  ok('页面标题和图标', (await page.eval('document.title')) === 'prompt 计划书助手' && (await page.eval('!!document.querySelector("link[rel=apple-touch-icon]")')));
  ok('空状态有四个入口', (await H.count('.empty button')) >= 3);
  const headH = await page.eval('__one(".head").getBoundingClientRect().height');
  ok('顶栏一行，不超过 60 像素', headH <= 60, headH);
  ok('没有「投递」入口', !(await H.exists('button', '投递', true)));
  await page.shot(join(shots, '01-空状态-1280.png'));

  await page.click(btn('看示例'));
  await page.sleep(300);
  ok('载入示例后有项目情况', await H.exists('.status-box'));
  ok('项目情况里两个功能，已完成 1 / 2', /已完成 1 \/ 2/.test((await H.text('.status-head .muted')) || ''), await H.text('.status-head .muted'));
  ok('示例没有待补', /没有待补/.test((await H.text('.statusline')) || ''), await H.text('.statusline'));
  await page.shot(join(shots, '02-示例-1280.png'));

  console.log('项目情况：点进度改写计划书');
  await page.click(Q('.status-row:nth-of-type(4) .prog'));
  await page.sleep(200);
  ok('进行中的点一下变成已完成', /已完成 2 \/ 2/.test((await H.text('.status-head .muted')) || ''), await H.text('.status-head .muted'));
  ok('计划书正文里的进度同步改了', /进度：已完成/.test((await H.text('.blk[data-no="4.2"] .box')) || ''), await H.text('.blk[data-no="4.2"] .box'));
  await page.click(Q('.status-row:nth-of-type(4) .prog'));
  await page.sleep(150);
  ok('再点一下回到未做', /已完成 1 \/ 2/.test((await H.text('.status-head .muted')) || ''));

  console.log('居中版面');
  const lay = await page.eval('(function(){var col=__one(".col").getBoundingClientRect();var hin=__one(".head .in").getBoundingClientRect();return {col:[col.left,col.right],head:[hin.left,hin.right]}})()');
  ok('正文列居中且不超过 760 像素', Math.abs((lay.col[0] + lay.col[1]) / 2 - 640) < 20 && lay.col[1] - lay.col[0] <= 760, lay);
  ok('顶栏内容和正文同一条列', Math.abs(lay.head[0] - lay.col[0]) < 8 && Math.abs(lay.head[1] - lay.col[1]) < 8, lay);

  console.log('点一块直接改、加界面、删除、撤销');
  await page.click(Q('.blk[data-no="4.1"] .box'));
  await page.insert('（改过）');
  await page.clickAt(5, 400);
  await page.sleep(200);
  ok('改完保存', /（改过）/.test((await H.text('.blk[data-no="4.1"] .box')) || ''));
  ok('已通过之外的状态不回退', /整理中|已通过/.test((await H.text('.state')) || ''));
  await page.click(Q('.sec[data-no="3"] .addslot button', '＋ 加界面'));
  await page.click(Q('.addrow button', '添加', true));
  ok('名称为空被拒绝', await H.exists('.err', '不能为空'));
  await page.click(Q('.addrow input.in'));
  await page.insert('计时界面');
  await page.click(Q('.addrow button', '添加', true));
  ok('重名被拒绝', await H.exists('.err', '已有同名界面'));
  await page.key('a', 2);
  await page.insert('统计界面');
  await page.click(Q('.addrow button', '添加', true));
  await page.sleep(300);
  ok('新界面出现，编号 3.3，并直接打开填写', (await H.exists('.blk[data-no="3.3"]')) && (await H.exists('.blk[data-no="3.3"] textarea.in.big')));
  await page.clickAt(5, 400);
  const del = await page.rectOf(Q('.blk[data-no="4.2"] .x'));
  await page.clickAt(del.x, del.y);
  await page.sleep(250);
  ok('删除后块消失，项目情况跟着变', !(await H.exists('.blk[data-no="4.2"]')) && /已完成 1 \/ 1/.test((await H.text('.status-head .muted')) || ''));
  await page.click(Q('.toast button', '撤销', true));
  await page.sleep(250);
  ok('撤销后块回来', await H.exists('.blk[data-no="4.2"]'));

  console.log('流程一行写完');
  await page.click(Q('.sec[data-no="2"] .addslot button', '＋ 加用法'));
  await page.sleep(300);
  ok('加用法直接出现填写框，不弹表单', (await H.exists('.sec[data-no="2"] textarea.in.big')) && !(await H.exists('.sec[data-no="2"] input.in')));
  await page.clickAt(5, 400);
  ok('待补计数增加', /还有 \d+ 处待补/.test((await H.text('.statusline .btn.sm')) || ''), await H.text('.statusline'));

  console.log('浏览器文件夹：连接、保存、自动读回');
  await page.click(btn('⋯'));
  await page.click(btn('连接文件夹'));
  await H.wait(async () => (await page.eval('Object.keys(__fs).length')) > 0, 30);
  const keys = await page.eval('Object.keys(__fs)');
  ok('计划书写进了文件夹，文件名是 plan.md', keys.indexOf('plan.md') >= 0, keys);
  await page.eval('__fs["plan.md"] = __fs["plan.md"].replace(/(### 4\\.2[\\s\\S]*?进度：)[^\\n]*/, "$1已完成")');
  const t0 = Date.now();
  await H.wait(async () => /已完成 2 \/ 2/.test((await H.text('.status-head .muted')) || ''), 80);
  ok('文件夹里的进度一改，页面 5 秒内自动更新', /已完成 2 \/ 2/.test((await H.text('.status-head .muted')) || '') && Date.now() - t0 < 6000, Date.now() - t0);
  ok('显示同步时间', /同步于/.test((await H.text('.statusline')) || ''));

  console.log('中英文切换');
  await page.click(btn('⋯'));
  await page.click(btn('English'));
  await page.sleep(300);
  ok('界面变成英文', /Prompt plan helper/.test((await H.text('.brand-name')) || ''), await H.text('.brand-name'));
  ok('项目情况标题是英文', await H.exists('.status-head h2', 'Project status'));
  await page.shot(join(shots, '03-English-1280.png'));
  await page.click(btn('⋯'));
  await page.click(btn('New blank plan'));
  await page.sleep(300);
  ok('英文界面下新建的计划书用英文模板', /^Plan:|Status:/m.test(await page.eval('__one(".statusline").parentElement.parentElement.textContent')) || (await H.exists('.sec h2', '1 What it is')));
  await page.click(btn('⋯'));
  await page.click(btn('中文'));
  await page.sleep(200);

  console.log('各屏幕宽度');
  await page.click(btn('⋯'));
  await page.click(btn('看示例'));
  await page.sleep(250);
  for (const [w, hh] of [[1280, 800], [820, 1100], [390, 844], [320, 640], [280, 560]]) {
    await page.resize(w, hh, w < 700);
    await page.sleep(200);
    const m = await page.eval('(function(){var b=__one(".body");var app=__one(".app").getBoundingClientRect();var bad=[];__deep("button,.pend,h2,.blk,.box,.status-box,textarea.in,input.in").forEach(function(e){var r=e.getBoundingClientRect();if(r.width&&(r.right>app.right+1||r.left<app.left-1))bad.push((e.textContent||e.className).slice(0,20))});return {page:document.documentElement.scrollWidth-innerWidth,body:b.scrollWidth-b.clientWidth,doc:document.scrollingElement.scrollHeight-document.scrollingElement.clientHeight,head:__one(".head").getBoundingClientRect().height,bad:bad.slice(0,5)}})()');
    ok('宽 ' + w + '：不溢出、整页不滚动、顶栏一行', m.page <= 0 && m.body <= 0 && m.doc <= 0 && m.bad.length === 0 && m.head <= 64, m);
    await page.shot(join(shots, '04-计划书-' + w + '.png'));
  }
  await page.resize(1280, 800);

  // ================= 桌面服务 =================
  console.log('桌面服务：小窗口和文件夹');
  ok('服务已启动', !!srvInfo, srvInfo);
  const url = 'http://127.0.0.1:' + srvInfo.port + '/index.html?k=' + srvInfo.token;
  const hub = await chrome.newPage();
  await hub.init(DEEP);
  await hub.resize(420, 640);
  const HH = helpers(hub);
  await hub.goto(url + '&view=hub');
  await HH.wait(async () => HH.exists('.frow'), 40);
  ok('桌面小窗口列出最近在用的文件夹', await HH.exists('.frow .fname', '番茄钟项目'), await hub.eval('__one(".folders") && __one(".folders").textContent'));
  ok('标出「正在用」', await HH.exists('.badge', '正在用'));
  ok('显示完整地址', (await HH.text('.fpath')) === projDir, await HH.text('.fpath'));
  ok('显示进度摘要', /已完成 1 \/ 2，待补 0 处/.test((await HH.text('.frow .muted')) || ''), await HH.text('.frow .muted'));
  ok('每个文件夹有复制地址', await HH.exists('.frow button', '复制地址', true));
  await hub.shot(join(shots, '05-桌面小窗口-420.png'));
  const hubW = await hub.eval('(function(){var b=__one(".body");return {over:b.scrollWidth-b.clientWidth, doc:document.documentElement.scrollWidth-innerWidth}})()');
  ok('小窗口不横向溢出', hubW.over <= 0 && hubW.doc <= 0, hubW);

  const full = await chrome.newPage();
  await full.init(DEEP);
  await full.resize(1280, 800);
  const HF = helpers(full);
  await full.goto(url + '&folder=' + encodeURIComponent(projDir));
  await HF.wait(async () => HF.exists('.status-box'), 40);
  ok('按文件夹打开：直接读到 plan.md', /番茄钟/.test((await HF.text('.title')) || ''), await HF.text('.title'));
  ok('显示文件夹名和复制地址', (await HF.exists('.statusline button', '复制地址', true)) && /文件夹/.test((await HF.text('.statusline')) || ''));
  await full.click(Q('.status-row:nth-of-type(4) .prog'));
  await sleep(900);
  ok('点进度后，磁盘上的 plan.md 改了', /进度：已完成/.test(readFileSync(join(projDir, 'plan.md'), 'utf8').split('### 4.2')[1] || ''), readFileSync(join(projDir, 'plan.md'), 'utf8').split('### 4.2')[1]);
  writeFileSync(join(projDir, 'plan.md'), readFileSync(join(projDir, 'plan.md'), 'utf8').replace(/(### 4\.2[\s\S]*?进度：)已完成/, '$1未做'));
  const t1 = Date.now();
  await HF.wait(async () => /已完成 1 \/ 2/.test((await HF.text('.status-head .muted')) || ''), 80);
  ok('磁盘上的计划书被 AI 改了，页面自动更新', /已完成 1 \/ 2/.test((await HF.text('.status-head .muted')) || '') && Date.now() - t1 < 7000, Date.now() - t1);
  const bad = await full.eval('fetch("/api/file?root=" + encodeURIComponent("C:\\\\Windows") + "&p=plan.md", { headers: { "x-shupian-token": "' + srvInfo.token + '" } }).then(function(r){return r.status})');
  ok('服务不读未知文件夹', bad === 400, bad);
  const noTok = await full.eval('fetch("/api/projects").then(function(r){return r.status})');
  ok('没有口令的接口请求被拒绝', noTok === 401, noTok);
  await full.shot(join(shots, '06-桌面打开计划书-1280.png'));

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
  const win = await fpage.rectOf(fq('.win'));
  ok('悬浮窗是小窗：宽不超过 330、高不超过 330', win.w <= 330 && win.h <= 330, win);
  await fpage.shot(join(shots, '07-悬浮窗-1280.png'));
  const hdr = await fpage.rectOf(fq('.head .brand'));
  await fpage.drag(hdr.x, hdr.y, hdr.x - 300, hdr.y + 100);
  const win2 = await fpage.rectOf(fq('.win'));
  ok('窗口可以拖动', Math.abs(win2.l - win.l) > 200, [win.l, win2.l]);
  await fpage.drag(win2.l + 20, win2.t + 15, -400, 5);
  const win3 = await fpage.rectOf(fq('.win'));
  ok('拖出屏幕最多出去一半', win3.l >= -win3.w / 2 - 2 && win3.r > 0, win3);
  await fpage.key('S', 1 | 8);
  await fpage.eval('window.Shupian.open()');
  await fpage.sleep(200);

  await fpage.click(fq('button', '截图', true));
  await HP.wait(async () => fpage.eval('__deep(".chipline img.shot").length === 1'), 40);
  ok('截图出现在窗里', (await fpage.eval('__deep(".chipline img.shot").length')) === 1);
  ok('标注为伪截图', /伪截图/.test((await HP.text('.chipline')) || ''), await HP.text('.chipline'));
  await fpage.click(fq('button', '选取元素', true));
  await fpage.sleep(150);
  const target = await fpage.eval('(function(){var r=document.querySelector("h1").getBoundingClientRect();return {x:r.left+20,y:r.top+10}})()');
  await fpage.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: target.x, y: target.y });
  await fpage.sleep(100);
  await fpage.clickAt(target.x, target.y);
  await fpage.sleep(300);
  ok('选取的元素显示出来', /h1/.test((await HP.text('.chipline')) || ''), await HP.text('.chipline'));
  await fpage.click(fq('textarea.in'));
  await fpage.insert('标题字号太小');
  await fpage.eval('window.__clip = null; Object.defineProperty(navigator, "clipboard", { value: { writeText: function (t) { window.__clip = t; return Promise.resolve(); }, write: function () { return Promise.resolve(); } }, configurable: true });');
  await fpage.click(fq('button', '复制文字', true));
  await fpage.sleep(300);
  const clip = await fpage.eval('window.__clip');
  ok('复制出来的话带页面、元素、样式、一句话、报错', clip && /h1/.test(clip) && /标题字号太小/.test(clip) && /font-size/.test(clip) && /测试报错/.test(clip) && /host\.html/.test(clip) && /1280×800/.test(clip), clip);
  ok('没有投递、队列、文件夹这类东西', !/投递|inbox/.test(await fpage.eval('__one(".win").textContent')));
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

  const errs = page.logs.concat(hub.logs, full.logs);
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
