// 桌面版小窗口只留托盘、不进任务栏：node tests/taskbar.mjs
// 真的启动桌面版，用界面自动化读任务栏按钮，再读窗口样式。需要 Windows 和已安装的 Edge / Chrome；
// 已有桌面版在运行时先退出它（本测试会开一个真实的小窗口，结束后关掉）。
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const exe = join(root, 'web', 'download', 'prompt-plan-helper.exe');
const ps1 = join(root, 'tests', 'taskbar.ps1');
const locales = JSON.parse(readFileSync(join(root, 'locales', 'zh.json'), 'utf8'));
const title = locales.ui.prompt_plan_helper;
let pass = 0;
const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✔ ' + n); } else { fails.push(n); console.log('  ✖ ' + n + (d !== undefined ? '  ' + JSON.stringify(d) : '')); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const running = () => /prompt-plan-helper\.exe/i.test(spawnSync('tasklist', ['/FI', 'IMAGENAME eq prompt-plan-helper.exe'], { encoding: 'utf8' }).stdout);
if (running()) {
  console.log('桌面版已经在运行：先退出托盘版再运行本测试。');
  process.exit(2);
}

function state(action) {
  const r = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', ps1, '-Title', title, '-Action', action || 'state'], { encoding: 'utf8' });
  try { return JSON.parse(r.stdout.trim()); } catch (e) { return { error: (r.stdout + r.stderr).slice(0, 300) }; }
}

const closeWindow = () => spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command',
  `Get-Process msedge,chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -eq '${title}' } | ForEach-Object { $_.CloseMainWindow() | Out-Null }`], { encoding: 'utf8' });

const home = mkdtempSync(join(tmpdir(), 'shupian-taskbar-'));
mkdirSync(join(home, '.claude'), { recursive: true });
writeFileSync(join(home, '.claude.json'), JSON.stringify({ projects: {} }));
const base = state();
let app = null;
try {
  console.log('桌面版小窗口：不进任务栏');
  app = spawn(exe, [], { stdio: 'ignore', env: Object.assign({}, process.env, { USERPROFILE: home, HOME: home }) });
  let s = {};
  for (let i = 0; i < 60 && !s.found; i++) { await sleep(250); s = state(); }
  ok('启动后出现了小窗口', s.found === true, s);
  for (let i = 0; i < 20 && !s.toolWindow; i++) { await sleep(250); s = state(); }
  ok('窗口是工具窗口样式，不是应用窗口', s.toolWindow === true && s.appWindow === false, s);
  ok('任务栏上的浏览器按钮没有因为这个窗口增加', s.buttons <= base.buttons, { before: base.buttons, after: s.buttons });
  ok('窗口可见', s.visible === true, s);

  const min = state('minimize');
  ok('最小化之后仍然没有任务栏按钮增加', min.iconic === true && min.buttons <= base.buttons, min);
  spawn(exe, [], { stdio: 'ignore', env: Object.assign({}, process.env, { USERPROFILE: home, HOME: home }) });
  let back = {};
  for (let i = 0; i < 24 && !(back.visible && back.iconic === false); i++) { await sleep(250); back = state(); }
  ok('再次启动：窗口从最小化还原并回到前面', back.found === true && back.iconic === false && back.visible === true, back);
  ok('再次启动之后仍不在任务栏', back.toolWindow === true && back.buttons <= base.buttons, back);

  closeWindow();
  await sleep(1500);
  spawn(exe, [], { stdio: 'ignore', env: Object.assign({}, process.env, { USERPROFILE: home, HOME: home }) });
  let again = {};
  for (let i = 0; i < 60 && !again.found; i++) { await sleep(250); again = state(); }
  for (let i = 0; i < 20 && !again.toolWindow; i++) { await sleep(250); again = state(); }
  ok('窗口关掉后再启动：新开的窗口也不在任务栏', again.found === true && again.toolWindow === true && again.buttons <= base.buttons, again);
} finally {
  closeWindow();
  spawnSync('taskkill', ['/IM', 'prompt-plan-helper.exe', '/F'], { encoding: 'utf8' });
  if (app) try { app.kill(); } catch (e) { /* 已退出 */ }
  await sleep(500);
  try { rmSync(home, { recursive: true, force: true }); } catch (e) { /* 目录被占用时留给系统清理 */ }
}
console.log('\n通过 ' + pass + ' 项，失败 ' + fails.length + ' 项');
process.exit(fails.length ? 1 : 0);
