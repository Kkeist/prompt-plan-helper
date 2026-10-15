'use strict';
// 界面基础件：元素创建、语言、浏览器存储、文件夹读写、下载和复制。

const NS = 'shupian:' + (location.protocol === 'file:' ? location.pathname : location.origin);

function add(el, c) {
  if (c == null || c === false) return;
  if (Array.isArray(c)) { c.forEach((x) => add(el, x)); return; }
  el.append(c.nodeType ? c : document.createTextNode(String(c)));
}

function h(tag, props) {
  const el = document.createElement(tag);
  if (props) {
    Object.keys(props).forEach((k) => {
      const v = props[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style') el.setAttribute('style', v);
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'value' || k === 'disabled' || k === 'placeholder' || k === 'rows') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
  }
  for (let i = 2; i < arguments.length; i++) add(el, arguments[i]);
  return el;
}

function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

const LS = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  del(key) {
    try { localStorage.removeItem(key); } catch (e) { /* 存储不可用时没有可删的内容 */ }
  },
};

// ---------- 语言 ----------
// 界面文字都在 locales/<语言>.json 的 ui 部分，代码里只写键；LOCALES 由构建注入。
// 缺键时显示键名并报错，不回退成别的语言。

const LANG_LIST = Object.keys(LOCALES);

let LANG = (function () {
  const saved = LS.get('shupian:lang', '');
  if (LOCALES[saved]) return saved;
  const lang = String(navigator.language || '').toLowerCase();
  return LANG_LIST.filter((k) => lang.indexOf(k) === 0)[0] || 'en';
})();

// 指定语言的文字（比如要写进某份计划书的语言）
function tl(lang, key, params) {
  let s = LOCALES[lang].ui[key];
  if (s === undefined) {
    console.error('Missing text key: ' + key + ' (' + lang + ')');
    return '[' + key + ']';
  }
  if (params) Object.keys(params).forEach((k) => { s = s.split('{' + k + '}').join(String(params[k])); });
  return s;
}

function t(key, params) {
  return tl(LANG, key, params);
}

function setLang(l) {
  LANG = LOCALES[l] ? l : LANG;
  LS.set('shupian:lang', LANG);
}

// ---------- IndexedDB：文件夹授权句柄和图片 ----------

function openDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error('indexedDB unavailable')); return; }
    const r = indexedDB.open('shupian', 1);
    r.onupgradeneeded = () => { r.result.createObjectStore('kv'); };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

function kv(mode, fn) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction('kv', mode);
    const req = fn(tx.objectStore('kv'));
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}
const kvGet = (k) => kv('readonly', (s) => s.get(k));
const kvSet = (k, v) => kv('readwrite', (s) => s.put(v, k));
const kvDel = (k) => kv('readwrite', (s) => s.delete(k));

// ---------- 本机服务（桌面快捷方式打开时） ----------
// 有服务时文件夹由服务读写，不需要浏览器的文件夹授权；页面带着启动时给的口令。

const SERVER = (function () {
  if (location.protocol !== 'http:' || location.hostname !== '127.0.0.1') return null;
  let k = new URLSearchParams(location.search).get('k') || '';
  try {
    if (k) sessionStorage.setItem('shupian:k', k);
    else k = sessionStorage.getItem('shupian:k') || '';
  } catch (e) { /* 没有会话存储时口令只在本次地址里 */ }
  return k ? { token: k } : null;
})();

const Api = {
  async call(method, path, body, raw) {
    const headers = { 'x-shupian-token': SERVER.token };
    let payload = body;
    if (body !== undefined && !(body instanceof Blob) && typeof body !== 'string') {
      headers['content-type'] = 'application/json';
      payload = JSON.stringify(body);
    }
    const r = await fetch(path, { method, headers, body: payload });
    if (!r.ok) throw new Error(path + ' ' + r.status);
    return raw ? r : r.json();
  },
};

// 悬浮窗到桌面服务的通道：只在浏览器扩展里可用，端口和口令由扩展后台持有，页面里拿不到
const Link = {
  available: typeof chrome !== 'undefined' && !!(chrome.runtime && chrome.runtime.id && chrome.runtime.sendMessage),
  // 失败时抛出的错误 message：unpaired（还没有打开过桌面小窗口）、down（服务没有响应）、或接口的状态码
  call(method, path, body) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ shupian: 'api', method, path, body }, (r) => {
        if (chrome.runtime.lastError || !r) { reject(new Error('down')); return; }
        if (!r.ok) { reject(new Error(r.why)); return; }
        resolve(r.json);
      });
    });
  },
};

// ---------- 文件夹 ----------
// handle 要么是浏览器授权的目录句柄，要么是 { server: true, root, name }

