// 浏览器扩展自测：node tests/ext.mjs
// 以扩展形态加载 extension/，检查脚本注入、悬浮窗、截图（真实截图或回退到伪截图）。
import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, DEEP } from './cdp.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0;
const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✔ ' + n); } else { fails.push(n); console.log('  ✖ ' + n + (d !== undefined ? '  ' + JSON.stringify(d) : '')); } };

const srv = spawn(process.execPath, [join(root, 'tools', 'serve.mjs'), '.'], { stdio: ['ignore', 'pipe', 'inherit'] });
const base = await new Promise((r) => srv.stdout.once('data', (d) => r(String(d).trim())));
const chrome = await launch(null, ['--load-extension=' + join(root, 'extension'), '--disable-extensions-except=' + join(root, 'extension')]);
try {
  const page = await chrome.newPage();
  await page.init(DEEP);
  await page.resize(1280, 800);
  await page.goto(base + 'tests/fixtures/host.html');
  await page.sleep(800);
  ok('页面上出现悬浮按钮', await page.eval('!!document.querySelector("[data-shupian]")'));
  await page.eval('window.postMessage({ shupian: "open" }, "*")');
  await page.sleep(400);
  ok('消息可以打开小窗', await page.eval('(function(){var h=document.querySelector("[data-shupian]");var w=h.shadowRoot.querySelector(".win");return w.style.display!=="none"})()'));
  await page.eval('(function(){var b=Array.prototype.filter.call(document.querySelector("[data-shupian]").shadowRoot.querySelectorAll("button"),function(x){return x.textContent==="截图"})[0];b.click()})()');
  let kind = '';
  for (let i = 0; i < 40 && !kind; i++) {
    await page.sleep(150);
    kind = await page.eval('(function(){var k=document.querySelector("[data-shupian]").shadowRoot.querySelector(".chipline span");return k?k.textContent:""})()');
  }
  ok('截图成功（真实截图或伪截图）', kind === '截图' || kind === '伪截图', kind);
  console.log('  附图类型：' + kind);
} finally {
  await chrome.close();
  srv.kill();
}
console.log('\n通过 ' + pass + ' 项，失败 ' + fails.length + ' 项');
process.exit(fails.length ? 1 : 0);
