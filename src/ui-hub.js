'use strict';
// 「最近」标签里的文件夹列表（本机服务提供）：最近在用的文件夹，一键打开计划书、复制地址。

// o: { kit, current, onPick(path), onBrowse() }
function folderRows(container, o) {
  clear(container);
  container.append(h('p', { class: 'muted', text: t('正在读取最近的文件夹') }));
  Api.call('GET', '/api/projects').then((data) => {
    clear(container);
    const row = (x) => {
      const s = x.summary;
      const info = h('div', { class: 'finfo' },
        h('div', { class: 'fname' }, h('span', { text: x.name }), x.active ? h('span', { class: 'badge', text: t('使用中') }) : null),
        h('div', { class: 'fpath', text: x.path }),
        s ? h('div', { class: 'muted', text: t('已完成 {done} / {total}，待补 {n} 处', { done: s.done, total: s.total, n: s.pending }) }) : h('div', { class: 'muted', text: t('尚无计划书') }));
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
    section(t('正在使用的文件夹'), active);
    section(t('最近使用的文件夹'), recent);
    section(t('连接过的文件夹'), data.history);
    if (!data.claude.length && !data.history.length) container.append(h('p', { class: 'muted', text: t('没有找到最近使用的文件夹，可以通过下方按钮选择。') }));
    container.append(h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn', onclick: o.onBrowse }, t('选择别的文件夹'))));
  }, (e) => {
    clear(container);
    container.append(h('p', { class: 'err', text: t('读取文件夹列表失败：{why}', { why: errText(e) }) }));
  });
}
