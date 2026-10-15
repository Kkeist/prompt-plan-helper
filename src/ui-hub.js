'use strict';
// 文件夹列表（本机服务提供）和桌面上的小窗口：最近在用的文件夹，一键打开计划书、复制地址。

// o: { kit, current, onPick(path), onBrowse() }
function folderRows(container, o) {
  clear(container);
  container.append(h('p', { class: 'muted', text: t('正在读取最近的文件夹') }));
  Api.call('GET', '/api/projects').then((data) => {
    clear(container);
    const row = (x) => {
      const s = x.summary;
      const info = h('div', { class: 'finfo' },
        h('div', { class: 'fname' }, h('span', { text: x.name }), x.active ? h('span', { class: 'badge', text: t('正在用') }) : null),
        h('div', { class: 'fpath', text: x.path }),
        s ? h('div', { class: 'muted', text: t('已完成 {done} / {total}，待补 {n} 处', { done: s.done, total: s.total, n: s.pending }) }) : h('div', { class: 'muted', text: t('还没有计划书') }));
      const isCur = o.current && o.current.toLowerCase() === x.path.toLowerCase();
      return h('div', { class: 'frow' + (isCur ? ' cur' : '') }, info,
        h('div', { class: 'factions' },
          h('button', { type: 'button', class: 'btn sm primary', onclick: () => o.onPick(x.path) }, isCur ? t('当前') : t('打开计划书')),
          h('button', { type: 'button', class: 'btn sm', onclick: () => copyThen(o.kit, x.path) }, t('复制地址'))));
    };
    const section = (title, list) => {
      if (!list.length) return;
      container.append(h('h3', { class: 'ftitle', text: title }));
      list.forEach((x) => container.append(row(x)));
    };
    const active = data.claude.filter((x) => x.active);
    const recent = data.claude.filter((x) => !x.active);
    section(t('正在用 Claude 的文件夹'), active);
    section(t('最近用过的文件夹'), recent);
    section(t('连接过的文件夹'), data.history);
    if (!data.claude.length && !data.history.length) container.append(h('p', { class: 'muted', text: t('还没有找到文件夹。点下面的按钮选择一个。') }));
    container.append(h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn', onclick: o.onBrowse }, t('选择别的文件夹'))));
  }, (e) => {
    clear(container);
    container.append(h('p', { class: 'err', text: t('读取文件夹列表失败：{why}', { why: errText(e) }) }));
  });
}

// 桌面小窗口
function createHub(opts) {
  const app = h('div', { class: 'app' });
  const head = h('div', { class: 'head' });
  const body = h('div', { class: 'body' });
  app.append(head, body);
  const kit = createKit(app);

  const openPlan = (path) => {
    const url = '/index.html?k=' + encodeURIComponent(SERVER.token) + '&folder=' + encodeURIComponent(path);
    const w = window.open(url, 'shupian-plan', 'popup=yes,width=980,height=820');
    if (!w) location.href = url;
  };

  const list = h('div', { class: 'folders' });
  const refresh = () => folderRows(list, {
    kit,
    current: '',
    onPick: openPlan,
    onBrowse: async () => {
      try {
        const r = await Api.call('POST', '/api/pick', {});
        if (r.path) openPlan(r.path);
      } catch (e) {
        kit.toast(t('没有打开文件夹：{why}', { why: errText(e) }));
      }
    },
  });

  function renderHead() {
    clear(head);
    const logo = document.createElement('span');
    logo.className = 'logo';
    logo.innerHTML = ICON_SVG;
    head.append(h('div', { class: 'in' },
      h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('prompt 计划书助手') })),
      h('span', { class: 'sp' }),
      h('button', { type: 'button', class: 'btn sm', onclick() { setLang(LANG === 'zh' ? 'en' : 'zh'); renderHead(); refresh(); } }, LANG === 'zh' ? 'English' : '中文')));
  }

  renderHead();
  body.append(h('div', { class: 'col' }, list));
  refresh();
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && kit.escape()) e.preventDefault(); });
  window.addEventListener('focus', refresh);
  return { el: app };
}
