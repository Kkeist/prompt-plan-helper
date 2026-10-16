// 本机服务：给桌面窗口提供网页、最近在用的文件夹，以及计划书文件的读写。
// 只监听 127.0.0.1；接口都要带启动时生成的口令；只能读写已知文件夹里的计划书文件；一段时间没有人用就自己退出。
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { spawn, spawnSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATE_DIR, STATE_FILE } from './base.mjs';
import { HISTORY_NAME_RE, historyDir, listHistory, norm, pruneHistory, snapshotFeatures } from './history.mjs';

const require = createRequire(import.meta.url);
const Core = require('../src/core.js');
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const webDir = join(projectRoot, 'web');
const home = homedir();
const HISTORY_FILE = join(STATE_DIR, 'history.json');
const WATCH_ERROR_FILE = join(STATE_DIR, 'watch-error.txt');
const PLAN_NAMES = Core.PLAN_NAMES;
const EXT_SRC = join(projectRoot, 'extension');
export const EXT_DIR = join(STATE_DIR, 'extension');
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

// 计划书文件：plan.md、计划书.md，以及同一个文件夹里的多份：plan-名称.md、计划书-名称.md
const PLAN_FILE_RE = Core.PLAN_FILE_RE;
const CURRENT_FILE = join(STATE_DIR, 'current.json');

function planFiles(root) {
  const have = existsSync(root) ? readdirSync(root).filter((n) => PLAN_FILE_RE.test(n) && statSync(join(root, n)).isFile()) : [];
  const first = PLAN_NAMES.filter((n) => have.indexOf(n) >= 0);
  return first.concat(have.filter((n) => first.indexOf(n) < 0).sort());
}

// 每个文件夹里当前用哪一份，以及最后打开的是哪一份
function readCurrent() {
  const j = readJson(CURRENT_FILE, {});
  return { files: j.files || {}, last: j.last || null };
}

function currentFile(root) {
  const list = planFiles(root);
  const want = readCurrent().files[norm(root)];
  return (want && list.indexOf(want) >= 0 ? want : list[0]) || '';
}

function setCurrent(root, file) {
  const cur = readCurrent();
  cur.files[norm(root)] = file;
  cur.last = { path: resolve(root), file };
  mkdirSync(STATE_DIR, { recursive: true });
  writeFileSync(CURRENT_FILE, JSON.stringify(cur));
}

// file 不给就取当前这一份
function summary(root, file) {
  const name = file || currentFile(root);
  if (!name) return null;
  return summaryOf(root, name);
}

// 标题和状态来自计划书；功能和进度来自它的功能清单（有的话）
function summaryOf(root, file) {
  const md = readFileSync(join(root, file), 'utf8');
  const featureFile = Core.featureFileFor(file);
  const hasFeatures = !!featureFile && existsSync(join(root, featureFile));
  const list = Core.progressList(hasFeatures ? readFileSync(join(root, featureFile), 'utf8') : md);
  return {
    file,
    title: Core.titleName(md),
    status: Core.getStatus(md),
    featureFile,
    hasFeatures,
    total: list.length,
    done: list.filter((x) => x.status === 'done').length,
    doing: list.filter((x) => x.status === 'doing').length,
    pending: Core.countPending(md),
  };
}

const connected = new Set();
// 拖入的文件夹按名字找到的候选，用户已经明确要打开它，可以连接
const offered = new Set();
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
  if (connected.has(n) || offered.has(n)) return true;
  return claudeFolders().some((x) => norm(x.path) === n) || history().some((x) => norm(x.path) === n);
}

