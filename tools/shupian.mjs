// 命令行：检查计划书、查看和更新进度、打开桌面窗口。
// 用法：
//   node tools/shupian.mjs check [计划书文件]                 状态、待补列表、重名检查
//   node tools/shupian.mjs progress [计划书文件或功能清单文件] [功能名 todo|doing|done]   查看或更新进度（记在功能清单里）
//   node tools/shupian.mjs snapshot [计划书文件]              把功能清单当前的内容存成一份历史版本（直接改文件之前先运行）
//   node tools/shupian.mjs app [hub|plan]                    打开桌面窗口（最近的文件夹，或计划书）
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { spawn, spawnSync } from 'node:child_process';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATE_FILE, snapshotFeatures } from './app-server.mjs';
import { T, locales } from './text.mjs';

const require = createRequire(import.meta.url);
const Core = require('../src/core.js');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function planPath(arg) {
  if (arg) return resolve(arg);
  for (const n of Core.PLAN_NAMES) if (existsSync(resolve(n))) return resolve(n);
  return resolve(Core.PLAN_NAMES[0]);
}

function load(arg) {
  const path = planPath(arg);
  if (!existsSync(path)) {
    console.error(T('not_found', { path }));
    process.exit(2);
  }
  return { path, md: readFileSync(path, 'utf8') };
}

// 开始做之后进度和问题记在功能清单里：给的是功能清单文件就直接用；给的是计划书，已有功能清单就用它，
// 计划书已通过但还没有功能清单时由计划书生成（第一次写入时才创建文件，计划书从此不再改），没通过就还是计划书
function loadWork(arg) {
  const plan = load(arg);
  const base = basename(plan.path);
  if (Core.FEATURE_FILE_RE.test(base)) return plan;
  const name = Core.featureFileFor(base);
  if (!name) return plan;
  const path = join(dirname(plan.path), name);
  if (existsSync(path)) return { path, md: readFileSync(path, 'utf8') };
  if (Core.getStatus(plan.md) === 'approved') return { path, md: Core.makeFeatureList(plan.md) };
  return plan;
}

// 写功能清单之前先把旧的一份存进历史版本
function writeWork(path, prev, next) {
  if (Core.FEATURE_FILE_RE.test(basename(path)) && existsSync(path)) snapshotFeatures(dirname(path), basename(path), prev, next);
  writeFileSync(path, next);
}

function snapshot(args) {
  const { path, md } = loadWork(args[0]);
  if (!Core.FEATURE_FILE_RE.test(basename(path)) || !existsSync(path)) {
    console.error(T('no_feature_list_yet'));
    process.exit(2);
  }
  const saved = snapshotFeatures(dirname(path), basename(path), md, '', true);
  console.log(saved ? T('snapshot_saved') : T('snapshot_not_needed'));
}

function check(arg) {
  const { path, md } = load(arg);
  const list = Core.pendingList(md);
  const total = list.reduce((s, x) => s + x.count, 0);
  const s = Core.structure(md);
  const dup = (arr) => arr.map((x) => x.name).filter((n, i, a) => a.indexOf(n) !== i);
  console.log(T('file_label', { path }));
  console.log(T('project_label', { name: Core.titleName(md) || T('unnamed') }));
  console.log(T('status_label', { state: Core.statusLabel(Core.getStatus(md), Core.docLang(md)) || T('no_status_line') }));
  console.log(T('counts', { pages: s.pages.length, features: s.features.length }));
  console.log(T('tbd_count', { n: total }));
  list.forEach((x) => console.log(T('tbd_line', { line: x.line + 1, text: x.text })));
  const problems = [];
  dup(s.pages).forEach((n) => problems.push(T('dup_page', { name: n })));
  dup(s.features).forEach((n) => problems.push(T('dup_feature', { name: n })));
  if (Core.getStatus(md) === 'approved' && total > 0) problems.push(T('approved_but_tbd'));
  problems.forEach((x) => console.log(T('problem', { text: x })));
  const ok = total === 0 && problems.length === 0;
  console.log(ok ? T('verdict_ok') : T('verdict_no'));
  process.exit(ok ? 0 : 1);
}

function progress(args) {
  let file = '';
  let rest = args.slice();
  if (rest.length && /\.md$/i.test(rest[0])) file = rest.shift();
  const { path, md } = loadWork(file);
  const list = Core.progressList(md);
  if (!rest.length) {
    list.forEach((x) => console.log((x.no ? x.no + ' ' : '') + x.name + '　' + x.status + (x.what ? '　' + x.what : '')));
    const done = list.filter((x) => x.status === 'done').length;
    console.log(T('progress_total', { done, total: list.length }));
    return;
  }
  const status = rest.pop();
  const name = rest.join(' ').trim();
  if (['todo', 'doing', 'done'].indexOf(status) < 0) {
    console.error(T('progress_states'));
    process.exit(2);
  }
  const hit = list.filter((x) => x.name === name || x.no === name || (x.no + ' ' + x.name) === name)[0];
  if (!hit) {
    console.error(T('no_such_feature', { name }));
    process.exit(2);
  }
  writeWork(path, md, Core.setProgress(md, hit.line, status));
  console.log(T('progress_updated', { name: hit.name, status }));
}

