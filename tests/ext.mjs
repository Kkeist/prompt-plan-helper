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
  for (let i = 0; i < 40 && !/先打开桌面小窗口/.test(unpaired); i++) { await page.sleep(150); unpaired = await wtext(); }
  ok('没有打开过桌面小窗口：提示先打开', /先打开桌面小窗口/.test(unpaired), unpaired);

  // 打开桌面小窗口页面：扩展拿到端口和口令
  const helper = await chrome.newPage();
  await helper.init(DEEP);
  await helper.resize(420, 640);
  await helper.goto('http://127.0.0.1:' + info.port + '/index.html?k=' + info.token + '&win=1');
  await helper.sleep(800);
  ok('桌面小窗口页面只有一个应用，没有再挂悬浮窗', (await helper.eval('document.querySelectorAll("[data-shupian]").length')) === 0);

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
  ok('显示计划书名称', /番茄钟/.test(await w2('return r.querySelector(".fb-body").innerText')));
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
} finally {
  await chrome.close();
  srv.kill();
  appSrv.kill();
  try { rmSync(home, { recursive: true, force: true }); } catch (e) { /* 目录被占用时留给系统清理 */ }
}
console.log('\n通过 ' + pass + ' 项，失败 ' + fails.length + ' 项');
process.exit(fails.length ? 1 : 0);
