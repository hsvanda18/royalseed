/**
 * Cuts the supplied Royalseed logotype off its baked-in white field and emits
 * the two variants the sheet needs. Both are COLOUR/ALPHA treatments of the
 * client's own artwork — PRODUCT.md permits exactly that — never a recreation:
 * leaf and crown pixels are passed through byte-for-byte.
 *
 *   royalseed-logo-cut.png       transparent field, original inks  (paper grounds)
 *   royalseed-logo-reversed.png  transparent field, paper wordmark (dark plate)
 *
 * The source is an opaque RGBA PNG whose background is a flat #F7F7F7 — there
 * is no alpha to work with, so the field is removed by a flood fill seeded
 * from the border. Flooding rather than thresholding is what protects the
 * specular highlights inside the crown and the pale veins on the leaves:
 * those whites are enclosed by artwork and never reached from the edge.
 *
 * PROVENANCE: derived from public/assets/royalseed-logo.png (the client's
 * logotype, extracted from their "Perfil Institucional da Empresa" .docx).
 * No generative model was involved.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";

const SRC = "public/assets/royalseed-logo.png";
const PAPER = [0xf6, 0xf2, 0xe8];

/* ── Decode ─────────────────────────────────────────────────────────────── */
const buf = readFileSync(SRC);
let pos = 8, width, height, bitDepth, colorType;
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
if (bitDepth !== 8 || colorType !== 6) throw new Error("expected 8-bit RGBA");

const raw = inflateSync(Buffer.concat(idat));
const stride = width * 4;
const base = Buffer.alloc(height * stride);
const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};
for (let y = 0; y < height; y++) {
  const ft = raw[y * (stride + 1)];
  const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
  for (let x = 0; x < stride; x++) {
    const a = x >= 4 ? base[y * stride + x - 4] : 0;
    const b = y > 0 ? base[(y - 1) * stride + x] : 0;
    const c = x >= 4 && y > 0 ? base[(y - 1) * stride + x - 4] : 0;
    let v = line[x];
    if (ft === 1) v += a;
    else if (ft === 2) v += b;
    else if (ft === 3) v += (a + b) >> 1;
    else if (ft === 4) v += paeth(a, b, c);
    base[y * stride + x] = v & 0xff;
  }
}

/* ── Flood the field from the border ────────────────────────────────────── */
const isField = (i) => {
  const r = base[i], g = base[i + 1], b = base[i + 2];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  return mn >= 228 && mx - mn <= 14; // flat and near-white
};

const removed = new Uint8Array(width * height);
const stack = [];
for (let x = 0; x < width; x++) {
  stack.push(x, (height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  stack.push(y * width, y * width + width - 1);
}
while (stack.length) {
  const p = stack.pop();
  if (removed[p]) continue;
  if (!isField(p * 4)) continue;
  removed[p] = 1;
  const x = p % width, y = (p - x) / width;
  if (x > 0) stack.push(p - 1);
  if (x < width - 1) stack.push(p + 1);
  if (y > 0) stack.push(p - width);
  if (y < height - 1) stack.push(p + width);
}

/**
 * The artwork was anti-aliased against #F7F7F7, so the pixels bordering the
 * cut are part background. Give them partial alpha by how far they sit from
 * the field colour; without this the mark ships with a hard white halo.
 */
const alpha = new Uint8Array(width * height).fill(255);
for (let p = 0; p < width * height; p++) {
  if (removed[p]) {
    alpha[p] = 0;
    continue;
  }
  const x = p % width, y = (p - x) / width;
  const touches =
    (x > 0 && removed[p - 1]) ||
    (x < width - 1 && removed[p + 1]) ||
    (y > 0 && removed[p - width]) ||
    (y < height - 1 && removed[p + width]);
  if (!touches) continue;
  const i = p * 4;
  const lum = 0.2126 * base[i] + 0.7152 * base[i + 1] + 0.0722 * base[i + 2];
  if (lum > 205) alpha[p] = Math.max(0, Math.min(255, Math.round(((247 - lum) / 42) * 255)));
}

/* ── Encode ─────────────────────────────────────────────────────────────── */
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

function write(path, px, note) {
  const out = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    out[y * (stride + 1)] = 0;
    px.copy(out, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const text = Buffer.concat([
    Buffer.from("impeccable:prompt\0", "latin1"),
    Buffer.from(note, "latin1"),
  ]);
  writeFileSync(
    path,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk("IHDR", ihdr),
      chunk("tEXt", text),
      chunk("IDAT", deflateSync(out, { level: 9 })),
      chunk("IEND", Buffer.alloc(0)),
    ]),
  );
  console.log(`${path}  ${width}x${height}`);
}

const PROV =
  "ORIGIN: derived, not generated. A treatment of the supplied artwork " +
  "public/assets/royalseed-logo.png (the client's logotype, extracted from " +
  "their 'Perfil Institucional da Empresa' .docx), produced by tools/cut-logo.mjs. " +
  "The opaque #F7F7F7 field is removed by a border-seeded flood fill with " +
  "anti-aliased edge alpha; leaf and crown pixels are passed through unchanged. " +
  "No generative model involved. Permitted by PRODUCT.md as a colour variant of " +
  "the supplied logotype. Re-running the script overwrites this file. ";

// Variant 1 — original inks, transparent field. For paper grounds.
const cut = Buffer.from(base);
for (let p = 0; p < width * height; p++) cut[p * 4 + 3] = alpha[p];
write("public/assets/royalseed-logo-cut.png", cut, PROV + "VARIANT: field cut only, inks untouched.");

// Variant 2 — wordmark re-inked to paper for the dark plate. The crown is
// red-dominant and bright; the leaves are bright green. Only dark, non-gold
// pixels are the wordmark.
const rev = Buffer.from(cut);
let reinked = 0;
for (let p = 0; p < width * height; p++) {
  const i = p * 4;
  if (rev[i + 3] === 0) continue;
  const r = rev[i], g = rev[i + 1], b = rev[i + 2];
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (lum < 0.36 && !(r > g && r > 90)) {
    const k = 0.84 + (lum / 0.36) * 0.16;
    rev[i] = Math.round(PAPER[0] * k);
    rev[i + 1] = Math.round(PAPER[1] * k);
    rev[i + 2] = Math.round(PAPER[2] * k);
    reinked++;
  }
}
write("public/assets/royalseed-logo-reversed.png", rev, PROV + "VARIANT: field cut, wordmark re-inked to paper #F6F2E8 for the dark plate.");

const cutPx = removed.reduce((n, v) => n + v, 0);
console.log(`field removed: ${cutPx} px (${((cutPx / (width * height)) * 100).toFixed(1)}%) · wordmark re-inked: ${reinked} px`);