// 草稿：未提交的问题，文件夹里 .shupian/drafts/<计划书文件名>.json
const DRAFT_NAME_RE = /^[^/\\:*?"<>|]+\.md\.json$/;

// 相对路径只允许顶层的计划书和功能清单文件，以及历史版本和草稿目录里的文件
function planPath(root, rel) {
  if (!root || !known(root)) return '';
  const p = String(rel || '');
  if (PLAN_FILE_RE.test(p) || Core.FEATURE_FILE_RE.test(p)) return join(resolve(root), p);
  const m = /^\.shupian\/history\/([^/]+)$/.exec(p);
  if (m && HISTORY_NAME_RE.test(m[1])) return join(historyDir(root), m[1]);
  const d = /^\.shupian\/drafts\/([^/]+)$/.exec(p);
  if (d && DRAFT_NAME_RE.test(d[1])) return join(resolve(root), '.shupian', 'drafts', d[1]);
  return '';
}

// 每个已知文件夹里功能清单上次看到的内容：变了就把上一份存成历史版本
const seenFeatures = new Map();

function watchFeatures() {
  const roots = new Set();
  claudeFolders().forEach((x) => roots.add(resolve(x.path)));
  history().forEach((x) => roots.add(resolve(x.path)));
  roots.forEach((root) => {
    planFiles(root).forEach((planFile) => {
      const file = Core.featureFileFor(planFile);
      const path = file ? join(root, file) : '';
      if (!path || !existsSync(path)) return;
      const text = readFileSync(path, 'utf8');
      const key = norm(root) + '|' + file.toLowerCase();
      const prev = seenFeatures.get(key);
      if (prev !== undefined && prev !== text) snapshotFeatures(root, file, prev, text);
      seenFeatures.set(key, text);
    });
  });
}

// 文件夹名里不能有这些字符，也不能以点或空格结尾
function folderNameError(name) {
  const n = String(name || '');
  if (!n.trim()) return 'empty';
  if (n.length > 100 || /[\\/:*?"<>|]/.test(n) || /[. ]$/.test(n) || n === '.' || n === '..') return 'name';
  return '';
}

// 按名字和里面的文件找一个拖进来的文件夹的地址：只在已知文件夹的上一级和已知文件夹本身里找
function locateFolder(name, entries) {
  const parents = new Set();
  const own = [];
  claudeFolders().concat(history()).forEach((x) => { parents.add(dirname(resolve(x.path))); own.push(resolve(x.path)); });
  connected.forEach((p) => { parents.add(dirname(resolve(p))); own.push(resolve(p)); });
  const want = (entries || []).map((e) => String(e).toLowerCase());
  const found = new Map();
  const check = (dir) => {
    if (!existsSync(dir) || !statSync(dir).isDirectory()) return;
    const have = new Set(readdirSync(dir).map((e) => e.toLowerCase()));
    if (want.every((e) => have.has(e))) found.set(norm(dir), resolve(dir));
  };
  parents.forEach((p) => check(join(p, name)));
  own.filter((p) => basename(p).toLowerCase() === String(name).toLowerCase()).forEach(check);
  found.forEach((full, key) => offered.add(key));
  return Array.from(found.values());
}

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json', '.xml': 'application/xml',
};

// 浏览器扩展：把文件放到固定的文件夹（内容有变才写），浏览器里「加载解压缩的扩展」选这个文件夹
function extensionFiles(dir, rel) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? extensionFiles(p, join(rel, n)) : [join(rel, n)];
  });
}

export function syncExtension() {
  extensionFiles(EXT_SRC, '').forEach((rel) => {
    const buf = readFileSync(join(EXT_SRC, rel));
    const to = join(EXT_DIR, rel);
    if (existsSync(to) && readFileSync(to).equals(buf)) return;
    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(to, buf);
  });
  return EXT_DIR;
}

// 扩展的身份：manifest 里的公钥算出的 ID 和版本（打包时写进去）
export function extensionIdentity() {
  const m = JSON.parse(readFileSync(join(EXT_SRC, 'manifest.json'), 'utf8'));
  const h = createHash('sha256').update(Buffer.from(m.key || '', 'base64')).digest().subarray(0, 16);
  const id = Array.from(h).map((b) => String.fromCharCode(97 + (b >> 4)) + String.fromCharCode(97 + (b & 15))).join('');
  return { id, version: m.version, hasKey: !!m.key };
}

