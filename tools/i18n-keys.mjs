// 检查文字和代码是否分离：
//   1. 代码里用到的键，每个语言文件里都要有；语言文件里没人用的键算多余
//   2. 代码里（注释除外）不许有中文字符串，文字都在 locales/<语言>.json 里
// 用法：node tools/i18n-keys.mjs（有问题时退出码为 1）
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SECTIONS = ['ui', 'cli', 'exe'];

function localeFiles() {
  const dir = join(root, 'locales');
  const out = {};
  readdirSync(dir).filter((f) => f.endsWith('.json')).forEach((f) => { out[f.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(dir, f), 'utf8')); });
  return out;
}

function listFiles(dir, exts) {
  const full = join(root, dir);
  return existsSync(full) ? readdirSync(full).filter((f) => exts.some((e) => f.endsWith(e))).map((f) => join(dir, f)) : [];
}

const read = (f) => readFileSync(join(root, f), 'utf8');

// 去掉注释；字符串里的 // 也会被当成注释，只会少报，不会多报
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
}

// 各部分的键在哪些文件里用
const USE = {
  ui: { files: [...listFiles('src', ['.js'])], res: [/\bt\('([a-z0-9_]+)'/g, /\btl\([^,()]+,\s*'([a-z0-9_]+)'/g] },
  cli: { files: [...listFiles('tools', ['.mjs'])], res: [/\bT\('([a-z0-9_]+)'/g] },
  exe: { files: ['desktop/PlanHelper.cs'], res: [/\bText\("([a-z0-9_]+)"/g] },
};

export function usedKeys() {
  const out = {};
  SECTIONS.forEach((sec) => {
    const keys = new Set();
    USE[sec].files.filter((f) => existsSync(join(root, f))).forEach((f) => {
      const src = stripComments(read(f));
      USE[sec].res.forEach((re) => { for (const m of src.matchAll(re)) keys.add(m[1]); });
    });
    out[sec] = keys;
  });
  // 动态拼出来的键：ui-app.js 里 ADD_LABEL 的值
  const app = read('src/ui-app.js');
  const m = /const ADD_LABEL = \{([^}]*)\}/.exec(app);
  if (m) for (const k of m[1].matchAll(/'([a-z0-9_]+)'/g)) out.ui.add(k[1]);
  return out;
}

// 返回 { used, missing: [...], unused: [...], text: [...] }
export function checkKeys() {
  const loc = localeFiles();
  const used = usedKeys();
  const missing = [];
  const unused = [];
  let count = 0;
  SECTIONS.forEach((sec) => {
    used[sec].forEach((k) => {
      count++;
      Object.keys(loc).forEach((lang) => {
        if (!loc[lang][sec] || loc[lang][sec][k] === undefined) missing.push(lang + '.' + sec + '.' + k);
      });
    });
    Object.keys(loc).forEach((lang) => {
      Object.keys(loc[lang][sec] || {}).forEach((k) => { if (!used[sec].has(k)) unused.push(lang + '.' + sec + '.' + k); });
    });
  });
  // 各语言的键要一致
  const langs = Object.keys(loc);
  SECTIONS.forEach((sec) => {
    const base = Object.keys(loc[langs[0]][sec] || {});
    langs.slice(1).forEach((l) => {
      const other = Object.keys(loc[l][sec] || {});
      base.filter((k) => other.indexOf(k) < 0).forEach((k) => missing.push(l + '.' + sec + '.' + k));
      other.filter((k) => base.indexOf(k) < 0).forEach((k) => missing.push(langs[0] + '.' + sec + '.' + k));
    });
  });
  // 代码里的中文字符串
  const text = [];
  const code = [...listFiles('src', ['.js']), ...listFiles('tools', ['.mjs']), ...listFiles('extension', ['.js']).filter((f) => !/shupian\.js$/.test(f)), ...listFiles('desktop', ['.cs'])];
  code.forEach((f) => {
    stripComments(read(f)).split('\n').forEach((line, i) => {
      if (/[\u4e00-\u9fff]/.test(line)) text.push(f + ':' + (i + 1) + ': ' + line.trim().slice(0, 100));
    });
  });
  return { used: count, missing, unused, text };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const r = checkKeys();
  r.missing.forEach((k) => console.log('missing: ' + k));
  r.unused.forEach((k) => console.log('unused: ' + k));
  r.text.forEach((x) => console.log('text in code: ' + x));
  console.log('keys ' + r.used + ', missing ' + r.missing.length + ', unused ' + r.unused.length + ', Chinese strings in code ' + r.text.length);
  process.exit(r.missing.length || r.unused.length || r.text.length ? 1 : 0);
}
