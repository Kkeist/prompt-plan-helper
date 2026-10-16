'use strict';
// 悬浮在别的页面上的小窗：在每一条问题上指出一个东西，或框一块区域、记下当前页面，用列表一次写下多个问题，合成一段话复制给 AI。
// 在浏览器扩展里并且打开过桌面小窗口时，每一行可以选一个功能（输入 @ 切换），再一起记到计划书里对应功能的下面。

function createFeedback(opts) {
  const tools = opts.tools;
  const app = h('div', { class: 'app fb' });
  const body = h('div', { class: 'fb-body' });
  const foot = h('div', { class: 'fb-foot' });
  const kit = createKit(app);
  // 当前页面的信息和截图，整批问题共用
  const S = { info: null, shot: null, naming: null };
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

  // 未提交的问题草稿：能连到计划书时存在项目文件夹里（桌面窗口读同一份），否则存在这个页面的浏览器本地；写入按顺序排队
  const draftKey = NS + ':draft';
  let draftTimer = 0;
  let draftChain = Promise.resolve();
  let draftExists = false;
  const draftUrl = () => (link.state === 'ready' && link.project ? fileUrl(link.project, Draft.rel(link.project.file)) : '');

  async function loadDraft() {
    const url = draftUrl();
    if (!url) return LS.get(draftKey, []);
    const r = await Link.call('GET', url);
    return r.exists ? Draft.parse(r.text) : [];
  }

  function queueDraft(rows) {
    if (!rows.length && !draftExists) return;
    draftExists = rows.length > 0;
    const url = draftUrl();
    draftChain = draftChain.then(async () => {
      if (url) await Link.call('PUT', url, Draft.text(rows));
      else if (!LS.set(draftKey, rows)) throw new Error(t('browser_storage_is_full_and_the_latest'));
    }).catch((e) => kit.toast(t('could_not_save_the_draft_why', { why: e.message === 'down' ? t('the_desktop_window_did_not_respond') : errText(e) })));
  }

  async function restoreDraft() {
    try {
      const rows = await loadDraft();
      if (rows.length && !list.items().length) { draftExists = true; list.restore(rows); }
    } catch (e) {
      kit.toast(t('could_not_load_the_draft_why', { why: errText(e) }));
    }
  }

  const list = createIssueList({
    kit,
    features: () => (link.state === 'ready' ? link.features : Parts.list()),
    placeholder: () => (link.state === 'ready' ? t('describe_the_issue_you_can_several_features')
      : Parts.list().length ? t('describe_the_issue_you_can_several_parts') : t('describe_what_to_change')),
    onTarget(f) { if (link.state === 'ready') { link.target = f; rememberTarget(); } },
    onChange() {
      clearTimeout(draftTimer);
      draftTimer = setTimeout(() => queueDraft(list.snapshot()), 500);
    },
    // 每一条可以带多个元素：下面一个元素一行，可以单独去掉
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
  // 标题栏：按住拖动窗口（在 mount 里处理），右边的按钮收起成悬浮图标
  const head = h('div', { class: 'fb-head' }, logo, h('span', { class: 'fb-title', text: t('page_feedback') }),
    h('button', { type: 'button', class: 'btn sm collapse', onclick() { if (opts.onClose) opts.onClose(); } }, t('collapse')));
  app.append(head, body, foot);
  const section = (title, hint) => h('div', { class: 'fb-sec' }, h('div', { class: 'fb-sec-title', text: title }), hint ? h('p', { class: 'hint', text: hint }) : null);

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
    const text = items.length <= 1 ? one(items[0], true)
      : items.map((it, i) => (i + 1) + '. ' + (it.fs.length ? it.fs.map((f) => '@ ' + featLabel(f)).join(' ') : '') + '\n' + one(it, i === 0)).join('\n');
    return extraLines(items).concat(text).join('\n');
  }

  // 没有连计划书时：被 @ 的部件在页面上的位置，和调过的参数
  function extraLines(items) {
    if (link.state === 'ready') return [];
    const out = [];
    const seen = [];
    items.forEach((it) => it.fs.forEach((f) => {
      if (f.sel && seen.indexOf(f.name) < 0) { seen.push(f.name); out.push(t('where_part') + f.name + '（' + f.sel + '）'); }
    }));
    const stage = Stages.current();
    if (stage) out.push(t('stage_label', { name: stage.name }));
    Tune.changed().forEach((c) => out.push(t('tuned_value', { label: c.label, value: c.value, was: c.was })));
    return out.length ? [out.join('\n')] : [];
  }

  // ---------- 本页部件：没有连计划书时，这个网页上有什么 ----------

  const samePart = (a, b) => !!(a && b && a.name === b.name);
  const keepTarget = () => { const cur = list.defaultF; return cur ? Parts.list().filter((x) => samePart(x, cur))[0] || null : null; };

  async function circlePart() {
    const r = await tools.pick();
    if (!r) return;
    S.naming = { sel: r.sel, name: r.label };
    render();
    setTimeout(() => { const i = body.querySelector('.part-name'); if (i) { i.focus({ preventScroll: true }); i.select(); } }, 0);
  }

  function savePart(name) {
    const v = name.trim();
    if (!v) { kit.toast(t('the_name_cannot_be_empty')); return; }
    if (Parts.list().some((x) => x.declared && x.name === v)) { kit.toast(t('there_is_already_a_what_with_this_name', { what: t('part') })); return; }
    if (!Parts.add(v, S.naming.sel)) { kit.toast(t('browser_storage_is_full_and_the_latest')); return; }
    S.naming = null;
    list.syncTargets(keepTarget());
    render();
  }

  function removePart(p) {
    Parts.remove(p.name);
    list.syncTargets(keepTarget());
    render();
  }

  // 点部件：当前这一条问题 @ 它，之后新加的也默认是它
  function usePart(p) {
    const row = list.focusedRow();
    if (!row.text.trim()) row.fs = [p];
    else if (!row.fs.some((x) => samePart(x, p))) row.fs.push(p);
    list.defaultF = p;
    list.paint();
    row.ta.focus({ preventScroll: true });
  }

  function partsBlock() {
    if (link.state === 'ready') return null;
    const box = section(t('parts'), Parts.list().length ? t('click_a_part_to_aim_the_note_at_it') : '');
    box.classList.add('parts');
    box.append(h('div', { class: 'row tight' }, h('button', { type: 'button', class: 'btn', onclick: circlePart }, t('circle_a_part'))));
    if (S.naming) {
      const input = h('input', { class: 'in part-name', placeholder: t('part_name'), 'aria-label': t('part_name'), value: S.naming.name });
      input.addEventListener('keydown', (e) => {
        if (e.isComposing) return;
        if (e.key === 'Enter') { e.preventDefault(); savePart(input.value); }
        if (e.key === 'Escape') { e.preventDefault(); S.naming = null; render(); }
      });
      box.append(h('div', { class: 'row tight' }, input,
        h('button', { type: 'button', class: 'btn sm primary', onclick: () => savePart(input.value) }, t('add')),
        h('button', { type: 'button', class: 'btn sm', onclick() { S.naming = null; render(); } }, t('cancel'))));
    }
    const on = list.defaultF;
    const chips = Parts.list().map((p) => h('span', { class: 'ftag part' },
      h('button', { type: 'button', class: 'btn sm' + (samePart(on, p) ? ' primary' : ''), title: p.sel, onclick: () => usePart(p) }, p.name),
      p.declared ? null : h('button', { type: 'button', class: 'x', title: t('remove_this_part'), 'aria-label': t('remove_this_part'), onclick: () => removePart(p) }, '✕')));
    if (chips.length) box.append(h('div', { class: 'part-list' }, chips));
    return box;
  }

  // 进度档位：一排选项，点一个就把那一档的所有参数一起设好
  function stagesBlock() {
    const stages = Stages.list();
    if (!stages.length || !Tune.list().length) return null;
    const box = section(t('stage_title'));
    const row = h('div', { class: 'stage-row' });
    stages.forEach((s) => row.append(h('button', { type: 'button', class: 'chip' + (Stages.current() === s ? ' on' : ''), onclick() {
      Stages.apply(s);
      const top = body.scrollTop;
      render();
      body.scrollTop = top;
    } }, s.name)));
    box.append(row);
    return box;
  }

  // 网页声明的可调参数：滑块加数字框，调了立刻交给网页，并记在这个浏览器里
  function tuneBlock() {
    const items = Tune.list();
    if (!items.length) return null;
    const box = section(t('tune_title'));
    box.classList.add('tune');
    // 手动改了值，进度档位的高亮跟着更新
    const syncStages = () => Array.prototype.forEach.call(body.querySelectorAll('.stage-row .chip'), (b, i) => b.classList.toggle('on', Stages.list()[i] === Stages.current()));
    items.forEach((x) => {
      const name = x.label || x.key;
      const step = x.step || (x.max - x.min) / 100;
      const show = (v) => String(Number(Number(v).toFixed(4)));
      const range = h('input', { class: 'tune-range', type: 'range', min: x.min, max: x.max, step, value: Tune.value(x), 'aria-label': name });
      const num = h('input', { class: 'in tune-num', type: 'text', inputmode: 'decimal', 'aria-label': name, value: show(Tune.value(x)) });
      range.addEventListener('input', () => { num.value = show(Tune.set(x, range.value)); syncStages(); });
      num.addEventListener('input', () => { num.value = num.value.replace(/[^0-9.-]/g, ''); });
      num.addEventListener('change', () => {
        const v = Tune.set(x, num.value);
        num.value = show(v);
        range.value = String(v);
        syncStages();
      });
      box.append(h('div', { class: 'tune-row' }, h('span', { class: 'tune-label', text: name }), range, num));
    });
    return box;
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
    if (!Link.available) { await restoreDraft(); render(); return; }
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
    await restoreDraft();
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
        // 换计划书之前，把现在写的存进原来那份的草稿
        clearTimeout(draftTimer);
        queueDraft(list.snapshot());
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
      clearTimeout(draftTimer);
      queueDraft([]);
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
    clear(foot);
    const ready = link.state === 'ready';
    const where = section(t('point_it_out'));
    where.append(h('div', { class: 'actions three' },
      h('button', { type: 'button', class: 'btn', onclick: () => pickInto(list.focusedRow()) }, t('pick_an_element')),
      h('button', { type: 'button', class: 'btn', onclick: region }, t('region_screenshot')),
      h('button', { type: 'button', class: 'btn', onclick: currentPage }, t('current_page'))));
    if (S.info) {
      where.append(h('div', { class: 'chipline' }, h('span', { text: t('current_page_title', { title: S.info.title || tools.context().page }) }),
        h('button', { type: 'button', class: 'x', title: t('clear'), onclick() { S.info = null; render(); } }, '✕')));
    }
    if (S.shot) {
      where.append(h('div', { class: 'chipline' },
        h('img', { class: 'shot', src: S.shot.url, alt: t('screenshot') }),
        h('span', { text: S.shot.kind === 'simulated' ? t('kind_fake_shot') : t('kind_shot') }),
        h('button', { type: 'button', class: 'x', title: t('clear'), onclick() { setShot(null); render(); } }, '✕')));
    }
    body.append(where);
    if (ready) {
      const plan = section(t('plan'));
      if (link.projects.length > 1) {
        const pick = h('button', { type: 'button', class: 'link plan-pick', title: t('change_the_plan') }, planName(link.project) + ' ▾');
        pick.addEventListener('click', () => choosePlan(pick));
        plan.append(pick);
      } else {
        plan.append(h('div', { class: 'hint', text: planName(link.project) }));
      }
      body.append(plan);
    } else if (link.state !== 'loading' && Link.available) {
      const why = link.state === 'empty' ? (link.project ? t('this_plan_has_no_features_yet') : t('no_folder_with_a_plan_was_found'))
        : link.why === 'unpaired' ? t('open_the_desktop_window_first_to_add_issues') : t('the_desktop_window_did_not_respond_only');
      body.append(h('div', { class: 'fb-sec' }, h('p', { class: 'hint', text: why })));
    }
    [partsBlock(), stagesBlock(), tuneBlock()].forEach((x) => { if (x) body.append(x); });
    const write = section(t('write_a_note'));
    write.append(list.el);
    body.append(write);
    foot.append(h('div', { class: 'actions' },
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