// 一键安装：把扩展安装包登记到浏览器的「外部扩展」注册表项（当前用户，不要管理员）。
// 浏览器运行中几秒内、没运行时下次启动就会发现它，并提示用户启用。测试用 SHUPIAN_REG_ROOT 改到别的注册表位置。
const REG_VENDOR = { edge: ['Microsoft', 'Edge'], chrome: ['Google', 'Chrome'] };
const EXT_PACKAGE = join(STATE_DIR, 'prompt-plan-helper-extension.crx');
const EXT_PACKAGE_SRC = join(projectRoot, 'web', 'download', 'prompt-plan-helper-extension.crx');
const regKey = (browser, id) => ['HKCU', process.env.SHUPIAN_REG_ROOT || 'Software'].concat(REG_VENDOR[browser], ['Extensions', id]).join(String.fromCharCode(92));

function extensionRegistered(browser) {
  if (!REG_VENDOR[browser]) return false;
  const { id, version } = extensionIdentity();
  const r = spawnSync('reg', ['query', regKey(browser, id), '/v', 'version'], { encoding: 'utf8', windowsHide: true });
  return r.status === 0 && r.stdout.split('\n').some((l) => l.indexOf('REG_SZ') >= 0 && l.trim().split(' ').filter(Boolean).pop() === version);
}

// 失败时抛出带 code 的错误：browser（不支持的浏览器）、package（没有安装包）、registry（写注册表失败）
function registerExtension(browser) {
  const fail = (code) => Object.assign(new Error(code), { code });
  if (!REG_VENDOR[browser]) throw fail('browser');
  const { id, version, hasKey } = extensionIdentity();
  if (!hasKey || !existsSync(EXT_PACKAGE_SRC)) throw fail('package');
  mkdirSync(STATE_DIR, { recursive: true });
  copyFileSync(EXT_PACKAGE_SRC, EXT_PACKAGE);
  const key = regKey(browser, id);
  const set = (name, value) => spawnSync('reg', ['add', key, '/v', name, '/t', 'REG_SZ', '/d', value, '/f'], { encoding: 'utf8', windowsHide: true }).status === 0;
  if (!set('path', EXT_PACKAGE) || !set('version', version)) throw fail('registry');
}

// 本机装了的浏览器，及各自的扩展页地址
const BROWSERS = [
  { id: 'edge', name: 'Edge', page: 'edge://extensions/', exe: ['Microsoft/Edge/Application/msedge.exe'] },
  { id: 'chrome', name: 'Chrome', page: 'chrome://extensions/', exe: ['Google/Chrome/Application/chrome.exe'] },
  { id: 'firefox', name: 'Firefox', page: 'about:debugging#/runtime/this-firefox', exe: ['Mozilla Firefox/firefox.exe'] },
].map((b) => Object.assign(b, {
  path: ['ProgramFiles(x86)', 'ProgramFiles'].map((v) => process.env[v]).filter(Boolean)
    .flatMap((base) => b.exe.map((e) => join(base, e))).filter((e) => existsSync(e))[0] || '',
})).filter((b) => b.path);

function pickFolder(description) {
  return new Promise((resolvePick) => {
    const script = [
      'Add-Type -AssemblyName System.Windows.Forms',
      '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
      '$f = New-Object System.Windows.Forms.FolderBrowserDialog',
      '$f.ShowNewFolderButton = $true',
      '$f.Description = $env:SHUPIAN_PICK_TEXT',
      "if ($f.ShowDialog() -eq 'OK') { Write-Output $f.SelectedPath }",
    ].join('; ');
    const env = Object.assign({}, process.env, { SHUPIAN_PICK_TEXT: String(description || '').slice(0, 200) });
    const ps = spawn('powershell', ['-NoProfile', '-STA', '-Command', script], { windowsHide: true, env });
    let out = '';
    ps.stdout.on('data', (d) => { out += d.toString('utf8'); });
    ps.on('close', () => resolvePick(out.trim()));
    ps.on('error', () => resolvePick(''));
  });
}

