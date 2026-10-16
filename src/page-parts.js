'use strict';
// 本页部件和可调参数：个人用的悬浮窗没有连到计划书时，这个网页上「有什么、哪些能调」由网页自己带的一段声明，
// 加上自己在页面上圈选的部分组成。声明写在网页里：
//   window.SHUPIAN_ME = {
//     parts: [{ name: '开始按钮', selector: '#start' }],
//     tune: [{ key: 'bounce', label: '弹性', min: 0, max: 1, step: 0.05, value: 0.4, apply(v) { game.bounce = v; } }],
//   };
// 圈选的部件和调过的参数记在这个浏览器里，按页面地址分开；调过的参数下次打开页面时自动再用一遍。

function meDeclared() {
  return window.SHUPIAN_ME && typeof window.SHUPIAN_ME === 'object' ? window.SHUPIAN_ME : null;
}

// 声明了 SHUPIAN_ME 的网页可能会发布出去：悬浮窗只在本机（localhost、文件）、地址带 ?shupian=1、或这个浏览器里打开过开关时出现
function meAllowed() {
  if (!meDeclared()) return true;
  const host = location.hostname;
  if (location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '[::1]') return true;
  if (new URLSearchParams(location.search).get('shupian') === '1') { LS.set(NS + ':me-on', true); return true; }
  return LS.get(NS + ':me-on', false) === true;
}

const pageKey = () => location.origin + location.pathname;

const Parts = {
  // 声明的部件在前，圈选的在后；同名的以声明为准。no 留空，和计划书里的功能用同一种形状
  list() {
    const d = meDeclared();
    const declared = (d && Array.isArray(d.parts) ? d.parts : []).filter((p) => p && p.name)
      .map((p) => ({ no: '', name: String(p.name), sel: String(p.selector || ''), declared: true }));
    const mine = LS.get(NS + ':parts:' + pageKey(), []).filter((p) => p && p.name && !declared.some((x) => x.name === p.name))
      .map((p) => ({ no: '', name: String(p.name), sel: String(p.sel || ''), declared: false }));
    return declared.concat(mine);
  },
  add(name, sel) {
    const key = NS + ':parts:' + pageKey();
    const rest = LS.get(key, []).filter((p) => p && p.name !== name);
    rest.push({ name, sel });
    return LS.set(key, rest);
  },
  remove(name) {
    const key = NS + ':parts:' + pageKey();
    return LS.set(key, LS.get(key, []).filter((p) => p && p.name !== name));
  },
};

const Tune = {
  list() {
    const d = meDeclared();
    return (d && Array.isArray(d.tune) ? d.tune : []).filter((x) => x && x.key && typeof x.min === 'number' && typeof x.max === 'number');
  },
  saved() { return LS.get(NS + ':tune:' + pageKey(), {}); },
  value(item) {
    const v = Tune.saved()[item.key];
    return typeof v === 'number' ? v : item.value;
  },
  // 把值交给网页（apply 和 shupian:tune 事件），并记在这个浏览器里
  set(item, v) {
    const n = Math.min(item.max, Math.max(item.min, Number(v)));
    if (!isFinite(n)) return item.value;
    const all = Tune.saved();
    all[item.key] = n;
    LS.set(NS + ':tune:' + pageKey(), all);
    if (typeof item.apply === 'function') item.apply(n);
    window.dispatchEvent(new CustomEvent('shupian:tune', { detail: { key: item.key, value: n } }));
    return n;
  },
  // 页面打开时把调过的值再用一遍
  restore() {
    const all = Tune.saved();
    Tune.list().forEach((item) => {
      if (typeof all[item.key] === 'number' && typeof item.apply === 'function') item.apply(all[item.key]);
    });
  },
  // 调过的（和声明里的原值不同）：[{ label, value, was }]
  changed() {
    return Tune.list().filter((x) => Tune.value(x) !== x.value).map((x) => ({ label: x.label || x.key, value: Tune.value(x), was: x.value }));
  },
};
