'use strict';
// 挂载：有 #shupian-app 就整页显示（桌面小窗口或计划书页）；否则作为小悬浮窗叠在当前页面上。

function styleEl() {
  return h('style', { text: CSS });
}

// 打开或屏幕尺寸变化时：整个窗口都要在屏幕内（放不下就贴左上）
function fitPos(pos, w, hgt) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.round(Math.min(Math.max(pos.x, 0), Math.max(0, vw - w))),
    y: Math.round(Math.min(Math.max(pos.y, 0), Math.max(0, vh - hgt))),
  };
}

// 拖动时：最多允许出去一半，标题栏始终在屏幕里
function clampPos(pos, w, hgt) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.round(Math.min(Math.max(pos.x, -w / 2), vw - w / 2)),
    y: Math.round(Math.min(Math.max(pos.y, 0), vh - Math.min(hgt, vh) / 2)),
  };
}

function dragWith(el, shouldStart, getPos, setPos, onTap) {
  let st = null;
  el.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (shouldStart && !shouldStart(e)) return;
    const p = getPos();
    st = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: p.x, y: p.y, moved: false };
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* 指针已结束 */ }
  });
  el.addEventListener('pointermove', (e) => {
    if (!st || e.pointerId !== st.id) return;
    const dx = e.clientX - st.sx;
    const dy = e.clientY - st.sy;
    if (!st.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
    st.moved = true;
    setPos({ x: st.x + dx, y: st.y + dy }, false);
  });
  const end = (e) => {
    if (!st || e.pointerId !== st.id) return;
    const s = st;
    st = null;
    if (s.moved) setPos(getPos(), true);
    else if (onTap) onTap(e);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

function mountPage(host) {
  const params = new URLSearchParams(location.search);
  const root = host.attachShadow({ mode: 'open' });
  root.append(styleEl());
  const wrap = h('div', { style: 'width:100%;height:100%' });
  const inst = createApp({ root, defaultName: t('新项目'), folder: params.get('folder') || '' });
  wrap.append(inst.el);
  root.append(wrap);
  document.title = t('prompt 计划书助手');
  document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en';
  return { open() {}, close() {}, toggle() {}, mode: 'plan' };
}

function nextFrames(n) {
  return new Promise((resolve) => {
    const step = (i) => (i <= 0 ? resolve() : requestAnimationFrame(() => step(i - 1)));
    step(n);
  });
}

function mountFloat(autoOpen) {
  if (window.top !== window) return null;
  // 页面自己引入了脚本又装了扩展时只留一份：扩展的那份能连桌面小窗口
  const existing = document.querySelector('[data-shupian]');
  if (existing) {
    if (!Link.available) return null;
    existing.remove();
  }
  installErrorHook();
  const host = document.createElement('div');
  host.setAttribute('data-shupian', '');
  host.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;z-index:2147483000';
  document.documentElement.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });
  root.append(styleEl());
  const win = h('div', { class: 'win', style: 'display:none' });
  const fab = h('button', { type: 'button', class: 'fab', title: t('prompt 计划书助手') + '（Alt+Shift+S）', 'aria-label': t('prompt 计划书助手') });
  fab.innerHTML = ICON_SVG;
  root.append(win, fab);

  let built = false;
  let isOpen = false;
  const winKey = NS + ':win';
  const fabKey = NS + ':fab';

  const savedWinPos = () => LS.get(winKey, null) || { x: window.innerWidth - win.offsetWidth - 12, y: window.innerHeight - win.offsetHeight - 12 };
  const winPos = () => {
    const r = win.getBoundingClientRect();
    return { x: r.left, y: r.top };
  };
  const placeWin = (pos, save, loose) => {
    const w = win.offsetWidth;
    const hh = win.offsetHeight;
    const p = loose ? clampPos(pos, w, hh) : fitPos(pos, w, hh);
    win.style.left = p.x + 'px';
    win.style.top = p.y + 'px';
    if (save) LS.set(winKey, p);
  };
  const dragWin = (pos, final) => placeWin(pos, final, true);
  const fabPos = () => {
    const saved = LS.get(fabKey, null);
    const s = fab.offsetWidth || 54;
    const base = saved || { x: window.innerWidth - s - 14, y: window.innerHeight - s - 14 };
    return { x: Math.min(Math.max(base.x, 0), window.innerWidth - s), y: Math.min(Math.max(base.y, 0), window.innerHeight - s) };
  };
  const placeFab = (pos, save) => {
    const s = fab.offsetWidth || 54;
    const p = { x: Math.min(Math.max(pos.x, 0), window.innerWidth - s), y: Math.min(Math.max(pos.y, 0), window.innerHeight - s) };
    fab.style.left = p.x + 'px';
    fab.style.top = p.y + 'px';
    if (save) LS.set(fabKey, p);
  };

  // 截图和选取元素时窗口先藏起来
  const whileHidden = async (fn) => {
    const was = win.style.display;
    win.style.display = 'none';
    fab.style.display = 'none';
    try {
      await nextFrames(2);
      return await fn();
    } finally {
      win.style.display = was;
      if (!isOpen) fab.style.display = '';
    }
  };
  const viewShot = async () => (await realShot()) || (await domShot());
  const tools = {
    // 当前页面：一下记下页面的信息，并存一张整个可见区域的图
    page: () => whileHidden(async () => ({ info: pageInfo(), shot: await viewShot() })),
    // 区域截图：拖出一块区域，只存这一块
    region: async () => {
      const rect = await whileHidden(() => pickRegion(root));
      if (!rect) return null;
      return whileHidden(async () => cropShot(await viewShot(), rect));
    },
    pick: () => whileHidden(() => pickElement(root)),
    errors: () => pageErrors.slice(),
    context: () => ({ page: location.href, view: window.innerWidth + '×' + window.innerHeight }),
  };

  const open = () => {
    if (!built) {
      win.append(createFeedback({ tools, onClose: close, onLayout: () => { if (isOpen) placeWin(winPos(), false, false); } }).el);
      built = true;
    }
    isOpen = true;
    win.style.display = '';
    fab.style.display = 'none';
    placeWin(savedWinPos(), false, false);
  };
  function close() {
    isOpen = false;
    win.style.display = 'none';
    fab.style.display = '';
    placeFab(fabPos(), false);
  }
  const toggle = () => (isOpen ? close() : open());

  dragWith(fab, null, fabPos, placeFab, toggle);
  dragWith(win, (e) => {
    const path = e.composedPath ? e.composedPath() : [];
    let onBar = false;
    for (let i = 0; i < path.length; i++) {
      const n = path[i];
      if (n === win) break;
      if (n.tagName === 'BUTTON' || n.tagName === 'INPUT' || n.tagName === 'TEXTAREA') return false;
      if (n.classList && n.classList.contains('head')) onBar = true;
    }
    return onBar;
  }, winPos, dragWin);

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyS') { e.preventDefault(); toggle(); }
  }, true);
  window.addEventListener('resize', () => {
    if (isOpen) placeWin(winPos(), false, false);
    else placeFab(fabPos(), false);
  });
  placeFab(fabPos(), false);
  if (autoOpen) open();

  return { open, close, toggle, mode: 'float' };
}

(function boot() {
  if (window.Shupian) return;
  const params = new URLSearchParams(location.search);
  const want = params.get('shupian') || (location.hash.indexOf('#shupian-') === 0 ? location.hash.slice(9) : '');
  const start = () => {
    const page = document.getElementById('shupian-app');
    if (page && Link.available && SERVER) {
      chrome.runtime.sendMessage({ shupian: 'pair', port: location.port, token: SERVER.token }, () => void chrome.runtime.lastError);
      return;
    }
    const api = page ? mountPage(page) : mountFloat(!!want || document.documentElement.hasAttribute('data-shupian-open'));
    if (!api) return;
    window.Shupian = api;
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg && msg.shupian === 'toggle') api.toggle();
      });
    }
    window.addEventListener('message', (e) => {
      if (e.source === window && e.data && typeof e.data.shupian === 'string') {
        if (e.data.shupian === 'close') api.close();
        else api.open();
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
