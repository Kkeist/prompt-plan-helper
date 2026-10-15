// 桌面版自测：node tests/exe.mjs
// 用临时的用户目录启动 exe 和 Node 版本服务，对同一份数据调用接口，检查两边结果一致。
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const exe = join(root, 'web', 'download', 'prompt-plan-helper.exe');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0;
const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✔ ' + n); } else { fails.push(n); console.log('  ✖ ' + n + (d !== undefined ? '  ' + JSON.stringify(d) : '')); } };

if (!existsSync(exe)) { console.error('先运行 node tools/build-exe.mjs'); process.exit(1); }

const home = mkdtempSync(join(tmpdir(), 'shupian-exe-'));
const proj = join(home, '番茄钟项目');
mkdirSync(proj, { recursive: true });
for (const [name, file] of [['plan.md', 'timer.zh.md']]) writeFileSync(join(proj, name), readFileSync(join(root, 'tests', 'fixtures', file), 'utf8'));
const enc = proj.replace(/[^A-Za-z0-9]/g, '-');
mkdirSync(join(home, '.claude', 'projects', enc), { recursive: true });
writeFileSync(join(home, '.claude', 'projects', enc, 'a.jsonl'), '{}\n');
utimesSync(join(home, '.claude', 'projects', enc, 'a.jsonl'), new Date(), new Date());
writeFileSync(join(home, '.claude.json'), JSON.stringify({ projects: { [proj]: {} } }));

const env = Object.assign({}, process.env, { USERPROFILE: home, HOME: home, PLAN_HELPER_TEST: '-test' });
const exeProc = spawn(exe, [], { env: Object.assign({}, env, { PORT: '14611' }), stdio: 'ignore' });
const stateFile = join(home, '.shupian', 'server.json');
let exeInfo = null;
for (let i = 0; i < 50 && !exeInfo; i++) {
  await sleep(150);
  try { const j = JSON.parse(readFileSync(stateFile, 'utf8')); if (j.port === 14611) exeInfo = j; } catch (e) { /* 还没写出来 */ }
}

async function call(info, path, opts) {
  const r = await fetch('http://127.0.0.1:' + info.port + path, Object.assign({ headers: { 'x-shupian-token': info.token } }, opts || {}));
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* 不是 JSON */ }
  return { status: r.status, text, json };
}

try {
  ok('桌面版启动了', !!exeInfo, exeInfo);
  const ping = await call(exeInfo, '/api/ping');
  ok('接口可用', ping.status === 200 && ping.json && ping.json.ok === true);
  const page = await fetch('http://127.0.0.1:' + exeInfo.port + '/index.html');
  const html = await page.text();
  ok('网页文件嵌在 exe 里，直接可以打开', page.status === 200 && /prompt 计划书助手/.test(html));
  const js = await fetch('http://127.0.0.1:' + exeInfo.port + '/shupian.js');
  ok('脚本可以取到', js.status === 200 && (await js.text()).length > 100000);
  ok('没有口令的接口请求被拒绝', (await fetch('http://127.0.0.1:' + exeInfo.port + '/api/projects')).status === 401);
  const projects = await call(exeInfo, '/api/projects');
  const mine = projects.json && projects.json.claude.filter((x) => x.name === '番茄钟项目')[0];
  ok('列出最近在用的文件夹，标为使用中', !!mine && mine.active === true, projects.text.slice(0, 200));
  ok('摘要：2 个功能，1 个已完成，没有待补', mine && mine.summary && mine.summary.total === 2 && mine.summary.done === 1 && mine.summary.doing === 1 && mine.summary.pending === 0, mine && mine.summary);
  ok('摘要：标题和状态', mine && mine.summary && mine.summary.title === '番茄钟（示例）' && mine.summary.status === 'doing', mine && mine.summary);

  const read = await call(exeInfo, '/api/file?root=' + encodeURIComponent(proj) + '&p=plan.md');
  ok('读 plan.md', read.json && read.json.exists === true && /番茄钟/.test(read.json.text));
  const put = await call(exeInfo, '/api/file?root=' + encodeURIComponent(proj) + '&p=plan.md', { method: 'PUT', body: read.json.text.replace('进度：进行中', '进度：已完成') });
  ok('写 plan.md', put.status === 200 && /进度：已完成/.test(readFileSync(join(proj, 'plan.md'), 'utf8').split('### 4.2')[1]));
  ok('不读未知文件夹', (await call(exeInfo, '/api/file?root=' + encodeURIComponent('C:\\Windows') + '&p=plan.md')).status === 400);
  ok('不读别的文件名', (await call(exeInfo, '/api/file?root=' + encodeURIComponent(proj) + '&p=secret.txt')).status === 400);
  const conn = await call(exeInfo, '/api/connect', { method: 'POST', body: JSON.stringify({ path: proj }) });
  ok('连接文件夹，记入连接历史', conn.status === 200 && existsSync(join(home, '.shupian', 'history.json')), conn.text.slice(0, 120));

  // 和 Node 版本服务对照：同一份数据，摘要一致
  const nodeProc = spawn(process.execPath, [join(root, 'tools', 'app-server.mjs')], { env: Object.assign({}, env, { PORT: '14633' }), stdio: 'ignore' });
  let nodeInfo = null;
  for (let i = 0; i < 50 && !nodeInfo; i++) {
    await sleep(150);
    try { const j = JSON.parse(readFileSync(stateFile, 'utf8')); if (j.port === 14633) nodeInfo = j; } catch (e) { /* 还没写出来 */ }
  }
  const a = await call(exeInfo, '/api/connect', { method: 'POST', body: JSON.stringify({ path: proj }) });
  const b = nodeInfo ? await call(nodeInfo, '/api/connect', { method: 'POST', body: JSON.stringify({ path: proj }) }) : null;
  ok('两个版本给出同样的摘要', !!b && JSON.stringify(a.json.summary) === JSON.stringify(b.json.summary), [a.json && a.json.summary, b && b.json && b.json.summary]);
  nodeProc.kill();
} finally {
  exeProc.kill();
  await sleep(500);
  try { rmSync(home, { recursive: true, force: true }); } catch (e) { /* 下次再清 */ }
}
console.log('\n通过 ' + pass + ' 项，失败 ' + fails.length + ' 项');
process.exit(fails.length ? 1 : 0);
