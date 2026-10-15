// 生成图标：红底、黄色薯片。不依赖第三方库，直接栅格化后写 PNG / ICO。
// 用法：node tools/build-icons.mjs
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RED = [229, 50, 45];
const GOLD = [227, 164, 0];
const YELLOW = [255, 210, 31];
const RIDGE = [240, 180, 0];

// 薯片在自己的坐标系里（以中心为原点，横向半轴 178）。
const A = 178;
const B = 132;
const ROT = (-20 * Math.PI) / 180;

// 外形：圆润的薯片轮廓，只有很缓的起伏，没有尖刺。
function outline(scale) {
  const pts = [];
  const n = 360;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const m = 1 + 0.045 * Math.sin(2 * t + 0.6) + 0.03 * Math.sin(3 * t + 1.4);
    pts.push([Math.cos(t) * A * m * scale, Math.sin(t) * B * m * scale]);
  }
  return pts;
}

// 里面是三条平行的整齐锯齿波浪线：三角波，齿尖略圆。
function tri(t) {
  const f = t / (Math.PI * 2) - Math.floor(t / (Math.PI * 2));
  return 4 * Math.abs(f - 0.5) - 1;
}

function ridges() {
  const out = [];
  [-0.5, 0, 0.5].forEach((k) => {
    const line = [];
    for (let i = 0; i <= 120; i++) {
      const x = (-0.74 + (1.48 * i) / 120) * A;
      const w = (x / A) * Math.PI * 2 * 3.5;
      line.push([x, k * B + 0.09 * B * (0.8 * tri(w) + 0.2 * Math.sin(w))]);
    }
    out.push(line);
  });
  return out;
}

const DOTS = [];
const OUTER = outline(1);
const INNER = outline(0.93);
const RIDGE_LINES = ridges();
const RIDGE_W = 11;

function rot([x, y]) {
  return [x * Math.cos(ROT) - y * Math.sin(ROT), x * Math.sin(ROT) + y * Math.cos(ROT)];
}

function inside(poly, x, y) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function chipColor(x, y) {
  // x、y 已经换算到薯片自己的坐标系（未旋转）
  if (x * x + y * y > (A * 1.12) * (A * 1.12)) return null;
  if (!inside(OUTER, x, y)) return null;
  if (!inside(INNER, x, y)) return GOLD;
  for (const [dx, dy, r] of DOTS) if (Math.hypot(x - dx, y - dy) <= r) return RIDGE;
  for (const line of RIDGE_LINES) {
    for (let i = 0; i < line.length - 1; i++) {
      if (segDist(x, y, line[i][0], line[i][1], line[i + 1][0], line[i + 1][1]) <= RIDGE_W / 2) return RIDGE;
    }
  }
  return YELLOW;
}

function roundedInside(x, y, w, h, r) {
  if (x < 0 || y < 0 || x > w || y > h) return false;
  const cx = x < r ? r : x > w - r ? w - r : x;
  const cy = y < r ? r : y > h - r ? h - r : y;
  return Math.hypot(x - cx, y - cy) <= r;
}

// opts: radius（0 为通铺）、chip（薯片横向占画面宽度的比例，按短边计）
function render(w, h, opts) {
  const SS = 3;
  const short = Math.min(w, h);
  const s = (short * opts.chip) / (A * 2);
  const cx = w / 2;
  const cy = h / 2;
  const r = opts.radius * short;
  const buf = Buffer.alloc(w * h * 4);
  const cosR = Math.cos(-ROT);
  const sinR = Math.sin(-ROT);
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      let ar = 0, ag = 0, ab = 0, aa = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = px + (sx + 0.5) / SS;
          const y = py + (sy + 0.5) / SS;
          if (!roundedInside(x, y, w, h, r)) continue;
          const lx = (x - cx) / s;
          const ly = (y - cy) / s;
          const c = chipColor(lx * cosR - ly * sinR, lx * sinR + ly * cosR) || RED;
          ar += c[0]; ag += c[1]; ab += c[2]; aa += 1;
        }
      }
      const i = (py * w + px) * 4;
      if (aa) {
        buf[i] = Math.round(ar / aa);
        buf[i + 1] = Math.round(ag / aa);
        buf[i + 2] = Math.round(ab / aa);
        buf[i + 3] = Math.round((aa / (SS * SS)) * 255);
      }
    }
  }
  return buf;
}

