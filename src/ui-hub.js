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

// 页面悬浮窗靠浏览器扩展出现：扩展的脚本在这个页面里留下一个标记
function extensionInstalled() {
  return document.documentElement.hasAttribute('data-shupian-ext');
}

// 书签：拖到书签栏，在任意网页上点一下，把悬浮窗从本机服务加载进当前页面（不用装扩展）
function bookmarkletHref() {
  const src = location.origin + '/shupian.js?k=' + SERVER.token;
  return "javascript:(function(){var s=document.createElement('script');s.src='" + src + "&t='+Date.now();"
    + "document.documentElement.setAttribute('data-shupian-open','');document.documentElement.appendChild(s)})();void 0";
}

// 安装内容：书签和浏览器扩展两种方式。info 是 /api/extension 的返回
function installContent(kit, info) {
  const openPage = (b, page) => Api.call('POST', '/api/extension', { browser: b.id, page }).catch((e) => kit.toast(t('could_not_open_the_extensions_page_why', { why: errText(e) })));
  const steps = [t('extension_step_open'), t('extension_step_load'), t('extension_step_done'), t('extension_step_button')].map((x) => h('li', { text: x }));
  const link = h('a', { class: 'bookmarklet', href: bookmarkletHref(), draggable: 'true', title: t('drag_to_the_bookmarks_bar') }, t('prompt_plan_helper'));
  link.addEventListener('click', (e) => e.preventDefault());
  return h('div', null,
    h('div', { class: 'ext-block' },
      h('h3', { text: t('bookmark_title') }),
      h('p', { class: 'hint', text: t('bookmark_steps') }),
      link,
      h('p', { class: 'hint', text: t('bookmark_limits') })),
    h('div', { class: 'ext-block' },
      h('h3', { text: t('extension_title') }),
      h('ol', { class: 'steps' }, steps),
      h('div', { class: 'muted', text: t('extension_folder') }),
      h('button', { type: 'button', class: 'fpath', title: t('copy_path'), 'aria-label': t('copy_path') + '：' + info.path, onclick: () => copyThen(kit, info.path) }, info.path),
      info.browsers.some((b) => b.id === 'firefox') ? h('p', { class: 'hint', text: t('extension_step_firefox') }) : null,
      info.browsers.length ? null : h('p', { class: 'hint', text: t('no_edge_or_chrome_was_found') }),
      h('div', { class: 'row' }, info.browsers.map((b) => h('button', { type: 'button', class: 'btn', onclick: () => openPage(b, '') }, t('open_the_extensions_page_in_name', { name: b.name }))))),
    info.browsers.length
      ? h('div', { class: 'row' }, info.browsers.map((b) => h('button', { type: 'button', class: 'btn primary', onclick: () => openPage(b, 'install') }, t('open_the_install_page_in_name', { name: b.name }))))
      : null);
}

async function openExtensionHelp(kit) {
  let info;
  try {
    info = await Api.call('GET', '/api/extension');
  } catch (e) {
    kit.toast(t('could_not_prepare_the_extension_why', { why: errText(e) }));
    return;
  }
  kit.openModal({
    title: t('install_the_floating_window'),
    body: installContent(kit, info),
    foot: (close) => [h('button', { type: 'button', class: 'btn', onclick: close }, t('close'))],
  });
}

// 「最近」页顶上的一行：悬浮窗要不要装扩展。检测完成前占位不显示，避免下面的内容移位。
function extensionRow(kit) {
  const row = h('div', { class: 'extrow wait' });
  setTimeout(async () => {
    // 扩展在别的浏览器里时，页面里没有标记，但扩展已经联系过本服务
    let seen = false;
    try { seen = !!(await Api.call('GET', '/api/extension')).seen; } catch (e) { kit.toast(t('could_not_prepare_the_extension_why', { why: errText(e) })); }
    row.classList.remove('wait');
    clear(row);
    if (extensionInstalled() || seen) {
      row.append(h('span', { class: 'muted', text: t('the_page_floating_window_is_on_alt_shift_s') }));
      return;
    }
    row.append(h('span', { class: 'muted', text: t('the_page_floating_window_needs_the_browser_extension') }),
      h('button', { type: 'button', class: 'btn sm primary', onclick: () => openExtensionHelp(kit) }, t('install_the_browser_extension')));
  }, 1200);
  row.append(h('span', { class: 'muted', text: t('the_page_floating_window_is_on_alt_shift_s') }));
  return row;
}
