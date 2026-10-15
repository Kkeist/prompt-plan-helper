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

  // 新建文件夹和按名字找文件夹：两个版本都要通过同样的检查
  async function folderChecks(label, info, made) {
    const post = (path, obj) => call(info, path, { method: 'POST', body: JSON.stringify(obj) });
    const ext = await call(info, '/api/extension');
    const extDir = ext.json && ext.json.path;
    ok(label + '：扩展文件放到了固定的文件夹', !!extDir && extDir.startsWith(home) && existsSync(join(extDir, 'manifest.json')) && existsSync(join(extDir, 'background.js')) && existsSync(join(extDir, 'icons', '128.png')), ext.text.slice(0, 160));
    ok(label + '：扩展脚本和网页里的是同一份', !!extDir && readFileSync(join(extDir, 'shupian.js'), 'utf8') === readFileSync(join(root, 'web', 'shupian.js'), 'utf8'));
    ok(label + '：扩展接口列出浏览器，不认识的浏览器被拒绝', Array.isArray(ext.json.browsers) && (await post('/api/extension', { browser: 'nothing' })).status === 404, ext.text.slice(0, 160));
    const r = await post('/api/mkdir', { parent: proj, name: made });
    ok(label + '：新建文件夹', r.status === 200 && existsSync(join(proj, made)) && r.json.name === made, r.text.slice(0, 120));
    ok(label + '：同名文件夹被拒绝', (await post('/api/mkdir', { parent: proj, name: made })).status === 409);
    ok(label + '：非法名称被拒绝', (await post('/api/mkdir', { parent: proj, name: 'a/b' })).status === 400 && (await post('/api/mkdir', { parent: proj, name: '  ' })).status === 400);
    ok(label + '：不在未知文件夹里新建', (await post('/api/mkdir', { parent: 'C:\\Windows', name: made + 'x' })).status === 404);
    const hit = await post('/api/locate', { name: '番茄钟项目', entries: ['plan.md'] });
    ok(label + '：按名字和文件找到文件夹', hit.status === 200 && hit.json.candidates.some((x) => x.toLowerCase() === proj.toLowerCase()), hit.text.slice(0, 160));
    const miss = await post('/api/locate', { name: '番茄钟项目', entries: ['不存在的文件.md'] });
    ok(label + '：里面的文件对不上时不返回', miss.status === 200 && miss.json.candidates.length === 0, miss.text.slice(0, 160));
  }
  // 同一个文件夹里的多份计划书
  async function planChecks(label, info, extra) {
    const projectsOf = async () => (await call(info, '/api/projects')).json.claude.filter((x) => x.name === '番茄钟项目')[0];
    const url = (f) => '/api/file?root=' + encodeURIComponent(proj) + '&p=' + encodeURIComponent(f);
    const put = await call(info, url(extra), { method: 'PUT', body: '# 计划书：第二份\n\n状态：整理中　　更新：2026-10-15\n' });
    ok(label + '：可以写出第二份计划书', put.status === 200 && existsSync(join(proj, extra)), put.text.slice(0, 100));
    const bad = await call(info, url('secret.md'), { method: 'PUT', body: 'x' });
    ok(label + '：不是计划书的名字被拒绝', bad.status === 400 && !existsSync(join(proj, 'secret.md')));
    const pr = await projectsOf();
    ok(label + '：列出多份计划书，默认用 plan.md', pr && pr.plans.length >= 2 && pr.file === 'plan.md' && pr.plans.map((x) => x.file).indexOf(extra) >= 0, pr && { file: pr.file, plans: pr.plans.map((x) => x.file) });
    const sw = await call(info, '/api/current', { method: 'POST', body: JSON.stringify({ path: proj, file: extra }) });
    const pr2 = await projectsOf();
    ok(label + '：选定当前的一份', sw.status === 200 && pr2.file === extra && pr2.summary && pr2.summary.file === extra && pr2.summary.title === '第二份', pr2 && { file: pr2.file, summary: pr2.summary });
    const last = (await call(info, '/api/projects')).json.last;
    ok(label + '：记着最后打开的是哪一份', last && last.file === extra, last);
    const miss = await call(info, '/api/current', { method: 'POST', body: JSON.stringify({ path: proj, file: 'plan-不存在.md' }) });
    ok(label + '：选不存在的计划书被拒绝', miss.status === 404);
    const unk = await call(info, '/api/current', { method: 'POST', body: JSON.stringify({ path: 'C:\\Windows', file: extra }) });
    ok(label + '：未知文件夹被拒绝', unk.status === 404);
    await call(info, '/api/current', { method: 'POST', body: JSON.stringify({ path: proj, file: 'plan.md' }) });
  }
  await folderChecks('桌面版', exeInfo, '新文件夹');
  await planChecks('桌面版', exeInfo, '计划书-第二份.md');

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
  if (nodeInfo) await folderChecks('Node 版', nodeInfo, '节点文件夹');
  if (nodeInfo) await planChecks('Node 版', nodeInfo, 'plan-第二份.md');
  nodeProc.kill();
} finally {
  exeProc.kill();
  await sleep(500);
  try { rmSync(home, { recursive: true, force: true }); } catch (e) { /* 下次再清 */ }
}
console.log('\n通过 ' + pass + ' 项，失败 ' + fails.length + ' 项');
process.exit(fails.length ? 1 : 0);
