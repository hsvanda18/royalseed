/**
 * Produces a reversed variant of the SUPPLIED Royalseed logotype for the dark
 * title-block plate. This is a colour treatment of the client's own artwork —
 * PRODUCT.md permits exactly that — not a recreation of the mark: the leaf
 * and crown pixels are passed through untouched, and only the dark-green
 * wordmark is re-inked to the sheet's paper colour.
 *
 * PROVENANCE: derived from public/assets/royalseed-logo.png (the client's
 * logotype, extracted from their "Perfil Institucional da Empresa" .docx).
 * No generative model was involved.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";

const SRC = "public/assets/royalseed-logo.png";
const OUT = "public/assets/royalseed-logo-reversed.png";
const PAPER = [0xf6, 0xf2, 0xe8];

const buf = readFileSync(SRC);
if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");

// ── Read chunks ───────────────────────────────────────────────────────────
let pos = 8;
let width, height, bitDepth, colorType;
const idat = [];
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString("ascii", pos + 4, pos + 8);
  const data = buf.subarray(pos + 8, pos + 8 + len);
  if (type === "IHDR") {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    bitDepth = data[8];
    colorType = data[9];
    if (data[12] !== 0) throw new Error("interlaced PNG unsupported");
  } else if (type === "IDAT") idat.push(data);
  pos += 12 + len;
}
if (bitDepth !== 8 || colorType !== 6) {
  throw new Error(`expected 8-bit RGBA, got depth ${bitDepth} type ${colorType}`);
}

// ── Un-filter ─────────────────────────────────────────────────────────────
const raw = inflateSync(Buffer.concat(idat));
const bpp = 4;
const stride = width * bpp;
const px = Buffer.alloc(height * stride);
const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};
for (let y = 0; y < height; y++) {
  const ft = raw[y * (stride + 1)];
  const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
  for (let x = 0; x < stride; x++) {
    const a = x >= bpp ? px[y * stride + x - bpp] : 0;
    const b = y > 0 ? px[(y - 1) * stride + x] : 0;
    const c = x >= bpp && y > 0 ? px[(y - 1) * stride + x - bpp] : 0;
    let v = line[x];
    if (ft === 1) v += a;
    else if (ft === 2) v += b;
    else if (ft === 3) v += (a + b) >> 1;
    else if (ft === 4) v += paeth(a, b, c);
    px[y * stride + x] = v & 0xff;
  }
}

// ── Re-ink ────────────────────────────────────────────────────────────────
// The wordmark is dark and green-leaning. The crown is gold (red-dominant and
// bright) and the leaves are bright green; both must survive untouched, so
// the test is luminance plus an explicit gold exclusion.
let changed = 0;
for (let i = 0; i < px.length; i += 4) {
  const [r, g, b, a] = [px[i], px[i + 1], px[i + 2], px[i + 3]];
  if (a === 0) continue;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const isGold = r > g && r > 90;
  if (lum < 0.36 && !isGold) {
    // Keep the letterform's internal shading by carrying luminance through
    // as a slight darkening of paper rather than flattening it to one value.
    const k = 0.82 + (lum / 0.36) * 0.18;
    px[i] = Math.round(PAPER[0] * k);
    px[i + 1] = Math.round(PAPER[1] * k);
    px[i + 2] = Math.round(PAPER[2] * k);
    changed++;
  }
}

// ── Re-encode (filter 0) ──────────────────────────────────────────────────
const out = Buffer.alloc(height * (stride + 1));
for (let y = 0; y < height; y++) {
  out[y * (stride + 1)] = 0;
  px.copy(out, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
}
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (b) => {
  let c = 0xffffffff;
  for (const byte of b) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const cr = Buffer.alloc(4);
  cr.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, cr]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;

writeFileSync(
  OUT,
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(out, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]),
);

console.log(`${OUT}  ${width}x${height}  re-inked ${changed} px`);
