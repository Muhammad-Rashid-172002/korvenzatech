#!/usr/bin/env node
/**
 * Brand asset pipeline — rerunnable: `node scripts/build-brand.mjs [--og-hero path/to/render.png]`
 *
 * Sources (brand-source/):
 *   KorvenzaTech_PK_Green_Charcoal.png  original shaded K render (4096², transparent) — used where shading matters
 *   k-logo.svg                          clean vector master (faceted flat gradients)  — UI / 3D / particles
 *   k-mark.svg                          single-colour silhouette                       — tiny sizes, masks
 *
 * Outputs (public/):
 *   favicon.svg, favicon.ico (16/32/48), favicon-48.png
 *   media/brand/apple-touch-icon.png (180), icon-192.png, icon-512.png, icon-maskable-512.png
 *   media/brand/logo-{64,128,256,512}.webp + logo-512.png (Organization logo), k-logo.svg, k-mark.svg
 *   og-cover.png (1200×630)
 *   src/assets/brand/logo-{64,128,256}.webp — imported by the app, so the shipped URLs are content-hashed
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = (f) => path.join(root, 'brand-source', f);
const out = (f) => { const p = path.join(root, 'public', f); fs.mkdirSync(path.dirname(p), { recursive: true }); return p; };
const args = process.argv.slice(2);
const ogHero = args.includes('--og-hero') ? args[args.indexOf('--og-hero') + 1] : null;

const BG = '#07110E';
const raster = src('KorvenzaTech_PK_Green_Charcoal.png');
const logoSvg = fs.readFileSync(src('k-logo.svg'), 'utf8');
const markSvg = fs.readFileSync(src('k-mark.svg'), 'utf8');
const VB = '480 350 1200 1400'; // shared viewBox of the vector masters

/** Raster K trimmed to its solid pixels, padded to a square (transparent). */
async function rasterSquare(size, padRatio = 0.08) {
  const trimmed = await sharp(raster).trim({ threshold: 8 }).toBuffer({ resolveWithObject: true });
  const { width, height } = trimmed.info;
  const side = Math.round(Math.max(width, height) * (1 + padRatio * 2));
  return sharp({ create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: trimmed.data, left: Math.round((side - width) / 2), top: Math.round((side - height) / 2) }])
    .png().toBuffer()
    .then((b) => sharp(b).resize(size, size, { kernel: 'lanczos3' }).png().toBuffer());
}

