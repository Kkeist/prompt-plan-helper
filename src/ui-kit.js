'use strict';
// 浮层：下拉菜单、弹窗、轻提示。每个应用外壳各建一份。

function createKit(appEl) {
  let popEl = null;
  let popAnchor = null;
  const modals = [];
  let toastEl = null;
  let toastTimer = 0;

  function closePop() {
    if (popEl) { popEl.remove(); popEl = null; popAnchor = null; }
  }

  function openPop(anchor, build) {
    if (popEl && popAnchor === anchor) { closePop(); return; }
    closePop();
    popEl = h('div', { class: 'pop' });
    popAnchor = anchor;
    build(popEl, closePop);
    appEl.append(popEl);
    const r = anchor.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = popEl.offsetWidth;
    const ph = popEl.offsetHeight;
    popEl.style.left = Math.max(8, Math.min(r.right - w, vw - w - 8)) + 'px';
    let top = r.bottom + 4;
    if (top + ph > vh - 8) top = Math.max(8, r.top - ph - 4);
    popEl.style.top = top + 'px';
  }

  function popItem(label, run, ex) {
    return h('button', { type: 'button', class: ex && ex.on ? 'on' : '', disabled: ex && ex.disabled, onclick() { closePop(); run(); } }, label);
  }

  function openModal(o) {
    closePop();
    const mask = h('div', { class: 'mask' });
    const m = { el: mask };
    const close = () => {
      const i = modals.indexOf(m);
      if (i >= 0) modals.splice(i, 1);
      mask.remove();
      if (o.onClose) o.onClose();
    };
    m.close = close;
    const box = h('div', { class: 'modal', role: 'dialog' },
      h('div', { class: 'modal-head' }, h('h2', { text: o.title }), h('button', { type: 'button', class: 'x', title: t('关闭'), onclick: close }, '✕')),
      h('div', { class: 'modal-body' }, o.body),
      o.foot ? h('div', { class: 'modal-foot' }, o.foot(close)) : null);
    mask.addEventListener('pointerdown', (e) => { m.down = e.target === mask; });
    mask.addEventListener('click', (e) => { if (e.target === mask && m.down) close(); });
    mask.append(box);
    appEl.append(mask);
    modals.push(m);
    return m;
  }

  function toast(msg, action) {
    if (toastEl) { toastEl.remove(); clearTimeout(toastTimer); }
    const el = h('div', { class: 'toast', role: 'status' }, h('span', { text: msg }));
    toastEl = el;
    const dismiss = () => { if (toastEl === el) { el.remove(); toastEl = null; clearTimeout(toastTimer); } };
    if (action) el.append(h('button', { type: 'button', class: 'btn sm', onclick(e) { e.stopPropagation(); dismiss(); action.run(); } }, action.label));
    el.addEventListener('click', dismiss);
    appEl.append(el);
    toastTimer = setTimeout(dismiss, action ? 9000 : 5000);
  }

  // Esc：先关弹窗，再关下拉；返回 true 表示已处理
  function escape() {
    if (modals.length) { modals[modals.length - 1].close(); return true; }
    if (popEl) { closePop(); return true; }
    return false;
  }

  document.addEventListener('pointerdown', (e) => {
    if (!popEl) return;
    const path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(popEl) >= 0 || (popAnchor && path.indexOf(popAnchor) >= 0)) return;
    closePop();
  }, true);

  return { closePop, openPop, popItem, openModal, toast, escape };
}

function autoGrow(ta) {
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 2 + 'px';
}

function growAll(el) {
  Array.prototype.forEach.call(el.querySelectorAll('textarea.in'), autoGrow);
}

function copyThen(kit, text, ta) {
  copyText(text, ta).then((ok) => {
    if (ok) kit.toast(t('已复制。'));
    else {
      if (ta) ta.select();
      kit.toast(t('浏览器不允许自动复制，已选中全文，请按 Ctrl+C 复制。'));
    }
  });
}

// 弹出一个带全文的文本框，配复制按钮
function showText(kit, title, text, hint) {
  const ta = h('textarea', { class: 'in big', readonly: true, value: text, 'aria-label': t('全文') });
  kit.openModal({
    title,
    body: h('div', null, hint ? h('p', { class: 'hint', text: hint }) : null, ta),
    foot: (close) => [
      h('button', { type: 'button', class: 'btn', onclick: close }, t('关闭')),
      h('button', { type: 'button', class: 'btn primary', onclick() { copyThen(kit, text, ta); } }, t('复制')),
    ],
  });
  setTimeout(() => { autoGrow(ta); ta.select(); }, 0);
}
