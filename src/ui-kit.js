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
    const box = h('div', { class: 'modal' + (o.small ? ' small' : ''), role: 'dialog', 'aria-label': o.title },
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

// 列表式写问题：点「＋ 加一条」或回车加一条，每一条是一个输入框，随时可以改、可以补。
// 每一条可以 @ 多个功能（点「＋ @」或输入 @），行里的 data 留给调用方放自己的东西（比如选取的多个元素）。
// o: { kit, features: () => [{ no, name }]（可以没有功能，那就没有 @）, placeholder（文字或函数）, onTarget(f),
//      rowTools(row, repaint)（每条上方的额外按钮）, rowExtra(row, repaint)（每条下方的额外内容）, onLayout(),
//      onChange()（用户改了内容；程序自己的 reset / restore / syncTargets 不触发） }
// 返回 { el, rows, items(), focusedRow(), syncTargets(f), reset(f), addRow(f), paint(), defaultF,
//        snapshot()（有内容的行，可存成 JSON）, restore(rows)（取回草稿，返回有没有取回） }
function createIssueList(o) {
  const el = h('div', { class: 'ilist' });
  const rows = [];
  const feats = () => (o.features ? o.features() : []);
  const label = (f) => (f.no ? f.no + ' ' : '') + f.name;
  const same = (a, b) => !!(a && b && a.no === b.no && a.name === b.name);
  const has = (row, f) => row.fs.some((x) => same(x, f));
  const api = { el, rows, defaultF: null };
  let focused = null;
  // 用户改动（输入、加减行、选功能、加元素）之后通知调用方保存草稿；程序自己重画不通知
  let quiet = false;
  const changed = () => { if (!quiet && o.onChange) o.onChange(); };

  // 勾选或取消勾选一个功能；下拉保持打开，可以连着选多个
  function choose(row, anchor, after) {
    const list = feats();
    if (!list.length) return;
    o.kit.openPop(anchor, (pop) => {
      const btns = list.map((f) => {
        const b = h('button', { type: 'button', class: has(row, f) ? 'on' : '', onclick() {
          if (has(row, f)) row.fs = row.fs.filter((x) => !same(x, f));
          else { row.fs.push(f); api.defaultF = f; if (o.onTarget) o.onTarget(f); }
          b.className = has(row, f) ? 'on' : '';
          paint();
          if (after) after();
        } }, label(f));
        return b;
      });
      btns.forEach((b) => pop.append(b));
    });
  }

  function makeRow(fs, text) {
    const row = { fs: (fs || []).slice(), text: text || '', data: {}, ta: null };
    const ta = h('textarea', { class: 'in', rows: 1, 'aria-label': t('issue_description'), value: row.text });
    row.ta = ta;
    ta.addEventListener('focus', () => { focused = row; });
    ta.addEventListener('input', () => {
      row.text = ta.value;
      autoGrow(ta);
      if (feats().length && /@$/.test(ta.value)) {
        ta.value = ta.value.slice(0, -1);
        row.text = ta.value;
        choose(row, ta);
      }
      changed();
    });
    ta.addEventListener('keydown', (e) => {
      if (e.isComposing) return;
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        add(api.defaultF ? [api.defaultF] : row.fs, rows.indexOf(row) + 1);
      } else if (e.key === 'Backspace' && ta.value === '' && rows.length > 1) {
        e.preventDefault();
        const i = rows.indexOf(row);
        rows.splice(i, 1);
        paint();
        const prev = rows[Math.max(0, i - 1)];
        prev.ta.focus({ preventScroll: true });
        prev.ta.setSelectionRange(prev.ta.value.length, prev.ta.value.length);
      }
    });
    return row;
  }

  function add(fs, at) {
    const row = makeRow(fs);
    rows.splice(at === undefined ? rows.length : at, 0, row);
    paint();
    row.ta.focus({ preventScroll: true });
    return row;
  }

  function paint() {
    clear(el);
    rows.forEach((row, i) => {
      const top = h('div', { class: 'irow-top' });
      if (feats().length) {
        row.fs.forEach((f) => top.append(h('span', { class: 'ftag' },
          h('button', { type: 'button', class: 'btn sm target', title: t('click_to_change_the_feature'), onclick(e) { choose(row, e.currentTarget); } }, '@ ' + label(f)),
          h('button', { type: 'button', class: 'x', title: t('remove_this_feature'), 'aria-label': t('remove_this_feature'), onclick() { row.fs = row.fs.filter((x) => !same(x, f)); paint(); } }, '✕'))));
        const more = h('button', { type: 'button', class: 'btn sm', title: t('choose_features'), onclick() { choose(row, more); } }, '＋ @');
        top.append(more);
      }
      if (o.rowTools) o.rowTools(row, paint).forEach((x) => { if (x) top.append(x); });
      top.append(h('span', { class: 'sp' }));
      if (rows.length > 1) {
        top.append(h('button', { type: 'button', class: 'x', title: t('delete'), 'aria-label': t('delete'), onclick() { rows.splice(i, 1); paint(); } }, '✕'));
      }
      const ph = typeof o.placeholder === 'function' ? o.placeholder() : o.placeholder;
      row.ta.setAttribute('placeholder', i === 0 && rows.length === 1 ? (ph || '') : '');
      const extra = o.rowExtra ? o.rowExtra(row, paint) : null;
      el.append(h('div', { class: 'irow' }, top, row.ta, extra));
    });
    el.append(h('button', { type: 'button', class: 'btn sm add-row', onclick() { add(api.defaultF ? [api.defaultF] : []); } }, '＋ ' + t('add_an_issue')));
    setTimeout(() => growAll(el), 0);
    if (o.onLayout) o.onLayout();
    changed();
  }

  // 程序自己改列表时不当作用户改动
  const silently = (fn) => { quiet = true; try { fn(); } finally { quiet = false; } };

  api.items =() => rows.filter((r) => r.text.trim()).map((r) => ({ fs: r.fs.slice(), text: r.text.trim(), data: r.data }));
  api.focusedRow = () => (focused && rows.indexOf(focused) >= 0 ? focused : rows[rows.length - 1]);
  // 功能列表更新（比如换了计划书）：行里的功能按名字对回去，对不上的去掉；没有功能的行补上 f
  api.syncTargets = (f) => {
    const list = feats();
    api.defaultF = f || null;
    rows.forEach((r) => {
      r.fs = r.fs.map((x) => list.filter((y) => same(x, y))[0]).filter(Boolean);
      if (!r.fs.length && f) r.fs = [f];
    });
    silently(paint);
  };
  api.reset = (f) => {
    rows.length = 0;
    api.defaultF = f || null;
    rows.push(makeRow(f ? [f] : []));
    silently(paint);
  };
  // 草稿：只存有内容的行；功能按编号和名字存，取回时对回当前的功能列表，对不上的去掉
  api.snapshot = () => rows.filter((r) => r.text.trim()).map((r) => ({
    text: r.text,
    fs: r.fs.map((f) => ({ no: f.no, name: f.name })),
    data: r.data,
  }));
  api.restore = (saved) => {
    const list = feats();
    const keep = (Array.isArray(saved) ? saved : []).filter((x) => x && typeof x.text === 'string' && x.text.trim());
    if (!keep.length) return false;
    const defaults = api.defaultF ? [api.defaultF] : [];
    rows.length = 0;
    keep.forEach((x) => {
      const fs = (x.fs || []).map((f) => list.filter((y) => same(f, y))[0]).filter(Boolean);
      const row = makeRow(fs.length ? fs : defaults, x.text);
      row.data = x.data && typeof x.data === 'object' ? x.data : {};
      rows.push(row);
    });
    silently(paint);
    return true;
  };
  api.addRow = (f) => add(f ? [f] : []);
  api.paint = paint;
  api.reset(null);
  return api;
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
    if (ok) kit.toast(t('copied'));
    else {
      if (ta) ta.select();
      kit.toast(t('the_browser_does_not_allow_automatic_copying'));
    }
  });
}

// 弹出一个带全文的文本框，配复制按钮
function showText(kit, title, text, hint) {
  const ta = h('textarea', { class: 'in big', readonly: true, value: text, 'aria-label': t('full_text') });
  kit.openModal({
    title,
    body: h('div', null, hint ? h('p', { class: 'hint', text: hint }) : null, ta),
    foot: (close) => [
      h('button', { type: 'button', class: 'btn', onclick: close }, t('close')),
      h('button', { type: 'button', class: 'btn primary', onclick() { copyThen(kit, text, ta); } }, t('copy')),
    ],
  });
  setTimeout(() => { autoGrow(ta); ta.select(); }, 0);
}
