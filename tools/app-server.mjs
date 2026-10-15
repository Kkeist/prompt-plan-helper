// 本机服务：给桌面窗口提供网页、最近在用的文件夹，以及计划书文件的读写。
// 只监听 127.0.0.1；接口都要带启动时生成的口令；只能读写已知文件夹里的计划书文件；一段时间没有人用就自己退出。
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const Core = require('../src/core.js');
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const webDir = join(projectRoot, 'web');
const home = homedir();
export const STATE_DIR = join(home, '.shupian');
export const STATE_FILE = join(STATE_DIR, 'server.json');
const HISTORY_FILE = join(STATE_DIR, 'history.json');
const PLAN_NAMES = ['plan.md', '计划书.md'];
const IDLE_MS = 30 * 60 * 1000;
const ACTIVE_MS = 10 * 60 * 1000;

// 端口 = 10000 + 目录名按 h = (h * 31 + 码位) % 30000 算出的数，被占用就往后挪
function basePort() {
  let h = 0;
  for (const c of basename(projectRoot)) h = (h * 31 + c.codePointAt(0)) % 30000;
  return 10000 + h;
}

function readJson(file, fallback) {
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch (e) { return fallback; }
}

function norm(p) {
  return resolve(p).toLowerCase();
}

function claudeFolders() {
  const j = readJson(join(home, '.claude.json'), {});
  const out = [];
  Object.keys(j.projects || {}).forEach((p) => {
    const full = normalize(p);
    if (!existsSync(full)) return;
    const dir = join(home, '.claude', 'projects', full.replace(/[^A-Za-z0-9]/g, '-'));
    let last = 0;
    try {
      readdirSync(dir).forEach((f) => { if (f.endsWith('.jsonl')) last = Math.max(last, statSync(join(dir, f)).mtimeMs); });
    } catch (e) { /* 这个文件夹还没有会话记录 */ }
    if (last > 0) out.push({ path: full, name: basename(full), last });
  });
  return out.sort((a, b) => b.last - a.last).slice(0, 20);
}

function planFileIn(root) {
  return PLAN_NAMES.filter((n) => existsSync(join(root, n)))[0] || '';
}

function summary(root) {
  const file = planFileIn(root);
  if (!file) return null;
  const md = readFileSync(join(root, file), 'utf8');
  const list = Core.progressList(md);
  return {
    file,
    title: Core.titleName(md),
    status: Core.getStatus(md),
    total: list.length,
    done: list.filter((x) => x.status === 'done').length,
    doing: list.filter((x) => x.status === 'doing').length,
    pending: Core.countPending(md),
  };
}

const connected = new Set();
function history() {
  return readJson(HISTORY_FILE, []).filter((x) => x && x.path && existsSync(x.path));
}

function remember(path) {
  const full = normalize(path);
  connected.add(norm(full));
  mkdirSync(STATE_DIR, { recursive: true });
  const list = history().filter((x) => norm(x.path) !== norm(full));
  list.unshift({ path: full, last: Date.now() });
  writeFileSync(HISTORY_FILE, JSON.stringify(list.slice(0, 30)));
  return full;
}

function known(root) {
  const n = norm(root);
  if (connected.has(n)) return true;
  return claudeFolders().some((x) => norm(x.path) === n) || history().some((x) => norm(x.path) === n);
}

// 相对路径只允许顶层的计划书文件
function planPath(root, rel) {
  if (!root || !known(root)) return '';
  const p = String(rel || '');
  if (PLAN_NAMES.indexOf(p) < 0) return '';
  return join(resolve(root), p);
}

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json', '.xml': 'application/xml',
};

function pickFolder() {
  return new Promise((resolvePick) => {
    const script = [
      'Add-Type -AssemblyName System.Windows.Forms',
      '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
      '$f = New-Object System.Windows.Forms.FolderBrowserDialog',
      '$f.ShowNewFolderButton = $true',
      "if ($f.ShowDialog() -eq 'OK') { Write-Output $f.SelectedPath }",
    ].join('; ');
    const ps = spawn('powershell', ['-NoProfile', '-STA', '-Command', script], { windowsHide: true });
    let out = '';
    ps.stdout.on('data', (d) => { out += d.toString('utf8'); });
    ps.on('close', () => resolvePick(out.trim()));
    ps.on('error', () => resolvePick(''));
  });
}

