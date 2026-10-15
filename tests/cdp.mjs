// 自测用：起一个无头 Chrome，全部交互走调试协议，不碰系统鼠标键盘。
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import os from 'node:os';

const CHROME = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe']
  .filter((p) => existsSync(p))[0];

function freePort() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => resolve(p)); });
    s.on('error', reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch(recordFile, extraArgs) {
  const port = await freePort();
  const dir = mkdtempSync(join(tmpdir(), 'shupian-chrome-'));
  const proc = spawn(CHROME, [
    '--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + dir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-background-networking',
    '--window-size=1280,900', '--lang=zh-CN',
  ].concat(extraArgs || [], ['about:blank']), { stdio: 'ignore' });
  try { os.setPriority(proc.pid, os.constants.priority.PRIORITY_LOW); } catch (e) { /* 优先级设置失败不影响测试 */ }
  spawnSync('powershell', ['-NoProfile', '-Command', '(Get-Process -Id ' + proc.pid + ').ProcessorAffinity = 3'], { stdio: 'ignore' });
  if (recordFile) writeFileSync(recordFile, JSON.stringify({ pid: proc.pid, port, dir }));
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch('http://127.0.0.1:' + port + '/json/version'); if (r.ok) break; } catch (e) { /* 还没起来 */ }
    await sleep(250);
  }
  return {
    port,
    async close() {
      try { proc.kill(); } catch (e) { /* 进程已退出 */ }
      await sleep(600);
      try { rmSync(dir, { recursive: true, force: true }); } catch (e) { /* 目录被占用时下次再清 */ }
      if (recordFile) try { rmSync(recordFile); } catch (e) { /* 记录已删 */ }
    },
    async newPage() {
      const r = await fetch('http://127.0.0.1:' + port + '/json/new?about:blank', { method: 'PUT' });
      const t = await r.json();
      return connect(t.webSocketDebuggerUrl);
    },
  };
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const waits = new Map();
  const handlers = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && waits.has(msg.id)) {
      const w = waits.get(msg.id);
      waits.delete(msg.id);
      msg.error ? w.rej(new Error(msg.error.message)) : w.res(msg.result);
    } else if (msg.method) handlers.forEach((h) => h(msg));
  };
  const send = (method, params) => new Promise((res, rej) => {
    const i = ++id;
    waits.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params: params || {} }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.bringToFront');
  const logs = [];
  handlers.push((m) => {
    if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + (m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text));
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') logs.push('ERR ' + m.params.args.map((a) => a.value || a.description).join(' '));
  });

  const page = {
    send, logs,
    on(fn) { handlers.push(fn); },
    async eval(expr) {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error('eval: ' + (r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text));
      return r.result.value;
    },
    async goto(url) {
      await send('Page.navigate', { url });
      await sleep(500);
      for (let i = 0; i < 40; i++) {
        if ((await page.eval('document.readyState')) === 'complete') break;
        await sleep(100);
      }
    },
    async init(script) { await send('Page.addScriptToEvaluateOnNewDocument', { source: script }); },
    async resize(w, h, mobile) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: !!mobile });
      await sleep(250);
    },
    async shot(file) {
      const r = await send('Page.captureScreenshot', { format: 'png' });
      mkdirSync(join(file, '..'), { recursive: true });
      writeFileSync(file, Buffer.from(r.data, 'base64'));
    },
    async rectOf(js) {
      return page.eval('(function(){var el=(' + js + ');if(!el)return null;el.scrollIntoView({block:"center"});var r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height,l:r.left,t:r.top,r:r.right,b:r.bottom};})()');
    },
    async clickAt(x, y) {
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
      await sleep(120);
    },
    async click(js) {
      const r = await page.rectOf(js);
      if (!r) throw new Error('找不到元素：' + js);
      await page.clickAt(r.x, r.y);
      return r;
    },
    async key(key, mods) {
      const code = { Escape: 27, Enter: 13 }[key] || key.toUpperCase().charCodeAt(0);
      const m = mods || 0;
      const codeName = key.length === 1 && /[a-z]/i.test(key) ? 'Key' + key.toUpperCase() : key;
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code: codeName, windowsVirtualKeyCode: code, modifiers: m });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: codeName, windowsVirtualKeyCode: code, modifiers: m });
      await sleep(100);
    },
    async insert(text) { await send('Input.insertText', { text }); await sleep(100); },
    async drag(x1, y1, x2, y2) {
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x1, y: y1 });
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: x1, y: y1, button: 'left', clickCount: 1 });
      for (let i = 1; i <= 8; i++) await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x1 + ((x2 - x1) * i) / 8, y: y1 + ((y2 - y1) * i) / 8, button: 'left' });
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x2, y: y2, button: 'left', clickCount: 1 });
      await sleep(150);
    },
    sleep,
    close() { try { ws.close(); } catch (e) { /* 已关闭 */ } },
  };
  return page;
}

// 页面内的查找工具：穿过所有 shadow root，按选择器和文字找元素
export const DEEP = `
window.__deep = function (sel, text, exact) {
  var out = [];
  (function walk(root) {
    root.querySelectorAll('*').forEach(function (el) {
      if (el.shadowRoot) walk(el.shadowRoot);
    });
    root.querySelectorAll(sel).forEach(function (el) {
      var t = (el.textContent || '').trim();
      if (text == null || (exact ? t === text : t.indexOf(text) >= 0)) out.push(el);
    });
  })(document);
  return out;
};
window.__one = function (sel, text, exact) { return window.__deep(sel, text, exact)[0] || null; };
`;

export function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}
