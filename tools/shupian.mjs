// 命令行：检查计划书、查看和更新进度、打开桌面窗口。
// 用法：
//   node tools/shupian.mjs check [计划书文件]                 状态、待补列表、重名检查
//   node tools/shupian.mjs progress [计划书文件] [功能名 todo|doing|done]   查看或更新进度
//   node tools/shupian.mjs app [hub|plan]                    打开桌面窗口（最近的文件夹，或计划书）
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATE_FILE } from './app-server.mjs';

const require = createRequire(import.meta.url);
const Core = require('../src/core.js');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function planPath(arg) {
  if (arg) return resolve(arg);
  for (const n of ['plan.md', '计划书.md']) if (existsSync(resolve(n))) return resolve(n);
  return resolve('plan.md');
}

function load(arg) {
  const path = planPath(arg);
  if (!existsSync(path)) {
    console.error('找不到：' + path);
    process.exit(2);
  }
  return { path, md: readFileSync(path, 'utf8') };
}

function check(arg) {
  const { path, md } = load(arg);
  const list = Core.pendingList(md);
  const total = list.reduce((s, x) => s + x.count, 0);
  const s = Core.structure(md);
  const dup = (arr) => arr.map((x) => x.name).filter((n, i, a) => a.indexOf(n) !== i);
  console.log('文件：' + path);
  console.log('项目：' + (Core.titleName(md) || '（未命名）'));
  console.log('状态：' + (Core.statusLabel(Core.getStatus(md), Core.docLang(md)) || '（没有状态行）'));
  console.log('页面 ' + s.pages.length + ' 个，功能 ' + s.features.length + ' 个');
  console.log('待补：' + total + ' 处');
  list.forEach((x) => console.log('  第 ' + (x.line + 1) + ' 行　' + x.text));
  const problems = [];
  dup(s.pages).forEach((n) => problems.push('页面重名：' + n));
  dup(s.features).forEach((n) => problems.push('功能重名：' + n));
  if (Core.getStatus(md) === 'approved' && total > 0) problems.push('状态是已通过，但还有待补');
  problems.forEach((p) => console.log('问题：' + p));
  const ok = total === 0 && problems.length === 0;
  console.log(ok ? '结论：没有待补，确认后可以开始做。' : '结论：还不能开始做。');
  process.exit(ok ? 0 : 1);
}

function progress(args) {
  let file = '';
  let rest = args.slice();
  if (rest.length && /\.md$/i.test(rest[0])) file = rest.shift();
  const { path, md } = load(file);
  const list = Core.progressList(md);
  if (!rest.length) {
    list.forEach((x) => console.log((x.no ? x.no + ' ' : '') + x.name + '　' + x.status + (x.what ? '　' + x.what : '')));
    const done = list.filter((x) => x.status === 'done').length;
    console.log('已完成 ' + done + ' / ' + list.length);
    return;
  }
  const status = rest.pop();
  const name = rest.join(' ').trim();
  if (['todo', 'doing', 'done'].indexOf(status) < 0) {
    console.error('进度只能是 todo、doing、done');
    process.exit(2);
  }
  const hit = list.filter((x) => x.name === name || x.no === name || (x.no + ' ' + x.name) === name)[0];
  if (!hit) {
    console.error('没有这个功能：' + name);
    process.exit(2);
  }
  writeFileSync(path, Core.setProgress(md, hit.line, status));
  console.log('已更新：' + hit.name + ' → ' + status);
}

function browserPath() {
  const list = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  return list.filter((p) => existsSync(p) && statSync(p).isFile())[0] || '';
}

async function ping(info) {
  try {
    const r = await fetch('http://127.0.0.1:' + info.port + '/api/ping', { headers: { 'x-shupian-token': info.token } });
    return r.ok;
  } catch (e) {
    return false;
  }
}

function readState() {
  try { return JSON.parse(readFileSync(STATE_FILE, 'utf8')); } catch (e) { return null; }
}

async function app(view) {
  let info = readState();
  if (!(info && info.port && (await ping(info)))) {
    spawn(process.execPath, [join(root, 'tools', 'app-server.mjs')], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 150));
      info = readState();
      if (info && info.port && (await ping(info))) break;
    }
  }
  if (!(info && info.port)) { console.error('桌面服务没有启动。'); process.exit(2); }
  const exe = browserPath();
  const hub = view !== 'plan';
  const url = 'http://127.0.0.1:' + info.port + '/index.html?k=' + info.token + '&win=1' + (hub ? '&view=hub' : '');
  if (!exe) { console.error('没有找到 Edge 或 Chrome，请直接打开：' + url); process.exit(2); }
  spawn(exe, ['--app=' + url, '--window-size=360,480'], { detached: true, stdio: 'ignore' }).unref();
  console.log('已打开：' + url.replace(info.token, '***'));
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'check') check(args[0]);
else if (cmd === 'progress') progress(args);
else if (cmd === 'app') app(args[0]).then(() => process.exit(0));
else {
  console.log('用法：node tools/shupian.mjs check [计划书] | progress [计划书] [功能名 todo|doing|done] | app [hub|plan]');
  process.exit(cmd ? 2 : 0);
}
