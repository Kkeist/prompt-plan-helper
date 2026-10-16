// 端到端自测：node tests/e2e.mjs
// 无头 Chrome，交互走调试协议；浏览器文件夹用页面内的内存实现替身；桌面服务用临时的用户目录；截图放进 preview/。
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, utimesSync } from 'node:fs';
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
    return Promise.resolve({ write: function (d) { buf = d; return Promise.resolve(); }, close: function () { files[path] = buf; window.__writes = (window.__writes || 0) + 1; return Promise.resolve(); } });
  };
  function DirH(prefix, name) { this.kind = 'directory'; this.prefix = prefix; this.name = name; }
  DirH.prototype.getFileHandle = function (n, o) {
    var p = this.prefix + n;
    return Promise.resolve().then(function () { if (!(p in files) && !(o && o.create)) throw nf(); return new FileH(p); });
  };
  DirH.prototype.getDirectoryHandle = function (n) { return Promise.resolve(new DirH(this.prefix + n + '/', n)); };
  DirH.prototype.entries = function () {
    var prefix = this.prefix;
    var names = Object.keys(files).filter(function (k) { return k.indexOf(prefix) === 0 && k.slice(prefix.length).indexOf('/') < 0; });
    var i = 0;
    return { next: function () { if (i >= names.length) return Promise.resolve({ done: true }); var n = names[i++]; return Promise.resolve({ done: false, value: [n.slice(prefix.length), { kind: 'file' }] }); }, [Symbol.asyncIterator]: function () { return this; } };
  };
  DirH.prototype.removeEntry = function (n) { delete files[this.prefix + n]; return Promise.resolve(); };
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
  env: Object.assign({}, process.env, { USERPROFILE: tmpHome, HOME: tmpHome, PORT: String(srvPort), SHUPIAN_REG_ROOT: 'Software\\ShupianTest' }),
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

  console.log('计划书还在整理中：也能写问题');
  ok('项目情况里有「写问题」入口', await H.exists('.status-head .btn.sm', '＋ 写问题', true));
  await page.click(Q('.status-head .btn.sm', '＋ 写问题', true));
  ok('弹出写问题的小窗', await H.exists('.modal.small'));
  await page.click(Q('.modal.small textarea'));
  await page.insert('整理中写下的问题');
  await page.click(Q('.modal-foot button', '添加', true));
  await page.sleep(300);
  ok('问题记在功能下面', await H.exists('.issue .issue-text', '整理中写下的问题'));
  await page.click(Q('.issue .x'));
  await page.sleep(200);
  ok('可以删除这条问题', !(await H.exists('.issue .issue-text', '整理中写下的问题')));

  console.log('导出（下载）：文件名带日期时间，内容是计划书，可以再导入');
  await page.eval('(function(){window.__dl=[];var c=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.download){var a=this;fetch(a.href).then(function(r){return r.text()}).then(function(x){window.__dl.push({name:a.download,text:x})})}else c.call(this)}})()');
  await page.click(btn('⋯'));
  await page.sleep(150);
  await page.click(btn('导出'));
  await page.sleep(400);
  const dl = JSON.parse(await page.eval('JSON.stringify(window.__dl)'));
  ok('导出了一个 md 文件，名字带日期时间', dl.length === 1 && /^.+-\d{8}-\d{6}\.md$/.test(dl[0].name), dl.map((x) => x.name));
  ok('导出的内容是这份计划书', dl.length === 1 && /番茄钟/.test(dl[0].text) && /### 4\.2/.test(dl[0].text), dl.length ? dl[0].text.slice(0, 60) : '');

  console.log('给 AI 的话：默认英文，可以切换');
  await page.click(btn('⋯'));
  await page.sleep(150);
  await page.click(btn('复制提示词'));
  await page.sleep(300);
  const aiEn = await page.eval('__deep(".modal textarea.big")[0].value');
  ok('界面是中文，给 AI 的话默认是英文', /Turn the content below into a plan/.test(aiEn) && !/[一-鿿]{4}/.test(aiEn.split('```')[0]), aiEn.slice(0, 80));
  await page.click(Q('.modal .lang'));
  await page.sleep(150);
  await page.click(Q('.pop button', '中文', true));
  await page.sleep(200);
  const aiZh = await page.eval('__deep(".modal textarea.big")[0].value');
  ok('切到中文之后是中文的话', !/Turn the content below into a plan/.test(aiZh) && /[一-鿿]{4}/.test(aiZh.split('```')[0]), aiZh.slice(0, 40));
  await page.key('Escape');
  await page.sleep(150);
  ok('关掉弹窗', !(await H.exists('.modal')));

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

  console.log('确认之后还没开始做：仍然是更新计划书，第一次改进度才有功能清单');
  const approved = timer.replace(/^状态[：:][^　\r\n]*/m, '状态：已通过');
  const openNewTab = async (md) => {
    await page.click(Q('.tabbar .chip.add'));
    await page.sleep(300);
    await page.click(btn('导入'));
    await page.click(Q('.modal textarea'));
    await page.insert(md);
    await page.click(Q('.modal-foot button', '导入', true));
    await page.sleep(400);
  };
  const closeNewTab = async () => {
    await page.click(Q('.tabbar .tab:nth-of-type(2) .tab-x'));
    await page.sleep(300);
  };
  const storeOf = () => page.eval('(function(){var out=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/:p:/.test(k)){var v=JSON.parse(localStorage.getItem(k));if(/已通过/.test(v.md||""))out.push({fmd:(v.fmd||"").length,md:(v.md||"").length})}}return out})()');

  await openNewTab(approved.replace(/进度[：:][^\r\n]*/g, '进度：未做'));
  ok('已确认、功能都还没做：仍是项目情况，没有功能清单页签', (await H.text('.status-head h2')) === '项目情况' && !(await H.exists('.doctabs')) && (await H.exists('.statusline .state', '已确认', true)), [await H.text('.status-head h2'), await H.text('.statusline .state')]);
  ok('这时计划书仍可以直接改', (await H.count('.sec .box[tabindex]')) > 0);
  await page.click(Q('.status-row .prog', '未做'));
  await page.sleep(300);
  ok('第一次改进度：生成功能清单，页面切到功能清单', (await H.exists('.doctabs .chip.on', '功能清单', true)) && /进行中 1/.test((await H.text('.status-head .muted')) || ''), await H.text('.status-head .muted'));
  const started = await storeOf();
  ok('功能清单存下来了，计划书的内容没有变', started.length === 1 && started[0].fmd > 0, started);
  await closeNewTab();

  console.log('已确认、还没开始做：第一条问题就是开始做，问题记在功能清单里');
  await openNewTab(approved.replace(/进度[：:][^\r\n]*/g, '进度：未做'));
  ok('项目情况里一直有「写问题」入口', await H.exists('.status-head .btn.sm', '＋ 写问题', true));
  await page.click(Q('.status-row .btn.sm', '＋'));
  await page.click(Q('.modal.small textarea'));
  await page.insert('一开始就发现的问题');
  await page.click(Q('.modal-foot button', '添加', true));
  await page.sleep(400);
  ok('第一条问题：生成功能清单并切过去，问题出现在功能下', (await H.exists('.doctabs .chip.on', '功能清单', true)) && (await H.exists('.issue .issue-text', '一开始就发现的问题')), await H.text('.status-box'));
  const startedByIssue = await storeOf();
  ok('功能清单存下来了', startedByIssue.length === started.length + 1 && startedByIssue.every((x) => x.fmd > 0), startedByIssue);
  await closeNewTab();

  console.log('旧的单文件计划书（已确认并且已经开始做）：页面里生成功能清单，第一次改动才存成文件');
  await openNewTab(approved);
  ok('旧计划书：打开就是功能清单，有功能清单和初始计划书两个页签', (await H.exists('.doctabs .chip.on', '功能清单', true)) && (await H.exists('.doctabs .chip', '初始计划书', true)), await H.text('.doctabs'));
  const before = (await storeOf()).filter((x) => x.md === approved.length);
  ok('只看不改：功能清单没有被存成文件，原计划书不动', before.length === 1 && before[0].fmd === 0 && before[0].md > 0, before);
  await page.click(Q('.status-row .prog', '已完成'));
  await page.sleep(300);
  const after = (await storeOf()).filter((x) => x.md === approved.length);
  ok('第一次改动之后：功能清单才存下来，原计划书不变', after.length === 1 && after[0].fmd > 0 && after[0].md === before[0].md, after);
  await closeNewTab();
  ok('关掉这个项目回到第一个标签', (await H.count('.tabbar .tab')) === 1 && /已完成 1 \/ 2/.test((await H.text('.status-head .muted')) || ''), await H.text('.status-head .muted'));
  await page.click(Q('button.lang'));
  ok('语言是下拉，有两项', (await H.count('.pop button')) === 2);
  await page.click(Q('.pop button', 'English', true));
  await page.sleep(300);
  ok('选 English 后界面变成英文', await H.exists('.status-head h2', 'Project status'));
  await page.click(Q('button.lang'));
  await page.click(Q('.pop button', '中文', true));
  await page.sleep(300);

  console.log('最初的描述：开关');
  await page.click(btn('⋯'));
  ok('更多里有「保留最初的描述」，当前是开', await H.exists('.pop button.on', '保留最初的描述', true));
  await page.click(btn('保留最初的描述'));
  await page.sleep(150);
  await page.click(btn('⋯'));
  ok('关掉之后开关显示为关', !(await H.exists('.pop button.on', '保留最初的描述', true)) && (await H.exists('.pop button', '保留最初的描述', true)));
  await page.key('Escape');
  await page.sleep(100);

  console.log('有选项的字段：点选，可以多选');
  const sec7 = '__deep(".sec").filter(function(x){return x.getAttribute("data-no")==="7"})[0]';
  await page.eval('(function(){var s=' + sec7 + ';s.classList.remove("closed")})()');
  await page.click(sec7 + '.querySelector(".box")');
  await page.sleep(200);
  ok('编辑第 7 部分时，有选项的字段显示一排可点的选项', (await H.count('.optrow')) >= 3, await H.count('.optrow'));
  const platformRow = '__deep(".optrow").filter(function(r){return r.textContent.indexOf("使用平台")===0})[0]';
  await page.click(platformRow + '.querySelectorAll(".chip")[2]');
  await page.sleep(150);
  const val1 = await page.eval('__deep(".box textarea")[0].value');
  ok('点一个选项：写进「使用平台」那一行', /使用平台：.*电脑软件/.test(val1), val1.split('\n').filter((l) => /使用平台/.test(l))[0]);
  await page.click(platformRow + '.querySelectorAll(".chip")[3]');
  await page.sleep(150);
  const line2 = (await page.eval('__deep(".box textarea")[0].value')).split('\n').filter((l) => /^使用平台/.test(l))[0];
  ok('再点一个：新选的和之前选的都在，可以多选', /小程序/.test(line2) && /电脑软件/.test(line2) && /手机应用/.test(line2), line2);
  await page.click(platformRow + '.querySelectorAll(".chip")[2]');
  await page.sleep(150);
  const line3 = (await page.eval('__deep(".box textarea")[0].value')).split('\n').filter((l) => /^使用平台/.test(l))[0];
  ok('再点已选的：取消，别的不动', !/电脑软件/.test(line3) && /小程序/.test(line3) && /手机应用/.test(line3), line3);
  ok('点选项时填写框没有退出编辑', (await H.count('.box textarea')) === 1);
  await page.key('Escape');
  await page.sleep(150);
  await page.resize(1280, 800);

  console.log('确认：计划书里已经有进度，确认之后直接是功能清单');
  await page.click(Q('.statusline .btn.primary'));
  await page.sleep(300);
  ok('确认之后：已经开始做，出现功能清单和初始计划书两个页签，先看功能清单', (await H.exists('.doctabs .chip.on', '功能清单', true)) && (await H.exists('.doctabs .chip', '初始计划书', true)), await H.text('.doctabs'));
  ok('标题变成功能清单', (await H.text('.status-head h2')) === '功能清单');
  await page.click(Q('.status-row .prog', '进行中'));
  await page.sleep(300);
  ok('进度改在功能清单里', /已完成 2 \/ 2/.test((await H.text('.status-head .muted')) || ''), await H.text('.status-head .muted'));
  ok('各部分默认收起', (await H.count('.sec.closed')) >= 1, await H.count('.sec.closed'));
  ok('每个功能旁有 ＋', (await H.count('.status-row .btn.sm', '＋')) === 2);
  await page.shot(join(shots, '03-功能清单-1280.png'));
  await page.click(Q('.doctabs .chip', '初始计划书', true));
  await page.sleep(300);
  ok('初始计划书只读：没有项目情况框、没有加功能、块不能点开', !(await H.exists('.status-box')) && !(await H.exists('.addslot')) && (await H.count('.box.readonly')) > 0 && (await H.count('.box[tabindex]')) === 0);
  ok('初始计划书的状态是初版已确认', await H.exists('.statusline .state', '初版已确认', true), await H.text('.statusline .state'));
  await page.click(Q('.doctabs .chip', '功能清单', true));
  await page.sleep(300);

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
  ok('选择后这一条同时 @ 了 4.1 和 4.2', (await H.count('.modal.small .target')) === 2, await H.count('.modal.small .target'));
  ok('输入框里的 @ 被去掉', (await page.eval('__one(".modal.small textarea").value')) === '点暂停后数字仍在走');
  await page.click(Q('.modal.small textarea'));
  await page.click(Q('.modal.small .ftag .x'));
  await page.sleep(150);
  ok('去掉 4.1 之后只剩 4.2', (await H.count('.modal.small .target')) === 1 && /4\.2/.test((await H.text('.modal.small .target')) || ''));
  await page.click(Q('.modal-foot button', '添加', true));
  await page.sleep(300);
  ok('问题出现在功能清单里', await H.exists('.issue .issue-text', '点暂停后数字仍在走'));
  ok('记问题之后仍是功能清单，没有回到整理中', (await H.text('.status-head h2')) === '功能清单' && !(await H.exists('.statusline .state')), [await H.text('.status-head h2'), await H.text('.statusline .state')]);
  ok('未处理的问题计数', /未处理的问题 1 条/.test((await H.text('.status-head .muted')) || ''));
  await page.click(Q('.issue .istate', '待处理', true));
  await page.sleep(200);
  ok('点状态：变成处理中', await H.exists('.issue.doing .istate', '处理中', true));
  await page.click(Q('.issue .istate', '处理中', true));
  await page.sleep(200);
  ok('再点：变成已修，并留在列表里', await H.exists('.issue.done .istate', '✓ 已修', true) && (await H.count('.issue')) === 1);
  ok('已修的不再算未处理', !/未处理的问题/.test((await H.text('.status-head .muted')) || ''));

  console.log('写问题的小弹窗：没提交的内容留作草稿');
  await page.click(Q('.status-row .btn.sm', '＋'));
  await page.click(Q('.modal.small textarea'));
  await page.insert('草稿里的一句话');
  await page.sleep(800);
  await page.click(Q('.modal-foot button', '取消', true));
  await page.sleep(200);
  ok('取消后弹窗关闭', !(await H.exists('.modal.small')));
  await page.click(Q('.status-row .btn.sm', '＋'));
  await page.sleep(500);
  ok('再打开：没提交的内容还在', (await page.eval('__deep(".modal.small textarea")[0].value')) === '草稿里的一句话', await page.eval('__deep(".modal.small textarea")[0].value'));
  await page.eval('(function(){var ta=__deep(".modal.small textarea")[0];ta.value="";ta.dispatchEvent(new Event("input",{bubbles:true}));})()');
  await page.sleep(800);
  await page.click(Q('.modal-foot button', '取消', true));
  await page.sleep(200);
  await page.click(Q('.status-row .btn.sm', '＋'));
  await page.sleep(500);
  ok('清空之后再打开是空的', (await page.eval('__deep(".modal.small textarea")[0].value')) === '');
  await page.click(Q('.modal-foot button', '取消', true));
  await page.sleep(200);

  console.log('写问题的小弹窗：用列表一次写多条');
  await page.click(Q('.status-row .btn.sm', '＋'));
  await page.click(Q('.modal.small textarea'));
  await page.insert('开始按钮点了没有反应');
  await page.key('Enter');
  await page.sleep(150);
  ok('回车另起一行，上一行还在', (await H.count('.modal.small .irow')) === 2 && (await page.eval('__deep(".modal.small textarea")[0].value')) === '开始按钮点了没有反应');
  await page.insert('完成轮数没有加一@');
  await page.sleep(150);
  await page.click(Q('.pop button', '4.2 今天完成几轮'));
  await page.sleep(100);
  await page.click(Q('.modal.small .irow:nth-child(2) textarea'));
  await page.click(Q('.modal.small .irow:nth-child(2) .ftag .x'));
  await page.sleep(100);
  const tags = JSON.parse(await page.eval('JSON.stringify(__deep(".modal.small .irow").map(function(r){return Array.prototype.map.call(r.querySelectorAll(".target"),function(b){return b.textContent.replace(/\s.*/,"")})}))'));
  ok('每一行各选各的功能', tags.length === 2 && tags[0].length === 1 && tags[1].length === 1 && tags[0][0] !== tags[1][0], tags);
  await page.click(Q('.modal.small .irow:nth-child(2) textarea'));
  await page.key('Enter');
  await page.sleep(100);
  await page.insert('第三条继承上一行的功能');
  ok('新的一行用上一行的功能', /4\.2/.test(await page.eval('__deep(".modal.small .target")[2].textContent')));
  ok('没有「再写一条」按钮', !(await H.exists('.modal-foot button', '再写一条', true)));
  await page.click(Q('.modal-foot button', '添加', true));
  await page.sleep(300);
  ok('三条新问题都进了功能清单（加上之前已修的共 4 条）', (await H.count('.issue .issue-text')) === 4, await H.count('.issue .issue-text'));
  ok('未处理的问题计数', /未处理的问题 3 条/.test((await H.text('.status-head .muted')) || ''));
  const order = JSON.parse(await page.eval('JSON.stringify(__deep(".status-row, .issue").map(function(e){return e.className.indexOf("issue")>=0?"问题":"功能"}))'));
  ok('4.1 下面一条、4.2 下面三条（含之前已修的）', order.join('') === '功能问题功能问题问题问题', order.join(','));

  console.log('开始做之后：新增的功能记在功能清单里');
  await page.click(Q('.status-head .btn.sm', '＋ 添加功能', true));
  await page.click(Q('.modal input'));
  await page.insert('导出分享');
  await page.click(Q('.modal-foot button', '添加', true));
  await page.sleep(400);
  ok('加功能：功能清单里多了一项', await H.exists('.status-row .ref', '4.3 导出分享'), await H.text('.status-box'));
  ok('加功能：仍是功能清单', (await H.text('.status-head h2')) === '功能清单');
  ok('加功能：直接进入编辑', (await H.count('.box textarea')) === 1);
  await page.key('Escape');
  await page.sleep(150);

  console.log('浏览器文件夹：连接、保存、自动读回');
  await page.click(btn('⋯'));
  await page.click(btn('连接文件夹'));
  await H.wait(async () => (await page.eval('Object.keys(__fs).length')) > 0, 30);
  const saved = await page.eval('__fs["plan.md"] || ""');
  const savedF = await page.eval('__fs["features.md"] || ""');
  ok('初始计划书和功能清单是文件夹里的两个文件', /已通过/.test(saved) && /^# 功能清单/.test(savedF), [saved.slice(0, 40), savedF.slice(0, 40)]);
  ok('功能清单（features.md）带进度和问题', /进度：已完成/.test(savedF) && /已修：点暂停后数字仍在走/.test(savedF), savedF.slice(0, 80));
  ok('初始计划书里没有记下后来的问题', !/已修：/.test(saved) && !/导出分享/.test(saved), saved.slice(-80));
  ok('关掉开关之后，写进文件夹的计划书没有最初的描述', !/最初的描述/.test(saved), saved.slice(-80));
  await page.eval('__fs["features.md"] = __fs["features.md"].replace(/(### 4\\.2[\\s\\S]*?进度：)[^\\n]*/, "$1未做")');
  const t0 = Date.now();
  await H.wait(async () => /已完成 1 \/ 3/.test((await H.text('.status-head .muted')) || ''), 80);
  ok('文件夹里的进度一改，页面几秒内自动更新', /已完成 1 \/ 3/.test((await H.text('.status-head .muted')) || '') && Date.now() - t0 < 6500, Date.now() - t0);
  // 没有变化就不写文件；文件夹里被清空不算最新
  const w0 = await page.eval('window.__writes || 0');
  await page.sleep(4200);
  ok('没有改动时不重复写文件', (await page.eval('window.__writes || 0')) === w0, [w0, await page.eval('window.__writes || 0')]);
  await page.eval('__fs["features.md"] = ""');
  await H.wait(async () => (await page.eval('(__fs["features.md"] || "").length')) > 50, 90);
  ok('文件夹里的功能清单被清空：页面内容保留，并写回文件夹', (await page.eval('(__fs["features.md"] || "").length')) > 50 && (await H.exists('.status-head h2')), await page.eval('(__fs["features.md"] || "").length'));
  const hist = await page.eval('Object.keys(__fs).filter(function(k){return /^\\.shupian\\/history\\//.test(k)}).length');
  ok('功能清单被改写之前，旧的一份存进了历史版本', hist >= 1, await page.eval('Object.keys(__fs)'));
  await page.click(btn('⋯'));
  await page.click(btn('历史版本'));
  await H.wait(async () => H.exists('.hist-row'), 40);
  ok('历史版本弹窗列出旧版本，每条有恢复按钮', (await H.count('.hist-row')) >= 1 && (await H.exists('.hist-row button', '恢复', true)), await H.text('.modal'));
  await page.shot(join(shots, '06-历史版本-1280.png'));
  await page.click(Q('.hist-row button', '恢复', true));
  await page.sleep(300);
  ok('恢复之后弹窗关闭，仍是功能清单', !(await H.exists('.modal')) && (await H.text('.status-head h2')) === '功能清单', await H.text('.status-head h2'));

  console.log('各屏幕宽度');
  for (const [w, hh] of [[1280, 800], [820, 1100], [390, 844], [320, 640], [280, 560]]) {
    await page.resize(w, hh, w < 700);
    await page.sleep(200);
    const m = await page.eval('(function(){var b=__one(".body");var app=__one(".app").getBoundingClientRect();var bad=[];__deep("button,.pend,h2,.blk,.box,.status-box,textarea.in,input.in").forEach(function(e){var r=e.getBoundingClientRect();if(r.width&&(r.right>app.right+1||r.left<app.left-1)&&!e.closest(".tabbar"))bad.push((e.textContent||e.className).slice(0,20))});return {page:document.documentElement.scrollWidth-innerWidth,body:b.scrollWidth-b.clientWidth,doc:document.scrollingElement.scrollHeight-document.scrollingElement.clientHeight,head:__one(".head").getBoundingClientRect().height,bad:bad.slice(0,5)}})()');
    ok('宽 ' + w + '：不溢出、整页不滚动、顶栏不过高', m.page <= 0 && m.body <= 0 && m.doc <= 0 && m.bad.length === 0 && m.head <= 110, m);
    await page.shot(join(shots, '04-功能清单-' + w + '.png'));
  }
  await page.resize(360, 480);
  console.log('点击编辑：页面位置不跳');
  await page.eval('__deep(".sec.closed .fold").forEach(function(b){b.click()})');
  await page.sleep(150);
  const tallIdx = await page.eval('(function(){var bs=__deep(".box");var best=0;bs.forEach(function(b,i){if(b.getBoundingClientRect().height>bs[best].getBoundingClientRect().height)best=i});return best})()');
  await page.eval('(function(){var body=__one(".body");var b=__deep(".box")[' + tallIdx + '];body.scrollTop=0;var r=b.getBoundingClientRect(),br=body.getBoundingClientRect();body.scrollTop=r.top-br.top-120;})()');
  await page.sleep(150);
  const jb = await page.eval('(function(){var b=__deep(".box")[' + tallIdx + '].getBoundingClientRect();return {x:b.left+30,y:b.top+20,top:b.top,bottom:b.bottom,st:__one(".body").scrollTop,vb:__one(".body").getBoundingClientRect().bottom}})()');
  ok('测试用的框比窗口剩余部分高', jb.bottom > jb.vb, jb);
  await page.clickAt(jb.x, jb.y);
  await page.sleep(250);
  const ja = await page.eval('(function(){return {st:__one(".body").scrollTop,top:__deep(".box")[' + tallIdx + '].getBoundingClientRect().top,editing:!!__deep(".box")[' + tallIdx + '].querySelector("textarea")}})()');
  ok('点击后进入编辑', ja.editing, ja);
  ok('点击后页面位置不变（不跳到框底部）', Math.abs(ja.st - jb.st) <= 1 && Math.abs(ja.top - jb.top) <= 1, { before: jb.st, after: ja.st });
  await page.key('Escape');
  await page.sleep(150);

  // ================= 桌面服务 =================
  console.log('桌面服务：最近标签和文件夹');
  ok('服务已启动', !!srvInfo, srvInfo);
  const url = 'http://127.0.0.1:' + srvInfo.port + '/index.html?k=' + srvInfo.token + '&win=1';
  const win = await chrome.newPage();
  await win.init(DEEP);
  await win.init('(function () { var f = window.fetch; window.__pick = null; window.__pickBodies = []; window.fetch = function (u, o) { if (typeof u === "string" && /\\/api\\/pick$/.test(u.split("?")[0]) && window.__pick) { window.__pickBodies.push(o && o.body); return Promise.resolve(new Response(JSON.stringify(window.__pick), { status: 200, headers: { "content-type": "application/json" } })); } return f.apply(this, arguments); }; })();');
  await win.init('window.__sizeCalls = []; window.resizeTo = function (w, h) { window.__sizeCalls.push(["resize", w, h]); }; window.moveTo = function (x, y) { window.__sizeCalls.push(["move", x, y]); };');
  await win.resize(420, 640);
  const HW = helpers(win);
  await win.goto(url + '&view=hub');
  await HW.wait(async () => HW.exists('.frow'), 40);
  await HW.wait(async () => !(await win.eval('__one(".extrow").classList.contains("wait")')), 40);
  ok('最近页顶上提示悬浮窗要装扩展', (await HW.exists('.extrow .muted', '需要先安装浏览器扩展')) && (await HW.exists('.extrow button', '安装浏览器扩展', true)), await HW.text('.extrow'));
  await HW.wait(async () => HW.exists('.modal .ext-block'), 40);
  ok('第一次打开：安装说明自动弹出', await HW.exists('.modal .ext-block'), await HW.text('.modal'));
  ok('第一次打开：已经自动添加到浏览器，弹窗里说明要打开开关', /已添加到/.test((await HW.text('.modal .ext-status')) || ''), await HW.text('.modal .ext-status'));
  ok('弹窗第一块是安装到浏览器，Edge 和 Chrome 各一个按钮', (await HW.exists('.modal h3', '安装到浏览器', true)) && (await HW.exists('.modal .btn.primary', '安装到')), await HW.text('.modal'));
  await win.key('Escape');
  await win.sleep(150);
  ok('关掉之后不再自动弹出，页面顶上仍有安装入口', !(await HW.exists('.modal')) && (await HW.exists('.extrow button', '安装浏览器扩展', true)));
  await win.click(Q('.extrow button', '安装浏览器扩展', true));
  await HW.wait(async () => HW.exists('.modal .steps'), 40);
  const extPath = await HW.text('.modal .fpath');
  ok('安装弹窗：四步说明和扩展文件夹地址', (await win.eval('__deep(".modal .steps li").length')) === 4 && /extension$/.test(extPath || ''), extPath);
  ok('扩展文件夹里有清单和脚本', existsSync(join(extPath || '.', 'manifest.json')) && existsSync(join(extPath || '.', 'shupian.js')), extPath);
  const bmHref = await win.eval('(function(){var a=__one(".modal .bookmarklet");return a?a.getAttribute("href"):""})()');
  ok('安装弹窗里有可以拖到书签栏的书签，指向本机服务的脚本', /^javascript:/.test(bmHref) && /shupian\.js\?k=[0-9a-f]+/.test(bmHref), bmHref.slice(0, 120));
  await win.shot(join(shots, '05b-安装扩展弹窗-420.png'));
  await win.key('Escape');
  await win.sleep(100);
  // 在别的浏览器里打开的安装页：书签和扩展两种方式
  const inst = await chrome.newPage();
  await inst.init(DEEP);
  await inst.resize(900, 800);
  const HI = helpers(inst);
  await inst.goto('http://127.0.0.1:' + srvInfo.port + '/index.html?k=' + srvInfo.token + '&view=install');
  await HI.wait(async () => HI.exists('.bookmarklet'), 40);
  ok('安装页：一键安装、书签和手动安装', (await HI.count('.ext-block')) === 3 && (await HI.exists('h2', '安装悬浮窗', true)), await HI.text('.col'));
  await inst.shot(join(shots, '05c-安装页-900.png'));
  // 新开的页面会抢走前台，原来的窗口变成后台页：定时器被限速、截图卡住。关掉它，再把桌面窗口放回前台
  await inst.send('Page.close');
  inst.close();
  await win.send('Page.bringToFront');
  ok('先显示「最近」标签', await HW.exists('.tabbar .chip.on', '最近', true));
  ok('列出最近在用的文件夹', await HW.exists('.frow .fname', '番茄钟项目'), await win.eval('__one(".folders") && __one(".folders").textContent'));
  ok('标出「使用中」', await HW.exists('.badge', '使用中'));
  ok('显示完整地址', (await HW.text('.fpath')) === projDir, await HW.text('.fpath'));
  ok('显示进度摘要', /已完成 1 \/ 2，待补 0 处/.test((await HW.text('.frow .muted')) || ''), await HW.text('.frow .muted'));
  ok('最近里地址文字本身就是复制的地方，没有单独的复制按钮', (await HW.exists('.frow button.fpath')) && !(await HW.exists('.frow .btn')) && !/方便打开 CLI/.test(await win.eval('__one(".frow").textContent')));
  ok('界面里没有 Claude 字样', !/Claude/.test(await win.eval('__one(".app").textContent')));
  const sizeAtOpen = JSON.stringify(await win.eval('window.__sizeCalls'));
  ok('打开时只设置一次小窗口大小和位置', /^\[\["resize",360,480\],\["move",\d+,\d+\]\]$/.test(sizeAtOpen), sizeAtOpen);
  await win.shot(join(shots, '05-最近-420.png'));
  ok('框里没有单独的「打开」按钮', !(await HW.exists('.frow .btn.primary')));
  const hubGeo = await win.eval('(function(){var b=__one(".body").getBoundingClientRect();var n=__deep(".hub-actions button").map(function(x){var r=x.getBoundingClientRect();return {t:x.textContent,top:r.top,bottom:r.bottom}});var f=__one(".frow").getBoundingClientRect();var p=getComputedStyle(__one(".fpath"));var nm=getComputedStyle(__one(".fname"));return {bodyTop:b.top,bodyBottom:b.bottom,btns:n,frowTop:f.top,pathSize:parseFloat(p.fontSize),nameSize:parseFloat(nm.fontSize),pathColor:p.color}})()');
  ok('最近页：新建计划书、新建文件夹、选择别的文件夹在列表上面，不用滚动就能点', hubGeo.btns.length === 3 && hubGeo.btns.every((x) => x.bottom <= hubGeo.bodyBottom && x.bottom <= hubGeo.frowTop), hubGeo);
  ok('最近页：文件夹地址比名称小、颜色是次要色', hubGeo.pathSize < hubGeo.nameSize && hubGeo.pathColor !== 'rgb(0, 0, 0)', hubGeo);
  await win.click(Q('.frow .fname'));
  await HW.wait(async () => HW.exists('.status-box'), 40);
  ok('点打开计划书：在新标签里打开', (await HW.exists('.tabbar .tab .tab-name', '番茄钟（示例）')) || (await HW.count('.tabbar .tab')) === 1, await HW.text('.tabbar'));
  ok('读到了 plan.md 的内容', /番茄钟/.test((await HW.text('.title')) || ''), await HW.text('.title'));
  ok('文件夹名就是复制地址的地方', (await HW.exists('.statusline button.folder-path')) && !(await HW.exists('.statusline button', '复制地址', true)) && (await HW.exists('.statusline .muted', '方便打开 CLI')));
  await win.click(Q('.status-row:nth-of-type(4) .prog'));
  await sleep(900);
  ok('点进度后，磁盘上的 plan.md 改了', /进度：已完成/.test(readFileSync(join(projDir, 'plan.md'), 'utf8').split('### 4.2')[1] || ''));
  writeFileSync(join(projDir, 'plan.md'), readFileSync(join(projDir, 'plan.md'), 'utf8').replace(/(### 4\.2[\s\S]*?进度：)已完成/, '$1未做'));
  const t1 = Date.now();
  await HW.wait(async () => /已完成 1 \/ 2/.test((await HW.text('.status-head .muted')) || ''), 80);
  ok('磁盘上的计划书被改了，页面自动更新', /已完成 1 \/ 2/.test((await HW.text('.status-head .muted')) || '') && Date.now() - t1 < 7000, Date.now() - t1);
  const bad = await win.eval('fetch("/api/file?root=" + encodeURIComponent("C:\\\\Windows") + "&p=plan.md", { headers: { "x-shupian-token": "' + srvInfo.token + '" } }).then(function(r){return r.status})');
  ok('服务不读未知文件夹', bad === 400, bad);
  const draftUrl = (name) => '"/api/file?root=" + encodeURIComponent(' + JSON.stringify(projDir) + ') + "&p=" + encodeURIComponent(' + JSON.stringify(name) + ')';
  const draftPut = await win.eval('fetch(' + draftUrl('.shupian/drafts/plan.md.json') + ', { method: "PUT", headers: { "x-shupian-token": "' + srvInfo.token + '" }, body: JSON.stringify({ rows: [{ text: "草稿", fs: [] }] }) }).then(function(r){return r.status})');
  ok('服务接受草稿文件', draftPut === 200 && existsSync(join(projDir, '.shupian', 'drafts', 'plan.md.json')), draftPut);
  const draftBad = await win.eval('fetch(' + draftUrl('.shupian/drafts/other.txt') + ', { method: "PUT", headers: { "x-shupian-token": "' + srvInfo.token + '" }, body: "x" }).then(function(r){return r.status})');
  ok('服务不接受草稿目录里的其他文件', draftBad === 400, draftBad);
  rmSync(join(projDir, '.shupian', 'drafts'), { recursive: true, force: true });
  const noTok = await win.eval('fetch("/api/projects").then(function(r){return r.status})');
  ok('没有口令的接口请求被拒绝', noTok === 401, noTok);
  await win.shot(join(shots, '06-桌面打开计划书-420.png'));
  await win.click(Q('.tabbar .chip', '最近', true));
  await win.sleep(300);
  ok('可以切回「最近」', await HW.exists('.frow'));
  ok('打开计划书和切回最近都没有改窗口大小', JSON.stringify(await win.eval('window.__sizeCalls')) === sizeAtOpen, await win.eval('window.__sizeCalls'));

  console.log('桌面服务：没有计划书的文件夹');
  await win.click('(function(){var r=Array.from(__deep(".frow")).filter(function(x){return x.textContent.indexOf("空文件夹")>=0})[0];return r&&r.querySelector(".fname")})()');
  await HW.wait(async () => HW.exists('.doc.empty h1'), 40);
  ok('空文件夹：显示文件夹名作为标题', (await HW.text('.doc.empty h1')) === '空文件夹', await HW.text('.doc.empty h1'));
  ok('空文件夹：有一句说明和新建入口', (await HW.exists('.doc.empty p', '还没有计划书。', true)) && (await HW.exists('.doc.empty button', '新建空白计划书', true)));
  ok('空文件夹：窗口大小没变', JSON.stringify(await win.eval('window.__sizeCalls')) === sizeAtOpen, await win.eval('window.__sizeCalls'));
  await win.shot(join(shots, '09-空文件夹-420.png'));

  console.log('桌面服务：新建计划书、保存到文件夹、新建文件夹、拖入');
  const setPick = (obj) => win.eval('window.__pick = ' + JSON.stringify(obj));
  const goHub = async () => { await win.click(Q('.tabbar .chip', '最近', true)); await HW.wait(async () => HW.exists('.frow'), 40); };
  await goHub();
  ok('最近页有三个入口', (await HW.exists('button', '新建计划书', true)) && (await HW.exists('button', '新建文件夹', true)) && (await HW.exists('button', '选择别的文件夹', true)));
  const sizeBeforeNew = JSON.stringify(await win.eval('window.__sizeCalls'));
  await win.click(btn('新建计划书'));
  await HW.wait(async () => HW.exists('.doc h1'), 40);
  ok('新建计划书：直接进入空白计划书', (await HW.text('.doc h1')) === '未命名项目' && (await HW.exists('.sec h2', '1 基础信息')), await HW.text('.doc h1'));
  ok('新建计划书：提示可以保存到文件夹', await HW.exists('.statusline button', '保存到文件夹', true));
  ok('新建计划书：窗口大小没变', JSON.stringify(await win.eval('window.__sizeCalls')) === sizeBeforeNew);

  // 保存到没有计划书的文件夹
  await setPick({ path: emptyDir, name: '空文件夹' });
  await win.click(Q('.statusline button', '保存到文件夹', true));
  await win.click(Q('.pop button', '选择已有文件夹', true));
  await HW.wait(async () => HW.exists('.statusline button.folder-path', '文件夹：空文件夹'), 40);
  ok('保存到文件夹：显示文件夹名', await HW.exists('.statusline button.folder-path', '文件夹：空文件夹'));
  await sleep(500);
  ok('保存到文件夹：文件夹里写出了 plan.md', existsSync(join(emptyDir, 'plan.md')) && /计划书/.test(readFileSync(join(emptyDir, 'plan.md'), 'utf8')));
  ok('保存到文件夹：可以复制地址', await HW.exists('.statusline button.folder-path'));

  // 保存到已有计划书的文件夹：不直接覆盖，选「用文件夹里的」
  await goHub();
  await win.click(btn('新建计划书'));
  await HW.wait(async () => HW.exists('.statusline button', '保存到文件夹', true), 40);
  await setPick({ path: projDir, name: '番茄钟项目' });
  const diskBefore = readFileSync(join(projDir, 'plan.md'), 'utf8');
  await win.click(Q('.statusline button', '保存到文件夹', true));
  await win.click(Q('.pop button', '选择已有文件夹', true));
  await HW.wait(async () => HW.exists('.modal .p', '用哪一份'), 40);
  ok('已有计划书：弹出选择，不直接覆盖', (await HW.exists('.modal .p', '用哪一份')) && readFileSync(join(projDir, 'plan.md'), 'utf8') === diskBefore);
  await win.click(Q('.modal-foot button', '用文件夹里的', true));
  await HW.wait(async () => /番茄钟/.test((await HW.text('.doc h1')) || ''), 40);
  ok('已有计划书：用文件夹里的，页面显示它的内容', /番茄钟/.test((await HW.text('.doc h1')) || ''), await HW.text('.doc h1'));
  ok('已有计划书：磁盘上的没有被改', readFileSync(join(projDir, 'plan.md'), 'utf8') === diskBefore);

  console.log('桌面服务：同一个文件夹里的多份计划书');
  ok('状态行显示当前是哪一份', await HW.exists('.statusline button', 'plan.md ▾', true));
  await win.click(Q('.statusline button', 'plan.md ▾', true));
  await HW.wait(async () => HW.exists('.pop button', '新建一份计划书', true), 40);
  await win.click(Q('.pop button', '新建一份计划书', true));
  await HW.wait(async () => HW.exists('.modal input'), 40);
  await win.click(Q('.modal input'));
  await win.insert('第二版');
  await win.click(Q('.modal-foot button', '创建', true));
  await HW.wait(async () => HW.exists('.statusline button', '计划书-第二版.md ▾', true), 60);
  ok('新建一份：文件夹里多了 计划书-第二版.md', existsSync(join(projDir, '计划书-第二版.md')));
  ok('新建一份：页面显示的是新的这份', (await HW.text('.doc h1')) === '第二版', await HW.text('.doc h1'));
  ok('新建一份：原来的 plan.md 没被改', readFileSync(join(projDir, 'plan.md'), 'utf8') === diskBefore);
  await win.click(Q('.statusline button', '计划书-第二版.md ▾', true));
  await HW.wait(async () => HW.exists('.pop button', '番茄钟（示例）（plan.md）', true), 40);
  ok('下拉里列出两份', (await HW.count('.pop button')) === 3, await HW.count('.pop button'));
  await win.click(Q('.pop button', '番茄钟（示例）（plan.md）', true));
  await HW.wait(async () => /番茄钟/.test((await HW.text('.doc h1')) || ''), 40);
  ok('切回 plan.md：显示它的内容', /番茄钟/.test((await HW.text('.doc h1')) || ''), await HW.text('.doc h1'));
  await win.click(Q('.statusline button', 'plan.md ▾', true));
  await HW.wait(async () => HW.exists('.pop button', '第二版（计划书-第二版.md）', true), 40);
  await win.click(Q('.pop button', '第二版（计划书-第二版.md）', true));
  await HW.wait(async () => (await HW.text('.doc h1')) === '第二版', 40);
  await goHub();
  ok('最近页：有多份时显示当前是哪一份', await HW.exists('.plan-pick', '计划书：计划书-第二版.md ▾', true), await HW.text('.plan-pick'));
  await win.click(Q('.plan-pick'));
  await HW.wait(async () => HW.exists('.pop button', '番茄钟（示例）（plan.md）', true), 40);
  await win.click(Q('.pop button', '番茄钟（示例）（plan.md）', true));
  await HW.wait(async () => HW.exists('.plan-pick', '计划书：plan.md ▾', true), 40);
  ok('最近页：选定当前这一份', await HW.exists('.plan-pick', '计划书：plan.md ▾', true), await HW.text('.plan-pick'));

  // 新建文件夹：先选放在哪里，再起名字
  await goHub();
  await setPick({ path: projDir, name: '番茄钟项目' });
  await win.click(btn('新建文件夹'));
  await HW.wait(async () => HW.exists('.modal input'), 40);
  ok('新建文件夹：询问选择位置时带了说明', /新文件夹放在哪里/.test(String((await win.eval('window.__pickBodies')).slice(-1)[0])), await win.eval('window.__pickBodies'));
  mkdirSync(join(projDir, '已有文件夹'), { recursive: true });
  await win.click(Q('.modal input'));
  await win.insert('已有文件夹');
  await win.click(Q('.modal-foot button', '创建', true));
  await sleep(300);
  await win.eval('0');
  ok('新建文件夹：同名时说明原因，不关闭', /已有同名文件夹/.test((await HW.text('.modal .err')) || ''), await HW.text('.modal .err'));
  await win.eval('(function(){var i=__one(".modal input");i.value=""})()');
  await win.click(Q('.modal input'));
  await win.insert('新建的文件夹');
  await win.click(Q('.modal-foot button', '创建', true));
  await HW.wait(async () => HW.exists('.tabbar .tab .tab-name', '新建的文件夹'), 40);
  ok('新建文件夹：磁盘上有这个文件夹', existsSync(join(projDir, '新建的文件夹')));
  ok('新建文件夹：自动打开，显示文件夹名作标题', (await HW.text('.doc.empty h1')) === '新建的文件夹', await HW.text('.doc.empty h1'));

  // 拖入文件夹：用浏览器内部的文件夹句柄模拟拖入
  const dropJs = (name, files) => '(async function(){var root=await navigator.storage.getDirectory();var d=await root.getDirectoryHandle(' + JSON.stringify(name) + ',{create:true});' +
    files.map((f) => 'await (await d.getFileHandle(' + JSON.stringify(f) + ',{create:true})).createWritable().then(function(w){return w.write("x").then(function(){return w.close()})});').join('') +
    'var ev=new Event("drop",{bubbles:true,cancelable:true,composed:true});ev.dataTransfer={types:["Files"],items:[{kind:"file",getAsFileSystemHandle:function(){return Promise.resolve(d)}}]};' +
    'var host=document.querySelector("#shupian-app")||document.body;var target=(host.shadowRoot&&host.shadowRoot.querySelector(".app"))||host;target.dispatchEvent(ev);return true})()';
  await goHub();
  await win.eval(dropJs('番茄钟项目', ['plan.md']));
  await HW.wait(async () => HW.exists('.tabbar .tab.on .tab-name', '番茄钟（示例）'), 60);
  ok('拖入文件夹：按名字找到地址并打开', await HW.exists('.tabbar .tab.on .tab-name', '番茄钟（示例）'), await HW.text('.tabbar'));
  ok('拖入文件夹：可以复制地址', await HW.exists('.statusline button.folder-path'));
  await goHub();
  await win.eval(dropJs('不存在的文件夹名', []));
  await HW.wait(async () => HW.exists('.tabbar .tab .tab-name', '不存在的文件夹名'), 60);
  ok('拖入文件夹：找不到地址时也能打开，并说明', (await HW.exists('.tabbar .tab .tab-name', '不存在的文件夹名')) && /没有找到这个文件夹的地址/.test((await HW.text('.toast')) || ''), await HW.text('.toast'));
  ok('拖入文件夹：没有地址时没有复制入口', !(await HW.exists('.statusline button.folder-path')));
  ok('拖入和新建之后窗口大小仍没变', JSON.stringify(await win.eval('window.__sizeCalls')) === sizeAtOpen, await win.eval('window.__sizeCalls'));
  await win.shot(join(shots, '10-拖入文件夹-420.png'));

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
  ok('顶上两个动作按钮，选取元素只在每条问题上', !(await HP.exists('button', '选取元素', true)) && (await HP.exists('button', '＋ 选取元素', true)) && (await HP.exists('button', '区域截图', true)) && (await HP.exists('button', '当前页面', true)));
  await fpage.shot(join(shots, '07-悬浮窗-1280.png'));
  const hdr = await fpage.rectOf(fq('.collapse'));
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
  await fpage.click(fq('button', '＋ 选取元素', true));
  await fpage.sleep(150);
  const target = await fpage.eval('(function(){var r=document.querySelector("h1").getBoundingClientRect();return {x:r.left+20,y:r.top+10}})()');
  await fpage.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: target.x, y: target.y });
  await fpage.sleep(100);
  await fpage.clickAt(target.x, target.y);
  await fpage.sleep(300);
  ok('选取的元素显示出来', /h1/.test((await HP.text('.fb-body')) || ''), await HP.text('.fb-body'));
  await fpage.click(fq('button', '＋ 选取元素', true));
  await fpage.sleep(150);
  await fpage.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: target.x, y: target.y });
  await fpage.sleep(100);
  await fpage.clickAt(target.x, target.y);
  await fpage.sleep(300);
  const nEls = await fpage.eval('__deep(".chipline").filter(function(c){return /h1/.test(c.textContent) && !c.querySelector("img")}).length');
  ok('同一条问题可以选取多个元素', nEls === 2, nEls);
  await fpage.click(fq('textarea.in'));
  await fpage.insert('标题字号太小');
  await fpage.eval('window.__clip = null; Object.defineProperty(navigator, "clipboard", { value: { writeText: function (t) { window.__clip = t; return Promise.resolve(); }, write: function () { return Promise.resolve(); } }, configurable: true });');
  await fpage.click(fq('button', '复制文字', true));
  await fpage.sleep(300);
  const clip = await fpage.eval('window.__clip');
  ok('复制出来的话带页面、标题、元素、样式、说明、报错', clip && /h1/.test(clip) && /页面标题：示例项目页面/.test(clip) && /标题字号太小/.test(clip) && /font-size/.test(clip) && /测试报错/.test(clip) && /host\.html/.test(clip) && /1280×800/.test(clip), clip);
  ok('没有口语化的提示词', !/随手|就行/.test(await fpage.eval('__one(".win").textContent') + (await fpage.eval('__one("textarea.in").placeholder'))));
  await fpage.click(fq('.collapse'));
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

  console.log('标签放不下时换行，每个标签都完整显示');
  await page.resize(280, 560);
  for (let n = 0; n < 4; n++) { await page.click(Q('.tabbar .chip.add')); await page.sleep(120); }
  const tabInfo = await page.eval('(function(){var bar=__one(".tabbar");var vw=innerWidth;var rs=Array.from(__deep(".tabbar .tab, .tabbar .chip")).map(function(e){var r=e.getBoundingClientRect();return {l:r.left,r:r.right}});return {n:rs.length,inside:rs.every(function(r){return r.l>=-0.5&&r.r<=vw+0.5}),hscroll:bar.scrollWidth-bar.clientWidth}})()');
  ok('标签多了换行：每个都完整在窗口里，没有横向滚动', tabInfo.n >= 5 && tabInfo.inside && tabInfo.hscroll <= 0, tabInfo);
  await page.shot(join(shots, '12-标签换行-280.png'));
} finally {
  await chrome.close();
  staticSrv.kill();
  appSrv.kill();
  await sleep(300);
  try { rmSync(tmpHome, { recursive: true, force: true }); } catch (e) { /* 临时目录下次再清 */ }
  spawnSync('reg', ['delete', 'HKCU\\Software\\ShupianTest', '/f'], { encoding: 'utf8' });
}
console.log('\n通过 ' + pass + ' 项，失败 ' + fails.length + ' 项');
fails.forEach((f) => console.log('  失败：' + f));
process.exit(fails.length ? 1 : 0);
