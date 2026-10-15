'use strict';
// 悬浮在别的页面上的小窗：指出一个东西、框一块区域或记下当前页面、写一句话，合成一段话复制给 AI。
// 一次可以攒多条问题。在浏览器扩展里并且打开过桌面小窗口时，每条问题可以选一个功能（输入 @ 切换），
// 再一起记到计划书里对应功能的下面。

function createFeedback(opts) {
  const tools = opts.tools;
  const app = h('div', { class: 'app fb' });
  const head = h('div', { class: 'head' });
  const body = h('div', { class: 'fb-body' });
  app.append(head, body);
  const kit = createKit(app);
  // 当前正在写的一条
  const S = { text: '', element: '', styles: '', info: null, shot: null };
  // 已经写好、还没有记进计划书的
  const queue = [];
  // 计划书通道：off（不可用，why 说明原因）、loading、ready、empty（没有计划书或没有功能）
  // projects 里每一项是一份计划书：{ path, name（文件夹名）, file, summary, multi（这个文件夹里有多份）}
  const link = { state: Link.available ? 'loading' : 'off', why: '', projects: [], project: null, features: [], target: null };
  const targetKey = NS + ':target';
  const planName = (x) => ((x.summary && x.summary.title) || x.name) + (x.multi ? '（' + x.file + '）' : '');
  const planUrl = (x) => '/api/file?root=' + encodeURIComponent(x.path) + '&p=' + encodeURIComponent(x.file);
  const featLabel = (f) => (f.no ? f.no + ' ' : '') + f.name;

  const logo = document.createElement('span');
  logo.className = 'logo';
  logo.innerHTML = ICON_SVG;
  head.append(h('div', { class: 'in drag' },
    h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('标记要修改的位置') })),
    h('span', { class: 'sp' }),
    h('button', { type: 'button', class: 'x', title: t('关闭'), 'aria-label': t('关闭'), onclick: opts.onClose }, '✕')));

  function infoLines() {
    if (!S.info) return [];
    const i = S.info;
    const out = [];
    if (i.title) out.push((LANG === 'zh' ? '页面标题：' : 'Page title: ') + i.title);
    if (i.headings.length) out.push((LANG === 'zh' ? '页面上能看到的标题：' : 'Headings on the page: ') + i.headings.join(' / '));
    if (i.controls.length) out.push((LANG === 'zh' ? '页面上能点的东西：' : 'Things to click on the page: ') + i.controls.join(' / '));
    return out;
  }

  function whereText() {
    const ctx = tools.context();
    const out = [];
    try { const u = new URL(ctx.page); out.push((LANG === 'zh' ? '页面：' : 'Page: ') + u.host + u.pathname); } catch (e) { /* 地址不是标准网址时不写页面 */ }
    if (S.element) out.push((LANG === 'zh' ? '元素：' : 'Element: ') + S.element);
    return out.length ? '（' + out.join('；') + '）' : '';
  }

  // 正在写的这一条的快照；没写字就是 null
  function snapshot() {
    const text = S.text.trim();
    if (!text) return null;
    const ctx = tools.context();
    return {
      text, element: S.element, styles: S.styles, page: ctx.page, view: ctx.view, where: whereText(),
      no: link.target ? link.target.no : '', name: link.target ? link.target.name : '', label: link.target ? featLabel(link.target) : '',
    };
  }

  function feedbackText() {
    const cur = snapshot();
    const all = queue.concat(cur ? [cur] : []);
    const errors = tools.errors();
    const shot = S.shot ? t('截图已复制到剪贴板，请另行粘贴') : '';
    if (all.length <= 1) {
      const one = all[0];
      const ctx = tools.context();
      return Core.buildFeedback({
        text: one ? one.text : '', page: one ? one.page : ctx.page, view: one ? one.view : ctx.view, element: one ? one.element : S.element,
        styles: one ? one.styles : S.styles, summary: infoLines(), errors, shot,
      }, LANG);
    }
    return all.map((it, i) => (i + 1) + '. ' + (it.label ? '@ ' + it.label : '') + '\n' + Core.buildFeedback({
      text: it.text, page: it.page, view: it.view, element: it.element, styles: it.styles,
      summary: i === 0 ? infoLines() : [], errors: i === 0 ? errors : [], shot: i === 0 ? shot : '',
    }, LANG)).join('\n');
  }

  async function loadPlan() {
    link.features = [];
    if (!link.project) { link.state = 'empty'; return; }
    const f = await Link.call('GET', planUrl(link.project));
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
    render();
  }

  function rememberTarget() {
    if (link.project && link.target) LS.set(targetKey, { path: link.project.path, file: link.project.file, no: link.target.no, name: link.target.name });
  }

  // 功能列表，下面接可换的计划书
  function chooseTarget(anchor, after) {
    kit.openPop(anchor, (pop, close) => {
      link.features.forEach((f) => pop.append(h('button', { type: 'button', class: f === link.target ? 'on' : '', onclick() {
        link.target = f;
        rememberTarget();
        close();
        render();
        if (after) after();
      } }, featLabel(f))));
      if (link.projects.length > 1) {
        pop.append(h('hr'));
        link.projects.forEach((x) => pop.append(h('button', { type: 'button', class: x === link.project ? 'on' : '', onclick: async () => {
          close();
          link.project = x;
          link.target = null;
          try { await loadPlan(); } catch (e) { link.state = 'off'; link.why = 'down'; }
          rememberTarget();
          render();
        } }, t('计划书：{name}', { name: planName(x) }))));
      }
    });
  }

  // 把正在写的这一条放进列表，输入框清空准备写下一条
  function addAnother() {
    const cur = snapshot();
    if (!cur) { kit.toast(t('请先写下问题。')); return; }
    queue.push(cur);
    S.text = '';
    S.element = '';
    S.styles = '';
    render();
  }

  async function record() {
    const cur = snapshot();
    const all = queue.concat(cur ? [cur] : []);
    if (!all.length) { kit.toast(t('请先写下问题。')); return; }
    try {
      const f = await Link.call('GET', planUrl(link.project));
      const feats = f.exists ? Core.issueList(f.text) : [];
      const items = all.map((it) => ({ it, hit: feats.filter((x) => x.no === it.no && x.name === it.name)[0] }));
      const lost = items.filter((x) => !x.hit);
      if (lost.length) {
        await loadPlan();
        render();
        kit.toast(t('计划书里已经没有这些功能：{names}，请重新选择。', { names: lost.map((x) => x.it.label || t('未选功能')).join('、') }));
        return;
      }
      const r = Core.addIssues(f.text, items.map((x) => ({ featureLine: x.hit.featureLine, text: x.it.text + x.it.where })), Core.today());
      if (!r.ok) { kit.toast(t('请先写下问题。')); return; }
      await Link.call('PUT', planUrl(link.project), r.md);
      queue.length = 0;
      S.text = '';
      render();
      kit.toast(t('已记 {n} 条问题到计划书。', { n: r.added }));
    } catch (e) {
      kit.toast(t('没有记进计划书：{why}', { why: e.message === 'down' ? t('桌面小窗口没有响应。') : errText(e) }));
    }
  }

  function setShot(r) {
    if (S.shot && S.shot.url) URL.revokeObjectURL(S.shot.url);
    S.shot = r ? { blob: r.blob, kind: r.kind, url: URL.createObjectURL(r.blob) } : null;
  }

  async function pick() {
    const r = await tools.pick();
    if (!r) return;
    S.element = r.path;
    S.styles = r.styles;
    render();
  }

  async function region() {
    try {
      const r = await tools.region();
      if (!r) return;
      setShot(r);
      render();
    } catch (e) {
      kit.toast(t('截图失败：{why}', { why: errText(e) }));
    }
  }

  async function currentPage() {
    try {
      const r = await tools.page();
      S.info = r.info;
      setShot(r.shot);
      render();
    } catch (e) {
      kit.toast(t('截图失败：{why}', { why: errText(e) }));
    }
  }

  async function copyShot() {
    if (!S.shot) return;
    if (await copyImage(S.shot.blob)) { kit.toast(t('截图已复制。')); return; }
    kit.toast(t('已下载：{name}', { name: download(S.shot.blob, 'screenshot', 'webp', 'image/webp') }));
  }

  function render() {
    clear(body);
    body.append(h('div', { class: 'row tight' },
      h('button', { type: 'button', class: 'btn', onclick: pick }, t('选取元素')),
      h('button', { type: 'button', class: 'btn', onclick: region }, t('区域截图')),
      h('button', { type: 'button', class: 'btn', onclick: currentPage }, t('当前页面'))));
    queue.forEach((it, i) => {
      body.append(h('div', { class: 'chipline queued' },
        h('span', { text: (it.label ? '@ ' + it.label + '　' : '') + it.text }),
        h('button', { type: 'button', class: 'x', title: t('删除'), 'aria-label': t('删除'), onclick() { queue.splice(i, 1); render(); } }, '✕')));
    });
    if (S.element) {
      body.append(h('div', { class: 'chipline' }, h('span', { text: S.element }),
        h('button', { type: 'button', class: 'x', title: t('清除'), onclick() { S.element = ''; S.styles = ''; render(); } }, '✕')));
    }
    if (S.info) {
      body.append(h('div', { class: 'chipline' }, h('span', { text: t('当前页面：{title}', { title: S.info.title || tools.context().page }) }),
        h('button', { type: 'button', class: 'x', title: t('清除'), onclick() { S.info = null; render(); } }, '✕')));
    }
    if (S.shot) {
      body.append(h('div', { class: 'chipline' },
        h('img', { class: 'shot', src: S.shot.url, alt: t('截图') }),
        h('span', { text: S.shot.kind }),
        h('button', { type: 'button', class: 'x', title: t('清除'), onclick() { setShot(null); render(); } }, '✕')));
    }
    const ready = link.state === 'ready';
    if (ready) {
      const label = h('button', { type: 'button', class: 'btn sm target', title: t('点击更换功能') }, '@ ' + featLabel(link.target));
      label.addEventListener('click', () => chooseTarget(label));
      body.append(h('div', { class: 'field' }, label, h('div', { class: 'muted', text: planName(link.project) })));
    } else if (link.state !== 'loading' && Link.available) {
      const why = link.state === 'empty' ? (link.project ? t('这个计划书里还没有功能。') : t('没有找到带计划书的文件夹。'))
        : link.why === 'unpaired' ? t('先打开桌面小窗口，才能记进计划书。') : t('桌面小窗口没有响应，只能复制文字。');
      body.append(h('p', { class: 'hint', text: why }));
    }
    const ta = h('textarea', { class: 'in', rows: 3, placeholder: ready ? t('说明遇到的问题，输入 @ 选择功能。') : t('说明需要修改的内容。'), value: S.text, 'aria-label': t('修改说明') });
    ta.addEventListener('input', () => {
      S.text = ta.value;
      autoGrow(ta);
      if (ready && /@$/.test(ta.value)) {
        ta.value = ta.value.slice(0, -1);
        S.text = ta.value;
        chooseTarget(ta, () => ta.focus({ preventScroll: true }));
      }
    });
    body.append(ta);
    body.append(h('div', { class: 'row' },
      h('button', { type: 'button', class: 'btn', onclick: addAnother }, t('再写一条')),
      ready ? h('button', { type: 'button', class: 'btn primary', onclick: record }, t('记到计划书')) : null,
      h('button', { type: 'button', class: ready ? 'btn' : 'btn primary', onclick() { copyThen(kit, feedbackText()); } }, t('复制文字')),
      S.shot ? h('button', { type: 'button', class: 'btn', onclick: copyShot }, t('复制截图')) : null));
    // 内容长高后，窗口要重新拉回屏幕内
    setTimeout(() => { autoGrow(ta); if (opts.onLayout) opts.onLayout(); }, 0);
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && kit.escape()) e.preventDefault(); });
  render();
  loadLink();
  return { el: app };
}
