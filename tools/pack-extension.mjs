// 把 extension/ 打成 CRX3 包：node tools/pack-extension.mjs [输出文件]
// 签名私钥放在 tools/.extension-key.pem（不进仓库，没有就生成一把）；公钥写进 manifest 的 key，
// 这样打包出来的和直接「加载解压缩的扩展」得到的是同一个扩展 ID。
import { createHash, createPrivateKey, createPublicKey, createSign, generateKeyPairSync } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { deflateRawSync, crc32 } from 'node:zlib';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const extDir = join(root, 'extension');
const keyFile = join(root, 'tools', '.extension-key.pem');
const manifestFile = join(extDir, 'manifest.json');

function loadKey() {
  if (existsSync(keyFile)) return createPrivateKey(readFileSync(keyFile));
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  writeFileSync(keyFile, privateKey.export({ type: 'pkcs8', format: 'pem' }));
  return privateKey;
}

const varint = (n) => {
  const out = [];
  while (n > 127) { out.push((n & 127) | 128); n = Math.floor(n / 128); }
  out.push(n);
  return Buffer.from(out);
};
const field = (no, data) => Buffer.concat([varint(no * 8 + 2), varint(data.length), data]);
const le32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; };

// 扩展 ID：公钥 DER 的 SHA-256 前 16 字节，每个半字节映射成 a-p
export function extensionId(publicDer) {
  const h = createHash('sha256').update(publicDer).digest().subarray(0, 16);
  return Array.from(h).map((b) => String.fromCharCode(97 + (b >> 4)) + String.fromCharCode(97 + (b & 15))).join('');
}

function listFiles(dir) {
  const out = [];
  readdirSync(dir).sort().forEach((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  });
  return out;
}

// 最小的 zip 写入：每个文件一条，deflate 压缩，路径用斜杠
function zip(files) {
  const parts = [];
  const central = [];
  let offset = 0;
  files.forEach(({ name, data }) => {
    const nameBuf = Buffer.from(name, 'utf8');
    const comp = deflateRawSync(data);
    const crc = crc32(data);
    const head = Buffer.concat([le32(0x04034b50), Buffer.from([20, 0, 0, 8, 8, 0, 0, 0, 0, 0]), le32(crc), le32(comp.length), le32(data.length), Buffer.from([nameBuf.length & 255, nameBuf.length >> 8, 0, 0]), nameBuf]);
    parts.push(head, comp);
    central.push(Buffer.concat([le32(0x02014b50), Buffer.from([20, 0, 20, 0, 0, 8, 8, 0, 0, 0, 0, 0]), le32(crc), le32(comp.length), le32(data.length),
      Buffer.from([nameBuf.length & 255, nameBuf.length >> 8, 0, 0, 0, 0, 0, 0, 0, 0]), le32(0), le32(offset), nameBuf]));
    offset += head.length + comp.length;
  });
  const cd = Buffer.concat(central);
  const end = Buffer.concat([le32(0x06054b50), Buffer.from([0, 0, 0, 0]), Buffer.from([files.length & 255, files.length >> 8, files.length & 255, files.length >> 8]), le32(cd.length), le32(offset), Buffer.from([0, 0])]);
  return Buffer.concat([...parts, cd, end]);
}

export function pack() {
  const privateKey = loadKey();
  const publicDer = createPublicKey(privateKey).export({ type: 'spki', format: 'der' });
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  const keyB64 = publicDer.toString('base64');
  if (manifest.key !== keyB64) {
    manifest.key = keyB64;
    writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  }
  const files = listFiles(extDir).map((p) => ({ name: relative(extDir, p).split(sep).join('/'), data: readFileSync(p) }));
  const zipBuf = zip(files);
  const id = extensionId(publicDer);
  const signedData = field(1, createHash('sha256').update(publicDer).digest().subarray(0, 16));
  const signer = createSign('sha256');
  signer.update(Buffer.concat([Buffer.from('CRX3 SignedData\0'), le32(signedData.length), signedData, zipBuf]));
  const signature = signer.sign(privateKey);
  const proof = Buffer.concat([field(1, publicDer), field(2, signature)]);
  const header = Buffer.concat([field(2, proof), field(10000, signedData)]);
  const crx = Buffer.concat([Buffer.from('Cr24'), le32(3), le32(header.length), header, zipBuf]);
  return { crx, id, version: manifest.version };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = resolve(process.argv[2] || join(root, 'web', 'download', 'extension.crx'));
  const r = pack();
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, r.crx);
  console.log('packed ' + out + ' id ' + r.id + ' version ' + r.version + ' ' + r.crx.length + ' bytes');
}
