// 浏览器扩展自测：node tests/ext.mjs
// 以扩展形态加载 extension/，检查脚本注入、悬浮窗、截图（真实截图或回退到伪截图）。
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, DEEP } from './cdp.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0;
const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✔ ' + n); } else { fails.push(n); console.log('  ✖ ' + n + (d !== undefined ? '  ' + JSON.stringify(d) : '')); } };

// 扩展会在固定端口范围里找桌面版；已经有桌面版在运行时，扩展会连到那个真实的，测试没法隔离，先退出它再测
for (let p = 14165; p < 14225; p++) {
  const r = await fetch('http://127.0.0.1:' + p + '/api/pair', { method: 'POST' }).catch(() => null);
  if (r) {
    console.log('端口 ' + p + ' 上已有桌面版在运行：先退出托盘版再运行本测试。');
    process.exit(2);
  }
}

// 桌面服务：临时用户目录里放一个有计划书的文件夹
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const home = mkdtempSync(join(tmpdir(), 'shupian-ext-'));
const proj = join(home, '番茄钟项目');
mkdirSync(proj, { recursive: true });
writeFileSync(join(proj, 'plan.md'), readFileSync(join(root, 'tests', 'fixtures', 'timer.zh.md'), 'utf8'));
const enc = proj.replace(/[^A-Za-z0-9]/g, '-');
mkdirSync(join(home, '.claude', 'projects', enc), { recursive: true });
writeFileSync(join(home, '.claude', 'projects', enc, 'a.jsonl'), '{}\n');
utimesSync(join(home, '.claude', 'projects', enc, 'a.jsonl'), new Date(), new Date());
writeFileSync(join(home, '.claude.json'), JSON.stringify({ projects: { [proj]: {} } }));
const appSrv = spawn(process.execPath, [join(root, 'tools', 'app-server.mjs')], {
  stdio: 'ignore',
  env: Object.assign({}, process.env, { USERPROFILE: home, HOME: home, PORT: String(14300 + Math.floor(Math.random() * 300)) }),
});
let info = null;
for (let i = 0; i < 40 && !info; i++) {
  await sleep(150);
  try { const j = JSON.parse(readFileSync(join(home, '.shupian', 'server.json'), 'utf8')); if (j.port) info = j; } catch (e) { /* 还没写出来 */ }
}

