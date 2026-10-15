'use strict';
// 悬浮在别的页面上的小窗：指出一个东西、框一块区域或记下当前页面、写一句话，合成一段话复制给 AI。
// 在浏览器扩展里并且打开过桌面小窗口时，可以选一个功能（输入 @ 切换），把问题直接记到计划书的该功能下面。

function createFeedback(opts) {
  const tools = opts.tools;
  const app = h('div', { class: 'app fb' });
  const head = h('div', { class: 'head' });
  const body = h('div', { class: 'fb-body' });
  app.append(head, body);
  const kit = createKit(app);
  const S = { text: '', element: '', styles: '', info: null, shot: null };
  // 计划书通道：off（不可用，why 说明原因）、loading、ready、empty（没有计划书或没有功能）
  const link = { state: Link.available ? 'loading' : 'off', why: '', projects: [], project: null, features: [], target: null };
  const targetKey = NS + ':target';
  const planName = (x) => (x.summary && x.summary.title) || x.name;
  const planUrl = (x) => '/api/file?root=' + encodeURIComponent(x.path) + '&p=' + encodeURIComponent(x.summary.file);
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

  function feedbackText() {
    const ctx = tools.context();
    return Core.buildFeedback({
      text: S.text, page: ctx.page, view: ctx.view, element: S.element, styles: S.styles, summary: infoLines(),
      errors: tools.errors(), shot: S.shot ? t('截图已复制到剪贴板，请另行粘贴') : '',
    }, LANG);
  }

  async function loadPlan() {
    link.features = [];
    if (!link.project) { link.state = 'empty'; return; }
    const f = await Link.call('GET', planUrl(link.project));
    if (!f.exists) { link.state = 'empty'; return; }
    link.features = Core.issueList(f.text);
    const saved = LS.get(targetKey, null) || {};
    const keep = link.target || (saved.path === link.project.path ? saved : null);
    link.target = (keep && link.features.filter((x) => x.no === keep.no && x.name === keep.name)[0]) || link.features[0] || null;
    link.state = link.target ? 'ready' : 'empty';
  }

  async function loadLink() {
    if (!Link.available) return;
    link.state = 'loading';
    try {
      const data = await Link.call('GET', '/api/projects');
      link.projects = data.claude.concat(data.history).filter((x) => x.summary);
      const saved = LS.get(targetKey, null) || {};
      link.project = link.projects.filter((x) => x.path === saved.path)[0] || link.projects.filter((x) => x.active)[0] || link.projects[0] || null;
      await loadPlan();
    } catch (e) {
      link.state = 'off';
      link.why = e.message === 'unpaired' ? 'unpaired' : 'down';
    }
    render();
  }

  function rememberTarget() {
    if (link.project && link.target) LS.set(targetKey, { path: link.project.path, no: link.target.no, name: link.target.name });
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

  function whereText() {
    const ctx = tools.context();
    const out = [];
    try { const u = new URL(ctx.page); out.push((LANG === 'zh' ? '页面：' : 'Page: ') + u.host + u.pathname); } catch (e) { /* 地址不是标准网址时不写页面 */ }
    if (S.element) out.push((LANG === 'zh' ? '元素：' : 'Element: ') + S.element);
    return out.length ? '（' + out.join('；') + '）' : '';
  }

  async function record() {
    if (!S.text.trim()) { kit.toast(t('请先写下问题。')); return; }
    try {
      const f = await Link.call('GET', planUrl(link.project));
      const hit = f.exists && Core.issueList(f.text).filter((x) => x.no === link.target.no && x.name === link.target.name)[0];
      if (!hit) {
        await loadPlan();
        render();
        kit.toast(t('计划书里已经没有这个功能，请重新选择。'));
        return;
      }
      const r = Core.addIssue(f.text, hit.featureLine, S.text.trim() + whereText(), Core.today());
      if (!r.ok) { kit.toast(t('请先写下问题。')); return; }
      await Link.call('PUT', planUrl(link.project), r.md);
      const name = featLabel(link.target);
      S.text = '';
      render();
      kit.toast(t('已记到「{name}」。', { name }));
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
