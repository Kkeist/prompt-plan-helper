// 点工具栏图标或按快捷键：让当前页面里的悬浮窗打开或收起。
chrome.action.onClicked.addListener((tab) => {
  if (tab && tab.id != null) chrome.tabs.sendMessage(tab.id, { shupian: 'toggle' }, () => void chrome.runtime.lastError);
});

// 桌面小窗口页面把端口和口令交过来；悬浮窗通过这里读写计划书。口令只放在内存型的会话存储里。
const LINK_KEY = 'shupian-link';

function paired() {
  return chrome.storage.session.get(LINK_KEY).then((v) => v[LINK_KEY] || null);
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (!msg) return false;
  if (msg.shupian === 'pair') {
    const ok = sender.url && /^http:\/\/127\.0\.0\.1:\d+\//.test(sender.url) && String(msg.port) === new URL(sender.url).port && /^[0-9a-f]{8,}$/.test(String(msg.token));
    if (!ok) { reply({ ok: false }); return false; }
    chrome.storage.session.set({ [LINK_KEY]: { port: String(msg.port), token: String(msg.token) } }).then(() => reply({ ok: true }));
    return true;
  }
  if (msg.shupian === 'api') {
    paired().then(async (link) => {
      if (!link) { reply({ ok: false, why: 'unpaired' }); return; }
      try {
        const isText = typeof msg.body === 'string';
        const r = await fetch('http://127.0.0.1:' + link.port + msg.path, {
          method: msg.method || 'GET',
          headers: Object.assign({ 'x-shupian-token': link.token }, msg.body === undefined ? {} : { 'content-type': isText ? 'text/plain; charset=utf-8' : 'application/json' }),
          body: msg.body === undefined ? undefined : isText ? msg.body : JSON.stringify(msg.body),
        });
        if (!r.ok) { reply({ ok: false, why: String(r.status) }); return; }
        reply({ ok: true, json: await r.json() });
      } catch (e) {
        reply({ ok: false, why: 'down' });
      }
    });
    return true;
  }
  return false;
});

// 真实截图：悬浮窗先收起，再由这里截取当前标签页的可见区域。
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (!msg || msg.shupian !== 'capture') return false;
  chrome.tabs.captureVisibleTab(sender.tab ? sender.tab.windowId : undefined, { format: 'png' }, (dataUrl) => {
    reply(chrome.runtime.lastError || !dataUrl ? { dataUrl: '' } : { dataUrl });
  });
  return true;
});