/** Rounded dark tile with an inner artwork buffer. */
async function tile(size, art, { radius = 0.22, inset = 0.14, bg = BG, glow = true } = {}) {
  const r = Math.round(size * radius);
  const base = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs><radialGradient id="g" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#0F2A20"/><stop offset="1" stop-color="${bg}"/></radialGradient></defs>
    <rect width="${size}" height="${size}" rx="${r}" fill="${glow ? 'url(#g)' : bg}"/></svg>`);
  const inner = Math.round(size * (1 - inset * 2));
  const a = await sharp(art).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp(base).composite([{ input: a, left: Math.round(size * inset), top: Math.round(size * inset) }]).png().toBuffer();
}

const svgRaster = (svg, size) => sharp(Buffer.from(svg), { density: 300 }).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

/** Minimal ICO writer (PNG-compressed entries, supported by all modern browsers). */
function ico(pngs) {
  const header = Buffer.alloc(6 + pngs.length * 16);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, buf }, i) => {
    const o = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, o); header.writeUInt8(size >= 256 ? 0 : size, o + 1);
    header.writeUInt8(0, o + 2); header.writeUInt8(0, o + 3);
    header.writeUInt16LE(1, o + 4); header.writeUInt16LE(32, o + 6);
    header.writeUInt32LE(buf.length, o + 8); header.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.buf)]);
}

const written = [];
const save = async (rel, buf) => { fs.writeFileSync(out(rel), buf); written.push(`${rel} (${Math.round(buf.length / 1024)} KB)`); };

// ---- vector copies for the site / 3D
fs.copyFileSync(src('k-logo.svg'), out('media/brand/k-logo.svg'));
fs.copyFileSync(src('k-mark.svg'), out('media/brand/k-mark.svg'));
written.push('media/brand/k-logo.svg', 'media/brand/k-mark.svg');

// ---- favicon.svg: emerald mark on a dark rounded tile (crisp at every tab size)
const markPaths = markSvg.match(/<path[^>]*\/>/g).join('').replace(/fill="#19C784"/g, 'fill="url(#m)"');
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="m" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0E8C4A"/><stop offset="1" stop-color="#3FE09A"/></linearGradient></defs>
<rect width="64" height="64" rx="14" fill="${BG}"/>
<svg x="10" y="8" width="44" height="48" viewBox="${VB}">${markPaths}</svg>
</svg>
`;
fs.writeFileSync(out('favicon.svg'), faviconSvg);
written.push('favicon.svg');

// ---- favicons (PNG + ICO) from the SVG tile
const fav = {};
for (const s of [16, 32, 48]) fav[s] = await sharp(Buffer.from(faviconSvg), { density: 600 }).resize(s, s).png().toBuffer();
await save('favicon-48.png', fav[48]);
await save('favicon.ico', ico([16, 32, 48].map((s) => ({ size: s, buf: fav[s] }))));

// ---- app icons: the shaded K on a dark tile
const k1024 = await rasterSquare(1024, 0.02);
await save('media/brand/apple-touch-icon.png', await sharp(await tile(180, k1024, { radius: 0, inset: 0.12 })).flatten({ background: BG }).png().toBuffer());
await save('media/brand/icon-192.png', await tile(192, k1024, { inset: 0.12 }));
await save('media/brand/icon-512.png', await tile(512, k1024, { inset: 0.12 }));
// maskable: full-bleed background, logo inside the 80% safe circle (≈ 0.2 inset each side)
await save('media/brand/icon-maskable-512.png', await sharp(await tile(512, k1024, { radius: 0, inset: 0.2 })).flatten({ background: BG }).png().toBuffer());

// ---- UI logo rasters (chat avatar, curtain mark, Organization logo)
for (const s of [64, 128, 256, 512]) {
  const buf = await rasterSquare(s, 0.04);
  const webp = await sharp(buf).webp({ quality: 88, alphaQuality: 90 }).toBuffer();
  await save(`media/brand/logo-${s}.webp`, webp); // stable URL (kept so old cached pages still get the new K)
  if (s <= 256) { // UI copies imported by the app → Vite content-hashes them (logo-64.[hash].webp)
    const p = path.join(root, 'src/assets/brand', `logo-${s}.webp`);
    fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, webp); written.push(`src/assets/brand/logo-${s}.webp`);
  }
  if (s === 512) await save('media/brand/logo-512.png', await sharp(buf).png({ compressionLevel: 9 }).toBuffer());
}

// ---- og-cover 1200×630 (only with --og / --og-hero, so a plain rerun never overwrites a hero-render cover)
if (ogHero || args.includes('--og')) {
  const W = 1200, H = 630;
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="a" cx="27%" cy="50%" r="55%"><stop offset="0" stop-color="#0F3B2A"/><stop offset="1" stop-color="${BG}"/></radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#19C784" stroke-opacity=".06"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#a)"/><rect width="${W}" height="${H}" fill="url(#grid)"/>
  <text x="560" y="275" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="84" font-weight="800" letter-spacing="-3" fill="#F3F7F5">Korvenza<tspan dx="-2" fill="#19C784">Tech</tspan></text>
  <text x="564" y="335" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="30" font-weight="500" fill="#A6BDB2">Software engineering &amp; AI products</text>
  <text x="564" y="395" font-family="'JetBrains Mono', Menlo, monospace" font-size="20" letter-spacing="5" fill="#19C784">BUILD · AUTOMATE · SCALE</text>
  <rect x="564" y="440" width="300" height="2" fill="#19C784" fill-opacity=".4"/>
  </svg>`);
  const heroArt = ogHero && fs.existsSync(ogHero)
    ? await sharp(ogHero).resize(470, 470, { fit: 'cover' }).png().toBuffer()
    : await rasterSquare(470, 0.03);
  await save('og-cover.png', await sharp(bg).composite([{ input: heroArt, left: 60, top: 80 }]).png({ compressionLevel: 9 }).toBuffer());
}

console.log('[brand] wrote:\n  ' + written.join('\n  '));