const srv = spawn(process.execPath, [join(root, 'tools', 'serve.mjs'), '.'], { stdio: ['ignore', 'pipe', 'inherit'] });
const base = await new Promise((r) => srv.stdout.once('data', (d) => r(String(d).trim())));
const chrome = await launch(null, ['--load-extension=' + join(root, 'extension'), '--disable-extensions-except=' + join(root, 'extension'), '--disable-features=DisableLoadExtensionCommandLineSwitch']);
try {
  const page = await chrome.newPage();
  await page.init(DEEP);
  await page.resize(1280, 800);
  await page.goto(base + 'tests/fixtures/plain.html');
  await page.sleep(800);
  ok('页面上出现悬浮按钮', await page.eval('!!document.querySelector("[data-shupian]")'));
  await page.eval('window.postMessage({ shupian: "open" }, "*")');
  await page.sleep(400);
  ok('消息可以打开小窗', await page.eval('(function(){var h=document.querySelector("[data-shupian]");var w=h.shadowRoot.querySelector(".win");return w.style.display!=="none"})()'));
  await page.eval('(function(){var b=Array.prototype.filter.call(document.querySelector("[data-shupian]").shadowRoot.querySelectorAll("button"),function(x){return x.textContent==="当前页面"})[0];b.click()})()');
  let shot = false;
  for (let i = 0; i < 60 && !shot; i++) {
    await page.sleep(150);
    shot = await page.eval('!!document.querySelector("[data-shupian]").shadowRoot.querySelector(".chipline img.shot")');
  }
  ok('当前页面：带一张整页截图', shot);

  // 没打开过桌面小窗口：悬浮窗说明只能复制文字
  const root2 = '(function(){return document.querySelector("[data-shupian]").shadowRoot})()';
  const wtext = () => page.eval('(function(){var r=' + root2 + ';return r.querySelector(".fb-body").innerText})()');
  let unpaired = '';
  for (let i = 0; i < 120 && !/先打开桌面小窗口/.test(unpaired); i++) { await page.sleep(150); unpaired = await wtext(); }
  ok('没有打开过桌面小窗口：提示先打开', /先打开桌面小窗口/.test(unpaired), unpaired);

  // 打开桌面小窗口页面：扩展拿到端口和口令
  const helper = await chrome.newPage();
  await helper.init(DEEP);
  await helper.resize(420, 640);
  await helper.goto('http://127.0.0.1:' + info.port + '/index.html?k=' + info.token + '&win=1');
  await helper.sleep(800);
  ok('桌面小窗口页面只有一个应用，没有再挂悬浮窗', (await helper.eval('document.querySelectorAll("[data-shupian]").length')) === 0);
  ok('桌面小窗口页面里留下扩展已安装的标记', await helper.eval('document.documentElement.hasAttribute("data-shupian-ext")'));
  await helper.sleep(1500);
  const extRow = await helper.eval('(function(){var e=__one(".extrow");return e?e.textContent:""})()');
  ok('最近页显示悬浮窗已开启，没有安装按钮', /已开启/.test(extRow) && !/安装浏览器扩展/.test(extRow), extRow);

  const page2 = await chrome.newPage();
  await page2.init(DEEP);
  await page2.resize(1280, 800);
  await page2.goto(base + 'tests/fixtures/plain.html');
  await page2.sleep(600);
  await page2.eval('window.postMessage({ shupian: "open" }, "*")');
  const w2 = (js) => page2.eval('(function(){var r=document.querySelector("[data-shupian]").shadowRoot;' + js + '})()');
  let target = '';
  for (let i = 0; i < 60 && !target; i++) {
    await page2.sleep(150);
    target = await w2('var b=r.querySelector("button.target");return b?b.textContent:""');
  }
  await page2.shot(join(root, 'preview', '11-悬浮窗联动.png'));
  ok('悬浮窗显示 @ 功能', /^@ 4\.1/.test(target), target);
  let shownName = '';
  for (let i = 0; i < 40 && !/番茄钟/.test(shownName); i++) { await page2.sleep(100); shownName = await w2('return r.querySelector(".fb-body").innerText'); }
  ok('显示计划书名称', /番茄钟/.test(shownName), shownName);
  await w2('var t=r.querySelector("textarea");t.focus();');
  await page2.insert('开始按钮没有反应');
  await w2('r.querySelectorAll("button").forEach(function(b){if(b.textContent==="记到计划书")b.click()})');
  let recorded = '';
  for (let i = 0; i < 40 && !/开始按钮没有反应/.test(recorded); i++) {
    await sleep(150);
    recorded = readFileSync(join(proj, 'plan.md'), 'utf8');
  }
  const issueLine = (recorded.split('\n').filter((l) => /开始按钮没有反应/.test(l))[0] || '');
  const afterFeature = recorded.split('### 4.1')[1] || '';
  ok('问题记到了所选功能的「问题：」下', /开始按钮没有反应/.test(afterFeature.split('### 4.2')[0]) && /问题[：:]/.test(afterFeature.split('### 4.2')[0]), issueLine);
  ok('问题带着页面信息', /页面：127\.0\.0\.1|页面：localhost|页面：/.test(issueLine), issueLine);

  // 用列表一次记多条：一行一条，回车另起一行，每行各选各的功能
  const clickBtn = (label) => w2('var f=false;r.querySelectorAll("button").forEach(function(b){if(!f&&b.textContent===' + JSON.stringify(label) + '){f=true;b.click()}})');
  await w2('var t=r.querySelector("textarea");t.focus();');
  await page2.insert('关闭再打开没有回到设定值');
  await page2.key('Enter');
  await page2.sleep(150);
  ok('回车另起一行，上一行还在', (await w2('return r.querySelectorAll("textarea").length')) === 2 && /关闭再打开没有回到设定值/.test(await w2('return r.querySelectorAll("textarea")[0].value')));
  await page2.insert('完成轮数不加一@');
  await page2.sleep(200);
  await w2('var f=false;r.querySelectorAll(".pop button").forEach(function(b){if(!f&&/^4\.2/.test(b.textContent)){f=true;b.click()}})');
  await page2.sleep(150);
  // 第二行继承了上一行的 4.1，@ 选 4.2 是追加；去掉 4.1，这一行只属于 4.2
  await w2('var rows=r.querySelectorAll(".irow");rows[1].querySelector(".ftag .x").click()');
  await page2.sleep(150);
  const targets = await w2('return Array.prototype.map.call(r.querySelectorAll("button.target"),function(b){return b.textContent}).join("|")');
  ok('每一行各选各的功能', /^@ 4\.1[^|]*\|@ 4\.2/.test(targets), targets);
  await page2.shot(join(root, 'preview', '12-悬浮窗多条问题.png'));
  await clickBtn('记到计划书');
  let both = '';
  for (let i = 0; i < 40 && !/完成轮数不加一/.test(both); i++) { await sleep(150); both = readFileSync(join(proj, 'plan.md'), 'utf8'); }
  const part41 = (both.split('### 4.1')[1] || '').split('### 4.2')[0];
  const part42 = both.split('### 4.2')[1] || '';
  ok('两条问题各记到了自己的功能下', /关闭再打开没有回到设定值/.test(part41) && /完成轮数不加一/.test(part42) && !/完成轮数不加一/.test(part41), { part41: part41.slice(-160), part42: part42.slice(-160) });
  ok('记完之后只剩一个空行', (await w2('return r.querySelectorAll("textarea").length')) === 1 && (await w2('return r.querySelector("textarea").value')) === '');

  // 没提交的内容存成草稿，放在项目文件夹里：别的页面里的悬浮窗和桌面窗口读同一份
  const draftFile = join(proj, '.shupian', 'drafts', 'plan.md.json');
  const readDraftText = () => { try { return readFileSync(draftFile, 'utf8'); } catch (e) { return ''; } };
  await w2('var t=r.querySelector("textarea");t.focus();');
  await page2.insert('草稿里的一句话');
  let drafted = '';
  for (let i = 0; i < 120 && !/草稿里的一句话/.test(drafted); i++) { await sleep(150); drafted = readDraftText(); }
  ok('没提交的问题存进了文件夹里的草稿', /草稿里的一句话/.test(drafted), drafted);
  const page5 = await chrome.newPage();
  await page5.init(DEEP);
  await page5.resize(1280, 800);
  await page5.goto(base + 'tests/fixtures/plain.html');
  await page5.sleep(600);
  await page5.eval('window.postMessage({ shupian: "open" }, "*")');
  const w5 = (js) => page5.eval('(function(){var r=document.querySelector("[data-shupian]").shadowRoot;' + js + '})()');
  let restored = '';
  for (let i = 0; i < 60 && restored !== '草稿里的一句话'; i++) {
    await page5.sleep(150);
    restored = await w5('var t=r.querySelector("textarea");return t?t.value:""');
  }
  ok('另一个页面里的悬浮窗打开后，草稿还在', restored === '草稿里的一句话', restored);
  await w5('var t=r.querySelector("textarea");t.value="";t.dispatchEvent(new Event("input",{bubbles:true}))');
  let cleared = '';
  for (let i = 0; i < 40 && !/"rows":\[\]/.test(cleared); i++) { await sleep(150); cleared = readDraftText(); }
  ok('清空之后草稿也清空', /"rows":\[\]/.test(cleared), cleared);

  // 页面自己引入了脚本又装了扩展：只留一份悬浮窗，并且是能连桌面小窗口的那份
  const page3 = await chrome.newPage();
  await page3.init(DEEP);
  await page3.resize(1280, 800);
  await page3.goto(base + 'tests/fixtures/host.html');
  await page3.sleep(800);
  ok('页面自己引入脚本时也只有一个悬浮窗', (await page3.eval('document.querySelectorAll("[data-shupian]").length')) === 1);
  await page3.eval('window.postMessage({ shupian: "open" }, "*")');
  let target3 = '';
  for (let i = 0; i < 60 && !target3; i++) {
    await page3.sleep(150);
    target3 = await page3.eval('(function(){var r=document.querySelector("[data-shupian]").shadowRoot;var b=r.querySelector("button.target");return b?b.textContent:""})()');
  }
  ok('留下的是能连桌面小窗口的那一个，并记着上次选的功能', /^@ 4\.2/.test(target3), target3);

  // 计划书已确认并且已经开始做：问题记到独立的功能清单里，计划书不再改
  const planFile = join(proj, 'plan.md');
  writeFileSync(planFile, readFileSync(planFile, 'utf8').replace(/^状态[：:][^　\r\n]*/m, '状态：已通过'));
  const planBefore = readFileSync(planFile, 'utf8');
  const page4 = await chrome.newPage();
  await page4.init(DEEP);
  await page4.resize(1280, 800);
  await page4.goto(base + 'tests/fixtures/plain.html');
  await page4.sleep(600);
  await page4.eval('window.postMessage({ shupian: "open" }, "*")');
  const w4 = (js) => page4.eval('(function(){var r=document.querySelector("[data-shupian]").shadowRoot;' + js + '})()');
  let target4 = '';
  for (let i = 0; i < 60 && !target4; i++) {
    await page4.sleep(150);
    target4 = await w4('var b=r.querySelector("button.target");return b?b.textContent:""');
  }
  ok('已确认的计划书：悬浮窗读到的是它的功能', /^@ 4\.\d/.test(target4), target4);
  await w4('var t=r.querySelector("textarea");t.focus();');
  await page4.insert('点开始后界面没有变化');
  await w4('r.querySelectorAll("button").forEach(function(b){if(b.textContent==="记到计划书")b.click()})');
  const featuresFile = join(proj, 'features.md');
  let featuresText = '';
  for (let i = 0; i < 160 && !/点开始后界面没有变化/.test(featuresText); i++) {
    await sleep(150);
    try { featuresText = readFileSync(featuresFile, 'utf8'); } catch (e) { featuresText = ''; }
  }
  ok('问题记进了新建的功能清单（features.md），在所选功能下面', /^# 功能清单/.test(featuresText) && /### 4\.\d[\s\S]*点开始后界面没有变化/.test(featuresText), featuresText.slice(0, 80));
  ok('计划书本身没有被改', readFileSync(planFile, 'utf8') === planBefore);
} finally {
  await chrome.close();
  srv.kill();
  appSrv.kill();
  try { rmSync(home, { recursive: true, force: true }); } catch (e) { /* 目录被占用时留给系统清理 */ }
}
console.log('\n通过 ' + pass + ' 项，失败 ' + fails.length + ' 项');
process.exit(fails.length ? 1 : 0);
