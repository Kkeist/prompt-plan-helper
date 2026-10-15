// 本地静态服务器：端口按项目目录名算出来，被占用就往后挪；不缓存、不回 304。
// 用法：node tools/serve.mjs [目录，默认 web]   环境变量 PORT 可以指定起始端口
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(projectRoot, process.argv[2] || 'web');

// 端口 = 10000 + 目录名按 h = (h * 31 + 码位) % 30000 算出的数
function basePort() {
  let h = 0;
  for (const c of basename(projectRoot)) h = (h * 31 + c.codePointAt(0)) % 30000;
  return 10000 + h;
}

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.md': 'text/markdown; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = normalize(join(dir, p));
    if (!file.startsWith(dir)) { res.writeHead(403).end(); return; }
    const st = await stat(file);
    if (!st.isFile()) throw new Error('not file');
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    });
    res.end(data);
  } catch (e) {
    res.writeHead(404, { 'Cache-Control': 'no-store' }).end('not found');
  }
});

function listen(port, limit) {
  server.once('error', (e) => {
    if (e.code === 'EADDRINUSE' && port < limit) listen(port + 1, limit);
    else { console.error('端口都被占用了：' + e.message); process.exit(1); }
  });
  server.listen({ port, host: '127.0.0.1', exclusive: true }, () => {
    console.log('http://127.0.0.1:' + port + '/');
  });
}

const start = Number(process.env.PORT) || basePort();
listen(start, start + 60);
