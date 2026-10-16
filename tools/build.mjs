// 构建：读中英文模板和字段表，把核心、界面、样式、图标合成一个 web/shupian.js，并同步到浏览器扩展目录和 AI 说明。
// 用法：node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { iconSvg } from './build-icons.mjs';
import { checkKeys } from './i18n-keys.mjs';
import { T, locales } from './text.mjs';
import { pack } from './pack-extension.mjs';

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
    if (cells.length < 3 || /^-+$/.test(cells[0]) || Object.keys(locales).some((k) => locales[k].doc.fieldHeader === cells[0])) return;
    const options = (cells[3] || '').split(/[、,，]\s*/).map((o) => o.trim()).filter(Boolean);
    (fields[no] = fields[no] || []).push({ name: cells[0], purpose: cells[1], how: cells[2], options });
  });
  return fields;
}

// 中文示例就是这个项目自己的计划书，以根目录的计划书为准
// 示例就是这个项目自己的计划书（中文那份）
copyFileSync(join(root, locales.zh.doc.planFile), join(root, 'templates', 'zh', 'example.md'));

const schema = {};
['zh', 'en'].forEach((lang) => {
  schema[lang] = {
    fields: parseFieldTable(read('templates', lang, 'fields.md')),
    planTemplate: read('templates', lang, 'plan.md'),
    changeTemplate: read('templates', lang, 'change.md'),
    example: read('templates', lang, 'example.md'),
  };
});

// 文字和代码分离：键要齐全，不留没人用的键，代码里不许有中文字符串
const keyCheck = checkKeys();
if (keyCheck.missing.length || keyCheck.unused.length || keyCheck.text.length) {
  if (keyCheck.missing.length) console.error(T('build_missing_keys') + '\n' + keyCheck.missing.join('\n'));
  if (keyCheck.unused.length) console.error(T('build_unused_keys') + '\n' + keyCheck.unused.join('\n'));
  if (keyCheck.text.length) console.error(T('build_text_in_code') + '\n' + keyCheck.text.join('\n'));
  process.exit(1);
}

const core = read('src', 'core.js');
const parts = [
  '(function () {',
  "'use strict';",
  'const LOCALES = ' + JSON.stringify(locales) + ';',
  'const SCHEMA = ' + JSON.stringify(schema) + ';',
  'const CSS = ' + JSON.stringify(read('src', 'style.css')) + ';',
  'const ICON_SVG = ' + JSON.stringify(iconSvg()) + ';',
  'const Core = (function () { const module = { exports: {} };',
  core,
  'return module.exports; })();',
  read('src', 'ui-base.js'),
  read('src', 'ui-kit.js'),
  read('src', 'page-tools.js'),
  read('src', 'page-parts.js'),
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
// 哐哐工作室署名（语言文件里的 credit_ 开头几条）是允许出现的固定文字，扫描时先去掉
const creditTexts = Object.keys(locales).flatMap((k) => Object.keys(locales[k].ui).filter((n) => n.indexOf('credit_') === 0).map((n) => JSON.stringify(locales[k].ui[n]).slice(1, -1))).filter(Boolean);
const scanned = creditTexts.reduce((s, c) => s.split(c).join(''), bundle);
const hit = banned.filter((re) => re.test(scanned));
if (hit.length) {
  console.error(T('build_banned', { what: hit.map(String).join(' ') }));
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

// 扩展安装包（CRX）：桌面版「一键安装」把它登记给浏览器。签名私钥只在本机，没有私钥时保留已有的安装包
if (existsSync(join(root, 'tools', '.extension-key.pem'))) {
  const r = pack();
  mkdirSync(join(out, 'download'), { recursive: true });
  writeFileSync(join(out, 'download', 'prompt-plan-helper-extension.crx'), r.crx);
}

// AI 说明里带一份同步的模板副本
// AI 说明目录：skill/，以及 skills/ 下带 references 的各个目录
const skillDirs = ['skill'].concat(existsSync(join(root, 'skills')) ? readdirSync(join(root, 'skills')).map((n) => join('skills', n)) : []);
skillDirs.forEach((dir) => {
  if (!existsSync(join(root, dir))) return;
  ['zh', 'en'].forEach((lang) => {
    const to = join(root, dir, 'references', lang);
    mkdirSync(to, { recursive: true });
    ['plan.md', 'fields.md', 'change.md', 'example.md'].forEach((f) => copyFileSync(join(root, 'templates', lang, f), join(to, f)));
  });
});

// 公开的 AI 说明自带命令行：脚本、核心脚本（core.cjs）和语言文件放在 skill/scripts/，只装 skill/ 也能用
const scripts = join(root, 'skill', 'scripts');
mkdirSync(join(scripts, 'locales'), { recursive: true });
['shupian.mjs', 'history.mjs', 'base.mjs', 'text.mjs'].forEach((f) => copyFileSync(join(root, 'tools', f), join(scripts, f)));
const coreSrc = readFileSync(join(root, 'src', 'core.js'), 'utf8');
if (coreSrc.indexOf("require('../locales/") < 0) throw new Error('core.js no longer loads ../locales');
writeFileSync(join(scripts, 'core.cjs'), coreSrc.split("require('../locales/").join("require('./locales/"));
readdirSync(join(root, 'locales')).filter((f) => f.endsWith('.json')).forEach((f) => copyFileSync(join(root, 'locales', f), join(scripts, 'locales', f)));

console.log('built web/shupian.js ' + Math.round(bundle.length / 1024) + ' KB, hash ' + hash);
console.log('keys: ' + keyCheck.used + '; field sections: zh ' + Object.keys(schema.zh.fields).join(',') + ' / en ' + Object.keys(schema.en.fields).join(','));
