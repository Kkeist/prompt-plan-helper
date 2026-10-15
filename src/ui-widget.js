'use strict';
// 悬浮在别的页面上的小窗：指出一个东西、截一张图、写一句话，合成一段话复制给 AI。

function createFeedback(opts) {
  const tools = opts.tools;
  const app = h('div', { class: 'app fb' });
  const head = h('div', { class: 'head' });
  const body = h('div', { class: 'fb-body' });
  app.append(head, body);
  const kit = createKit(app);
  const S = { text: '', element: '', styles: '', shot: null };

  const logo = document.createElement('span');
  logo.className = 'logo';
  logo.innerHTML = ICON_SVG;
  head.append(h('div', { class: 'in drag' },
    h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('改哪里') })),
    h('span', { class: 'sp' }),
    h('button', { type: 'button', class: 'x', title: t('关闭'), 'aria-label': t('关闭'), onclick: opts.onClose }, '✕')));

  function feedbackText() {
    const ctx = tools.context();
    return Core.buildFeedback({
      text: S.text, page: ctx.page, view: ctx.view, element: S.element, styles: S.styles,
      errors: tools.errors(), shot: S.shot ? t('截图在剪贴板里，请另外粘贴') : '',
    }, LANG);
  }

  async function pick() {
    const r = await tools.pick();
    if (!r) return;
    S.element = r.path;
    S.styles = r.styles;
    render();
  }

  async function shot() {
    try {
      const r = await tools.capture();
      if (!r) { kit.toast(t('这个页面没有截下来。')); return; }
      if (S.shot && S.shot.url) URL.revokeObjectURL(S.shot.url);
      S.shot = { blob: r.blob, kind: r.kind, url: URL.createObjectURL(r.blob) };
      render();
    } catch (e) {
      kit.toast(t('这个页面没有截下来：{why}', { why: errText(e) }));
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
      h('button', { type: 'button', class: 'btn', onclick: shot }, t('截图'))));
    if (S.element) {
      body.append(h('div', { class: 'chipline' }, h('span', { text: S.element }),
        h('button', { type: 'button', class: 'x', title: t('清除'), onclick() { S.element = ''; S.styles = ''; render(); } }, '✕')));
    }
    if (S.shot) {
      body.append(h('div', { class: 'chipline' },
        h('img', { class: 'shot', src: S.shot.url, alt: t('截图') }),
        h('span', { text: S.shot.kind }),
        h('button', { type: 'button', class: 'x', title: t('清除'), onclick() { URL.revokeObjectURL(S.shot.url); S.shot = null; render(); } }, '✕')));
    }
    const ta = h('textarea', { class: 'in', rows: 3, placeholder: t('想怎么改，随手写。'), value: S.text, 'aria-label': t('想怎么改') });
    ta.addEventListener('input', () => { S.text = ta.value; autoGrow(ta); });
    body.append(ta);
    body.append(h('div', { class: 'row' },
      h('button', { type: 'button', class: 'btn primary', onclick() { copyThen(kit, feedbackText()); } }, t('复制文字')),
      S.shot ? h('button', { type: 'button', class: 'btn', onclick: copyShot }, t('复制截图')) : null));
    setTimeout(() => autoGrow(ta), 0);
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && kit.escape()) e.preventDefault(); });
  render();
  return { el: app };
}
