// 命令行、本机服务和历史版本共用的定位：在仓库里（tools/ 旁边有 src/ 和 locales/），
// 或在 AI 说明自带的 scripts/ 里（核心脚本 core.cjs 和语言文件就放在旁边）。
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

export const STATE_DIR = join(homedir(), '.shupian');
export const STATE_FILE = join(STATE_DIR, 'server.json');
export const here = dirname(fileURLToPath(import.meta.url));
export const inRepo = !existsSync(join(here, 'core.cjs'));
export const localesDir = inRepo ? join(here, '..', 'locales') : join(here, 'locales');
export const Core = createRequire(import.meta.url)(inRepo ? '../src/core.js' : './core.cjs');