let crcTable;
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function png(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function ico(images) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const dirs = [];
  images.forEach((im) => {
    const d = Buffer.alloc(16);
    d[0] = im.size === 256 ? 0 : im.size;
    d[1] = im.size === 256 ? 0 : im.size;
    d.writeUInt16LE(1, 4);
    d.writeUInt16LE(32, 6);
    d.writeUInt32LE(im.data.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += im.data.length;
    dirs.push(d);
  });
  return Buffer.concat([head, ...dirs, ...images.map((i) => i.data)]);
}

const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
const path = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('') + 'Z';

// 供界面和 icon.svg 使用的矢量版本，画布 512×512。
export function iconSvg(opts = {}) {
  const radius = opts.radius === undefined ? 0.22 : opts.radius;
  const chip = opts.chip === undefined ? 0.7 : opts.chip;
  const s = (512 * chip) / (A * 2);
  const tr = 'translate(256 256) rotate(-20) scale(' + s.toFixed(4) + ')';
  const ridgePaths = RIDGE_LINES.map((l) => '<path d="' + path(l).replace(/Z$/, '') + '" fill="none" stroke="' + hex(RIDGE) + '" stroke-width="' + RIDGE_W + '" stroke-linecap="round"/>').join('');
  const dots = DOTS.map((d) => '<circle cx="' + d[0].toFixed(1) + '" cy="' + d[1].toFixed(1) + '" r="' + d[2].toFixed(1) + '" fill="' + hex(RIDGE) + '"/>').join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
    + '<rect width="512" height="512" rx="' + Math.round(radius * 512) + '" fill="' + hex(RED) + '"/>'
    + '<g transform="' + tr + '">'
    + '<path d="' + path(OUTER) + '" fill="' + hex(GOLD) + '"/>'
    + '<path d="' + path(INNER) + '" fill="' + hex(YELLOW) + '"/>'
    + ridgePaths + dots + '</g></svg>';
}

function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const out = join(root, 'web');
  mkdirSync(out, { recursive: true });
  const round = { radius: 0.22, chip: 0.7 };
  const bleed = { radius: 0, chip: 0.7 };
  const maskable = { radius: 0, chip: 0.56 };
  const put = (name, w, h, o) => {
    const data = png(w, h, render(w, h, o));
    writeFileSync(join(out, name), data);
    return data;
  };
  const f16 = put('favicon-16.png', 16, 16, round);
  put('favicon-32.png', 32, 32, round);
  const f48 = put('favicon-48.png', 48, 48, round);
  const f32 = png(32, 32, render(32, 32, round));
  writeFileSync(join(out, 'favicon.ico'), ico([{ size: 16, data: f16 }, { size: 32, data: f32 }, { size: 48, data: f48 }]));
  const big = [64, 128, 256].map((size) => ({ size, data: png(size, size, render(size, size, round)) }));
  writeFileSync(join(out, 'shupian.ico'), ico([{ size: 16, data: f16 }, { size: 32, data: f32 }, { size: 48, data: f48 }].concat(big)));
  put('apple-touch-icon.png', 180, 180, bleed);
  put('icon-192.png', 192, 192, round);
  put('icon-512.png', 512, 512, round);
  put('icon-maskable-192.png', 192, 192, maskable);
  put('icon-maskable-512.png', 512, 512, maskable);
  put('mstile-150x150.png', 150, 150, bleed);
  put('og-image.png', 1200, 630, { radius: 0, chip: 0.62 });
  writeFileSync(join(out, 'icon.svg'), iconSvg());
  console.log('icons written to', out);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
