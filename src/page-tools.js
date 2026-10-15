'use strict';
// 悬浮窗用的页面工具：伪截图、选取元素、页面报错记录。只在叠在别的页面上时使用。

const pageErrors = [];
let errorHookOn = false;

function clock() {
  const t = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return p(t.getHours()) + ':' + p(t.getMinutes()) + ':' + p(t.getSeconds());
}

function pushError(text) {
  pageErrors.push(clock() + ' ' + String(text).replace(/\s+/g, ' ').slice(0, 300));
  if (pageErrors.length > 5) pageErrors.shift();
}

function installErrorHook() {
  if (errorHookOn) return;
  errorHookOn = true;
  window.addEventListener('error', (e) => {
    pushError((e.message || '脚本错误') + (e.filename ? ' (' + e.filename.split('/').pop() + ':' + e.lineno + ')' : ''));
  });
  window.addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    pushError('未处理的 Promise 错误：' + (r && r.message ? r.message : r));
  });
  const orig = console.error;
  console.error = function () {
    try { pushError(Array.prototype.map.call(arguments, (a) => (a && a.message) || String(a)).join(' ')); } catch (e) { /* 记录失败不影响页面自己的输出 */ }
    return orig.apply(console, arguments);
  };
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

function withTimeout(p, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

// 伪截图：把当前可见区域的结构和样式画成一张图，不需要任何授权。
// 跨域样式、字体和图片取不到，对应部分显示为空白。
async function domShot() {
  const w = window.innerWidth;
  const hh = window.innerHeight;
  const body = document.body.cloneNode(true);
  const srcCanvas = document.body.querySelectorAll('canvas');
  const dstCanvas = body.querySelectorAll('canvas');
  Array.prototype.forEach.call(srcCanvas, (c, i) => {
    try {
      const im = document.createElement('img');
      im.src = c.toDataURL();
      const cs = getComputedStyle(c);
      im.setAttribute('style', 'width:' + cs.width + ';height:' + cs.height + ';display:' + cs.display);
      dstCanvas[i].parentNode.replaceChild(im, dstCanvas[i]);
    } catch (e) { /* 跨域画布取不到像素 */ }
  });
  const srcFields = document.body.querySelectorAll('input,textarea,select');
  const dstFields = body.querySelectorAll('input,textarea,select');
  Array.prototype.forEach.call(srcFields, (f, i) => {
    const d = dstFields[i];
    if (!d) return;
    if (f.tagName === 'TEXTAREA') d.textContent = f.value;
    else if (f.tagName === 'SELECT') Array.prototype.forEach.call(d.options, (o, k) => { if (k === f.selectedIndex) o.setAttribute('selected', ''); else o.removeAttribute('selected'); });
    else if (f.type === 'checkbox' || f.type === 'radio') { if (f.checked) d.setAttribute('checked', ''); else d.removeAttribute('checked'); }
    else d.setAttribute('value', f.value);
  });
  const imgs = Array.prototype.slice.call(body.querySelectorAll('img')).slice(0, 30);
  await Promise.all(imgs.map(async (im) => {
    try {
      const url = new URL(im.getAttribute('src') || '', location.href);
      if (url.protocol === 'data:' || url.origin !== location.origin) return;
      const r = await withTimeout(fetch(url.href), 3000);
      im.setAttribute('src', await blobToDataUrl(await r.blob()));
      im.removeAttribute('srcset');
    } catch (e) { /* 取不到的图保持原样，显示为空白 */ }
  }));
  Array.prototype.forEach.call(body.querySelectorAll('[data-shupian],script,noscript,iframe,video,audio,object,embed'), (n) => n.remove());
  let css = '';
  Array.prototype.forEach.call(document.styleSheets, (sheet) => {
    try { Array.prototype.forEach.call(sheet.cssRules, (r) => { css += r.cssText + '\n'; }); } catch (e) { /* 跨域样式表读不了 */ }
  });
  const bcs = getComputedStyle(document.body);
  const hcs = getComputedStyle(document.documentElement);
  const clear0 = 'rgba(0, 0, 0, 0)';
  const bg = bcs.backgroundColor !== clear0 ? bcs.backgroundColor : hcs.backgroundColor !== clear0 ? hcs.backgroundColor : '#ffffff';
  const xhtml = new XMLSerializer().serializeToString(body);
  const esc = css.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + hh + '"><foreignObject x="0" y="0" width="' + w + '" height="' + hh + '">'
    + '<div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:' + w + 'px;height:' + hh + 'px;overflow:hidden;background:' + bg + '">'
    + '<style>' + esc + '</style>'
    + '<div style="position:absolute;left:' + -window.scrollX + 'px;top:' + -window.scrollY + 'px;width:' + document.documentElement.scrollWidth + 'px">' + xhtml + '</div>'
    + '</div></foreignObject></svg>';
  const img = new Image();
  await withTimeout(new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('render'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }), 8000);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = hh;
  canvas.getContext('2d').drawImage(img, 0, 0, w, hh);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
  if (!blob) throw new Error('encode');
  return { blob, kind: '伪截图' };
}

