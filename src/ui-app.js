'use strict';
// 计划书页：项目情况、点一块直接修改、文件夹同步、导入导出。

const PLAN_NAMES = Core.PLAN_NAMES;
const ADD_LABEL = { 2: 'add_a_way_of_using_it', 3: 'add_a_page', 4: 'add_a_feature' };

function docLangOf(md) {
  return md && md.trim() ? Core.docLang(md) : LANG;
}

function sectionHint(md, sec) {
  const rows = ((SCHEMA[docLangOf(md)] || SCHEMA.zh).fields || {})[sec] || [];
  return rows.map((r) => r.name + '：' + r.purpose + (r.how ? '（' + LOCALES[docLangOf(md)].doc.example + r.how + '）' : '')).join('\n');
}

function newId() {
  return 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
}

function nameError(code, kind) {
  const what = kind === 'page' ? t('page') : t('feature');
  if (code === 'empty') return t('the_what_name_cannot_be_empty', { what });
  if (code === 'duplicate') return t('there_is_already_a_what_with_this_name', { what });
  return t('there_is_nowhere_to_add_it');
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
  // 同一个项目有两份文档：初始计划书，和确认开始做之后独立出来的功能清单。
  // S.md、S.past、S.future 指向正在看的那一份，下面的编辑、撤销都只作用在这一份上。
  const docs = {
    plan: { md: '', past: [], future: [] },
    features: { md: '', past: [], future: [], virtual: false },
  };
  const S = {
    doc: 'plan',
    picked: false,
    collapsed: {},
    view: 'plan',
    project: null,
    folder: { state: Folder.supported() ? 'none' : 'off', handle: null, name: '', path: '', synced: '', fsynced: '', file: PLAN_NAMES[0] },
    lastSync: '',
    editedAt: 0,
    issueSeen: {},
  };
  Object.defineProperties(S, {
    md: { get() { return docs[S.doc].md; }, set(v) { docs[S.doc].md = v; } },
    past: { get() { return docs[S.doc].past; }, set(v) { docs[S.doc].past = v; } },
    future: { get() { return docs[S.doc].future; }, set(v) { docs[S.doc].future = v; } },
  });
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
    return { state: Folder.supported() ? 'none' : 'off', handle: null, name: '', path: '', synced: '', fsynced: '', file: PLAN_NAMES[0] };
  }

  function resetDocs(plan, features) {
    docs.plan = { md: plan || '', past: [], future: [] };
    docs.features = { md: features || '', past: [], future: [], virtual: false };
    deriveFeatures();
    S.doc = docs.features.md.trim() ? 'features' : 'plan';
    S.picked = false;
  }

  // 计划书已确认并且已经开始做（有功能的进度不是「未做」，或者功能下已有问题），但还没有功能清单：
  // 先在页面里生成一份，第一次改动时才真的存成文件。确认之后还没开始做时仍然只是在更新计划书。
  function deriveFeatures() {
    const f = docs.features;
    if (f.md.trim() || Core.getStatus(docs.plan.md) !== 'approved' || !Core.workStarted(docs.plan.md)) return;
    f.md = Core.makeFeatureList(docs.plan.md);
    f.virtual = true;
  }

  // 计划书整份换了或刚确认：已经开始做的就生成功能清单，并先看它
  function settleDocs() {
    deriveFeatures();
    if (docs.features.md.trim()) S.doc = 'features';
  }

  // 开始做：从计划书生成功能清单，之后的进度、问题和新增的功能都记在功能清单里，计划书不再改
  function startWork() {
    if (docs.features.md.trim()) return;
    docs.features = { md: Core.makeFeatureList(docs.plan.md), past: [], future: [], virtual: false };
    S.doc = 'features';
    S.picked = true;
  }

  function loadProject(id) {
    const rec = LS.get(projectKey(id), null) || {};
    resetDocs(rec.md, rec.fmd);
    S.editedAt = rec.updated || 0;
    S.folder = freshFolder();
  }

  function saveIndex() {
    LS.set(NS + ':index', index);
  }

  function persist() {
    const f = docs.features;
    if (!LS.set(projectKey(S.project.id), { md: docs.plan.md, fmd: f.virtual ? '' : f.md, updated: S.editedAt || 0 })) toast(t('browser_storage_is_full_and_the_latest'));
    const nm = Core.titleName(docs.plan.md);
    if (nm && S.project.name !== nm) {
      S.project.name = nm;
      saveIndex();
    }
  }

  function startProject() {
    if (!index.list.length) {
      const id = newId();
      index.list.push({ id, name: opts.defaultName || t('new_project') });
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
    if (SERVER && new URLSearchParams(location.search).get('view') === 'install') {
      S.view = 'install';
    } else if (SERVER && !opts.folder && (new URLSearchParams(location.search).get('view') === 'hub' || WINDOW_MODE)) {
      S.view = 'hub';
      // 还没写过内容、也没连文件夹的空项目不占标签
      if (!docs.plan.md.trim() && !S.project.path) {
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
    const p = Object.assign({ id: newId(), name: t('new_project') }, extra || {});
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
    if (!index.list.length) index.list.push({ id: newId(), name: t('new_project') });
    if (index.current === id) useProject(index.list[0]);
    else { saveIndex(); renderAll(); }
    toast(t('deleted_project_name', { name: p.name }), {
      label: t('undo'),
      run() {
        index.list.splice(Math.min(pos, index.list.length), 0, p);
        if (rec) LS.set(projectKey(id), rec);
        saveIndex();
        useProject(p);
      },
    });
  }

  // ---------- 修改记录与撤销 ----------

  // 草稿一动手就变整理中；确认之后计划书是初版，后面的修改记在功能清单里，状态保持已通过
  function autoStatus(md) {
    return Core.getStatus(md) === 'draft' ? Core.setStatus(md, 'doing') : md;
  }

  function changed() {
    S.editedAt = Date.now();
    persist();
    clearTimeout(folderTimer);
    if (S.folder.state === 'ready') folderTimer = setTimeout(folderPush, 600);
  }

  function commit(md, raw) {
    const next = raw ? md : autoStatus(md);
    if (next === S.md) return;
    if (S.doc === 'features') docs.features.virtual = false;
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
    if (S.doc === 'features') docs.features.virtual = false;
    S.md = next;
    changed();
    renderStatus();
  }

  // 「最初的描述」去掉时正文记在这一次打开的页面里，再打开开关时放回去；去掉也可以撤销
  const droppedOriginal = {};
  function setOriginal(keep) {
    const r = Core.setOriginal(S.md, keep, droppedOriginal[S.project.id]);
    if (!keep) droppedOriginal[S.project.id] = r.text;
    commit(r.md, true);
    renderBody();
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

  // 项目指定了哪一份（同一个文件夹里可以有多份）就只读那一份；没指定按默认的名字找
  async function findPlan(handle) {
    const names = S.project.file ? [S.project.file] : PLAN_NAMES;
    for (const name of names) {
      const got = await Folder.readInfo(handle, [], name);
      if (got) return { name, text: got.text, mtime: got.mtime };
    }
    return { name: names[0], text: null, mtime: 0 };
  }

  // 当前这个计划书文件对应的功能清单文件
  const featureFile = () => Core.featureFileFor(S.folder.file);

  async function findFeatures() {
    const name = featureFile();
    if (!name) return { name: '', text: null, mtime: 0 };
    const got = await Folder.readInfo(S.folder.handle, [], name);
    return { name, text: got ? got.text : null, mtime: got ? got.mtime : 0 };
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
      S.folder.file = S.project.file || PLAN_NAMES[0];
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
    S.folder.fsynced = '';
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
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return;
    }
    try { await kvSet('handle:' + NS + ':' + S.project.id, handle); } catch (e) { toast(t('the_folder_permission_could_not_be_saved')); }
    await connectHandle(handle);
  }

  // 本机服务：把某个文件夹变成一个项目并连接
  async function connectFolderPath(path) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path });
    } catch (e) {
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return;
    }
    let p = index.list.filter((x) => x.path && x.path.toLowerCase() === r.path.toLowerCase())[0];
    persist();
    if (!p) {
      p = { id: newId(), name: r.summary && r.summary.title ? r.summary.title : r.name, path: r.path };
      index.list.push(p);
    }
    if (r.file) p.file = r.file;
    else delete p.file;
    useProject(p);
  }

  // 新建计划书：先不放进文件夹，写好以后用「保存到文件夹」存
  function newPlanHere() {
    persist();
    const p = { id: newId(), name: t('new_project') };
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
      where = await Api.call('POST', '/api/pick', { description: t('choose_where_to_put_the_new_folder') });
    } catch (e) {
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return;
    }
    if (!where.path) return;
    const input = h('input', { class: 'in', placeholder: t('folder_name'), 'aria-label': t('folder_name') });
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
        err.textContent = st === 409 ? t('a_folder_with_this_name_already_exists') : st === 400 ? t('the_name_cannot_be_empty_or_contain_any_of') : t('could_not_create_the_folder_why', { why: errText(e) });
        err.style.display = '';
        input.focus({ preventScroll: true });
      }
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    kit.openModal({
      title: t('new_folder'),
      small: true,
      body: h('div', null, h('p', { class: 'muted', text: where.path }), input, err),
      foot: (close) => {
        closeModal = close;
        return [
          h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
          h('button', { type: 'button', class: 'btn primary', onclick: go }, t('create')),
        ];
      },
    });
    setTimeout(() => input.focus({ preventScroll: true }), 0);
  }

  async function pickFolderPath() {
    try {
      const r = await Api.call('POST', '/api/pick', { description: t('choose_the_folder_that_holds_the_plan') });
      return r.path || '';
    } catch (e) {
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return '';
    }
  }

  // 把当前的计划书存进一个文件夹；文件夹里已有计划书时让用户选，不直接覆盖
  async function attachFolderPath(path) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path });
    } catch (e) {
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return;
    }
    // file：写到哪一份；不给就是文件夹当前的这一份（没有计划书时是默认名字）
    const attach = async (useFolderPlan, file) => {
      const target = file || r.file || PLAN_NAMES[0];
      S.project.path = r.path;
      S.project.file = target;
      saveIndex();
      S.folder = Object.assign(freshFolder(), { handle: { server: true, root: r.path, name: r.name }, name: r.name, path: r.path, file: target, state: 'ready' });
      if (file || useFolderPlan) {
        try { await Api.call('POST', '/api/current', { path: r.path, file: target }); } catch (e) { if (useFolderPlan) toast(t('could_not_select_the_plan_why', { why: errText(e) })); }
      }
      if (useFolderPlan) {
        const found = await findPlan(S.folder.handle);
        S.folder.file = found.name;
        S.folder.synced = found.text;
        commitTo('plan', found.text);
        S.folder.fsynced = '';
        docs.features = { md: '', past: [], future: [], virtual: false };
        deriveFeatures();
        await pullDoc('features', false, true);
        S.doc = docs.features.md.trim() ? 'features' : 'plan';
        S.lastSync = clockText();
        renderAll();
        toast(t('loaded_the_plan_from_the_folder'), { label: t('undo'), run: () => undo() });
      } else {
        await folderPush();
        S.lastSync = clockText();
        renderAll();
        toast(t('saved_to_the_folder_name', { name: r.name }));
      }
    };
    if (!r.summary) { attach(false); return; }
    kit.openModal({
      title: t('this_folder_already_has_a_plan'),
      small: true,
      body: h('p', { class: 'p', text: t('which_one_to_use_replace_with_current') }),
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
        h('button', { type: 'button', class: 'btn', onclick() { close(); attach(true); } }, t('use_the_one_in_the_folder')),
        h('button', { type: 'button', class: 'btn', onclick() { close(); askPlanName(r, (file) => attach(false, file)); } }, t('save_as_a_new_plan')),
        h('button', { type: 'button', class: 'btn primary', onclick() { close(); attach(false); } }, t('replace_with_current')),
      ],
    });
  }

  // 同一个文件夹里的多份计划书：文件名是 计划书-名称.md（英文界面是 plan-名称.md）
  function planFileName(name) {
    return LOCALES[LANG].doc.filePrefix + name.trim() + '.md';
  }

  // 问一个名称，得到文件名后交给 then(文件名)；info 是 /api/connect 的返回，用来判重
  function askPlanName(info, then) {
    const input = h('input', { class: 'in', placeholder: t('plan_name'), 'aria-label': t('plan_name') });
    const err = h('p', { class: 'err', style: 'display:none' });
    let closeModal = null;
    const go = () => {
      const name = input.value.trim();
      const file = planFileName(name);
      const bad = !name ? t('the_name_cannot_be_empty') : name.length > 60 || /[\\\\/:*?"<>|]/.test(name) ? t('the_name_cannot_be_longer_than_60_characters')
        : info.plans.some((x) => x.file.toLowerCase() === file.toLowerCase()) ? t('a_plan_with_this_name_already_exists_choose') : '';
      if (bad) { err.textContent = bad; err.style.display = ''; input.focus({ preventScroll: true }); return; }
      closeModal();
      then(file, name);
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    kit.openModal({
      title: t('new_plan_in_this_folder'),
      small: true,
      body: h('div', null, input, err),
      foot: (close) => {
        closeModal = close;
        return [
          h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
          h('button', { type: 'button', class: 'btn primary', onclick: go }, t('create')),
        ];
      },
    });
    setTimeout(() => input.focus({ preventScroll: true }), 0);
  }

  async function switchPlanFile(file) {
    persist();
    if (S.folder.state === 'ready') await folderPush();
    S.project.file = file;
    saveIndex();
    resetDocs('', '');
    S.folder.file = file;
    S.folder.synced = '';
    S.folder.fsynced = '';
    try {
      await Api.call('POST', '/api/current', { path: S.folder.path, file });
    } catch (e) {
      toast(t('could_not_select_the_plan_why', { why: errText(e) }));
    }
    renderAll();
    await folderPull(true, false);
  }

  async function openPlanMenu(anchor) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path: S.folder.path });
    } catch (e) {
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return;
    }
    kit.openPop(anchor, (pop) => {
      r.plans.forEach((pl) => pop.append(kit.popItem((pl.title || r.name) + '（' + pl.file + '）', () => { if (pl.file !== S.folder.file) switchPlanFile(pl.file); }, { on: pl.file === S.folder.file })));
      pop.append(h('hr'));
      pop.append(kit.popItem(t('new_plan_in_this_folder'), () => askPlanName(r, async (file, name) => {
        try {
          await Folder.write(S.folder.handle, [], file, Core.blankPlan(SCHEMA[LANG].planTemplate, name, Core.today()));
        } catch (e) {
          toast(t('could_not_save_to_the_folder_why', { why: errText(e) }));
          return;
        }
        switchPlanFile(file);
      })));
    });
  }

  function openSaveTo(anchor) {
    kit.openPop(anchor, (pop, close) => {
      pop.append(kit.popItem(t('choose_an_existing_folder'), async () => {
        const path = await pickFolderPath();
        if (path) attachFolderPath(path);
      }));
      pop.append(kit.popItem(t('new_folder'), () => newFolderFlow(attachFolderPath)));
    });
  }

  // 拖入文件夹：服务按名字和里面的文件找到它的地址；找不到就直接用浏览器授权的方式打开
  async function dropFolder(dt) {
    const item = dt.items && dt.items[0];
    if (!item || item.kind !== 'file') { toast(t('drop_a_folder_not_a_file')); return; }
    if (!item.getAsFileSystemHandle) { toast(t('this_browser_cannot_open_dropped_folders_use')); return; }
    let handle;
    const entries = [];
    try {
      handle = await item.getAsFileSystemHandle();
      if (handle && handle.kind === 'directory' && SERVER) {
        for await (const pair of handle.entries()) { entries.push(pair[0]); if (entries.length >= 200) break; }
      }
    } catch (e) {
      toast(t('could_not_read_the_dropped_item_why', { why: errText(e) }));
      return;
    }
    if (!handle || handle.kind !== 'directory') { toast(t('drop_a_folder_not_a_file')); return; }
    if (SERVER) {
      let found;
      try {
        found = await Api.call('POST', '/api/locate', { name: handle.name, entries });
      } catch (e) {
        toast(t('could_not_open_the_folder_why', { why: errText(e) }));
        return;
      }
      if (found.candidates.length === 1) { connectFolderPath(found.candidates[0]); return; }
      if (found.candidates.length > 1) {
        const dup = kit.openModal({
          title: t('several_folders_have_this_name_choose_one'),
          small: true,
          body: h('div', null, found.candidates.map((p) => h('button', { type: 'button', class: 'btn pick-row', onclick() { dup.close(); connectFolderPath(p); } }, p))),
          foot: (close) => [h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel'))],
        });
        return;
      }
    }
    try {
      if (!(await Folder.permission(handle, true))) { toast(t('permission_was_not_granted_why', { why: t('no_read_and_write_permission') })); return; }
    } catch (e) {
      toast(t('permission_was_not_granted_why', { why: errText(e) }));
      return;
    }
    persist();
    const p = { id: newId(), name: handle.name };
    index.list.push(p);
    try { await kvSet('handle:' + NS + ':' + p.id, handle); } catch (e) { toast(t('the_folder_permission_could_not_be_saved')); }
    useProject(p);
    if (SERVER) toast(t('the_address_of_this_folder_was_not_found_you'));
  }

  async function folderRegrant() {
    if (!S.folder.handle) return;
    try {
      const ok = await Folder.permission(S.folder.handle, true);
      S.folder.state = ok ? 'ready' : 'need';
      renderAll();
      if (ok) await folderPull(true, false);
    } catch (e) {
      toast(t('permission_was_not_granted_why', { why: errText(e) }));
    }
  }

  async function folderDisconnect() {
    if (!SERVER) { try { await kvDel('handle:' + NS + ':' + S.project.id); } catch (e) { /* 句柄已不存在 */ } }
    delete S.project.path;
    saveIndex();
    S.folder = freshFolder();
    renderAll();
    toast(t('folder_disconnected'));
  }

  // 历史版本：功能清单被改写之前，把旧的一份存进文件夹里的 .shupian/history/；
  // 平时隔几分钟存一份，有功能被去掉时马上存，防止写过的功能找不回来
  const HISTORY_GAP = 5 * 60 * 1000;
  const HISTORY_KEEP = 50;
  let historyAt = 0;

  const featureNames = (md) => Core.progressList(md).map((x) => x.name);

  async function keepVersion(prev, next) {
    if (!prev || !prev.trim() || prev === next || !S.folder.handle || S.folder.handle.server) return;
    const lost = featureNames(prev).some((n) => featureNames(next).indexOf(n) < 0);
    if (!lost && Date.now() - historyAt < HISTORY_GAP) return;
    const name = Core.timeStamp() + '-' + featureFile();
    try {
      await Folder.write(S.folder.handle, ['.shupian', 'history'], name, prev);
      if (!S.folder.handle.server) await Folder.historyPrune(S.folder.handle, featureFile(), HISTORY_KEEP);
      historyAt = Date.now();
    } catch (e) {
      toast(t('could_not_save_the_history_why', { why: errText(e) }));
    }
  }

  // kind：plan 或 features
  async function pushDoc(kind) {
    const d = docs[kind];
    if (!d.md.trim() || d.virtual) return;
    const key = kind === 'plan' ? 'synced' : 'fsynced';
    const file = kind === 'plan' ? S.folder.file : featureFile();
    if (!file || d.md === S.folder[key]) return;
    try {
      if (kind === 'features') await keepVersion(S.folder.fsynced, d.md);
      await Folder.write(S.folder.handle, [], file, d.md);
      S.folder[key] = d.md;
    } catch (e) {
      toast(t('could_not_save_to_the_folder_why', { why: errText(e) }));
    }
  }

  async function folderPush() {
    if (S.folder.state !== 'ready') return;
    await pushDoc('plan');
    await pushDoc('features');
  }

  // 在某一份文档上提交（拉取回来的内容放进对应那一份的撤销记录里）
  function commitTo(kind, md) {
    const keep = S.doc;
    S.doc = kind;
    commit(md, true);
    S.doc = keep;
  }

  // 有文字框正在编辑时，自动检查不替换页面
  const editing = () => !!body.querySelector('textarea');

  // 把文件夹里的一份读回来：kind 是 plan 或 features；返回 true 表示页面内容变了
  async function pullDoc(kind, manual, silent) {
    const d = docs[kind];
    const key = kind === 'plan' ? 'synced' : 'fsynced';
    let found;
    try {
      found = kind === 'plan' ? await findPlan(S.folder.handle) : await findFeatures();
    } catch (e) {
      if (!silent) toast(t('could_not_read_the_folder_why', { why: errText(e) }));
      return false;
    }
    if (kind === 'plan') S.folder.file = found.name;
    const text = found.text;
    const mine = d.virtual ? '' : d.md;
    if (text == null) {
      if (mine.trim()) await pushDoc(kind);
      else if (manual && kind === 'plan' && !d.md.trim()) toast(t('there_is_no_plan_in_the_folder_yet'));
      return false;
    }
    if (text === mine) {
      S.folder[key] = text;
      if (manual && kind === 'plan') toast(t('already_up_to_date'));
      return false;
    }
    // 文件夹里是空的：空的不算最新，保留页面里的并写回去
    if (!text.trim() && mine.trim()) { S.folder[key] = text; await pushDoc(kind); return false; }
    if (!mine.trim() || mine === S.folder[key]) {
      if (silent && editing()) return false;
      if (kind === 'features') await keepVersion(mine || S.folder[key], text);
      S.folder[key] = text;
      d.virtual = false;
      commitTo(kind, text);
      S.editedAt = found.mtime || 0;
      persist();
      S.lastSync = clockText();
      if (!silent) toast(kind === 'plan' ? t('loaded_the_plan_from_the_folder') : t('loaded_the_feature_list_from_the_folder'), { label: t('undo'), run: () => { undo(); folderPush(); } });
      return true;
    }
    if (text === S.folder[key]) { await pushDoc(kind); return false; }
    if (silent && editing()) return false;
    // 两边都改过：不问，按先后合并。改在不同位置的都保留，改在同一位置的用较新的那一份。
    const remoteNewer = (found.mtime || 0) > (S.editedAt || 0);
    const merged = Core.merge3(S.folder[key], mine, text, remoteNewer ? 'theirs' : 'mine');
    if (kind === 'features') await keepVersion(mine, merged.text);
    S.folder[key] = text;
    commitTo(kind, merged.text);
    S.editedAt = Date.now();
    S.lastSync = clockText();
    if (merged.text !== text) await pushDoc(kind);
    toast(merged.conflicts ? t('both_the_folder_and_the_page_changed_merged', { n: merged.conflicts }) : t('both_the_folder_and_the_page_changed_merged_2'),
      { label: t('undo'), run: () => { undo(); folderPush(); } });
    return true;
  }

  // silent：自动检查时不弹提示。先读计划书，再读它的功能清单
  async function folderPull(manual, silent) {
    if (S.folder.state !== 'ready') return;
    const a = await pullDoc('plan', manual, silent);
    deriveFeatures();
    const b = await pullDoc('features', manual, silent);
    // 还没自己选过看哪一份时，有功能清单就先看功能清单
    if (!S.picked && S.doc === 'plan' && docs.features.md.trim()) S.doc = 'features';
    if (S.doc === 'features' && !docs.features.md.trim()) S.doc = 'plan';
    if (a || b || !silent) renderAll();
  }

  function clockText() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0');
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
    const re = new RegExp('((?:' + Core.TBD_ALT + ')[：:][^；;。\\n]*|〈[^〉]*〉|\\d+\\.\\d+)', 'g');
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      const tok = m[0];
      if (m.index > last) frag.append(document.createTextNode(text.slice(last, m.index)));
      const prev = m.index > 0 ? text.charAt(m.index - 1) : '';
      if (Core.TBD_START_RE.test(tok)) frag.append(h('span', { class: 'pend', text: tok }));
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
    const tbd = LOCALES[lang].doc.tbd + LOCALES[lang].doc.sep + LOCALES[lang].doc.missing;
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

  // 有可选项的字段（字段表第 4 列）：在填写框上方给一排可点选的选项，点一下写进对应的那一行，可以多选
  function optionRows(ta, sec) {
    const lang = docLangOf(S.md);
    const doc = LOCALES[lang].doc;
    const fields = (((SCHEMA[lang] || SCHEMA.zh).fields || {})[sec] || []).filter((r) => r.options && r.options.length);
    if (!fields.length) return null;
    const box = h('div', { class: 'optrows' });
    const reLine = (name) => new RegExp('^\\s*' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[：:]\\s*(.*)$');
    const read = (name) => {
      const hit = ta.value.split('\n').map((l) => reLine(name).exec(l)).filter(Boolean)[0];
      return hit ? hit[1].split(/[、,，;；]\s*/).map((x) => x.trim()).filter(Boolean) : [];
    };
    const write = (name, values) => {
      const lines = ta.value.split('\n');
      const text = name + doc.sep + values.join(doc.listSep);
      const i = lines.findIndex((l) => reLine(name).test(l));
      if (i >= 0) lines[i] = text;
      else lines.push(text);
      ta.value = lines.join('\n');
      ta.dispatchEvent(new Event('input'));
      paint();
    };
    const paint = () => {
      clear(box);
      fields.forEach((r) => {
        const cur = read(r.name);
        box.append(h('div', { class: 'optrow' },
          h('span', { class: 'lb', text: r.name }),
          r.options.map((o) => {
            const on = cur.indexOf(o) >= 0;
            const b = h('button', { type: 'button', class: 'chip' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false' }, o);
            // 不让填写框失去焦点，否则这一块会退出编辑
            b.addEventListener('mousedown', (e) => e.preventDefault());
            b.addEventListener('click', () => {
              const now = read(r.name);
              const next = on ? now.filter((x) => x !== o) : r.options.filter((x) => x === o || now.indexOf(x) >= 0).concat(now.filter((x) => r.options.indexOf(x) < 0));
              write(r.name, next);
            });
            return b;
          })));
      });
    };
    ta.addEventListener('input', paint);
    paint();
    return box;
  }

  // 点一下变成大填写框，点框外保存
  // readonly：初始计划书只读，不能点开编辑
  function makeBox(line, sec, nums, readonly) {
    const el = h('div', Object.assign({ class: 'box' + (readonly ? ' readonly' : ''), 'data-line': line }, readonly ? {} : { tabindex: 0, role: 'button', 'aria-label': t('click_to_edit') }));
    const at = () => Number(el.getAttribute('data-line'));
    const paint = () => {
      clear(el);
      const text = Core.bodyText(Core.split(S.md), at());
      if (!text.trim()) {
        if (!readonly) el.append(h('div', { class: 'hint-note' }, t('click_to_fill_in')), h('pre', { class: 'hint-lines', text: sectionHint(S.md, sec) }));
      } else el.append(renderLines(text, nums, docLangOf(S.md)));
    };
    const edit = () => {
      if (el.querySelector('textarea')) return;
      const text = Core.bodyText(Core.split(S.md), at());
      const ta = h('textarea', { class: 'in big', placeholder: sectionHint(S.md, sec), value: text, 'aria-label': t('content') });
      const choices = optionRows(ta, sec);
      ta.addEventListener('input', () => {
        autoGrow(ta);
        const before = Core.split(S.md).length;
        typing(Core.setBody(S.md, at(), ta.value), 'b' + at());
        shiftLines(at(), Core.split(S.md).length - before);
      });
      ta.addEventListener('blur', paint);
      ta.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); ta.blur(); } });
      clear(el);
      if (choices) el.append(choices);
      el.append(ta);
      autoGrow(ta);
      // 光标放在文末，但不让页面跟着滚到文末（框比窗口高时会跳到框底部）
      ta.focus({ preventScroll: true });
      ta.setSelectionRange(ta.value.length, ta.value.length);
    };
    if (!readonly) {
      el.addEventListener('click', (e) => { if (!e.target.closest('button') && !el.querySelector('textarea')) edit(); });
      el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); edit(); } });
      el.edit = edit;
    }
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
        h('button', { type: 'button', class: 'btn primary', onclick: go }, t('add')),
        h('button', { type: 'button', class: 'btn', onclick: showButton }, t('cancel'))), err);
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
    const input = h('input', { class: 'in', value: /〈/.test(current) ? '' : current, placeholder: t('name'), 'aria-label': t('name') });
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

  // 未提交的问题草稿：连了文件夹时存在文件夹里（悬浮窗读同一份），否则存在浏览器本地；写入按顺序排队
  let draftChain = Promise.resolve();
  let draftExists = false;

  function draftHandle() {
    return S.folder.state === 'ready' && S.folder.handle && S.folder.file ? S.folder.handle : null;
  }

  async function loadDraft() {
    const handle = draftHandle();
    if (!handle) return LS.get(NS + ':draft:' + S.project.id, []);
    const text = await Folder.read(handle, Draft.sub, Draft.name(S.folder.file));
    return text ? Draft.parse(text) : [];
  }

  function queueDraft(rows) {
    if (!rows.length && !draftExists) return;
    draftExists = rows.length > 0;
    const handle = draftHandle();
    const file = S.folder.file;
    const key = NS + ':draft:' + S.project.id;
    draftChain = draftChain.then(async () => {
      if (handle) await Folder.write(handle, Draft.sub, Draft.name(file), Draft.text(rows));
      else if (!LS.set(key, rows)) throw new Error(t('browser_storage_is_full_and_the_latest'));
    }).catch((e) => toast(t('could_not_save_the_draft_why', { why: errText(e) })));
  }

  // 项目情况：每个功能做什么、做到哪一步
  // 写问题的小弹窗：问题记在某个功能下面；输入 @ 可以换功能；没提交的内容留作草稿，下次打开还在
  function openIssue(featureLine) {
    const feats = Core.issueList(S.md);
    if (!feats.length) return;
    const first = feats.filter((f) => f.featureLine === featureLine)[0] || feats[0];
    let timer = 0;
    const list = createIssueList({
      kit,
      features: () => feats,
      placeholder: t('describe_the_issue_you_can_several_features'),
      onChange() {
        clearTimeout(timer);
        timer = setTimeout(() => queueDraft(list.snapshot()), 500);
      },
    });
    list.reset(first);
    loadDraft().then((rows) => {
      if (rows.length && !list.items().length) { draftExists = true; list.restore(rows); }
    }, (e) => toast(t('could_not_load_the_draft_why', { why: errText(e) })));
    kit.openModal({
      title: t('report_an_issue'),
      small: true,
      body: list.el,
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          const items = list.items();
          if (!items.length) { toast(t('write_the_issue_first')); return; }
          if (items.some((x) => !x.fs.length)) { toast(t('choose_a_feature_for_every_issue')); return; }
          // 一条问题 @ 了几个功能，就记到每个功能下面
          const flat = [];
          items.forEach((x) => x.fs.forEach((f) => flat.push({ featureLine: f.featureLine, text: x.text })));
          // 计划书已确认、还没有功能清单：第一条问题就是开始做，问题记在新生成的功能清单里
          if (S.doc === 'plan' && Core.getStatus(S.md) === 'approved') {
            const before = Core.progressList(S.md);
            startWork();
            const after = Core.progressList(S.md);
            flat.forEach((x) => {
              const f = before.filter((b) => b.line === x.featureLine)[0];
              const hit = f && after.filter((a) => a.no === f.no && a.name === f.name)[0];
              if (hit) x.featureLine = hit.line;
            });
          }
          const r = Core.addIssues(S.md, flat, Core.today());
          if (!r.ok) { toast(t('write_the_issue_first')); return; }
          close();
          clearTimeout(timer);
          queueDraft([]);
          // 记问题、改进度不算改计划书
          commit(r.md, true);
          renderAll();
          toast(t('added_n_issues', { n: r.added }));
        } }, t('add')),
      ],
    });
    setTimeout(() => list.focusedRow().ta.focus({ preventScroll: true }), 0);
  }

  // 点问题的文字：变成输入框，改完点别处保存；状态前缀保留
  function editIssueText(btn, it) {
    const ta = h('textarea', { class: 'in', rows: 1, value: it.text, 'aria-label': t('issue_description') });
    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      const v = ta.value.replace(/\s+/g, ' ').trim();
      if (save && v && v !== it.text) {
        const lines = Core.split(S.md);
        const info = Core.info(lines[it.line]);
        const prefix = Core.issuePrefix(S.md, it.state);
        lines[it.line] = ' '.repeat(info.indent) + info.marker + ' ' + prefix + v;
        commit(Core.join(lines), true);
      }
      renderAll();
    };
    ta.addEventListener('input', () => autoGrow(ta));
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); finish(true); }
      if (e.key === 'Escape') { e.stopPropagation(); finish(false); }
    });
    ta.addEventListener('blur', () => finish(true));
    btn.replaceWith(ta);
    autoGrow(ta);
    ta.focus({ preventScroll: true });
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }

  // 确认之后在功能清单里直接加功能：填名称，加完直接进入编辑
  function openAddFeature() {
    const input = h('input', { class: 'in', placeholder: t('feature_name'), 'aria-label': t('feature_name') });
    const err = h('p', { class: 'err', style: 'display:none' });
    let closeModal = null;
    const go = () => {
      const r = Core.addBlock(S.md, 'feature', input.value);
      if (!r.ok) { err.textContent = nameError(r.code, 'feature'); err.style.display = ''; input.focus({ preventScroll: true }); return; }
      closeModal();
      commit(r.md, true);
      afterAdd(r.line);
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    kit.openModal({
      title: t('add_a_feature'),
      small: true,
      body: h('div', null, input, err),
      foot: (close) => {
        closeModal = close;
        return [
          h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
          h('button', { type: 'button', class: 'btn primary', onclick: go }, t('add')),
        ];
      },
    });
    setTimeout(() => input.focus({ preventScroll: true }), 0);
  }

  // 开始做之后有功能清单，初始计划书不再改，只读
  const planLocked = () => S.doc === 'plan' && docs.features.md.trim() !== '';

  // 项目情况（计划书阶段）和功能清单（开始做之后）：每个功能做什么、做到哪一步，以及它下面的问题
  function renderProgress() {
    if (planLocked()) return null;
    const list = Core.progressList(S.md);
    if (!list.length) return null;
    const lang = docLangOf(S.md);
    const W = Core.WORDS[lang].progress;
    const building = S.doc === 'features';
    const issues = Core.issueList(S.md);
    const done = list.filter((x) => x.status === 'done').length;
    const doing = list.filter((x) => x.status === 'doing').length;
    const open = issues.reduce((n, f) => n + f.items.filter((i) => i.state !== 'done').length, 0);
    const box = h('section', { class: 'status-box' });
    box.append(h('div', { class: 'status-head' },
      h('h2', { text: building ? t('feature_list') : t('project_status') }),
      h('span', { class: 'muted', text: t('done_of_total_done_doing_in_progress', { done, total: list.length, doing }) + (open ? '　' + t('n_open_issues', { n: open }) : '') }),
      building ? h('button', { type: 'button', class: 'btn sm', onclick: openAddFeature }, '＋ ' + t('add_a_feature')) : null,
      h('button', { type: 'button', class: 'btn sm', onclick: () => openIssue(list[0].line) }, '＋ ' + t('report_an_issue'))));
    box.append(h('div', { class: 'bar-track' },
      h('span', { class: 'bar-done', style: 'width:' + (done / list.length) * 100 + '%' }),
      h('span', { class: 'bar-doing', style: 'width:' + (doing / list.length) * 100 + '%' })));
    list.forEach((f) => {
      const chip = h('button', { type: 'button', class: 'prog ' + f.status, title: t('click_to_change_progress') }, W[f.status]);
      chip.addEventListener('click', () => {
        const next = Core.nextProgress(f.status);
        // 计划书已确认后第一次改进度就是开始做了：生成功能清单，进度记在功能清单里
        if (S.doc === 'plan' && Core.getStatus(S.md) === 'approved') {
          startWork();
          const hit = Core.progressList(S.md).filter((x) => x.no === f.no && x.name === f.name)[0];
          if (hit) commit(Core.setProgress(S.md, hit.line, next), true);
          renderAll();
          return;
        }
        commit(Core.setProgress(S.md, f.line, next), true);
        renderAll();
      });
      const mine = (issues.filter((x) => x.featureLine === f.line)[0] || { items: [] }).items;
      box.append(h('div', { class: 'status-row' },
        h('div', { class: 'status-name' },
          h('button', { type: 'button', class: 'ref', onclick() { jumpTo('[data-no="' + f.no + '"]'); } }, (f.no ? f.no + ' ' : '') + f.name),
          f.what ? h('span', { class: 'muted', text: f.what }) : null),
        h('button', { type: 'button', class: 'btn sm', title: t('report_an_issue'), 'aria-label': t('report_an_issue'), onclick: () => openIssue(f.line) }, '＋'),
        chip));
      // 每条问题：点状态在 待处理 / 处理中 / 已修 之间切换；点文字可以改；AI 处理时这里实时变化
      mine.forEach((it) => {
        const key = f.line + ':' + it.text;
        const was = S.issueSeen[key];
        const flash = was && was !== 'done' && it.state === 'done';
        S.issueSeen[key] = it.state;
        const stateBtn = h('button', { type: 'button', class: 'btn sm istate ' + it.state, title: t('click_to_change_the_status'), onclick() {
          commit(Core.setIssueState(S.md, it.line, Core.nextIssueState(it.state)), true);
          renderAll();
        } }, it.state === 'done' ? '✓ ' + t('fixed') : it.state === 'doing' ? t('working') : t('to_do'));
        const text = h('button', { type: 'button', class: 'issue-text link', title: t('click_to_edit'), 'aria-label': t('click_to_edit') }, it.text);
        text.addEventListener('click', () => editIssueText(text, it));
        box.append(h('div', { class: 'issue ' + it.state + (flash ? ' flash' : '') },
          stateBtn, text,
          h('button', { type: 'button', class: 'x', title: t('delete'), 'aria-label': t('delete'), onclick() {
            commit(Core.join(Core.deleteSubtree(Core.split(S.md), it.line)), true);
            renderAll();
            toast(t('deleted'), { label: t('undo'), run: () => undo() });
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
    const locked = planLocked();
    const inFeatures = S.doc === 'features';
    const doc = h('div', { class: 'doc' });
    const title = hs.filter((x) => x.level === 1)[0];
    if (title) {
      const nm = Core.titleName(S.md);
      if (locked || inFeatures) {
        doc.append(h('h1', null, h('span', { class: 'title', 'data-line': title.line }, nm || t('untitled_project'))));
      } else {
        const nameBtn = h('button', { type: 'button', class: 'title', 'data-line': title.line, title: t('click_to_rename') }, nm || t('untitled_project'));
        nameBtn.addEventListener('click', () => renameInline(nameBtn, nm, (v) => { if (v.trim()) commit(Core.setTitle(S.md, v)); }));
        doc.append(h('h1', null, nameBtn));
      }
    }
    if (docs.features.md.trim()) {
      const tabs = h('div', { class: 'doctabs', role: 'tablist' });
      [['features', t('feature_list')], ['plan', t('initial_plan')]].forEach(([kind, label]) => {
        const on = S.doc === kind;
        tabs.append(h('button', { type: 'button', role: 'tab', class: 'chip' + (on ? ' on' : ''), 'aria-selected': on ? 'true' : 'false', onclick() {
          if (on) return;
          S.doc = kind;
          S.picked = true;
          renderAll();
        } }, label));
      });
      doc.append(tabs);
    }
    doc.append(h('div', { class: 'statusline' }));
    const prog = renderProgress();
    if (prog) doc.append(prog);
    let secBody = null;
    hs.forEach((x, idx) => {
      if (x.level === 2) {
        const no = (/^(\d+)\b/.exec(x.body) || [])[1] || '';
        const closedNow = S.collapsed[x.body] !== undefined ? S.collapsed[x.body] : (inFeatures || locked);
        const secEl = h('section', { class: 'sec' + (closedNow ? ' closed' : ''), 'data-line': x.line, 'data-no': no });
        const fold = h('button', { type: 'button', class: 'fold', 'aria-label': t('expand_or_collapse') }, closedNow ? '▸' : '▾');
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
        if (!hasChildren || Core.bodyText(lines, x.line).trim() !== '') secBody.append(makeBox(x.line, no, nums, locked));
        if (ADD_LABEL[no] && !locked) {
          const slot = no === '2'
            ? h('div', { class: 'addslot' }, h('button', { type: 'button', class: 'btn', onclick() {
              const r = Core.addFlowLine(S.md);
              if (r.ok) { commit(r.md); afterAdd(x.line); }
            } }, '＋ ' + t(ADD_LABEL[no])))
            : nameSlot(t(ADD_LABEL[no]), no === '3' ? t('page_name') : t('feature_name'), (name) => {
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
        const nameParts = [h('span', { class: 'no', text: no }), titleText && !/〈/.test(titleText) ? h('span', { text: titleText }) : h('span', { class: 'ph', text: t('name') })];
        if (locked) {
          card.append(h('div', { class: 'blk-head' }, h('span', { class: 'blk-title' }, nameParts)), makeBox(x.line, sec, nums, true));
        } else {
          const nameBtn = h('button', { type: 'button', class: 'blk-title', title: t('click_to_rename') }, nameParts);
          nameBtn.addEventListener('click', () => renameInline(nameBtn, titleText, (v) => {
            const r = Core.renameBlock(S.md, Number(card.getAttribute('data-line')), v);
            if (r.ok) commit(r.md); else toast(nameError(r.code, sec === '3' ? 'page' : 'feature'));
          }));
          const del = h('button', { type: 'button', class: 'x', title: t('delete'), 'aria-label': t('delete'), onclick() {
            commit(Core.join(Core.deleteSubtree(Core.split(S.md), Number(card.getAttribute('data-line')))));
            renderAll();
            toast(t('deleted'), { label: t('undo'), run: () => undo() });
          } }, '✕');
          card.append(h('div', { class: 'blk-head' }, nameBtn, del), makeBox(x.line, sec, nums));
        }
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
    if (!S.md.trim()) { toast(t('there_is_nothing_to_export')); return; }
    const base = (S.project.name || 'plan').replace(/[\\/:*?"<>|\s]+/g, '-');
    toast(t('exported_name', { name: download(exportText(), base, 'md') }));
  }

  function openImport() {
    const ta = h('textarea', { class: 'in big', placeholder: t('paste_the_plan_or_choose_a_file'), 'aria-label': t('content_to_import') });
    const file = h('input', { type: 'file', accept: '.md,.txt,text/markdown,text/plain', style: 'position:fixed;left:0;top:0;opacity:0;width:1px;height:1px' });
    file.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      readText(f).then((txt) => { ta.value = txt; autoGrow(ta); }, () => toast(t('this_file_cannot_be_read_check_that_it_is_a')));
    });
    app.append(file);
    kit.openModal({
      title: t('import'),
      body: ta,
      onClose() { file.remove(); },
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
        h('button', { type: 'button', class: 'btn', onclick: () => file.click() }, t('choose_a_file')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          if (!ta.value.trim()) { toast(t('paste_something_or_choose_a_file_first')); return; }
          close();
          importText(ta.value);
        } }, t('import')),
      ],
    });
    setTimeout(() => ta.focus(), 0);
  }

  function importText(text) {
    S.doc = 'plan';
    const txt = text.replace(/\r\n?/g, '\n');
    if (!/^##\s+\d/m.test(txt)) {
      const wrapped = Core.wrapUnrecognised(txt, S.project.name, LANG, Core.today());
      commit(wrapped, true);
      renderAll();
      toast(t('the_plan_format_was_not_recognised_the'), { label: t('undo'), run: () => undo() });
      return;
    }
    commit(txt, true);
    settleDocs();
    renderAll();
    toast(t('plan_imported'), { label: t('undo'), run: () => undo() });
  }

  function newBlank() {
    S.doc = 'plan';
    commit(Core.blankPlan(SCHEMA[LANG].planTemplate, S.project.name === t('new_project') ? '' : S.project.name, Core.today()), true);
    renderAll();
    toast(t('new_plan_created'), { label: t('undo'), run: () => undo() });
  }

  function loadExample() {
    S.doc = 'plan';
    commit(SCHEMA[LANG].example, true);
    settleDocs();
    renderAll();
    toast(t('example_loaded'), { label: t('undo'), run: () => undo() });
  }

  // 给 AI 的话默认用英文写，可以切换成别的语言（和界面语言无关）
  function openAiPrompt() {
    let promptLang = LOCALES.en ? 'en' : LANG;
    const note = h('textarea', { class: 'in', rows: 3, placeholder: t('describe_what_you_want_to_make'), 'aria-label': t('notes') });
    const out = h('textarea', { class: 'in big', readonly: true, 'aria-label': t('words_for_the_ai') });
    const langBtn = h('button', { type: 'button', class: 'lang', title: t('language'), 'aria-label': t('language') });
    const refresh = () => {
      langBtn.textContent = LOCALES[promptLang].name + ' ▾';
      out.value = Core.buildAiPrompt(S.md, SCHEMA, note.value, promptLang);
      autoGrow(out);
    };
    langBtn.addEventListener('click', () => {
      kit.openPop(langBtn, (pop) => {
        LANG_LIST.forEach((k) => pop.append(kit.popItem(LOCALES[k].name, () => { promptLang = k; refresh(); }, { on: promptLang === k })));
      });
    });
    note.addEventListener('input', () => { autoGrow(note); refresh(); });
    kit.openModal({
      title: t('copy_prompt'),
      body: h('div', null,
        h('div', { class: 'field' }, h('div', { class: 'fl', text: t('language') }), langBtn),
        h('div', { class: 'field' }, h('div', { class: 'fl', text: t('notes') }), note),
        h('div', { class: 'field' }, h('div', { class: 'fl', text: t('prompt_content') }), out)),
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('close')),
        h('button', { type: 'button', class: 'btn primary', onclick() { copyThen(kit, out.value, out); } }, t('copy')),
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
    const inFeatures = S.doc === 'features';
    const locked = planLocked();
    const code = inFeatures ? '' : Core.getStatus(S.md) || 'doing';
    const n = Core.countPending(S.md);
    if (!inFeatures) {
      const label = code === 'approved' ? (locked ? t('initial_plan_approved') : t('plan_confirmed')) : Core.statusLabel(code, lang);
      box.append(h('span', { class: 'state' + (code === 'approved' ? ' pass' : ''), text: label }));
    }
    if (!locked && !(inFeatures && n === 0)) {
      if (n > 0) box.append(h('button', { type: 'button', class: 'btn sm', onclick: pendJump }, t('n_left_to_fill_in', { n })));
      else box.append(h('span', { class: 'muted', text: t('nothing_left_to_fill_in') }));
    }
    if (!inFeatures && code !== 'approved') {
      box.append(h('button', { type: 'button', class: 'btn sm primary', onclick() {
        const r = Core.markPassed(S.md);
        if (!r.ok) { toast(t('n_still_to_fill_in_fill_them_in_before', { n: r.pending })); return; }
        commit(r.md, true);
        settleDocs();
        renderAll();
        toast(t('the_plan_is_confirmed_work_can_start'));
      } }, t('confirm_and_start')));
    }
    if (SERVER && S.folder.state !== 'ready' && S.md.trim()) {
      const save = h('button', { type: 'button', class: 'btn sm', onclick() { openSaveTo(save); } }, t('save_to_a_folder'));
      box.append(save);
    }
    if (S.folder.state === 'ready') {
      const label = t('folder_name_2', { name: S.folder.name });
      // 有地址时，文件夹名就是复制地址的地方，悬停显示完整地址
      if (S.folder.path) box.append(h('button', { type: 'button', class: 'link folder-path', title: S.folder.path, onclick() { copyThen(kit, S.folder.path); } }, label));
      else box.append(h('span', { class: 'muted', text: label }));
      if (S.lastSync) box.append(h('span', { class: 'muted', text: t('synced_at_time', { time: S.lastSync }) }));
      if (S.folder.path) {
        const planBtn = h('button', { type: 'button', class: 'btn sm', title: t('switch_or_create_a_plan'), onclick() { openPlanMenu(planBtn); } }, S.folder.file + ' ▾');
        box.append(planBtn, h('span', { class: 'muted', text: t('handy_for_opening_a_cli') }));
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

  // 历史版本：功能清单每次被改写之前存下的旧版本，可以整份恢复
  function stampText(name) {
    const m = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/.exec(name);
    return m ? m[1] + '-' + m[2] + '-' + m[3] + ' ' + m[4] + ':' + m[5] + ':' + m[6] : name;
  }

  async function openHistory() {
    let items;
    try {
      items = await Folder.historyList(S.folder.handle, featureFile());
    } catch (e) {
      toast(t('could_not_read_the_history_why', { why: errText(e) }));
      return;
    }
    if (!items.length) { toast(t('there_are_no_earlier_versions_yet')); return; }
    const now = featureNames(S.md);
    const rows = h('div', { class: 'hist' });
    const modal = kit.openModal({
      title: t('earlier_versions'),
      body: rows,
      foot: (close) => [h('button', { type: 'button', class: 'btn', onclick: close }, t('close'))],
    });
    for (const it of items) {
      let text;
      try {
        text = await Folder.read(S.folder.handle, ['.shupian', 'history'], it.name);
      } catch (e) {
        toast(t('could_not_read_the_history_why', { why: errText(e) }));
        return;
      }
      if (text == null) continue;
      const lost = featureNames(text).filter((n) => now.indexOf(n) < 0);
      rows.append(h('div', { class: 'hist-row' },
        h('div', { class: 'hist-info' },
          h('div', { text: stampText(it.name) }),
          lost.length ? h('div', { class: 'muted', text: t('removed_features_names', { names: lost.join(LOCALES[LANG].doc.listSep) }) }) : null),
        h('button', { type: 'button', class: 'btn sm', onclick() {
          modal.close();
          commit(text, true);
          renderAll();
          toast(t('restored_the_version', { time: stampText(it.name) }), { label: t('undo'), run: () => undo() });
        } }, t('restore'))));
    }
  }

  function openMenu(anchor) {
    kit.openPop(anchor, (pop) => {
      const add = (l, run, ex) => pop.append(kit.popItem(l, run, ex));
      const f = S.folder;
      const has = S.md.trim() !== '';
      if (has) {
        add(t('contents'), () => openToc(anchor));
        add(t('copy_everything'), () => showText(kit, t('full_plan'), exportText(), t('copy_it_and_send_it_to_the_ai')));
        add(t('copy_prompt'), openAiPrompt);
        add(t('export'), exportPlan);
        pop.append(h('hr'));
        if (S.doc === 'plan') {
          const keep = Core.hasOriginal(S.md);
          add(t('keep_the_original_description'), () => setOriginal(!keep), { on: keep, disabled: planLocked() });
        }
        if (S.doc === 'features' && f.state === 'ready') add(t('earlier_versions'), openHistory);
        pop.append(h('hr'));
      }
      add(t('view_an_example'), loadExample);
      add(t('new_blank_plan'), newBlank);
      add(t('import'), openImport);
      if (SERVER) add(t('install_the_browser_extension'), () => openExtensionHelp(kit));
      if (has) {
        add(t('undo'), () => { if (!undo()) toast(t('there_is_nothing_to_undo')); });
        add(t('redo'), () => { if (!redo()) toast(t('there_is_nothing_to_redo')); });
      }
      pop.append(h('hr'));
      if (f.state === 'off') add(t('folders_need_chrome_or_edge_on_a_computer'), () => {}, { disabled: true });
      else if (f.state === 'none' && SERVER) add(t('save_to_a_folder'), () => openSaveTo(anchor));
      else if (f.state === 'none') add(t('connect_a_folder'), folderConnect);
      else if (f.state === 'need') add(t('allow_the_folder_again'), folderRegrant);
      else {
        add(t('refresh'), () => folderPull(true, false));
        add(t('disconnect_the_folder'), folderDisconnect);
      }
      const closed = index.list.filter((p) => index.open.indexOf(p.id) < 0);
      if (closed.length) {
        pop.append(h('hr'));
        closed.forEach((p) => {
          pop.append(h('div', { class: 'row2' },
            h('button', { type: 'button', onclick() { kit.closePop(); useProject(p); } }, p.name),
            h('button', { type: 'button', class: 'x', title: t('delete_project'), onclick() { kit.closePop(); deleteProject(p.id); } }, '✕')));
        });
      }
      if (!SERVER) {
        pop.append(h('hr'));
        pop.append(h('a', { class: 'menu-link', href: 'download/prompt-plan-helper.exe', download: 'prompt-plan-helper.exe', onclick() { kit.closePop(); } }, t('download_the_desktop_version_windows')));
      }
    });
  }

  function openLang(anchor) {
    kit.openPop(anchor, (pop) => {
      LANG_LIST.forEach((k) => {
        pop.append(kit.popItem(LOCALES[k].name, () => { setLang(k); renderAll(); }, { on: LANG === k }));
      });
    });
  }

  function renderTabs() {
    const bar = h('div', { class: 'tabbar', role: 'tablist' });
    if (SERVER) {
      bar.append(h('button', { type: 'button', role: 'tab', class: 'chip' + (S.view === 'hub' ? ' on' : ''), onclick: showHub }, t('recent')));
    }
    index.open.forEach((id) => {
      const p = index.list.filter((x) => x.id === id)[0];
      if (!p) return;
      const on = S.view === 'plan' && S.project.id === id;
      bar.append(h('span', { class: 'tab' + (on ? ' on' : '') },
        h('button', { type: 'button', role: 'tab', class: 'tab-name', onclick() { if (!on) switchProject(id); } }, p.name),
        h('button', { type: 'button', class: 'tab-x', title: t('close_tab'), 'aria-label': t('close_tab'), onclick() { closeTab(id); } }, '✕')));
    });
    bar.append(h('button', { type: 'button', class: 'chip add', title: t('new_project'), 'aria-label': t('new_project'), onclick() { if (SERVER) showHub(); else createProject(); } }, '＋'));
    return bar;
  }

  function renderHead() {
    clear(head);
    const logo = document.createElement('span');
    logo.className = 'logo';
    logo.innerHTML = ICON_SVG;
    head.append(h('div', { class: 'in' },
      h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('prompt_plan_helper') })),
      h('span', { class: 'sp' }),
      h('button', { type: 'button', class: 'lang', title: t('language'), 'aria-label': t('language'), onclick(e) { openLang(e.currentTarget); } }, LOCALES[LANG].name + ' ▾'),
      h('button', { type: 'button', class: 'x more', title: t('more'), 'aria-label': t('more'), onclick(e) { openMenu(e.currentTarget); } }, '⋯')));
    head.append(h('div', { class: 'in tabs-in' }, renderTabs()));
  }

  // 在别的浏览器里打开的安装页：书签和扩展两种方式
  function renderInstallView() {
    const box = h('div', { class: 'col' });
    Api.call('GET', '/api/extension').then((info) => {
      box.append(h('h2', { text: t('install_the_floating_window') }), installContent(kit, info));
    }, (e) => toast(t('could_not_prepare_the_extension_why', { why: errText(e) })));
    return box;
  }

  function renderHubView() {
    const list = h('div', { class: 'folders' });
    folderRows(list, {
      kit,
      current: S.project && S.project.path ? S.project.path : '',
      onPick: (path) => connectFolderPath(path),
    });
    const actions = h('div', { class: 'row hub-actions' },
      h('button', { type: 'button', class: 'btn primary', onclick: newPlanHere }, t('new_plan')),
      h('button', { type: 'button', class: 'btn', onclick: () => newFolderFlow(connectFolderPath) }, t('new_folder')),
      h('button', { type: 'button', class: 'btn', async onclick() {
        const path = await pickFolderPath();
        if (path) connectFolderPath(path);
      } }, t('choose_another_folder')));
    return h('div', { class: 'col' }, actions, SERVER ? extensionRow(kit) : null, list);
  }

  function renderBody() {
    const st = body.scrollTop;
    kit.closePop();
    clear(body);
    let content;
    if (S.view === 'install') {
      content = renderInstallView();
    } else if (S.view === 'hub') {
      content = renderHubView();
    } else if (!S.md.trim()) {
      content = h('div', { class: 'col' }, h('div', { class: 'doc empty' },
        h('h1', { text: S.project.name || t('new_project') }),
        h('p', { class: 'muted', text: t('there_is_no_plan_yet') }),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn primary', onclick: newBlank }, t('new_blank_plan')),
          h('button', { type: 'button', class: 'btn', onclick: loadExample }, t('view_an_example')),
          h('button', { type: 'button', class: 'btn', onclick: () => openImport() }, t('import')),
          Folder.supported() && S.folder.state !== 'ready' ? h('button', { type: 'button', class: 'btn', onclick: folderConnect }, t('connect_a_folder')) : null)));
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
      if (S.folder.state === 'ready') folderPush().then(() => toast(t('saved')));
      else toast(t('saved_in_the_browser'));
      return;
    }
    if (inField(e)) return;
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); if (!undo()) toast(t('there_is_nothing_to_undo')); }
    else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); if (!redo()) toast(t('there_is_nothing_to_redo')); }
  });
  body.addEventListener('scroll', kit.closePop);
  {
    let depth = 0;
    const hasFiles = (e) => !!(e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0);
    const veil = h('div', { class: 'mask' }, h('div', { class: 'drop-text', text: t('drop_to_open_the_folder') }));
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
