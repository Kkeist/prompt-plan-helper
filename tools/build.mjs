// 构建：读中英文模板和字段表，把核心、界面、样式、图标合成一个 web/shupian.js，并同步到浏览器扩展目录和 AI 说明。
// 用法：node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { iconSvg } from './build-icons.mjs';
import { usedKeys, dictKeys } from './i18n-keys.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => readFileSync(join(root, ...p), 'utf8');

// 字段表里 "## 1 …" 到 "## 6 …" 每一节的表格：字段、写什么、例
function parseFieldTable(md) {
  const fields = {};
  let no = '';
  md.split(/\r?\n/).forEach((line) => {
    let m;
    if ((m = /^##\s+(\d+)\s/.exec(line))) { no = m[1]; return; }
    if (/^##\s/.test(line)) { no = ''; return; }
    if (!no || line.charAt(0) !== '|') return;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 3 || /^-+$/.test(cells[0]) || cells[0] === '字段' || cells[0] === 'Field') return;
    (fields[no] = fields[no] || []).push({ name: cells[0], purpose: cells[1], how: cells[2] });
  });
  return fields;
}

// 中文示例就是这个项目自己的计划书，以根目录的计划书为准
copyFileSync(join(root, '计划书.md'), join(root, 'templates', 'zh', 'example.md'));

const schema = {};
['zh', 'en'].forEach((lang) => {
  schema[lang] = {
    fields: parseFieldTable(read('templates', lang, 'fields.md')),
    planTemplate: read('templates', lang, 'plan.md'),
    changeTemplate: read('templates', lang, 'change.md'),
    example: read('templates', lang, 'example.md'),
  };
});

// 界面里的每一句都要有英文词条
const used = usedKeys();
const have = dictKeys();
const missing = used.filter((k) => !have.has(k));
if (missing.length) {
  console.error('构建失败：缺少英文词条：\n' + missing.join('\n'));
  process.exit(1);
}

const core = read('src', 'core.js');
const parts = [
  '(function () {',
  "'use strict';",
  'const SCHEMA = ' + JSON.stringify(schema) + ';',
  'const CSS = ' + JSON.stringify(read('src', 'style.css')) + ';',
  'const ICON_SVG = ' + JSON.stringify(iconSvg()) + ';',
  'const Core = (function () { const module = { exports: {} };',
  core,
  'return module.exports; })();',
  read('src', 'i18n-en.js'),
  read('src', 'ui-base.js'),
  read('src', 'ui-kit.js'),
  read('src', 'page-tools.js'),
  read('src', 'ui-app.js'),
  read('src', 'ui-hub.js'),
  read('src', 'ui-widget.js'),
  read('src', 'mount.js'),
  '})();',
  '',
];
const bundle = parts.join('\n');

// 出包自检：发布物里不许出现本机路径和个人词语。个人词语写在本机的 tools/.private-words.txt（每行一个，不进仓库）
const privateFile = join(root, 'tools', '.private-words.txt');
const privateWords = existsSync(privateFile) ? readFileSync(privateFile, 'utf8').split(/\r?\n/).map((w) => w.trim()).filter(Boolean) : [];
const escapeRe = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const banned = [/[A-Za-z]:\\Users\\/, /\/home\/[a-z0-9_-]+\//i].concat(privateWords.map((w) => new RegExp(escapeRe(w), 'i')));
const hit = banned.filter((re) => re.test(bundle));
if (hit.length) {
  console.error('构建失败：发布物里出现不允许的内容：' + hit.map(String).join(' '));
  process.exit(1);
}

const out = join(root, 'web');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'shupian.js'), bundle);
const hash = createHash('sha1').update(bundle).digest('hex').slice(0, 8);

const indexPath = join(out, 'index.html');
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, 'utf8').replace(/shupian\.js(\?v=[0-9a-f]+)?/, 'shupian.js?v=' + hash);
  writeFileSync(indexPath, html);
}

// 浏览器扩展：同一份脚本加图标
const ext = join(root, 'extension');
mkdirSync(join(ext, 'icons'), { recursive: true });
writeFileSync(join(ext, 'shupian.js'), bundle);
[['favicon-16.png', '16.png'], ['favicon-32.png', '32.png'], ['favicon-48.png', '48.png'], ['icon-192.png', '128.png']].forEach(([a, b]) => {
  if (existsSync(join(out, a))) copyFileSync(join(out, a), join(ext, 'icons', b));
});

// AI 说明里带一份同步的模板副本
['skill', join('skills', '薯片计划助手')].forEach((dir) => {
  if (!existsSync(join(root, dir))) return;
  ['zh', 'en'].forEach((lang) => {
    const to = join(root, dir, 'references', lang);
    mkdirSync(to, { recursive: true });
    ['plan.md', 'fields.md', 'change.md', 'example.md'].forEach((f) => copyFileSync(join(root, 'templates', lang, f), join(to, f)));
  });
});

console.log('built web/shupian.js ' + Math.round(bundle.length / 1024) + ' KB, hash ' + hash);
console.log('terms: ' + used.length + '; field sections: zh ' + Object.keys(schema.zh.fields).join(',') + ' / en ' + Object.keys(schema.en.fields).join(','));
