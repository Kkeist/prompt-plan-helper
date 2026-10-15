// 命令行和构建脚本的文字：来自 locales/<语言>.json 的 cli 部分，代码里只写键。
// 语言：环境变量 SHUPIAN_LANG，没有就看系统语言；找不到对应的语言文件时用 en。
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'locales');
const all = {};
readdirSync(dir).filter((f) => f.endsWith('.json')).forEach((f) => { all[f.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(dir, f), 'utf8')); });

export const locales = all;

export function currentLang() {
  const want = String(process.env.SHUPIAN_LANG || Intl.DateTimeFormat().resolvedOptions().locale || '').toLowerCase();
  return Object.keys(all).filter((k) => want.indexOf(k) === 0)[0] || 'en';
}

// section：cli（命令行和构建）
export function T(key, params, section) {
  const dict = all[currentLang()][section || 'cli'];
  let s = dict[key];
  if (s === undefined) throw new Error('Missing text key: ' + key);
  if (params) Object.keys(params).forEach((k) => { s = s.split('{' + k + '}').join(String(params[k])); });
  return s;
}