const Folder = {
  supported() {
    return !!SERVER || typeof window.showDirectoryPicker === 'function';
  },
  async pick() {
    if (SERVER) {
      const r = await Api.call('POST', '/api/pick', {});
      if (!r.path) { const e = new Error('cancel'); e.name = 'AbortError'; throw e; }
      return { server: true, root: r.path, name: r.name };
    }
    return window.showDirectoryPicker({ mode: 'readwrite' });
  },
  async permission(handle, ask) {
    if (handle.server) return true;
    const opts = { mode: 'readwrite' };
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    if (!ask) return false;
    return (await handle.requestPermission(opts)) === 'granted';
  },
  async dir(handle, sub, create) {
    let d = handle;
    for (const part of sub || []) d = await d.getDirectoryHandle(part, { create: !!create });
    return d;
  },
  // 文件不存在返回 null；存在返回 { text, mtime }（mtime 是文件的修改时间，毫秒）
  async readInfo(handle, sub, name) {
    if (handle.server) {
      const p = (sub || []).concat([name]).join('/');
      const r = await Api.call('GET', '/api/file?root=' + encodeURIComponent(handle.root) + '&p=' + encodeURIComponent(p));
      return r.exists ? { text: r.text, mtime: r.mtime || 0 } : null;
    }
    try {
      const d = await Folder.dir(handle, sub, false);
      const f = await (await d.getFileHandle(name)).getFile();
      return { text: await f.text(), mtime: f.lastModified || 0 };
    } catch (e) {
      if (e && e.name === 'NotFoundError') return null;
      throw e;
    }
  },
  async read(handle, sub, name) {
    const r = await Folder.readInfo(handle, sub, name);
    return r ? r.text : null;
  },
  async write(handle, sub, name, data) {
    if (handle.server) {
      const p = (sub || []).concat([name]).join('/');
      await Api.call('PUT', '/api/file?root=' + encodeURIComponent(handle.root) + '&p=' + encodeURIComponent(p), data);
      return;
    }
    const d = await Folder.dir(handle, sub, true);
    const fh = await d.getFileHandle(name, { create: true });
    const w = await fh.createWritable();
    await w.write(data);
    await w.close();
  },
  // 历史版本：项目文件夹里 .shupian/history/ 下，名字是 时间-功能清单文件名.md；最新的在前
  async historyList(handle, file) {
    if (handle.server) {
      const r = await Api.call('GET', '/api/history?root=' + encodeURIComponent(handle.root) + '&file=' + encodeURIComponent(file));
      return r.items;
    }
    let d;
    try {
      d = await Folder.dir(handle, ['.shupian', 'history'], false);
    } catch (e) {
      if (e && e.name === 'NotFoundError') return [];
      throw e;
    }
    const out = [];
    for await (const pair of d.entries()) {
      const name = pair[0];
      if (pair[1].kind === 'file' && /^\d{8}-\d{6}-/.test(name) && name.slice(16).toLowerCase() === file.toLowerCase()) out.push({ name });
    }
    return out.sort((a, b) => (a.name < b.name ? 1 : -1));
  },
  // 浏览器授权的文件夹没有服务替它清理：只留最近的 keep 份
  async historyPrune(handle, file, keep) {
    const all = await Folder.historyList(handle, file);
    const d = await Folder.dir(handle, ['.shupian', 'history'], false);
    for (const it of all.slice(keep)) await d.removeEntry(it.name);
  },
};

// ---------- 下载和复制 ----------

// 所有下载走这里：文件名带保存时的日期时间，同一秒内再存加序号。
const nameCount = {};
function uniqueFileName(base, ext) {
  const stamp = Core.timeStamp();
  const key = base + '|' + stamp + '|' + ext;
  nameCount[key] = (nameCount[key] || 0) + 1;
  return base + '-' + stamp + (nameCount[key] > 1 ? '-' + nameCount[key] : '') + '.' + ext;
}

function saveAs(name, content, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: type || 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return name;
}

function download(content, base, ext, type) {
  return saveAs(uniqueFileName(base, ext), content, type);
}

function readText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });
}

// 复制：先用剪贴板接口，不行再用选中复制；都不行返回 false，由调用方提示手动复制。
function copyText(text, fallbackEl) {
  const legacy = () => {
    try {
      const ta = fallbackEl || h('textarea', { value: text, style: 'position:fixed;left:0;top:0;opacity:0' });
      if (!fallbackEl) document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      if (!fallbackEl) ta.remove();
      return ok;
    } catch (e) {
      return false;
    }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true, () => legacy());
  }
  return Promise.resolve(legacy());
}

// 剪贴板只收 PNG：把任何图片转成 PNG
function toPng(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
    img.src = url;
  });
}

async function copyImage(blob) {
  if (!navigator.clipboard || !window.ClipboardItem) return false;
  try {
    const png = await toPng(blob);
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
    return true;
  } catch (e) {
    return false;
  }
}

function errText(e) {
  return e && e.message ? e.message : String(e);
}
