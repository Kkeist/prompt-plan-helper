// 生成 Windows 桌面版：把 web/ 里的网页文件嵌进 exe，用 .NET Framework 自带的 csc 编译。
// 用法：node tools/build.mjs && node tools/build-exe.mjs   →   web/download/prompt-plan-helper.exe
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const web = join(root, 'web');
const out = join(web, 'download');
const csc = [
  'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe',
  'C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe',
].filter(existsSync)[0];

if (!csc) {
  console.error('找不到 csc.exe（.NET Framework 4）。只能在 Windows 上生成桌面版。');
  process.exit(1);
}

function files(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return n === 'download' ? [] : files(p);
    return [p];
  });
}

mkdirSync(out, { recursive: true });
const target = join(out, 'prompt-plan-helper.exe');
const args = [
  '/nologo', '/target:winexe', '/optimize+', '/platform:anycpu',
  '/out:' + target,
  '/win32icon:' + join(web, 'shupian.ico'),
  '/r:System.dll', '/r:System.Core.dll', '/r:System.Windows.Forms.dll', '/r:System.Drawing.dll', '/r:System.Web.Extensions.dll',
];
files(web).forEach((f) => {
  const logical = 'web/' + relative(web, f).replace(/\\/g, '/');
  args.push('/resource:' + f + ',' + logical);
});
args.push('/resource:' + join(web, 'shupian.ico') + ',shupian.ico');
args.push(join(root, 'desktop', 'PlanHelper.cs'));

const r = spawnSync(csc, args, { encoding: 'utf8' });
process.stdout.write(r.stdout || '');
process.stderr.write(r.stderr || '');
if (r.status !== 0) process.exit(r.status || 1);
console.log('built ' + relative(root, target) + ' ' + Math.round(statSync(target).size / 1024) + ' KB');