// 扩展里有浏览器自己的截图能力时优先用它
function realShot() {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) { resolve(null); return; }
    try {
      chrome.runtime.sendMessage({ shupian: 'capture' }, (res) => {
        if (chrome.runtime.lastError || !res || !res.dataUrl) { resolve(null); return; }
        fetch(res.dataUrl).then((r) => r.blob()).then((blob) => resolve({ blob, kind: '截图' }), () => resolve(null));
      });
    } catch (e) {
      resolve(null);
    }
  });
}

function elementPath(el) {
  const parts = [];
  let n = el;
  while (n && n.nodeType === 1 && n !== document.body && n !== document.documentElement && parts.length < 4) {
    let s = n.tagName.toLowerCase();
    if (n.id) { parts.unshift(s + '#' + n.id); break; }
    const cls = (n.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (cls.length) s += '.' + cls.join('.');
    parts.unshift(s);
    n = n.parentElement;
  }
  return parts.join(' > ');
}

function elementInfo(el) {
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const props = ['font-size', 'font-weight', 'color', 'background-color', 'padding', 'margin', 'border-radius', 'display'];
  const styles = props.map((p) => p + ' ' + cs.getPropertyValue(p)).concat(['width ' + Math.round(r.width) + 'px', 'height ' + Math.round(r.height) + 'px']).join('；');
  const text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
  return {
    path: elementPath(el) + (text ? '（文字「' + text + '」）' : ''),
    styles,
  };
}

// 点选页面上的一个元素：移动高亮，点一下确认，Esc 取消
function pickElement(shadowRoot) {
  return new Promise((resolve) => {
    const box = document.createElement('div');
    box.setAttribute('style', 'position:fixed;z-index:2147483646;pointer-events:none;border:2px solid #e5322d;background:rgba(229,50,45,0.12);display:none');
    const tip = document.createElement('div');
    tip.setAttribute('style', 'position:fixed;z-index:2147483646;pointer-events:none;left:8px;top:8px;background:#000;color:#fff;font:13px/1.5 sans-serif;padding:4px 8px;border-radius:6px;max-width:calc(100vw - 16px);overflow-wrap:anywhere');
    tip.textContent = t('点击要选取的元素，按 Esc 取消。');
    shadowRoot.append(box, tip);
    let cur = null;
    const done = (v) => {
      document.removeEventListener('mousemove', move, true);
      document.removeEventListener('click', click, true);
      document.removeEventListener('keydown', key, true);
      box.remove();
      tip.remove();
      resolve(v);
    };
    const move = (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || el === document.documentElement || el === document.body) { box.style.display = 'none'; cur = null; return; }
      cur = el;
      const r = el.getBoundingClientRect();
      box.style.display = 'block';
      box.style.left = r.left + 'px';
      box.style.top = r.top + 'px';
      box.style.width = r.width + 'px';
      box.style.height = r.height + 'px';
      tip.textContent = elementPath(el);
    };
    const click = (e) => {
      e.preventDefault();
      e.stopPropagation();
      done(cur ? elementInfo(cur) : null);
    };
    const key = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(null); }
    };
    document.addEventListener('mousemove', move, true);
    document.addEventListener('click', click, true);
    document.addEventListener('keydown', key, true);
  });
}

