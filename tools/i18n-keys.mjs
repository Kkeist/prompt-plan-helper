// 列出界面里所有 t('中文') 词条，并检查英文词条是否齐全。
// 用法：node tools/i18n-keys.mjs          （缺词条时退出码为 1）
//       node tools/i18n-keys.mjs --list   （只列出全部中文词条）
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');

export function usedKeys() {
  const keys = new Set();
  readdirSync(srcDir).filter((f) => f.endsWith('.js') && f !== 'i18n-en.js').forEach((f) => {
    const s = readFileSync(join(srcDir, f), 'utf8');
    for (const m of s.matchAll(/\bt\('((?:[^'\\]|\\.)*)'/g)) keys.add(m[1].replace(/\\'/g, "'"));
  });
  // 动态拼出来的词条
  ['加用法', '加页面', '加功能'].forEach((k) => keys.add(k));
  return [...keys];
}

export function dictKeys() {
  const s = readFileSync(join(srcDir, 'i18n-en.js'), 'utf8');
  const keys = new Set();
  for (const m of s.matchAll(/^\s*'((?:[^'\\]|\\.)*)':/gm)) keys.add(m[1].replace(/\\'/g, "'"));
  return keys;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const used = usedKeys();
  if (process.argv.includes('--list')) {
    console.log(used.join('\n'));
  } else {
    const have = dictKeys();
    const missing = used.filter((k) => !have.has(k));
    const extra = [...have].filter((k) => used.indexOf(k) < 0);
    missing.forEach((k) => console.log('缺英文：' + k));
    extra.forEach((k) => console.log('多余：' + k));
    console.log('词条 ' + used.length + ' 个，缺 ' + missing.length + ' 个，多余 ' + extra.length + ' 个');
    process.exit(missing.length ? 1 : 0);
  }
}
