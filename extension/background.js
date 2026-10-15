// 点工具栏图标或按快捷键：让当前页面里的悬浮窗打开或收起。
chrome.action.onClicked.addListener((tab) => {
  if (tab && tab.id != null) chrome.tabs.sendMessage(tab.id, { shupian: 'toggle' }, () => void chrome.runtime.lastError);
});

// 桌面服务的端口和口令。来源有两种：桌面小窗口页面交过来，或者在桌面版固定的端口范围里自己找。
// 口令只放在内存型的会话存储里。
const LINK_KEY = 'shupian-link';
const PORT_FIRST = 14165;
const PORT_COUNT = 60;

function paired() {
  return chrome.storage.session.get(LINK_KEY).then((v) => v[LINK_KEY] || null);
}

// 桌面版在固定范围里取端口：逐个问一遍，只有来自扩展的请求才会拿到口令。
// 没有服务的端口连接被拒绝是正常情况，不算失败。
async function discover() {
  const asks = [];
  for (let i = 0; i < PORT_COUNT; i++) {
    const port = PORT_FIRST + i;
    asks.push(fetch('http://127.0.0.1:' + port + '/api/pair', { method: 'POST', headers: { 'content-type': 'text/plain; charset=utf-8' }, body: '' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => (j && /^[0-9a-f]{8,}$/.test(String(j.token)) ? { port: String(port), token: String(j.token) } : null))
      .catch(() => null));
  }
  const found = (await Promise.all(asks)).filter(Boolean)[0] || null;
  if (found) await chrome.storage.session.set({ [LINK_KEY]: found });
  return found;
}

async function callApi(link, msg) {
  const isText = typeof msg.body === 'string';
  return fetch('http://127.0.0.1:' + link.port + msg.path, {
    method: msg.method || 'GET',
    headers: Object.assign({ 'x-shupian-token': link.token }, msg.body === undefined ? {} : { 'content-type': isText ? 'text/plain; charset=utf-8' : 'application/json' }),
    body: msg.body === undefined ? undefined : isText ? msg.body : JSON.stringify(msg.body),
  });
}

// 口令失效（桌面版重启过）或服务换了端口时，重新找一次再请求
async function api(msg) {
  let link = (await paired()) || (await discover());
  if (!link) return { ok: false, why: 'unpaired' };
  try {
    let r;
    try {
      r = await callApi(link, msg);
    } catch (e) {
      r = null;
    }
    if (!r || r.status === 401 || r.status === 403) {
      link = await discover();
      if (!link) return { ok: false, why: r ? 'unpaired' : 'down' };
      r = await callApi(link, msg);
    }
    if (!r.ok) return { ok: false, why: String(r.status) };
    return { ok: true, json: await r.json() };
  } catch (e) {
    return { ok: false, why: 'down' };
  }
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
    api(msg).then(reply);
    return true;
  }
  return false;
});

// 安装和启动时先联系一次桌面版，让它知道扩展已经装好
chrome.runtime.onInstalled.addListener(() => { discover(); });
chrome.runtime.onStartup.addListener(() => { discover(); });

// 真实截图：悬浮窗先收起，再由这里截取当前标签页的可见区域。
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (!msg || msg.shupian !== 'capture') return false;
  chrome.tabs.captureVisibleTab(sender.tab ? sender.tab.windowId : undefined, { format: 'png' }, (dataUrl) => {
    reply(chrome.runtime.lastError || !dataUrl ? { dataUrl: '' } : { dataUrl });
  });
  return true;
});
