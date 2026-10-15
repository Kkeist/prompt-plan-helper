'use strict';
// 计划书页：项目情况、点一块直接修改、文件夹同步、导入导出。

const PLAN_NAMES = ['plan.md', '计划书.md'];
const ADD_LABEL = { 2: '加用法', 3: '加页面', 4: '加功能' };

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
  const what = kind === 'page' ? t('页面') : t('功能');
  if (code === 'empty') return t('{what}名称不能为空。', { what });
  if (code === 'duplicate') return t('已有同名{what}，请换一个名称。', { what });
  return t('没有找到可以添加的位置。');
}

// 桌面窗口：打开时是贴在屏幕右下角的小窗口，之后切换标签、打开计划书都不改变大小和位置
const WINDOW_MODE = !!SERVER && new URLSearchParams(location.search).get('win') === '1';
const WINDOW_SIZE = { w: 360, h: 480 };

function placeWindow() {
  if (!WINDOW_MODE) return;
  window.resizeTo(WINDOW_SIZE.w, WINDOW_SIZE.h);
  window.moveTo((screen.availLeft || 0) + screen.availWidth - WINDOW_SIZE.w - 12, (screen.availTop || 0) + screen.availHeight - WINDOW_SIZE.h - 12);
}

function createApp(opts) {
  const root = opts.root;
  const index = LS.get(NS + ':index', null) || { current: '', list: [], open: [] };
  if (!index.open) index.open = [];
  const S = {
    md: '',
    past: [],
    future: [],
    collapsed: {},
    view: 'plan',
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
    if (!LS.set(projectKey(S.project.id), { md: S.md, updated: Date.now() })) toast(t('浏览器存储空间已满，最近的修改未保存，请先导出。'));
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
    if (index.open.indexOf(cur.id) < 0) index.open.push(cur.id);
    index.open = index.open.filter((id) => index.list.some((p) => p.id === id));
    saveIndex();
    loadProject(cur.id);
    folderInit();
    // 有桌面服务时，窗口一打开先看最近的文件夹
    if (SERVER && !opts.folder && (new URLSearchParams(location.search).get('view') === 'hub' || WINDOW_MODE)) {
      S.view = 'hub';
      // 还没写过内容、也没连文件夹的空项目不占标签
      if (!S.md.trim() && !S.project.path) {
        index.open = index.open.filter((id) => id !== S.project.id);
        saveIndex();
      }
    }
  }

  // 打开一个项目：加到标签里并切过去
  function useProject(p) {
    S.project = p;
    S.view = 'plan';
    index.current = p.id;
    if (index.open.indexOf(p.id) < 0) index.open.push(p.id);
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

  function showHub() {
    persist();
    S.view = 'hub';
    renderAll();
  }

  // 关掉一个标签：项目还在，可以从「更多」里再打开
  function closeTab(id) {
    persist();
    const at = index.open.indexOf(id);
    if (at < 0) return;
    index.open.splice(at, 1);
    saveIndex();
    if (S.view === 'plan' && S.project.id === id) {
      const nextId = index.open[Math.min(at, index.open.length - 1)];
      const p = index.list.filter((x) => x.id === nextId)[0];
      if (p) useProject(p);
      else if (SERVER) showHub();
      else createProject();
    } else renderAll();
  }

  function deleteProject(id) {
    const p = index.list.filter((x) => x.id === id)[0];
    if (!p) return;
    const rec = LS.get(projectKey(id), null);
    const pos = index.list.indexOf(p);
    index.list.splice(pos, 1);
    index.open = index.open.filter((x) => x !== id);
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
      else handle = await kvGet('handle:' + NS + ':' + pid);
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
    if (SERVER) { showHub(); return; }
    let handle;
    try {
      handle = await Folder.pick();
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      toast(t('无法打开文件夹：{why}', { why: errText(e) }));
      return;
    }
    try { await kvSet('handle:' + NS + ':' + S.project.id, handle); } catch (e) { toast(t('未能保存文件夹授权，下次打开需要重新选择文件夹。')); }
    await connectHandle(handle);
  }

  // 本机服务：把某个文件夹变成一个项目并连接
  async function connectFolderPath(path) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path });
    } catch (e) {
      toast(t('无法打开文件夹：{why}', { why: errText(e) }));
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

  // 新建计划书：先不放进文件夹，写好以后用「保存到文件夹」存
  function newPlanHere() {
    persist();
    const p = { id: newId(), name: t('新项目') };
    index.list.push(p);
    useProject(p);
    newBlank();
  }

  function apiStatus(e) {
    return Number((/ (\d+)$/.exec(e && e.message) || [])[1] || 0);
  }

  // 先选放在哪里，再起名字，创建后交给 then(路径)
  async function newFolderFlow(then) {
    let where;
    try {
      where = await Api.call('POST', '/api/pick', { description: t('选择新文件夹放在哪里。') });
    } catch (e) {
      toast(t('无法打开文件夹：{why}', { why: errText(e) }));
      return;
    }
    if (!where.path) return;
    const input = h('input', { class: 'in', placeholder: t('文件夹名称'), 'aria-label': t('文件夹名称') });
    const err = h('p', { class: 'err', style: 'display:none' });
    let closeModal = null;
    const go = async () => {
      err.style.display = 'none';
      try {
        const r = await Api.call('POST', '/api/mkdir', { parent: where.path, name: input.value });
        closeModal();
        then(r.path);
      } catch (e) {
        const st = apiStatus(e);
        err.textContent = st === 409 ? t('已有同名文件夹，请换一个名称。') : st === 400 ? t('名称不能为空，也不能包含 / : * ? " < > | 这些符号。') : t('无法新建文件夹：{why}', { why: errText(e) });
        err.style.display = '';
        input.focus({ preventScroll: true });
      }
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    kit.openModal({
      title: t('新建文件夹'),
      small: true,
      body: h('div', null, h('p', { class: 'muted', text: where.path }), input, err),
      foot: (close) => {
        closeModal = close;
        return [
          h('button', { type: 'button', class: 'btn', onclick: close }, t('取消')),
          h('button', { type: 'button', class: 'btn primary', onclick: go }, t('创建')),
        ];
      },
    });
    setTimeout(() => input.focus({ preventScroll: true }), 0);
  }

  async function pickFolderPath() {
    try {
      const r = await Api.call('POST', '/api/pick', { description: t('选择计划书所在的文件夹。') });
      return r.path || '';
    } catch (e) {
      toast(t('无法打开文件夹：{why}', { why: errText(e) }));
      return '';
    }
  }

  // 把当前的计划书存进一个文件夹；文件夹里已有计划书时让用户选，不直接覆盖
  async function attachFolderPath(path) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path });
    } catch (e) {
      toast(t('无法打开文件夹：{why}', { why: errText(e) }));
      return;
    }
    const attach = async (useFolderPlan) => {
      S.project.path = r.path;
      saveIndex();
      S.folder = Object.assign(freshFolder(), { handle: { server: true, root: r.path, name: r.name }, name: r.name, path: r.path, state: 'ready' });
      if (useFolderPlan) {
        const found = await findPlan(S.folder.handle);
        S.folder.file = found.name;
        S.folder.synced = found.text;
        commit(found.text, true);
        S.lastSync = clockText();
        renderAll();
        toast(t('已载入文件夹中的计划书。'), { label: t('撤销'), run: () => undo() });
      } else {
        await folderPush();
        S.lastSync = clockText();
        renderAll();
        toast(t('已保存到文件夹「{name}」。', { name: r.name }));
      }
    };
    if (!r.summary) { attach(false); return; }
    kit.openModal({
      title: t('这个文件夹里已有计划书'),
      small: true,
      body: h('p', { class: 'p', text: t('用哪一份？选「用当前的替换」会替换文件夹里的计划书。') }),
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('取消')),
        h('button', { type: 'button', class: 'btn', onclick() { close(); attach(true); } }, t('用文件夹里的')),
        h('button', { type: 'button', class: 'btn primary', onclick() { close(); attach(false); } }, t('用当前的替换')),
      ],
    });
  }

  function openSaveTo(anchor) {
    kit.openPop(anchor, (pop, close) => {
      pop.append(kit.popItem(t('选择已有文件夹'), async () => {
        const path = await pickFolderPath();
        if (path) attachFolderPath(path);
      }));
      pop.append(kit.popItem(t('新建文件夹'), () => newFolderFlow(attachFolderPath)));
    });
  }

  // 拖入文件夹：服务按名字和里面的文件找到它的地址；找不到就直接用浏览器授权的方式打开
  async function dropFolder(dt) {
    const item = dt.items && dt.items[0];
    if (!item || item.kind !== 'file') { toast(t('请拖入文件夹，不是文件。')); return; }
    if (!item.getAsFileSystemHandle) { toast(t('这个浏览器不支持拖入文件夹，请使用「选择别的文件夹」。')); return; }
    let handle;
    const entries = [];
    try {
      handle = await item.getAsFileSystemHandle();
      if (handle && handle.kind === 'directory' && SERVER) {
        for await (const pair of handle.entries()) { entries.push(pair[0]); if (entries.length >= 200) break; }
      }
    } catch (e) {
      toast(t('无法读取拖入的内容：{why}', { why: errText(e) }));
      return;
    }
    if (!handle || handle.kind !== 'directory') { toast(t('请拖入文件夹，不是文件。')); return; }
    if (SERVER) {
      let found;
      try {
        found = await Api.call('POST', '/api/locate', { name: handle.name, entries });
      } catch (e) {
        toast(t('无法打开文件夹：{why}', { why: errText(e) }));
        return;
      }
      if (found.candidates.length === 1) { connectFolderPath(found.candidates[0]); return; }
      if (found.candidates.length > 1) {
        const dup = kit.openModal({
          title: t('找到多个同名文件夹，请选择'),
          small: true,
          body: h('div', null, found.candidates.map((p) => h('button', { type: 'button', class: 'btn pick-row', onclick() { dup.close(); connectFolderPath(p); } }, p))),
          foot: (close) => [h('button', { type: 'button', class: 'btn', onclick: close }, t('取消'))],
        });
        return;
      }
    }
    try {
      if (!(await Folder.permission(handle, true))) { toast(t('授权未完成：{why}', { why: t('没有读写权限') })); return; }
    } catch (e) {
      toast(t('授权未完成：{why}', { why: errText(e) }));
      return;
    }
    persist();
    const p = { id: newId(), name: handle.name };
    index.list.push(p);
    try { await kvSet('handle:' + NS + ':' + p.id, handle); } catch (e) { toast(t('未能保存文件夹授权，下次打开需要重新选择文件夹。')); }
    useProject(p);
    if (SERVER) toast(t('没有找到这个文件夹的地址，可以打开和保存计划书，但不能复制地址。'));
  }

  async function folderRegrant() {
    if (!S.folder.handle) return;
    try {
      const ok = await Folder.permission(S.folder.handle, true);
      S.folder.state = ok ? 'ready' : 'need';
      renderAll();
      if (ok) await folderPull(true, false);
    } catch (e) {
      toast(t('授权未完成：{why}', { why: errText(e) }));
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
      else if (manual) toast(t('文件夹中尚无计划书。'));
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
      if (!silent) toast(t('已载入文件夹中的计划书。'), { label: t('撤销'), run: () => { undo(); folderPush(); } });
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
      title: t('文件夹中的计划书与页面不一致'),
      body: h('p', { class: 'p', text: t('页面和文件夹中的计划书都有修改，请选择保留哪一份。另一份可通过撤销找回。') }),
      onClose: release,
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick() { release(); close(); } }, t('稍后处理')),
        h('button', { type: 'button', class: 'btn', onclick() { release(); close(); folderPush(); } }, t('保留页面中的')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          release(); close();
          S.folder.synced = fileText;
          commit(fileText, true);
          renderAll();
        } }, t('保留文件夹中的')),
      ],
    });
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
      if (!text.trim()) el.append(h('div', { class: 'hint-note' }, t('点击填写。')), h('pre', { class: 'hint-lines', text: sectionHint(S.md, sec) }));
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
      // 光标放在文末，但不让页面跟着滚到文末（框比窗口高时会跳到框底部）
      ta.focus({ preventScroll: true });
      ta.setSelectionRange(ta.value.length, ta.value.length);
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
  // 写问题的小弹窗：问题记在某个功能下面；输入 @ 可以换功能
  function openIssue(featureLine) {
    const feats = Core.issueList(S.md);
    if (!feats.length) return;
    let target = feats.filter((f) => f.featureLine === featureLine)[0] || feats[0];
    const label = h('button', { type: 'button', class: 'btn sm target', title: t('点击更换功能') });
    const ta = h('textarea', { class: 'in', rows: 4, placeholder: t('说明遇到的问题，输入 @ 选择功能。'), 'aria-label': t('问题说明') });
    const paintLabel = () => { label.textContent = '@ ' + (target.no ? target.no + ' ' : '') + target.name; };
    const choose = (anchor, after) => kit.openPop(anchor, (pop, close) => {
      feats.forEach((f) => pop.append(h('button', { type: 'button', class: f === target ? 'on' : '', onclick() {
        target = f;
        paintLabel();
        close();
        if (after) after();
      } }, (f.no ? f.no + ' ' : '') + f.name)));
    });
    label.addEventListener('click', () => choose(label));
    ta.addEventListener('input', () => {
      autoGrow(ta);
      if (/@$/.test(ta.value)) {
        ta.value = ta.value.slice(0, -1);
        choose(ta, () => ta.focus());
      }
    });
    paintLabel();
    kit.openModal({
      title: t('写问题'),
      small: true,
      body: h('div', null, h('div', { class: 'field' }, label), ta),
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('取消')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          const r = Core.addIssue(S.md, target.featureLine, ta.value, Core.today());
          if (!r.ok) { toast(t('请先写下问题。')); return; }
          close();
          commit(r.md);
          renderAll();
          toast(t('已添加问题。'));
        } }, t('添加')),
      ],
    });
    setTimeout(() => ta.focus(), 0);
  }

  // 项目情况（计划书阶段）和功能清单（确认之后）：每个功能做什么、做到哪一步，以及它下面的问题
  function renderProgress() {
    const list = Core.progressList(S.md);
    if (!list.length) return null;
    const lang = docLangOf(S.md);
    const W = Core.WORDS[lang].progress;
    const building = Core.getStatus(S.md) === 'approved';
    const issues = Core.issueList(S.md);
    const done = list.filter((x) => x.status === 'done').length;
    const doing = list.filter((x) => x.status === 'doing').length;
    const open = issues.reduce((n, f) => n + f.items.filter((i) => !i.done).length, 0);
    const box = h('section', { class: 'status-box' });
    box.append(h('div', { class: 'status-head' },
      h('h2', { text: building ? t('功能清单') : t('项目情况') }),
      h('span', { class: 'muted', text: t('已完成 {done} / {total}，进行中 {doing}', { done, total: list.length, doing }) + (open ? '　' + t('未处理的问题 {n} 条', { n: open }) : '') }),
      building ? h('button', { type: 'button', class: 'btn sm', onclick: () => openIssue(list[0].line) }, '＋ ' + t('写问题')) : null));
    box.append(h('div', { class: 'bar-track' },
      h('span', { class: 'bar-done', style: 'width:' + (done / list.length) * 100 + '%' }),
      h('span', { class: 'bar-doing', style: 'width:' + (doing / list.length) * 100 + '%' })));
    list.forEach((f) => {
      const chip = h('button', { type: 'button', class: 'prog ' + f.status, title: t('点击切换进度') }, W[f.status]);
      chip.addEventListener('click', () => {
        commit(Core.setProgress(S.md, f.line, Core.nextProgress(f.status)));
        renderAll();
      });
      const mine = (issues.filter((x) => x.featureLine === f.line)[0] || { items: [] }).items;
      const openItems = mine.filter((i) => !i.done);
      box.append(h('div', { class: 'status-row' },
        h('div', { class: 'status-name' },
          h('button', { type: 'button', class: 'ref', onclick() { jumpTo('[data-no="' + f.no + '"]'); } }, (f.no ? f.no + ' ' : '') + f.name),
          f.what ? h('span', { class: 'muted', text: f.what }) : null),
        building ? h('button', { type: 'button', class: 'btn sm', title: t('写问题'), 'aria-label': t('写问题'), onclick: () => openIssue(f.line) }, '＋') : null,
        chip));
      openItems.forEach((it) => {
        box.append(h('div', { class: 'issue' },
          h('button', { type: 'button', class: 'btn sm', title: t('标记为已修'), onclick() { commit(Core.setIssueDone(S.md, it.line, true)); renderAll(); } }, t('已修')),
          h('span', { class: 'issue-text', text: it.text }),
          h('button', { type: 'button', class: 'x', title: t('删除'), 'aria-label': t('删除'), onclick() {
            commit(Core.join(Core.deleteSubtree(Core.split(S.md), it.line)));
            renderAll();
            toast(t('已删除。'), { label: t('撤销'), run: () => undo() });
          } }, '✕')));
      });
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
        const closedNow = S.collapsed[x.body] !== undefined ? S.collapsed[x.body] : Core.getStatus(S.md) === 'approved';
        const secEl = h('section', { class: 'sec' + (closedNow ? ' closed' : ''), 'data-line': x.line, 'data-no': no });
        const fold = h('button', { type: 'button', class: 'fold', 'aria-label': t('展开或收起') }, closedNow ? '▸' : '▾');
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
            : nameSlot(t(ADD_LABEL[no]), no === '3' ? t('页面名称') : t('功能名称'), (name) => {
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
    if (!S.md.trim()) { toast(t('没有可导出的内容。')); return; }
    const base = (S.project.name || 'plan').replace(/[\\/:*?"<>|\s]+/g, '-');
    toast(t('已导出：{name}', { name: download(exportText(), base, 'md') }));
  }

  function openImport() {
    const ta = h('textarea', { class: 'in big', placeholder: t('粘贴计划书内容，或选择文件。'), 'aria-label': t('导入内容') });
    const file = h('input', { type: 'file', accept: '.md,.txt,text/markdown,text/plain', style: 'position:fixed;left:0;top:0;opacity:0;width:1px;height:1px' });
    file.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      readText(f).then((txt) => { ta.value = txt; autoGrow(ta); }, () => toast(t('无法读取该文件，请确认它是文本文件。')));
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
      toast(t('未识别出计划书格式，原文已放入「未识别」。'), { label: t('撤销'), run: () => undo() });
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
    const note = h('textarea', { class: 'in', rows: 3, placeholder: t('描述要做的东西。'), 'aria-label': t('补充说明') });
    const out = h('textarea', { class: 'in big', readonly: true, 'aria-label': t('给 AI 的话') });
    const refresh = () => { out.value = Core.buildAiPrompt(S.md, SCHEMA, note.value, LANG); autoGrow(out); };
    note.addEventListener('input', () => { autoGrow(note); refresh(); });
    kit.openModal({
      title: t('复制提示词'),
      body: h('div', null, h('div', { class: 'field' }, h('div', { class: 'fl', text: t('补充说明') }), note), h('div', { class: 'field' }, h('div', { class: 'fl', text: t('提示词内容') }), out)),
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
        toast(t('计划书已确认，可以开始制作。'));
      } }, t('确认并开始')));
    }
    if (SERVER && S.folder.state !== 'ready' && S.md.trim()) {
      const save = h('button', { type: 'button', class: 'btn sm', onclick() { openSaveTo(save); } }, t('保存到文件夹'));
      box.append(save);
    }
    if (S.folder.state === 'ready') {
      box.append(h('span', { class: 'muted', text: t('文件夹：{name}', { name: S.folder.name }) + (S.lastSync ? '　' + t('同步于 {time}', { time: S.lastSync }) : '') }));
      if (S.folder.path) {
        box.append(h('button', { type: 'button', class: 'btn sm', title: S.folder.path, onclick() { copyThen(kit, S.folder.path); } }, t('复制地址')),
          h('span', { class: 'muted', text: t('方便打开 CLI') }));
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
        add(t('复制全文'), () => showText(kit, t('计划书全文'), exportText(), t('复制后发送给 AI。')));
        add(t('复制提示词'), openAiPrompt);
        add(t('导出'), exportPlan);
        pop.append(h('hr'));
      }
      add(t('查看示例'), loadExample);
      add(t('新建空白计划书'), newBlank);
      add(t('导入'), openImport);
      if (has) {
        add(t('撤销'), () => { if (!undo()) toast(t('没有可撤销的操作。')); });
        add(t('重做'), () => { if (!redo()) toast(t('没有可重做的操作。')); });
      }
      pop.append(h('hr'));
      if (f.state === 'off') add(t('文件夹功能需要电脑版 Chrome 或 Edge'), () => {}, { disabled: true });
      else if (f.state === 'none' && SERVER) add(t('保存到文件夹'), () => openSaveTo(anchor));
      else if (f.state === 'none') add(t('连接文件夹'), folderConnect);
      else if (f.state === 'need') add(t('重新授权文件夹'), folderRegrant);
      else {
        add(t('刷新'), () => folderPull(true, false));
        add(t('断开文件夹'), folderDisconnect);
      }
      const closed = index.list.filter((p) => index.open.indexOf(p.id) < 0);
      if (closed.length) {
        pop.append(h('hr'));
        closed.forEach((p) => {
          pop.append(h('div', { class: 'row2' },
            h('button', { type: 'button', onclick() { kit.closePop(); useProject(p); } }, p.name),
            h('button', { type: 'button', class: 'x', title: t('删除项目'), onclick() { kit.closePop(); deleteProject(p.id); } }, '✕')));
        });
      }
      if (!SERVER) {
        pop.append(h('hr'));
        pop.append(h('a', { class: 'menu-link', href: 'download/prompt-plan-helper.exe', download: 'prompt-plan-helper.exe', onclick() { kit.closePop(); } }, t('下载桌面版（Windows）')));
      }
    });
  }

  function openLang(anchor) {
    kit.openPop(anchor, (pop) => {
      [['zh', '中文'], ['en', 'English']].forEach((x) => {
        pop.append(kit.popItem(x[1], () => { setLang(x[0]); renderAll(); }, { on: LANG === x[0] }));
      });
    });
  }

  function renderTabs() {
    const bar = h('div', { class: 'tabbar', role: 'tablist' });
    if (SERVER) {
      bar.append(h('button', { type: 'button', role: 'tab', class: 'chip' + (S.view === 'hub' ? ' on' : ''), onclick: showHub }, t('最近')));
    }
    index.open.forEach((id) => {
      const p = index.list.filter((x) => x.id === id)[0];
      if (!p) return;
      const on = S.view === 'plan' && S.project.id === id;
      bar.append(h('span', { class: 'tab' + (on ? ' on' : '') },
        h('button', { type: 'button', role: 'tab', class: 'tab-name', onclick() { if (!on) switchProject(id); } }, p.name),
        h('button', { type: 'button', class: 'tab-x', title: t('关闭标签'), 'aria-label': t('关闭标签'), onclick() { closeTab(id); } }, '✕')));
    });
    bar.append(h('button', { type: 'button', class: 'chip add', title: t('新项目'), 'aria-label': t('新项目'), onclick() { if (SERVER) showHub(); else createProject(); } }, '＋'));
    return bar;
  }

  function renderHead() {
    clear(head);
    const logo = document.createElement('span');
    logo.className = 'logo';
    logo.innerHTML = ICON_SVG;
    head.append(h('div', { class: 'in' },
      h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('prompt 计划书助手') })),
      h('span', { class: 'sp' }),
      h('button', { type: 'button', class: 'lang', title: t('语言'), 'aria-label': t('语言'), onclick(e) { openLang(e.currentTarget); } }, (LANG === 'zh' ? '中文' : 'English') + ' ▾'),
      h('button', { type: 'button', class: 'x more', title: t('更多'), 'aria-label': t('更多'), onclick(e) { openMenu(e.currentTarget); } }, '⋯')));
    head.append(h('div', { class: 'in tabs-in' }, renderTabs()));
  }

  function renderHubView() {
    const list = h('div', { class: 'folders' });
    folderRows(list, {
      kit,
      current: S.project && S.project.path ? S.project.path : '',
      onPick: (path) => connectFolderPath(path),
      onBrowse: async () => {
        const path = await pickFolderPath();
        if (path) connectFolderPath(path);
      },
      onNewPlan: newPlanHere,
      onNewFolder: () => newFolderFlow(connectFolderPath),
    });
    return h('div', { class: 'col' }, list);
  }

  function renderBody() {
    const st = body.scrollTop;
    kit.closePop();
    clear(body);
    let content;
    if (S.view === 'hub') {
      content = renderHubView();
    } else if (!S.md.trim()) {
      content = h('div', { class: 'col' }, h('div', { class: 'doc empty' },
        h('h1', { text: S.project.name || t('新项目') }),
        h('p', { class: 'muted', text: t('还没有计划书。') }),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn primary', onclick: newBlank }, t('新建空白计划书')),
          h('button', { type: 'button', class: 'btn', onclick: loadExample }, t('查看示例')),
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
      else toast(t('已保存到浏览器。'));
      return;
    }
    if (inField(e)) return;
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); if (!undo()) toast(t('没有可撤销的操作。')); }
    else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); if (!redo()) toast(t('没有可重做的操作。')); }
  });
  body.addEventListener('scroll', kit.closePop);
  {
    let depth = 0;
    const hasFiles = (e) => !!(e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0);
    const veil = h('div', { class: 'mask' }, h('div', { class: 'drop-text', text: t('松开即可打开文件夹。') }));
    app.addEventListener('dragenter', (e) => { if (!hasFiles(e)) return; e.preventDefault(); if (depth++ === 0) app.append(veil); });
    app.addEventListener('dragover', (e) => { if (hasFiles(e)) e.preventDefault(); });
    app.addEventListener('dragleave', (e) => { if (!hasFiles(e)) return; depth = Math.max(0, depth - 1); if (depth === 0) veil.remove(); });
    app.addEventListener('drop', (e) => { if (!hasFiles(e)) return; e.preventDefault(); depth = 0; veil.remove(); dropFolder(e.dataTransfer); });
  }
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
  placeWindow();

  return {
    el: app,
    refresh: () => folderPull(false, true),
    state: () => S,
  };
}
