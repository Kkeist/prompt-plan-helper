// 火狐里用书签方式加载悬浮窗：node tests/ff.mjs
// 无头火狐打开一个本机网页，网页按书签做的事情加载悬浮窗，再在悬浮窗里把一条问题记进计划书。
// 没有安装火狐时跳过。
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const firefox = ['ProgramFiles', 'ProgramFiles(x86)'].map((v) => process.env[v]).filter(Boolean)
  .map((base) => join(base, 'Mozilla Firefox', 'firefox.exe')).filter(existsSync)[0];
if (!firefox) { console.log('没有安装火狐，跳过。'); process.exit(0); }

let pass = 0;
const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✔ ' + n); } else { fails.push(n); console.log('  ✖ ' + n + (d !== undefined ? '  ' + JSON.stringify(d) : '')); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 桌面服务：临时用户目录里放一个有计划书的文件夹，端口在扩展会找的范围之外
const home = mkdtempSync(join(tmpdir(), 'shupian-ff-'));
const proj = join(home, 'tomato');
mkdirSync(proj, { recursive: true });
writeFileSync(join(proj, 'plan.md'), readFileSync(join(root, 'tests', 'fixtures', 'timer.zh.md'), 'utf8'));
const enc = proj.replace(/[^A-Za-z0-9]/g, '-');
mkdirSync(join(home, '.claude', 'projects', enc), { recursive: true });
writeFileSync(join(home, '.claude', 'projects', enc, 'a.jsonl'), '{}\n');
utimesSync(join(home, '.claude', 'projects', enc, 'a.jsonl'), new Date(), new Date());
writeFileSync(join(home, '.claude.json'), JSON.stringify({ projects: { [proj]: {} } }));
const appSrv = spawn(process.execPath, [join(root, 'tools', 'app-server.mjs')], {
  stdio: 'ignore',
  env: Object.assign({}, process.env, { USERPROFILE: home, HOME: home, PORT: String(14700 + Math.floor(Math.random() * 200)) }),
});
let info = null;
for (let i = 0; i < 40 && !info; i++) {
  await sleep(150);
  try { const j = JSON.parse(readFileSync(join(home, '.shupian', 'server.json'), 'utf8')); if (j.port) info = j; } catch (e) { /* 还没写出来 */ }
}
ok('桌面服务启动了', !!info, info);

// 测试网页：做书签做的事情，再在悬浮窗里写一条问题并记到计划书
const reports = [];
const pageHtml = `<!doctype html><meta charset="utf-8"><title>host</title><h1 id="t">示例页面</h1><button id="b">按钮</button><script>
(function () {
  var src = 'http://127.0.0.1:${info ? info.port : 0}/shupian.js?k=${info ? info.token : ''}&t=' + Date.now();
  function report(name, value) { fetch('/report?name=' + name + '&value=' + encodeURIComponent(value)); }
  var shadow = function () { var h = document.querySelector('[data-shupian]'); return h && h.shadowRoot; };
  setTimeout(function () {
    var s = document.createElement('script');
    s.src = src;
    document.documentElement.setAttribute('data-shupian-open', '');
    document.documentElement.appendChild(s);
  }, 500);
  setTimeout(function () {
    var r = shadow();
    report('opened', r ? (r.querySelector('.fb-body') ? r.querySelector('.fb-body').innerText : 'no-body') : 'no-widget');
  }, 6000);
  setTimeout(function () {
    var r = shadow();
    if (!r) return;
    var ta = r.querySelector('textarea');
    if (ta) { ta.value = '书签方式记下的问题'; ta.dispatchEvent(new Event('input', { bubbles: true })); }
    Array.prototype.forEach.call(r.querySelectorAll('button'), function (b) { if (b.textContent === '记到计划书' || b.textContent === 'Add to plan') b.click(); });
  }, 7000);
  setTimeout(function () {
    var r = shadow();
    report('after', r ? r.querySelector('.fb-body').innerText : 'no-widget');
  }, 10000);
  // 再点一次书签：悬浮窗收起
  setTimeout(function () {
    var s = document.createElement('script');
    s.src = src;
    document.documentElement.appendChild(s);
  }, 11000);
  setTimeout(function () {
    var r = shadow();
    var win = r && r.querySelector('.win');
    report('toggled', win ? win.style.display : 'no-win');
  }, 13000);
})();
</script>`;
const web = createServer((req, res) => {
  if (req.url.indexOf('/report') === 0) {
    const u = new URL(req.url, 'http://x');
    reports.push([u.searchParams.get('name'), u.searchParams.get('value')]);
    res.end('ok');
    return;
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(pageHtml);
}).listen(0, '127.0.0.1');
await new Promise((r) => web.once('listening', r));
const webPort = web.address().port;

const profile = mkdtempSync(join(tmpdir(), 'shupian-ffprof-'));
const ff = spawn(firefox, ['-headless', '-no-remote', '-profile', profile, 'http://127.0.0.1:' + webPort + '/'], { stdio: 'ignore' });
const get = (name) => (reports.filter((x) => x[0] === name)[0] || [])[1];
try {
  for (let i = 0; i < 160 && get('toggled') === undefined; i++) await sleep(150);
  const opened = get('opened') || '';
  ok('书签方式：悬浮窗加载进了本机网页', opened !== 'no-widget' && opened !== undefined, opened);
  ok('悬浮窗读到了计划书里的功能', /@ 4\.1/.test(opened), opened);
  const planText = readFileSync(join(proj, 'plan.md'), 'utf8');
  ok('在悬浮窗里写的问题记进了计划书', /书签方式记下的问题/.test(planText), planText.slice(-120));
  ok('再点一次书签：悬浮窗收起', get('toggled') === 'none', get('toggled'));
} finally {
  ff.kill();
  await sleep(500);
  web.close();
  appSrv.kill();
  for (const d of [home, profile]) { try { rmSync(d, { recursive: true, force: true }); } catch (e) { /* 被占用时留给系统清理 */ } }
}
console.log('\n通过 ' + pass + ' 项，失败 ' + fails.length + ' 项');
process.exit(fails.length ? 1 : 0);
