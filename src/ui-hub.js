'use strict';
// 「最近」标签里的文件夹列表（本机服务提供）：最近在用的文件夹，一键打开计划书、复制地址。

// o: { kit, current, onPick(path), onBrowse(), onNewPlan(), onNewFolder() }
function folderRows(container, o) {
  clear(container);
  container.append(h('p', { class: 'muted', text: t('reading_recent_folders') }));
  // 选定这个文件夹当前用哪一份，选完重新列出
  const choosePlan = (anchor, x) => o.kit.openPop(anchor, (pop) => {
    x.plans.forEach((pl) => pop.append(o.kit.popItem((pl.title || x.name) + '（' + pl.file + '）', () => {
      Api.call('POST', '/api/current', { path: x.path, file: pl.file }).then(() => folderRows(container, o), (e) => o.kit.toast(t('could_not_select_the_plan_why', { why: errText(e) })));
    }, { on: pl.file === x.file })));
  });
  Api.call('GET', '/api/projects').then((data) => {
    clear(container);
    const row = (x) => {
      const s = x.summary;
      const planBtn = x.plans && x.plans.length > 1
        ? h('button', { type: 'button', class: 'link plan-pick', onclick() { choosePlan(planBtn, x); } }, t('plan_file', { file: x.file }))
        : null;
      const info = h('div', { class: 'finfo' },
        h('div', { class: 'fname' }, h('span', { text: x.name }), x.active ? h('span', { class: 'badge', text: t('in_use') }) : null),
        h('button', { type: 'button', class: 'fpath', title: t('copy_path'), 'aria-label': t('copy_path') + '：' + x.path, onclick: () => copyThen(o.kit, x.path) }, x.path),
        planBtn,
        s ? h('div', { class: 'muted', text: t('done_of_total_done_n_left_to_fill_in', { done: s.done, total: s.total, n: s.pending }) }) : h('div', { class: 'muted', text: t('no_plan_yet') }));
      const isCur = o.current && o.current.toLowerCase() === x.path.toLowerCase();
      if (isCur) info.firstChild.append(h('span', { class: 'badge', text: t('current') }));
      // 整个框都可以点击打开；框里的按钮（复制地址、换计划书）各管各的
      const el = h('div', { class: 'frow' + (isCur ? ' cur' : ''), role: 'button', tabindex: 0, 'aria-label': x.name }, info);
      el.addEventListener('click', (e) => { if (!e.target.closest('button, a')) o.onPick(x.path); });
      el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); o.onPick(x.path); } });
      return el;
    };
    const section = (title, list) => {
      if (!list.length) return;
      container.append(h('h3', { class: 'ftitle', text: title }));
      list.forEach((x) => container.append(row(x)));
    };
    const active = data.claude.filter((x) => x.active);
    const recent = data.claude.filter((x) => !x.active);
    section(t('folders_in_use'), active);
    section(t('recent_folders'), recent);
    section(t('connected_folders'), data.history);
    if (!data.claude.length && !data.history.length) container.append(h('p', { class: 'muted', text: t('no_recent_folders_were_found_use_the_button') }));
    container.append(h('div', { class: 'row' },
      h('button', { type: 'button', class: 'btn primary', onclick: o.onNewPlan }, t('new_plan')),
      h('button', { type: 'button', class: 'btn', onclick: o.onNewFolder }, t('new_folder')),
      h('button', { type: 'button', class: 'btn', onclick: o.onBrowse }, t('choose_another_folder'))));
  }, (e) => {
    clear(container);
    container.append(h('p', { class: 'err', text: t('could_not_read_the_folder_list_why', { why: errText(e) }) }));
  });
}
