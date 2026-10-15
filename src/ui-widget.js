'use strict';
// 悬浮在别的页面上的小窗：在每一条问题上指出一个东西，或框一块区域、记下当前页面，用列表一次写下多个问题，合成一段话复制给 AI。
// 在浏览器扩展里并且打开过桌面小窗口时，每一行可以选一个功能（输入 @ 切换），再一起记到计划书里对应功能的下面。

function createFeedback(opts) {
  const tools = opts.tools;
  const app = h('div', { class: 'app fb' });
  const body = h('div', { class: 'fb-body' });
  app.append(body);
  const kit = createKit(app);
  // 当前页面的信息和截图，整批问题共用
  const S = { info: null, shot: null };
  // 计划书通道：off（不可用，why 说明原因）、loading、ready、empty（没有计划书或没有功能）
  // projects 里每一项是一份计划书：{ path, name（文件夹名）, file, summary, multi（这个文件夹里有多份）}
  const link = { state: Link.available ? 'loading' : 'off', why: '', projects: [], project: null, features: [], target: null };
  const targetKey = NS + ':target';
  const planName = (x) => ((x.summary && x.summary.title) || x.name) + (x.multi ? '（' + x.file + '）' : '');
  const fileUrl = (x, file) => '/api/file?root=' + encodeURIComponent(x.path) + '&p=' + encodeURIComponent(file);
  // 开始做之后问题记在功能清单里：已有功能清单就读它；计划书已确认但还没有功能清单时由计划书生成，记问题时才创建文件；
  // 计划书还没确认就是计划书本身。返回 { file（记到哪个文件）, exists, text }
  async function readDoc(x) {
    const s = x.summary || {};
    if (s.hasFeatures) return Object.assign({ file: s.featureFile }, await Link.call('GET', fileUrl(x, s.featureFile)));
    const plan = await Link.call('GET', fileUrl(x, x.file));
    if (plan.exists && s.status === 'approved' && s.featureFile) return { file: s.featureFile, exists: true, text: Core.makeFeatureList(plan.text) };
    return Object.assign({ file: x.file }, plan);
  }
  const featLabel = (f) => (f.no ? f.no + ' ' : '') + f.name;

  const list = createIssueList({
    kit,
    features: () => (link.state === 'ready' ? link.features : []),
    placeholder: () => (link.state === 'ready' ? t('describe_the_issue_you_can_several_features') : t('describe_what_to_change')),
    onTarget(f) { link.target = f; rememberTarget(); },
    // 每一条可以带多个元素：行上的按钮再选一个，下面一个元素一行，可以单独去掉
    rowTools(row) {
      return [h('button', { type: 'button', class: 'btn sm', onclick: () => pickInto(row) }, '＋ ' + t('pick_an_element'))];
    },
    rowExtra(row, repaint) {
      const els = row.data.elements || [];
      if (!els.length) return null;
      return h('div', null, els.map((e, i) => h('div', { class: 'chipline' }, h('span', { text: e.path }),
        h('button', { type: 'button', class: 'x', title: t('clear'), onclick() { els.splice(i, 1); repaint(); } }, '✕'))));
    },
    onLayout() { if (opts.onLayout) opts.onLayout(); },
  });

  const logo = document.createElement('span');
  logo.className = 'logo';
  logo.innerHTML = ICON_SVG;
  // 没有顶栏：图标是工具那一排的第一个按钮，点一下收起；按住窗口里的空白处或图标拖动（在 mount 里处理）
  const collapse = h('span', { class: 'collapse', title: t('collapse'), 'aria-label': t('collapse') }, logo);

  function infoLines() {
    if (!S.info) return [];
    const i = S.info;
    const out = [];
    if (i.title) out.push(t('page_title_label') + i.title);
    if (i.headings.length) out.push(t('headings_label') + i.headings.join(' / '));
    if (i.controls.length) out.push(t('controls_label') + i.controls.join(' / '));
    return out;
  }

  const elementsOf = (it) => it.data.elements || [];
  // 多个元素编号，一个元素不编号
  const numbered = (arr, pick) => arr.map((e, i) => (arr.length > 1 ? (i + 1) + ') ' : '') + pick(e)).join(arr.length > 1 ? '\n' : '');

  // 记进计划书时，每条后面带上页面地址和元素
  function whereText(it) {
    const ctx = tools.context();
    const out = [];
    try { const u = new URL(ctx.page); out.push(t('where_page') + u.host + u.pathname); } catch (e) { /* 地址不是标准网址时不写页面 */ }
    elementsOf(it).forEach((e) => out.push(t('where_element') + e.path));
    return out.length ? '（' + out.join('；') + '）' : '';
  }

  function feedbackText() {
    const ctx = tools.context();
    const items = list.items();
    const errors = tools.errors();
    const shot = S.shot ? t('the_screenshot_is_on_the_clipboard_paste_it') : '';
    const one = (it, first) => Core.buildFeedback({
      text: it ? it.text : '', page: ctx.page, view: ctx.view,
      element: it ? numbered(elementsOf(it), (e) => e.path) : '', styles: it ? numbered(elementsOf(it), (e) => e.styles) : '',
      summary: first ? infoLines() : [], errors: first ? errors : [], shot: first ? shot : '',
    }, LANG);
    if (items.length <= 1) return one(items[0], true);
    return items.map((it, i) => (i + 1) + '. ' + (it.fs.length ? it.fs.map((f) => '@ ' + featLabel(f)).join(' ') : '') + '\n' + one(it, i === 0)).join('\n');
  }

  async function loadPlan() {
    link.features = [];
    if (!link.project) { link.state = 'empty'; return; }
    const f = await readDoc(link.project);
    if (!f.exists) { link.state = 'empty'; return; }
    link.features = Core.issueList(f.text);
    const saved = LS.get(targetKey, null) || {};
    const keep = link.target || (saved.path === link.project.path && saved.file === link.project.file ? saved : null);
    link.target = (keep && link.features.filter((x) => x.no === keep.no && x.name === keep.name)[0]) || link.features[0] || null;
    link.state = link.target ? 'ready' : 'empty';
  }

  async function loadLink() {
    if (!Link.available) return;
    link.state = 'loading';
    try {
      const data = await Link.call('GET', '/api/projects');
      link.projects = [];
      data.claude.concat(data.history).forEach((x) => (x.plans || []).forEach((p) => {
        link.projects.push({ path: x.path, name: x.name, file: p.file, summary: p, active: x.active, current: p.file === x.file, multi: x.plans.length > 1 });
      }));
      const same = (a, b) => b && a.path === b.path && a.file === b.file;
      const saved = LS.get(targetKey, null);
      link.project = link.projects.filter((x) => same(x, saved))[0] || link.projects.filter((x) => same(x, data.last))[0]
        || link.projects.filter((x) => x.active && x.current)[0] || link.projects.filter((x) => x.current)[0] || null;
      await loadPlan();
    } catch (e) {
      link.state = 'off';
      link.why = e.message === 'unpaired' ? 'unpaired' : 'down';
    }
    list.syncTargets(link.state === 'ready' ? link.target : null);
    render();
  }

  function rememberTarget() {
    if (link.project && link.target) LS.set(targetKey, { path: link.project.path, file: link.project.file, no: link.target.no, name: link.target.name });
  }

  // 换一份计划书
  function choosePlan(anchor) {
    kit.openPop(anchor, (pop, close) => {
      link.projects.forEach((x) => pop.append(h('button', { type: 'button', class: x === link.project ? 'on' : '', onclick: async () => {
        close();
        link.project = x;
        link.target = null;
        try { await loadPlan(); } catch (e) { link.state = 'off'; link.why = 'down'; }
        rememberTarget();
        list.syncTargets(link.state === 'ready' ? link.target : null);
        render();
      } }, planName(x))));
    });
  }

  async function record() {
    const items = list.items();
    if (!items.length) { kit.toast(t('write_the_issue_first')); return; }
    if (items.some((it) => !it.fs.length)) { kit.toast(t('choose_a_feature_for_every_issue')); return; }
    try {
      const f = await readDoc(link.project);
      const feats = f.exists ? Core.issueList(f.text) : [];
      // 一条问题 @ 了几个功能，就记到每个功能下面
      const hits = [];
      items.forEach((it) => it.fs.forEach((g) => hits.push({ it, g, hit: feats.filter((x) => x.no === g.no && x.name === g.name)[0] })));
      const lost = hits.filter((x) => !x.hit);
      if (lost.length) {
        await loadPlan();
        list.syncTargets(link.state === 'ready' ? link.target : null);
        render();
        kit.toast(t('these_features_are_no_longer_in_the_plan', { names: lost.map((x) => featLabel(x.g)).join(LOCALES[LANG].doc.listSep) }));
        return;
      }
      const r = Core.addIssues(f.text, hits.map((x) => ({ featureLine: x.hit.featureLine, text: x.it.text + whereText(x.it) })), Core.today());
      if (!r.ok) { kit.toast(t('write_the_issue_first')); return; }
      await Link.call('PUT', fileUrl(link.project, f.file), r.md);
      list.reset(link.target);
      render();
      kit.toast(t('added_n_issues_to_the_plan', { n: r.added }));
    } catch (e) {
      kit.toast(t('could_not_add_to_the_plan_why', { why: e.message === 'down' ? t('the_desktop_window_did_not_respond') : errText(e) }));
    }
  }

  function setShot(r) {
    if (S.shot && S.shot.url) URL.revokeObjectURL(S.shot.url);
    S.shot = r ? { blob: r.blob, kind: r.kind, url: URL.createObjectURL(r.blob) } : null;
  }

  // 选取一个元素，加到指定的这一条上；可以连着选多个
  async function pickInto(row) {
    const r = await tools.pick();
    if (!r) return;
    (row.data.elements = row.data.elements || []).push({ path: r.path, styles: r.styles });
    list.paint();
    render();
  }

  async function region() {
    try {
      const r = await tools.region();
      if (!r) return;
      setShot(r);
      render();
    } catch (e) {
      kit.toast(t('capture_failed_why', { why: errText(e) }));
    }
  }

  async function currentPage() {
    try {
      const r = await tools.page();
      S.info = r.info;
      setShot(r.shot);
      render();
    } catch (e) {
      kit.toast(t('capture_failed_why', { why: errText(e) }));
    }
  }

  async function copyShot() {
    if (!S.shot) return;
    if (await copyImage(S.shot.blob)) { kit.toast(t('screenshot_copied')); return; }
    kit.toast(t('downloaded_name', { name: download(S.shot.blob, 'screenshot', 'webp', 'image/webp') }));
  }

  function render() {
    clear(body);
    body.append(h('div', { class: 'row tight' },
      collapse,
      h('button', { type: 'button', class: 'btn', onclick: region }, t('region_screenshot')),
      h('button', { type: 'button', class: 'btn', onclick: currentPage }, t('current_page'))));
    if (S.info) {
      body.append(h('div', { class: 'chipline' }, h('span', { text: t('current_page_title', { title: S.info.title || tools.context().page }) }),
        h('button', { type: 'button', class: 'x', title: t('clear'), onclick() { S.info = null; render(); } }, '✕')));
    }
    if (S.shot) {
      body.append(h('div', { class: 'chipline' },
        h('img', { class: 'shot', src: S.shot.url, alt: t('screenshot') }),
        h('span', { text: S.shot.kind === 'simulated' ? t('kind_fake_shot') : t('kind_shot') }),
        h('button', { type: 'button', class: 'x', title: t('clear'), onclick() { setShot(null); render(); } }, '✕')));
    }
    const ready = link.state === 'ready';
    if (ready) {
      if (link.projects.length > 1) {
        const plan = h('button', { type: 'button', class: 'link plan-pick', title: t('change_the_plan') }, planName(link.project) + ' ▾');
        plan.addEventListener('click', () => choosePlan(plan));
        body.append(plan);
      } else {
        body.append(h('div', { class: 'muted', text: planName(link.project) }));
      }
    } else if (link.state !== 'loading' && Link.available) {
      const why = link.state === 'empty' ? (link.project ? t('this_plan_has_no_features_yet') : t('no_folder_with_a_plan_was_found'))
        : link.why === 'unpaired' ? t('open_the_desktop_window_first_to_add_issues') : t('the_desktop_window_did_not_respond_only');
      body.append(h('p', { class: 'hint', text: why }));
    }
    body.append(list.el);
    body.append(h('div', { class: 'row' },
      ready ? h('button', { type: 'button', class: 'btn primary', onclick: record }, t('add_to_plan')) : null,
      h('button', { type: 'button', class: ready ? 'btn' : 'btn primary', onclick() { copyThen(kit, feedbackText()); } }, t('copy_text')),
      S.shot ? h('button', { type: 'button', class: 'btn', onclick: copyShot }, t('copy_screenshot')) : null));
    // 内容长高后，窗口要重新拉回屏幕内
    setTimeout(() => { if (opts.onLayout) opts.onLayout(); }, 0);
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && kit.escape()) e.preventDefault(); });
  render();
  loadLink();
  return { el: app };
}