// 每条问题一行，带序号和状态；改状态：issue <序号> todo|doing|done，AI 处理时一条一条地标
function issueNames() {
  return { todo: T('issue_todo'), doing: T('issue_doing'), done: T('issue_done') };
}

function issueRows(md) {
  const rows = [];
  Core.issueList(md).forEach((f) => f.items.forEach((it) => rows.push({ feature: (f.no ? f.no + ' ' : '') + f.name, line: it.line, state: it.state, text: it.text })));
  return rows;
}

function issues(args) {
  const { md } = loadWork(args[0]);
  const rows = issueRows(md);
  if (!rows.length) { console.log(T('no_issues')); return; }
  const names = issueNames();
  rows.forEach((r, i) => console.log(T('issue_line', { n: i + 1, state: names[r.state], feature: r.feature, text: r.text })));
}

function issue(args) {
  const rest = args.slice();
  const file = rest.length && /\.md$/i.test(rest[0]) ? rest.shift() : '';
  const n = Number(rest[0]);
  const state = rest[1];
  if (['todo', 'doing', 'done'].indexOf(state) < 0) { console.error(T('issue_states')); process.exit(2); }
  const { path, md } = loadWork(file);
  const row = issueRows(md)[n - 1];
  if (!row) { console.error(T('no_such_issue', { n: rest[0] })); process.exit(2); }
  writeWork(path, md, Core.setIssueState(md, row.line, state));
  console.log(T('issue_updated', { n, state: issueNames()[state] }));
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

// 已经有打开的小窗口时把它拿到最前面（包括被桌面版收进托盘的、最小化后隐藏的），返回 true；没有就返回 false
const RAISE_SCRIPT = `
Add-Type -TypeDefinition @'
using System; using System.Text; using System.Runtime.InteropServices;
public class W {
  delegate bool P(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] static extern bool EnumWindows(P p, IntPtr l);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] static extern void keybd_event(byte v, byte s, uint f, UIntPtr e);
  public static bool Raise(string[] titles) {
    IntPtr visible = IntPtr.Zero, hidden = IntPtr.Zero;
    EnumWindows((h, l) => {
      var c = new StringBuilder(64); GetClassName(h, c, 64);
      if (c.ToString() != "Chrome_WidgetWin_1") return true;
      var t = new StringBuilder(256); GetWindowText(h, t, 256);
      if (Array.IndexOf(titles, t.ToString()) < 0) return true;
      if (IsWindowVisible(h)) { visible = h; return false; }
      if (IsIconic(h)) hidden = h;
      return true;
    }, IntPtr.Zero);
    IntPtr hit = visible != IntPtr.Zero ? visible : hidden;
    if (hit == IntPtr.Zero) return false;
    if (IsIconic(hit)) ShowWindow(hit, 9);
    keybd_event(0x12, 0, 0, UIntPtr.Zero); keybd_event(0x12, 0, 2, UIntPtr.Zero);
    SetForegroundWindow(hit);
    return true;
  }
}
'@
$titles = [string[]]($env:SHUPIAN_TITLES -split '\\|')
if ([W]::Raise($titles)) { 'raised' } else { 'none' }
`;

function raiseExisting() {
  // 小窗口的标题：每种语言里页面标题的文字
  const titles = Object.keys(locales).map((k) => locales[k].ui.prompt_plan_helper).join('|');
  const r = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', RAISE_SCRIPT], { encoding: 'utf8', windowsHide: true, env: Object.assign({}, process.env, { SHUPIAN_TITLES: titles }) });
  if (r.status !== 0) {
    console.error(T('window_check_failed', { why: (r.stderr || '').trim() }));
    process.exit(2);
  }
  return /raised/.test(r.stdout);
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
  if (!(info && info.port)) { console.error(T('service_not_started')); process.exit(2); }
  if (raiseExisting()) { console.log(T('window_raised')); return; }
  const exe = browserPath();
  const hub = view !== 'plan';
  const url = 'http://127.0.0.1:' + info.port + '/index.html?k=' + info.token + '&win=1' + (hub ? '&view=hub' : '');
  if (!exe) { console.error(T('no_browser', { url })); process.exit(2); }
  spawn(exe, ['--app=' + url, '--window-size=360,480'], { detached: true, stdio: 'ignore' }).unref();
  console.log(T('opened', { url: url.replace(info.token, '***') }));
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'check') check(args[0]);
else if (cmd === 'progress') progress(args);
else if (cmd === 'issues') issues(args);
else if (cmd === 'issue') issue(args);
else if (cmd === 'snapshot') snapshot(args);
else if (cmd === 'app') app(args[0]).then(() => process.exit(0));
else {
  console.log(T('usage'));
  process.exit(cmd ? 2 : 0);
}
