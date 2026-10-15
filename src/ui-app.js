'use strict';
// 计划书页：项目情况、点一块直接修改、文件夹同步、导入导出。

const PLAN_NAMES = ['plan.md', '计划书.md'];
const ADD_LABEL = { 2: '加用法', 3: '加界面', 4: '加功能' };

function docLangOf(md) {
  return md && md.trim() ? Core.docLang(md) : LANG;
}

function sectionHint(md, sec) {
  const rows = ((SCHEMA[docLangOf(md)] || SCHEMA.zh).fields || {})[sec] || [];
  return rows.map((r) => r.name + '：' + r.purpose + (r.how ? '（' + (docLangOf(md) === 'zh' ? '例：' : 'e.g. ') + r.how + '）' : '')).join('\n');
}

function newId() {
  return 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
}

function nameError(code, kind) {
  const what = kind === 'page' ? t('界面') : t('功能');
  if (code === 'empty') return t('{what}名称不能为空。', { what });
  if (code === 'duplicate') return t('已有同名{what}，请换一个名称。', { what });
  return t('没有找到可以添加的位置。');
}

function createApp(opts) {
  const root = opts.root;
  const index = LS.get(NS + ':index', null) || { current: '', list: [] };
  const S = {
    md: '',
    past: [],
    future: [],
    collapsed: {},
    project: null,
    folder: { state: Folder.supported() ? 'none' : 'off', handle: null, name: '', path: '', synced: '', hold: false, file: PLAN_NAMES[0] },
    lastSync: '',
  };
  let typingKey = '';
  let typingAt = 0;
  let folderTimer = 0;
  let pendIndex = -1;

  const app = h('div', { class: 'app' });
  const head = h('div', { class: 'head' });
  const body = h('div', { class: 'body' });
  app.append(head, body);
  const kit = createKit(app);
  const toast = kit.toast;

  // ---------- 项目与保存 ----------

  const projectKey = (id) => NS + ':p:' + id;

  function freshFolder() {
    return { state: Folder.supported() ? 'none' : 'off', handle: null, name: '', path: '', synced: '', hold: false, file: PLAN_NAMES[0] };
  }

  function loadProject(id) {
    const rec = LS.get(projectKey(id), null) || {};
    S.md = rec.md || '';
    S.past = [];
    S.future = [];
    S.folder = freshFolder();
  }

  function saveIndex() {
    LS.set(NS + ':index', index);
  }

  function persist() {
    if (!LS.set(projectKey(S.project.id), { md: S.md, updated: Date.now() })) toast(t('浏览器存储已满，最近的修改没有保存。可以先导出。'));
    const nm = Core.titleName(S.md);
    if (nm && S.project.name !== nm) {
      S.project.name = nm;
      saveIndex();
    }
  }

  function startProject() {
    if (!index.list.length) {
      const id = newId();
      index.list.push({ id, name: opts.defaultName || t('新项目') });
      index.current = id;
      saveIndex();
    }
    let cur = index.list.filter((p) => p.id === index.current)[0];
    if (!cur) { cur = index.list[0]; index.current = cur.id; saveIndex(); }
    S.project = cur;
    loadProject(cur.id);
    folderInit();
  }

  function useProject(p) {
    S.project = p;
    index.current = p.id;
    saveIndex();
    loadProject(p.id);
    folderInit();
    renderAll();
  }

  function switchProject(id) {
    persist();
    const p = index.list.filter((x) => x.id === id)[0];
    if (p) useProject(p);
  }

  function createProject(extra) {
    persist();
    const p = Object.assign({ id: newId(), name: t('新项目') }, extra || {});
    index.list.push(p);
    useProject(p);
  }

  function deleteProject(id) {
    const p = index.list.filter((x) => x.id === id)[0];
    if (!p) return;
    const rec = LS.get(projectKey(id), null);
    const pos = index.list.indexOf(p);
    index.list.splice(pos, 1);
    LS.del(projectKey(id));
    if (!index.list.length) index.list.push({ id: newId(), name: t('新项目') });
    if (index.current === id) useProject(index.list[0]);
    else { saveIndex(); renderAll(); }
    toast(t('已删除项目「{name}」。', { name: p.name }), {
      label: t('撤销'),
      run() {
        index.list.splice(Math.min(pos, index.list.length), 0, p);
        if (rec) LS.set(projectKey(id), rec);
        saveIndex();
        useProject(p);
      },
    });
  }

  // ---------- 修改记录与撤销 ----------

  function autoStatus(md) {
    const st = Core.getStatus(md);
    return st === 'approved' || st === 'draft' ? Core.setStatus(md, 'doing') : md;
  }

  function changed() {
    persist();
    clearTimeout(folderTimer);
    if (S.folder.state === 'ready') folderTimer = setTimeout(folderPush, 600);
  }

  function commit(md, raw) {
    const next = raw ? md : autoStatus(md);
    if (next === S.md) return;
    S.past.push(S.md);
    if (S.past.length > 100) S.past.shift();
    S.future = [];
    S.md = next;
    typingKey = '';
    changed();
  }

  function typing(md, key) {
    const next = autoStatus(md);
    const now = Date.now();
    if (typingKey !== key || now - typingAt > 1500) {
      S.past.push(S.md);
      if (S.past.length > 100) S.past.shift();
      S.future = [];
    }
    typingKey = key;
    typingAt = now;
    S.md = next;
    changed();
    renderStatus();
  }

  function undo() {
    if (!S.past.length) return false;
    S.future.push(S.md);
    S.md = S.past.pop();
    typingKey = '';
    changed();
    renderAll();
    return true;
  }

  function redo() {
    if (!S.future.length) return false;
    S.past.push(S.md);
    S.md = S.future.pop();
    typingKey = '';
    changed();
    renderAll();
    return true;
  }

  // ---------- 文件夹 ----------

  async function findPlan(handle) {
    for (const name of PLAN_NAMES) {
      const text = await Folder.read(handle, [], name);
      if (text != null) return { name, text };
    }
    return { name: PLAN_NAMES[0], text: null };
  }

  async function folderInit() {
    if (!Folder.supported()) return;
    const pid = S.project.id;
    try {
      let handle = null;
      if (S.project.path && SERVER) handle = { server: true, root: S.project.path, name: S.project.name };
      else if (!SERVER) handle = await kvGet('handle:' + NS + ':' + pid);
      if (!handle || S.project.id !== pid) return;
      S.folder.handle = handle;
      S.folder.name = handle.name || S.project.name;
      S.folder.path = handle.server ? handle.root : '';
      const ok = await Folder.permission(handle, false);
      S.folder.state = ok ? 'ready' : 'need';
      renderAll();
      if (ok) await folderPull(false, false);
    } catch (e) {
      S.folder.state = Folder.supported() ? 'none' : 'off';
    }
  }

  async function connectHandle(handle) {
    S.folder.handle = handle;
    S.folder.name = handle.name;
    S.folder.path = handle.server ? handle.root : '';
    S.folder.state = 'ready';
    S.folder.synced = '';
    renderAll();
    await folderPull(true, false);
  }

  async function folderConnect() {
    if (SERVER) { openFolders(); return; }
    let handle;
    try {
      handle = await Folder.pick();
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      toast(t('没有打开文件夹：{why}', { why: errText(e) }));
      return;
    }
    try { await kvSet('handle:' + NS + ':' + S.project.id, handle); } catch (e) { toast(t('授权没有记住，下次打开需要重新选择文件夹。')); }
    await connectHandle(handle);
  }

  // 本机服务：把某个文件夹变成一个项目并连接
  async function connectFolderPath(path) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path });
    } catch (e) {
      toast(t('没有打开文件夹：{why}', { why: errText(e) }));
      return;
    }
    let p = index.list.filter((x) => x.path && x.path.toLowerCase() === r.path.toLowerCase())[0];
    persist();
    if (!p) {
      p = { id: newId(), name: r.summary && r.summary.title ? r.summary.title : r.name, path: r.path };
      index.list.push(p);
    }
    useProject(p);
  }

  async function folderRegrant() {
    if (!S.folder.handle) return;
    try {
      const ok = await Folder.permission(S.folder.handle, true);
      S.folder.state = ok ? 'ready' : 'need';
      renderAll();
      if (ok) await folderPull(true, false);
    } catch (e) {
      toast(t('授权没有完成：{why}', { why: errText(e) }));
    }
  }

  async function folderDisconnect() {
    if (!SERVER) { try { await kvDel('handle:' + NS + ':' + S.project.id); } catch (e) { /* 句柄已不存在 */ } }
    delete S.project.path;
    saveIndex();
    S.folder = freshFolder();
    renderAll();
    toast(t('已断开文件夹。'));
  }

  async function folderPush() {
    if (S.folder.state !== 'ready' || S.folder.hold || !S.md.trim()) return;
    const text = S.md;
    try {
      await Folder.write(S.folder.handle, [], S.folder.file, text);
      S.folder.synced = text;
    } catch (e) {
      toast(t('保存到文件夹失败：{why}', { why: errText(e) }));
    }
  }

  // silent：自动检查时不弹提示；有文字框正在编辑时不替换页面
  async function folderPull(manual, silent) {
    if (S.folder.state !== 'ready' || S.folder.hold) return;
    let found;
    try {
      found = await findPlan(S.folder.handle);
    } catch (e) {
      if (!silent) toast(t('读取文件夹失败：{why}', { why: errText(e) }));
      return;
    }
    S.folder.file = found.name;
    const text = found.text;
    if (text == null) {
      if (S.md.trim()) await folderPush();
      else if (manual) toast(t('文件夹里还没有计划书。'));
      return;
    }
    if (text === S.md) {
      S.folder.synced = text;
      if (manual) toast(t('已是最新。'));
      return;
    }
    if (!S.md.trim() || S.md === S.folder.synced) {
      if (silent && body.querySelector('textarea')) return;
      S.folder.synced = text;
      commit(text, true);
      S.lastSync = clockText();
      renderAll();
      if (!silent) toast(t('已读入文件夹里的计划书。'), { label: t('撤销'), run: () => { undo(); folderPush(); } });
      return;
    }
    if (text === S.folder.synced) { await folderPush(); return; }
    if (silent && body.querySelector('textarea')) return;
    folderConflict(text);
  }

  function clockText() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0');
  }

  function folderConflict(fileText) {
    S.folder.hold = true;
    const release = () => { S.folder.hold = false; };
    kit.openModal({
      title: t('文件夹里的计划书不一样'),
      body: h('p', { class: 'p', text: t('页面里和文件夹里的计划书都有改动，选择保留哪一份。另一份可以在撤销里找回。') }),
      onClose: release,
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick() { release(); close(); } }, t('先不处理')),
        h('button', { type: 'button', class: 'btn', onclick() { release(); close(); folderPush(); } }, t('用页面里的')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          release(); close();
          S.folder.synced = fileText;
          commit(fileText, true);
          renderAll();
        } }, t('用文件夹里的')),
      ],
    });
  }

  // 本机服务打开时的文件夹列表：最近在用 Claude 的、连接过的、别的
  function openFolders() {
    const box = h('div', { class: 'folders' });
    folderRows(box, {
      kit,
      current: S.folder.path,
      onPick: (path) => { m.close(); connectFolderPath(path); },
      onBrowse: async () => {
        try {
          const r = await Api.call('POST', '/api/pick', {});
          if (r.path) { m.close(); connectFolderPath(r.path); }
        } catch (e) {
          toast(t('没有打开文件夹：{why}', { why: errText(e) }));
        }
      },
    });
    const m = kit.openModal({ title: t('选择文件夹'), body: box });
  }

  // ---------- 文字显示 ----------

  function headingNumbers(lines) {
    const set = {};
    lines.forEach((l) => {
      const ti = Core.info(l);
      if (ti.kind !== 'h') return;
      const m = /^(\d+(?:\.\d+)?)\b/.exec(ti.body);
      if (m) set[m[1]] = true;
    });
    return set;
  }

  function openFolds(el) {
    let p = el.parentElement;
    while (p && p !== body) {
      if (p.classList.contains('sec') && p.classList.contains('closed')) { p.classList.remove('closed'); growAll(p); }
      p = p.parentElement;
    }
  }

  function jumpTo(selector) {
    const el = body.querySelector(selector);
    if (!el) return;
    openFolds(el);
    el.scrollIntoView({ block: 'start' });
  }

  function inline(text, nums) {
    const frag = document.createDocumentFragment();
    const re = /((?:待补|TBD)[：:][^；;。\n]*|〈[^〉]*〉|\d+\.\d+)/g;
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      const tok = m[0];
      if (m.index > last) frag.append(document.createTextNode(text.slice(last, m.index)));
      const prev = m.index > 0 ? text.charAt(m.index - 1) : '';
      if (/^(?:待补|TBD)/.test(tok)) frag.append(h('span', { class: 'pend', text: tok }));
      else if (tok.charAt(0) === '〈') frag.append(h('span', { class: 'ph', text: tok }));
      else if (nums[tok] && !/[\d.]/.test(prev)) frag.append(h('button', { type: 'button', class: 'ref', onclick() { jumpTo('[data-no="' + tok + '"]'); } }, tok));
      else frag.append(document.createTextNode(tok));
      last = m.index + tok.length;
    }
    if (last < text.length) frag.append(document.createTextNode(text.slice(last)));
    return frag;
  }

  function renderLines(text, nums, lang) {
    const lines = Core.split(text);
    const wrap = h('div', { class: 'lines' });
    const tbd = lang === 'zh' ? '待补：缺' : 'TBD: missing ';
    lines.forEach((l, i) => {
      const ti = Core.info(l);
      if (ti.kind === 'blank' || ti.kind === 'hr') return;
      if (ti.kind === 'li') {
        const lv = Core.splitLabel(ti.body);
        const row = h('div', { class: 'li', style: 'margin-left:' + Math.min(6, Math.floor(ti.indent / 2)) * 1.1 + 'em' }, h('span', { class: 'mk', text: ti.ordered ? ti.marker : '•' }));
        const tx = h('span', { class: 'tx' });
        if (lv) tx.append(h('span', { class: 'lb', text: lv.label + (lang === 'zh' ? '：' : ': ') }), inline(lv.value, nums));
        else tx.append(inline(ti.body, nums));
        row.append(tx);
        wrap.append(row);
        return;
      }
      const lv = Core.splitLabel(ti.body);
      const row = h('div', { class: 'kv' });
      if (lv) {
        row.append(h('span', { class: 'lb', text: lv.label + (lang === 'zh' ? '：' : ': ') }));
        let nx = i + 1;
        while (nx < lines.length && Core.info(lines[nx]).kind === 'blank') nx++;
        const hasList = nx < lines.length && Core.info(lines[nx]).kind === 'li';
        if (lv.value.trim() === '' && !hasList) row.append(h('span', { class: 'pend', text: tbd + lv.label }));
        else row.append(inline(lv.value, nums));
      } else row.append(inline(ti.body, nums));
      wrap.append(row);
    });
    return wrap;
  }

  // 块的位置按元素上的 data-line 读；增删行后后面的块被平移
  function shiftLines(after, delta) {
    if (!delta) return;
    Array.prototype.forEach.call(body.querySelectorAll('[data-line]'), (el) => {
      const n = Number(el.getAttribute('data-line'));
      if (n > after) el.setAttribute('data-line', String(n + delta));
    });
  }

  // 点一下变成大填写框，点框外保存
  function makeBox(line, sec, nums) {
    const el = h('div', { class: 'box', 'data-line': line, tabindex: 0, role: 'button', 'aria-label': t('点击修改') });
    const at = () => Number(el.getAttribute('data-line'));
    const paint = () => {
      clear(el);
      const text = Core.bodyText(Core.split(S.md), at());
      if (!text.trim()) el.append(h('div', { class: 'hint-note' }, t('点这里填写。')), h('pre', { class: 'hint-lines', text: sectionHint(S.md, sec) }));
      else el.append(renderLines(text, nums, docLangOf(S.md)));
    };
    const edit = () => {
      if (el.querySelector('textarea')) return;
      const text = Core.bodyText(Core.split(S.md), at());
      const ta = h('textarea', { class: 'in big', placeholder: sectionHint(S.md, sec), value: text, 'aria-label': t('内容') });
      ta.addEventListener('input', () => {
        autoGrow(ta);
        const before = Core.split(S.md).length;
        typing(Core.setBody(S.md, at(), ta.value), 'b' + at());
        shiftLines(at(), Core.split(S.md).length - before);
      });
      ta.addEventListener('blur', paint);
      ta.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); ta.blur(); } });
      clear(el);
      el.append(ta);
      autoGrow(ta);
      ta.focus();
    };
    el.addEventListener('click', (e) => { if (!e.target.closest('button') && !el.querySelector('textarea')) edit(); });
    el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); edit(); } });
    el.edit = edit;
    paint();
    return el;
  }

  function nameSlot(label, placeholder, run) {
    const slot = h('div', { class: 'addslot' });
    const showButton = () => {
      clear(slot);
      slot.append(h('button', { type: 'button', class: 'btn', onclick: showForm }, '＋ ' + label));
    };
    const showForm = () => {
      clear(slot);
      const input = h('input', { class: 'in', placeholder, 'aria-label': placeholder });
      const err = h('p', { class: 'err', style: 'display:none' });
      const go = () => {
        const r = run(input.value);
        if (r && !r.ok) { err.textContent = r.error; err.style.display = ''; input.focus(); }
      };
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); go(); }
        if (e.key === 'Escape') { e.stopPropagation(); showButton(); }
      });
      slot.append(h('div', { class: 'addrow' }, input,
        h('button', { type: 'button', class: 'btn primary', onclick: go }, t('添加')),
        h('button', { type: 'button', class: 'btn', onclick: showButton }, t('取消'))), err);
      input.focus();
    };
    showButton();
    return slot;
  }

  function afterAdd(line) {
    renderBody();
    const el = body.querySelector('[data-line="' + line + '"]');
    if (!el) return;
    openFolds(el);
    el.scrollIntoView({ block: 'center' });
    const box = el.classList.contains('box') ? el : el.querySelector('.box');
    if (box && box.edit) box.edit();
  }

  function renameInline(btn, current, run) {
    const input = h('input', { class: 'in', value: /〈/.test(current) ? '' : current, placeholder: t('名称'), 'aria-label': t('名称') });
    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      if (save && input.value.trim() !== current) run(input.value);
      renderAll();
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') finish(true); if (e.key === 'Escape') { e.stopPropagation(); finish(false); } });
    input.addEventListener('blur', () => finish(true));
    btn.replaceWith(input);
    input.focus();
    input.select();
  }

  // 项目情况：每个功能做什么、做到哪一步
  function renderProgress() {
    const list = Core.progressList(S.md);
    if (!list.length) return null;
    const lang = docLangOf(S.md);
    const W = Core.WORDS[lang].progress;
    const done = list.filter((x) => x.status === 'done').length;
    const doing = list.filter((x) => x.status === 'doing').length;
    const box = h('section', { class: 'status-box' });
    box.append(h('div', { class: 'status-head' },
      h('h2', { text: t('项目情况') }),
      h('span', { class: 'muted', text: t('已完成 {done} / {total}，进行中 {doing}', { done, total: list.length, doing }) })));
    box.append(h('div', { class: 'bar-track' },
      h('span', { class: 'bar-done', style: 'width:' + (done / list.length) * 100 + '%' }),
      h('span', { class: 'bar-doing', style: 'width:' + (doing / list.length) * 100 + '%' })));
    list.forEach((f) => {
      const chip = h('button', { type: 'button', class: 'prog ' + f.status, title: t('点击切换进度') }, W[f.status]);
      chip.addEventListener('click', () => {
        commit(Core.setProgress(S.md, f.line, Core.nextProgress(f.status)));
        renderAll();
      });
      box.append(h('div', { class: 'status-row' },
        h('div', { class: 'status-name' },
          h('button', { type: 'button', class: 'ref', onclick() { jumpTo('[data-no="' + f.no + '"]'); } }, (f.no ? f.no + ' ' : '') + f.name),
          f.what ? h('span', { class: 'muted', text: f.what }) : null),
        chip));
    });
    return box;
  }

  function renderPlan() {
    const lines = Core.split(S.md);
    const nums = headingNumbers(lines);
    const hs = Core.headings(lines);
    const lang = docLangOf(S.md);
    const doc = h('div', { class: 'doc' });
    const title = hs.filter((x) => x.level === 1)[0];
    if (title) {
      const nm = Core.titleName(S.md);
      const nameBtn = h('button', { type: 'button', class: 'title', 'data-line': title.line, title: t('点击改名') }, nm || t('未命名项目'));
      nameBtn.addEventListener('click', () => renameInline(nameBtn, nm, (v) => { if (v.trim()) commit(Core.setTitle(S.md, v)); }));
      doc.append(h('h1', null, nameBtn));
    }
    doc.append(h('div', { class: 'statusline' }));
    const prog = renderProgress();
    if (prog) doc.append(prog);
    let secBody = null;
    hs.forEach((x, idx) => {
      if (x.level === 2) {
        const no = (/^(\d+)\b/.exec(x.body) || [])[1] || '';
        const secEl = h('section', { class: 'sec' + (S.collapsed[x.body] ? ' closed' : ''), 'data-line': x.line, 'data-no': no });
        const fold = h('button', { type: 'button', class: 'fold', 'aria-label': t('展开或收起') }, S.collapsed[x.body] ? '▸' : '▾');
        fold.addEventListener('click', () => {
          const closed = secEl.classList.toggle('closed');
          S.collapsed[x.body] = closed;
          fold.textContent = closed ? '▸' : '▾';
          if (!closed) growAll(secEl);
        });
        secEl.append(h('div', { class: 'sec-head' }, h('h2', null, inline(x.body, nums)), fold));
        secBody = h('div', { class: 'sec-body' });
        secEl.append(secBody);
        const next = hs[idx + 1];
        const hasChildren = next && next.level >= 3;
        if (!hasChildren || Core.bodyText(lines, x.line).trim() !== '') secBody.append(makeBox(x.line, no, nums));
        if (ADD_LABEL[no]) {
          const slot = no === '2'
            ? h('div', { class: 'addslot' }, h('button', { type: 'button', class: 'btn', onclick() {
              const r = Core.addFlowLine(S.md);
              if (r.ok) { commit(r.md); afterAdd(x.line); }
            } }, '＋ ' + t(ADD_LABEL[no])))
            : nameSlot(t(ADD_LABEL[no]), no === '3' ? t('界面名称') : t('功能名称'), (name) => {
              const kind = no === '3' ? 'page' : 'feature';
              const r = Core.addBlock(S.md, kind, name);
              if (!r.ok) return { ok: false, error: nameError(r.code, kind) };
              commit(r.md);
              afterAdd(r.line);
              return r;
            });
          secBody.append(slot);
        }
        doc.append(secEl);
      } else if (x.level === 3 && secBody) {
        const no = (/^(\d+\.\d+)\b/.exec(x.body) || [])[1] || '';
        const sec = (/^(\d+)\./.exec(no) || [])[1] || '';
        const card = h('div', { class: 'blk', 'data-line': x.line, 'data-no': no });
        const titleText = x.body.replace(/^\d+\.\d+\s*/, '');
        const nameBtn = h('button', { type: 'button', class: 'blk-title', title: t('点击改名') },
          h('span', { class: 'no', text: no }), titleText && !/〈/.test(titleText) ? h('span', { text: titleText }) : h('span', { class: 'ph', text: t('名称') }));
        nameBtn.addEventListener('click', () => renameInline(nameBtn, titleText, (v) => {
          const r = Core.renameBlock(S.md, Number(card.getAttribute('data-line')), v);
          if (r.ok) commit(r.md); else toast(nameError(r.code, sec === '3' ? 'page' : 'feature'));
        }));
        const del = h('button', { type: 'button', class: 'x', title: t('删除'), 'aria-label': t('删除'), onclick() {
          commit(Core.join(Core.deleteSubtree(Core.split(S.md), Number(card.getAttribute('data-line')))));
          renderAll();
          toast(t('已删除。'), { label: t('撤销'), run: () => undo() });
        } }, '✕');
        card.append(h('div', { class: 'blk-head' }, nameBtn, del), makeBox(x.line, sec, nums));
        const slot = secBody.querySelector('.addslot');
        if (slot) secBody.insertBefore(card, slot); else secBody.append(card);
      }
    });
    return doc;
  }

  // ---------- 导入、导出、复制 ----------

  function exportText() {
    return Core.normalizeForExport(S.md);
  }

  function exportPlan() {
    if (!S.md.trim()) { toast(t('还没有内容可以导出。')); return; }
    const base = (S.project.name || 'plan').replace(/[\\/:*?"<>|\s]+/g, '-');
    toast(t('已导出：{name}', { name: download(exportText(), base, 'md') }));
  }

  function openImport() {
    const ta = h('textarea', { class: 'in big', placeholder: t('把写好的计划书粘贴在这里，或选择文件。'), 'aria-label': t('导入内容') });
    const file = h('input', { type: 'file', accept: '.md,.txt,text/markdown,text/plain', style: 'position:fixed;left:0;top:0;opacity:0;width:1px;height:1px' });
    file.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      readText(f).then((txt) => { ta.value = txt; autoGrow(ta); }, () => toast(t('这个文件读不出来，请确认是文本文件。')));
    });
    app.append(file);
    kit.openModal({
      title: t('导入'),
      body: ta,
      onClose() { file.remove(); },
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('取消')),
        h('button', { type: 'button', class: 'btn', onclick: () => file.click() }, t('选择文件')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          if (!ta.value.trim()) { toast(t('请先粘贴内容或选择文件。')); return; }
          close();
          importText(ta.value);
        } }, t('导入')),
      ],
    });
    setTimeout(() => ta.focus(), 0);
  }

  function importText(text) {
    const txt = text.replace(/\r\n?/g, '\n');
    if (!/^##\s+\d/m.test(txt)) {
      const zh = LANG === 'zh';
      const wrapped = [zh ? '# 计划书：' + (S.project.name || '〈项目名〉') : '# Plan: ' + (S.project.name || '〈Project name〉'), '',
        zh ? '状态：整理中　　更新：' + Core.today() : 'Status: In progress　　Updated: ' + Core.today(), '',
        zh ? '## 未识别' : '## Not recognised', ''].concat(txt.split('\n')).join('\n');
      commit(wrapped, true);
      renderAll();
      toast(t('没有认出计划书的格式，原文已放进「未识别」。'), { label: t('撤销'), run: () => undo() });
      return;
    }
    commit(txt, true);
    renderAll();
    toast(t('已导入计划书。'), { label: t('撤销'), run: () => undo() });
  }

  function newBlank() {
    commit(Core.blankPlan(SCHEMA[LANG].planTemplate, S.project.name === t('新项目') ? '' : S.project.name, Core.today()), true);
    renderAll();
    toast(t('已新建计划书。'), { label: t('撤销'), run: () => undo() });
  }

  function loadExample() {
    commit(SCHEMA[LANG].example, true);
    renderAll();
    toast(t('已载入示例。'), { label: t('撤销'), run: () => undo() });
  }

  function openAiPrompt() {
    const note = h('textarea', { class: 'in', rows: 3, placeholder: t('想做什么，随手写就行。'), 'aria-label': t('你的话') });
    const out = h('textarea', { class: 'in big', readonly: true, 'aria-label': t('给 AI 的话') });
    const refresh = () => { out.value = Core.buildAiPrompt(S.md, SCHEMA, note.value, LANG); autoGrow(out); };
    note.addEventListener('input', () => { autoGrow(note); refresh(); });
    kit.openModal({
      title: t('复制给 AI 的话'),
      body: h('div', null, h('div', { class: 'field' }, h('div', { class: 'fl', text: t('你的话') }), note), h('div', { class: 'field' }, h('div', { class: 'fl', text: t('发给 AI 的内容') }), out)),
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('关闭')),
        h('button', { type: 'button', class: 'btn primary', onclick() { copyThen(kit, out.value, out); } }, t('复制')),
      ],
    });
    refresh();
  }

  // ---------- 页面外壳 ----------

  function pendJump() {
    const els = Array.prototype.slice.call(body.querySelectorAll('.pend'));
    if (!els.length) return;
    pendIndex = (pendIndex + 1) % els.length;
    const el = els[pendIndex];
    openFolds(el);
    el.scrollIntoView({ block: 'center' });
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1400);
  }

  function renderStatus() {
    const box = body.querySelector('.statusline');
    if (!box) return;
    clear(box);
    const lang = docLangOf(S.md);
    const code = Core.getStatus(S.md) || 'doing';
    const n = Core.countPending(S.md);
    box.append(h('span', { class: 'state' + (code === 'approved' ? ' pass' : ''), text: Core.statusLabel(code, lang) }));
    if (n > 0) box.append(h('button', { type: 'button', class: 'btn sm', onclick: pendJump }, t('还有 {n} 处待补', { n })));
    else box.append(h('span', { class: 'muted', text: t('没有待补') }));
    if (code !== 'approved') {
      box.append(h('button', { type: 'button', class: 'btn sm primary', onclick() {
        const r = Core.markPassed(S.md);
        if (!r.ok) { toast(t('还有 {n} 处待补，补完才能通过。', { n: r.pending })); return; }
        commit(r.md, true);
        renderAll();
        toast(t('计划书已通过，可以开始做。'));
      } }, t('标记为已通过')));
    }
    if (S.folder.state === 'ready') {
      box.append(h('span', { class: 'muted', text: t('文件夹：{name}', { name: S.folder.name }) + (S.lastSync ? '　' + t('同步于 {time}', { time: S.lastSync }) : '') }));
      if (S.folder.path) {
        box.append(h('button', { type: 'button', class: 'btn sm', title: S.folder.path, onclick() { copyThen(kit, S.folder.path); } }, t('复制地址')));
      }
    }
  }

  function openToc(anchor) {
    kit.openPop(anchor, (pop, close) => {
      Core.headings(Core.split(S.md)).filter((x) => x.level === 2 || x.level === 3).forEach((x) => {
        pop.append(h('button', { type: 'button', style: x.level === 3 ? 'padding-left:1.6em' : 'font-weight:700', onclick() {
          close();
          jumpTo('[data-line="' + x.line + '"]');
        } }, x.body));
      });
    });
  }

  function openMenu(anchor) {
    kit.openPop(anchor, (pop) => {
      const add = (l, run, ex) => pop.append(kit.popItem(l, run, ex));
      const f = S.folder;
      const has = S.md.trim() !== '';
      if (has) {
        add(t('目录'), () => openToc(anchor));
        add(t('复制全文'), () => showText(kit, t('计划书全文'), exportText(), t('复制后发给 AI。')));
        add(t('复制给 AI 的话'), openAiPrompt);
        add(t('导出'), exportPlan);
        pop.append(h('hr'));
      }
      add(t('看示例'), loadExample);
      add(t('新建空白计划书'), newBlank);
      add(t('导入'), openImport);
      if (has) {
        add(t('撤销'), () => { if (!undo()) toast(t('没有可撤销的修改。')); });
        add(t('重做'), () => { if (!redo()) toast(t('没有可重做的修改。')); });
      }
      pop.append(h('hr'));
      if (f.state === 'off') add(t('文件夹功能需要电脑上的 Chrome 或 Edge'), () => {}, { disabled: true });
      else if (f.state === 'none') add(t('连接文件夹'), folderConnect);
      else if (f.state === 'need') add(t('重新授权文件夹'), folderRegrant);
      else {
        if (SERVER) add(t('换一个文件夹'), openFolders);
        add(t('刷新'), () => folderPull(true, false));
        add(t('断开文件夹'), folderDisconnect);
      }
      pop.append(h('hr'));
      index.list.forEach((p) => {
        pop.append(h('div', { class: 'row2' },
          h('button', { type: 'button', class: p.id === S.project.id ? 'on' : '', onclick() { kit.closePop(); if (p.id !== S.project.id) switchProject(p.id); } }, p.name),
          h('button', { type: 'button', class: 'x', title: t('删除项目'), onclick() { kit.closePop(); deleteProject(p.id); } }, '✕')));
      });
      add(t('新项目'), () => createProject());
      pop.append(h('hr'));
      add(LANG === 'zh' ? 'English' : '中文', () => { setLang(LANG === 'zh' ? 'en' : 'zh'); renderAll(); });
    });
  }

  function renderHead() {
    clear(head);
    const logo = document.createElement('span');
    logo.className = 'logo';
    logo.innerHTML = ICON_SVG;
    head.append(h('div', { class: 'in' },
      h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('prompt 计划书助手') })),
      h('span', { class: 'sp' }),
      h('button', { type: 'button', class: 'x more', title: t('更多'), 'aria-label': t('更多'), onclick(e) { openMenu(e.currentTarget); } }, '⋯')));
  }

  function renderBody() {
    const st = body.scrollTop;
    kit.closePop();
    clear(body);
    let content;
    if (!S.md.trim()) {
      content = h('div', { class: 'col' }, h('div', { class: 'empty' },
        h('p', { text: t('还没有计划书。新建一份，看一份示例，或导入写好的计划书。') }),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn primary', onclick: newBlank }, t('新建空白计划书')),
          h('button', { type: 'button', class: 'btn', onclick: loadExample }, t('看示例')),
          h('button', { type: 'button', class: 'btn', onclick: () => openImport() }, t('导入')),
          Folder.supported() && S.folder.state !== 'ready' ? h('button', { type: 'button', class: 'btn', onclick: folderConnect }, t('连接文件夹')) : null)));
    } else {
      content = h('div', { class: 'col' }, renderPlan());
    }
    body.append(content);
    growAll(body);
    body.scrollTop = st;
    pendIndex = -1;
    renderStatus();
  }

  function renderAll() {
    renderHead();
    renderBody();
  }

  // ---------- 快捷键与自动更新 ----------

  function inField(e) {
    const el = e.composedPath ? e.composedPath()[0] : e.target;
    return el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (kit.escape()) e.preventDefault(); return; }
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    if (k === 's') {
      e.preventDefault();
      if (S.folder.state === 'ready') folderPush().then(() => toast(t('已保存。')));
      else toast(t('已保存在浏览器里。'));
      return;
    }
    if (inField(e)) return;
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); if (!undo()) toast(t('没有可撤销的修改。')); }
    else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); if (!redo()) toast(t('没有可重做的修改。')); }
  });
  body.addEventListener('scroll', kit.closePop);
  let growTimer = 0;
  window.addEventListener('resize', () => {
    kit.closePop();
    clearTimeout(growTimer);
    growTimer = setTimeout(() => growAll(body), 120);
  });
  window.addEventListener('focus', () => folderPull(false, true));
  // 文件夹里的计划书一变，页面跟着更新
  setInterval(() => {
    if (document.visibilityState === 'visible' && S.folder.state === 'ready') folderPull(false, true);
  }, 3000);

  startProject();
  if (SERVER && opts.folder) connectFolderPath(opts.folder);
  renderAll();

  return {
    el: app,
    refresh: () => folderPull(false, true),
    state: () => S,
  };
}