export function startServer() {
  const token = randomBytes(12).toString('hex');
  let lastUse = Date.now();
  // 浏览器扩展联系过本服务
  let extensionSeen = false;
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
      // 书签方式加载进本机网页的悬浮窗要跨来源请求：只允许来自本机地址的网页，且仍然要口令
      const origin = String(req.headers.origin || '');
      if (url.pathname.indexOf('/api/') === 0 && /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Headers', 'x-shupian-token, content-type');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
      }
      if (req.method === 'OPTIONS' && url.pathname.indexOf('/api/') === 0) { res.writeHead(204); res.end(); return; }
      if (url.pathname === '/api/pair' && req.method === 'POST') {
        // 只有扩展发来的请求（来源是扩展自己的地址）能拿到口令，网页拿不到
        if (!/^(chrome|moz)-extension:\/\//.test(String(req.headers.origin || ''))) { json(403, { error: 'origin' }); return; }
        extensionSeen = true;
        json(200, { token });
        return;
      }
      if (url.pathname.indexOf('/api/') === 0) {
        if (req.headers['x-shupian-token'] !== token) { json(401, { error: 'token' }); return; }
        if (url.pathname === '/api/ping') { json(200, { ok: true }); return; }
        if (url.pathname === '/api/projects') {
          const withSummary = (x) => {
            const plans = planFiles(x.path).map((f) => summaryOf(x.path, f));
            const file = currentFile(x.path);
            return Object.assign({}, x, { active: Date.now() - (x.last || 0) < ACTIVE_MS, plans, file, summary: plans.filter((s) => s.file === file)[0] || null });
          };
          const claude = claudeFolders().map(withSummary);
          const seen = new Set(claude.map((x) => norm(x.path)));
          const hist = history().filter((x) => !seen.has(norm(x.path))).map((x) => withSummary({ path: x.path, name: basename(x.path), last: x.last }));
          json(200, { claude, history: hist, last: readCurrent().last });
          return;
        }
        const readJsonBody = async () => {
          const chunks = [];
          for await (const c of req) chunks.push(c);
          return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
        };
        if (url.pathname === '/api/mkdir' && req.method === 'POST') {
          const body = await readJsonBody();
          const bad = folderNameError(body.name);
          if (bad) { json(400, { error: bad }); return; }
          if (!body.parent || !existsSync(body.parent) || !known(body.parent)) { json(404, { error: 'folder' }); return; }
          const target = join(resolve(body.parent), String(body.name).trim());
          if (existsSync(target)) { json(409, { error: 'exists' }); return; }
          mkdirSync(target);
          const full = remember(target);
          json(200, { path: full, name: basename(full) });
          return;
        }
        if (url.pathname === '/api/extension') {
          if (req.method === 'GET') {
            json(200, {
              path: syncExtension(),
              seen: extensionSeen,
              id: extensionIdentity().id,
              browsers: BROWSERS.map((b) => ({ id: b.id, name: b.name, oneClick: !!REG_VENDOR[b.id], registered: extensionRegistered(b.id) })),
            });
            return;
          }
          if (req.method === 'POST') {
            const body = await readJsonBody();
            const b = BROWSERS.filter((x) => x.id === body.browser)[0];
            if (!b) { json(404, { error: 'browser' }); return; }
            if (body.action === 'register') {
              try {
                registerExtension(b.id);
                json(200, { ok: true });
              } catch (e) {
                json(e.code === 'package' ? 409 : e.code === 'browser' ? 400 : 500, { error: e.code || 'registry' });
              }
              return;
            }
            // page 为 install 时打开本机服务提供的安装页（书签和扩展两种方式），否则打开浏览器自己的扩展页
            const target = body.page === 'install' ? 'http://127.0.0.1:' + port + '/index.html?k=' + token + '&view=install' : b.page;
            spawn(b.path, [target], { detached: true, stdio: 'ignore' }).unref();
            json(200, { ok: true });
            return;
          }
        }
        if (url.pathname === '/api/current' && req.method === 'POST') {
          const body = await readJsonBody();
          if (!body.path || !known(body.path)) { json(404, { error: 'folder' }); return; }
          if (!PLAN_FILE_RE.test(String(body.file || '')) || !existsSync(join(resolve(body.path), body.file))) { json(404, { error: 'file' }); return; }
          setCurrent(body.path, body.file);
          json(200, { ok: true });
          return;
        }
        if (url.pathname === '/api/locate' && req.method === 'POST') {
          const body = await readJsonBody();
          if (folderNameError(body.name)) { json(400, { error: 'name' }); return; }
          json(200, { candidates: locateFolder(String(body.name).trim(), Array.isArray(body.entries) ? body.entries : []) });
          return;
        }
        if (url.pathname === '/api/pick' && req.method === 'POST') {
          const picked = await readJsonBody();
          const p = await pickFolder(picked.description);
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
          json(200, { path: full, name: basename(full), file: currentFile(full), plans: planFiles(full).map((f) => summaryOf(full, f)), summary: summary(full) });
          return;
        }
        if (url.pathname === '/api/file') {
          const file = planPath(url.searchParams.get('root'), url.searchParams.get('p'));
          if (!file) { json(400, { error: 'path' }); return; }
          if (req.method === 'GET') {
            json(200, existsSync(file) ? { exists: true, text: readFileSync(file, 'utf8'), mtime: statSync(file).mtimeMs } : { exists: false });
            return;
          }
          if (req.method === 'PUT') {
            const chunks = [];
            for await (const c of req) chunks.push(c);
            mkdirSync(dirname(file), { recursive: true });
            const name = basename(file);
            const isFeature = Core.FEATURE_FILE_RE.test(name) && dirname(file) === resolve(url.searchParams.get('root'));
            const prevText = isFeature && existsSync(file) ? readFileSync(file, 'utf8') : '';
            writeFileSync(file, Buffer.concat(chunks));
            if (isFeature) {
              const text = readFileSync(file, 'utf8');
              snapshotFeatures(url.searchParams.get('root'), name, prevText, text);
              seenFeatures.set(norm(url.searchParams.get('root')) + '|' + name.toLowerCase(), text);
            }
            const hm = HISTORY_NAME_RE.test(basename(file)) && basename(dirname(file)) === 'history' ? basename(file) : '';
            if (hm) pruneHistory(url.searchParams.get('root'), hm.slice(16));
            json(200, { ok: true });
            return;
          }
        }
        if (url.pathname === '/api/history' && req.method === 'GET') {
          const root = url.searchParams.get('root');
          const file = String(url.searchParams.get('file') || '');
          if (!root || !known(root) || !Core.FEATURE_FILE_RE.test(file)) { json(400, { error: 'path' }); return; }
          json(200, { items: listHistory(root, file) });
          return;
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

  const watcher = setInterval(() => {
    try {
      watchFeatures();
      if (existsSync(WATCH_ERROR_FILE)) unlinkSync(WATCH_ERROR_FILE);
    } catch (e) {
      // 盯文件失败时历史版本就不会自动存，把原因留在固定的文件里
      mkdirSync(STATE_DIR, { recursive: true });
      writeFileSync(WATCH_ERROR_FILE, String(e && e.stack || e));
    }
  }, 3000);
  watcher.unref();

  const idle = setInterval(() => {
    if (Date.now() - lastUse > IDLE_MS) process.exit(0);
  }, 60 * 1000);
  idle.unref();

  // 只在真正监听成功时登记一次，端口取实际监听的端口
  server.once('listening', () => {
    port = server.address().port;
    mkdirSync(STATE_DIR, { recursive: true });
    writeFileSync(STATE_FILE, JSON.stringify({ port, token, pid: process.pid }));
    // 调试：在控制台打印地址和每个请求；SHUPIAN_OPEN 时用默认浏览器打开
    if (process.env.SHUPIAN_DEBUG) {
      const url = 'http://127.0.0.1:' + port + '/index.html?k=' + token + '&view=hub';
      console.log('debug server: ' + url);
      if (process.env.SHUPIAN_OPEN) spawn('cmd', ['/c', 'start', '""', url], { stdio: 'ignore', windowsHide: true });
    }
  });
  const listen = (p, limit) => {
    server.once('error', (e) => {
      if (e.code === 'EADDRINUSE' && p < limit) listen(p + 1, limit);
      else { console.error(e.message); process.exit(1); }
    });
    server.listen({ port: p, host: '127.0.0.1', exclusive: true });
  };
  const start = Number(process.env.PORT) || basePort() + 100;
  listen(start, start + 60);
  process.on('exit', () => {
    const cur = readJson(STATE_FILE, null);
    if (cur && cur.pid === process.pid) { try { writeFileSync(STATE_FILE, '{}'); } catch (e) { /* 目录已不在 */ } }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) startServer();