// 当前页面的信息：标题、地址、窗口、滚动位置、能看到的标题和可点的东西
function pageInfo() {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const texts = (sel, max) => {
    const out = [];
    Array.prototype.forEach.call(document.querySelectorAll(sel), (el) => {
      if (out.length >= max || el.closest('[data-shupian]') || !visible(el)) return;
      const s = (el.innerText || el.value || el.getAttribute('aria-label') || el.placeholder || '').replace(/\s+/g, ' ').trim();
      if (s && out.indexOf(s) < 0) out.push(s.slice(0, 40));
    });
    return out;
  };
  return {
    title: document.title,
    scroll: Math.round(window.scrollX) + ',' + Math.round(window.scrollY),
    pixelRatio: window.devicePixelRatio,
    headings: texts('h1,h2,h3', 8),
    controls: texts('button,a[href],input,select,textarea,[role="button"]', 15),
  };
}

// 在页面上拖出一块区域，返回它在窗口里的位置；Esc 取消
function pickRegion(shadowRoot) {
  return new Promise((resolve) => {
    const layer = document.createElement('div');
    layer.setAttribute('style', 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483646;cursor:crosshair;background:rgba(0,0,0,0.25)');
    const box = document.createElement('div');
    box.setAttribute('style', 'position:fixed;border:2px solid #e5322d;background:rgba(255,255,255,0.15);display:none;pointer-events:none');
    const tip = document.createElement('div');
    tip.setAttribute('style', 'position:fixed;left:8px;top:8px;background:#000;color:#fff;font:13px/1.5 sans-serif;padding:4px 8px;border-radius:6px;pointer-events:none');
    tip.textContent = t('拖动选择截图区域，按 Esc 取消。');
    shadowRoot.append(layer, box, tip);
    let sx = 0;
    let sy = 0;
    let dragging = false;
    const done = (v) => {
      document.removeEventListener('keydown', key, true);
      layer.remove();
      box.remove();
      tip.remove();
      resolve(v);
    };
    const rectOf = (x, y) => ({ x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) });
    layer.addEventListener('pointerdown', (e) => {
      dragging = true;
      sx = e.clientX;
      sy = e.clientY;
      box.style.display = 'block';
      layer.setPointerCapture(e.pointerId);
    });
    layer.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const r = rectOf(e.clientX, e.clientY);
      box.style.left = r.x + 'px';
      box.style.top = r.y + 'px';
      box.style.width = r.w + 'px';
      box.style.height = r.h + 'px';
    });
    layer.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      const r = rectOf(e.clientX, e.clientY);
      done(r.w >= 8 && r.h >= 8 ? r : null);
    });
    const key = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(null); }
    };
    document.addEventListener('keydown', key, true);
  });
}

// 把整个可见区域的图按区域裁开
async function cropShot(shot, rect) {
  const url = URL.createObjectURL(shot.blob);
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('decode'));
    img.src = url;
  });
  const kx = img.naturalWidth / window.innerWidth;
  const ky = img.naturalHeight / window.innerHeight;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(rect.w * kx));
  c.height = Math.max(1, Math.round(rect.h * ky));
  c.getContext('2d').drawImage(img, rect.x * kx, rect.y * ky, rect.w * kx, rect.h * ky, 0, 0, c.width, c.height);
  URL.revokeObjectURL(url);
  const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/webp', 0.85));
  if (!blob) throw new Error('encode');
  return { blob, kind: shot.kind };
}