export function startServer() {
  const token = randomBytes(12).toString('hex');
  let lastUse = Date.now();
  let port = 0;

  const server = createServer(async (req, res) => {
    lastUse = Date.now();
    if (process.env.SHUPIAN_DEBUG) console.log(new Date().toTimeString().slice(0, 8), req.method, req.url.split('?')[0]);
    const json = (code, obj) => {
      res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(obj));
    };
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      if (req.headers.host !== '127.0.0.1:' + port) { json(403, { error: 'host' }); return; }
      if (url.pathname.indexOf('/api/') === 0) {
        if (req.headers['x-shupian-token'] !== token) { json(401, { error: 'token' }); return; }
        if (url.pathname === '/api/ping') { json(200, { ok: true }); return; }
        if (url.pathname === '/api/projects') {
          const withSummary = (x) => Object.assign({}, x, { active: Date.now() - (x.last || 0) < ACTIVE_MS, summary: summary(x.path) });
          const claude = claudeFolders().map(withSummary);
          const seen = new Set(claude.map((x) => norm(x.path)));
          const hist = history().filter((x) => !seen.has(norm(x.path))).map((x) => withSummary({ path: x.path, name: basename(x.path), last: x.last }));
          json(200, { claude, history: hist });
          return;
        }
        if (url.pathname === '/api/pick' && req.method === 'POST') {
          const p = await pickFolder();
          if (!p || !existsSync(p)) { json(200, { path: '' }); return; }
          const full = remember(p);
          json(200, { path: full, name: basename(full) });
          return;
        }
        if (url.pathname === '/api/connect' && req.method === 'POST') {
          const chunks = [];
          for await (const c of req) chunks.push(c);
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
          if (!body.path || !existsSync(body.path) || !known(body.path)) { json(404, { error: 'folder' }); return; }
          const full = remember(body.path);
          json(200, { path: full, name: basename(full), summary: summary(full) });
          return;
        }
        if (url.pathname === '/api/file') {
          const file = planPath(url.searchParams.get('root'), url.searchParams.get('p'));
          if (!file) { json(400, { error: 'path' }); return; }
          if (req.method === 'GET') {
            json(200, existsSync(file) ? { exists: true, text: readFileSync(file, 'utf8') } : { exists: false });
            return;
          }
          if (req.method === 'PUT') {
            const chunks = [];
            for await (const c of req) chunks.push(c);
            writeFileSync(file, Buffer.concat(chunks));
            json(200, { ok: true });
            return;
          }
        }
        json(404, { error: 'api' });
        return;
      }
      // 静态文件：只给 web 目录
      let p = decodeURIComponent(url.pathname);
      if (p === '/' || p === '') p = '/index.html';
      const file = normalize(join(webDir, p));
      if (!file.startsWith(webDir + sep) || !existsSync(file) || !statSync(file).isFile()) {
        res.writeHead(404, { 'Cache-Control': 'no-store' }).end('not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(await readFile(file));
    } catch (e) {
      json(500, { error: String(e && e.message) });
    }
  });

  const idle = setInterval(() => {
    if (Date.now() - lastUse > IDLE_MS) process.exit(0);
  }, 60 * 1000);
  idle.unref();

  const listen = (p, limit) => {
    server.once('error', (e) => {
      if (e.code === 'EADDRINUSE' && p < limit) listen(p + 1, limit);
      else { console.error(e.message); process.exit(1); }
    });
    server.listen({ port: p, host: '127.0.0.1', exclusive: true }, () => {
      port = p;
      mkdirSync(STATE_DIR, { recursive: true });
      writeFileSync(STATE_FILE, JSON.stringify({ port, token, pid: process.pid }));
      // 调试：在控制台打印地址和每个请求；SHUPIAN_OPEN 时用默认浏览器打开
      if (process.env.SHUPIAN_DEBUG) {
        const url = 'http://127.0.0.1:' + port + '/index.html?k=' + token;
        console.log('debug server: ' + url);
        if (process.env.SHUPIAN_OPEN) spawn('cmd', ['/c', 'start', '""', url], { stdio: 'ignore', windowsHide: true });
      }
    });
  };
  const start = Number(process.env.PORT) || basePort() + 100;
  listen(start, start + 60);
  process.on('exit', () => {
    const cur = readJson(STATE_FILE, null);
    if (cur && cur.pid === process.pid) { try { writeFileSync(STATE_FILE, '{}'); } catch (e) { /* 目录已不在 */ } }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) startServer();
