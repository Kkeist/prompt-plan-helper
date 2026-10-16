// 功能清单的历史版本：项目文件夹里 .shupian/history/ 下，页面、命令行、本机服务共用。
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Core } from './base.mjs';

export function norm(p) {
  return resolve(p).toLowerCase();
}

// 历史版本：文件夹里 .shupian/history/ 下，名字是 时间-功能清单文件名.md，每份功能清单只留最近的 HISTORY_KEEP 份
const HISTORY_KEEP = 50;
export const HISTORY_NAME_RE = /^\d{8}-\d{6}-[^/\\:*?"<>|]+\.md$/;

export function historyDir(root) {
  return join(resolve(root), '.shupian', 'history');
}

// 写了一份历史版本之后，同一份功能清单的旧版本只留最近的几份
export function pruneHistory(root, file) {
  const dir = historyDir(root);
  const mine = readdirSync(dir).filter((n) => HISTORY_NAME_RE.test(n) && n.slice(16).toLowerCase() === file.toLowerCase()).sort();
  mine.slice(0, Math.max(0, mine.length - HISTORY_KEEP)).forEach((n) => unlinkSync(join(dir, n)));
}

export function listHistory(root, file) {
  const dir = historyDir(root);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((n) => HISTORY_NAME_RE.test(n) && n.slice(16).toLowerCase() === String(file).toLowerCase())
    .sort().reverse()
    .map((n) => ({ name: n, time: statSync(join(dir, n)).mtimeMs }));
}

// 功能清单被改写之前的旧版本：页面、命令行、AI 直接改文件都一样处理。
// 有功能被去掉时马上存，平时隔 HISTORY_GAP 才存一份；和最新一份历史一样的不重复存；force 为真时不看间隔。
const HISTORY_GAP = 5 * 60 * 1000;
const lastSnap = new Map();
const featureNames = (md) => Core.progressList(md).map((x) => x.name);

export function snapshotFeatures(root, file, prev, next, force) {
  if (!prev || !prev.trim() || prev === next) return false;
  const key = norm(root) + '|' + file.toLowerCase();
  const nextNames = featureNames(next || '');
  const lost = featureNames(prev).some((n) => nextNames.indexOf(n) < 0);
  const existing = listHistory(root, file);
  const last = lastSnap.get(key) || (existing[0] ? existing[0].time : 0);
  if (!force && !lost && Date.now() - last < HISTORY_GAP) return false;
  if (existing[0] && readFileSync(join(historyDir(root), existing[0].name), 'utf8') === prev) return false;
  mkdirSync(historyDir(root), { recursive: true });
  writeFileSync(join(historyDir(root), Core.timeStamp() + '-' + file), prev);
  pruneHistory(root, file);
  lastSnap.set(key, Date.now());
  return true;
}
