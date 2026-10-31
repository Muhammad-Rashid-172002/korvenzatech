#!/usr/bin/env node
/**
 * Hero logo pipeline — the ORIGINAL KorvenzaTech K artwork, pixel for pixel.
 * Source: brand-source/KorvenzaTech_K_original.jpg (as supplied: white background, no alpha).
 * The only change is removing the white background so the logo can sit on the dark hero:
 *   1. flood-fill "background-white" from the image border (white areas *inside* the logo,
 *      e.g. the silver arm face, are enclosed by its outline and are never touched);
 *   2. edge band: alpha from distance to white + colour decontamination, so anti-aliased
 *      edges keep no white fringe on a dark page.
 * Outputs public/media/brand/k-original-{480,640,800,1200}.webp (+ a 1600 PNG for reference).
 * Run: node scripts/build-hero-logo.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = path.join(root, 'brand-source/KorvenzaTech_K_original.jpg');
const outDir = path.join(root, 'public/media/brand');

const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;
const isBg = (i) => {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
  return mn > 228 && mx - mn < 18;
};
// 1. flood fill from the border
const bg = new Uint8Array(N);
const stack = [];
for (let x = 0; x < W; x++) { stack.push(x, (H - 1) * W + x); }
for (let y = 0; y < H; y++) { stack.push(y * W, y * W + W - 1); }
while (stack.length) {
  const i = stack.pop();
  if (bg[i] || !isBg(i)) continue;
  bg[i] = 1;
  const x = i % W, y = (i / W) | 0;
  if (x > 0) stack.push(i - 1); if (x < W - 1) stack.push(i + 1);
  if (y > 0) stack.push(i - W); if (y < H - 1) stack.push(i + W);
}
// 2. distance (in px, up to 3) from background for the edge band
const near = new Uint8Array(N);
for (let pass = 1; pass <= 3; pass++) {
  for (let i = 0; i < N; i++) {
    if (bg[i] || near[i]) continue;
    const x = i % W, y = (i / W) | 0;
    const nb = [x > 0 && i - 1, x < W - 1 && i + 1, y > 0 && i - W, y < H - 1 && i + W];
    if (nb.some((j) => j !== false && (bg[j] || (near[j] && near[j] < pass)))) near[i] = pass;
  }
}
const out = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  let r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  let a = 255;
  if (bg[i]) a = 0;
  else if (near[i]) {
    // alpha from how far the pixel is from white; un-mix the white it was blended with
    const whiteness = Math.min(r, g, b) / 255;
    const al = Math.min(1, Math.max(0, (1 - whiteness) / 0.35 + (near[i] - 1) * 0.25));
    if (al <= 0.01) a = 0;
    else {
      a = Math.round(al * 255);
      r = Math.min(255, Math.max(0, Math.round((r - (1 - al) * 255) / al)));
      g = Math.min(255, Math.max(0, Math.round((g - (1 - al) * 255) / al)));
      b = Math.min(255, Math.max(0, Math.round((b - (1 - al) * 255) / al)));
    }
  }
  out[i * 4] = r; out[i * 4 + 1] = g; out[i * 4 + 2] = b; out[i * 4 + 3] = a;
}
const img = sharp(out, { raw: { width: W, height: H, channels: 4 } });
const trimmed = await img.png().toBuffer().then((b) => sharp(b).trim({ threshold: 1 }).png().toBuffer());
const meta = await sharp(trimmed).metadata();
fs.mkdirSync(outDir, { recursive: true });
const written = [];
for (const w of [480, 640, 800, 1200]) {
  const p = path.join(outDir, `k-original-${w}.webp`);
  await sharp(trimmed).resize({ width: w }).webp({ quality: 86, alphaQuality: 92, effort: 6 }).toFile(p);
  written.push(`${path.relative(root, p)} (${Math.round(fs.statSync(p).size / 1024)} KB)`);
}
const ref = path.join(root, 'brand-source/KorvenzaTech_K_original-transparent.png');
await sharp(trimmed).resize({ width: 1600 }).png({ compressionLevel: 9 }).toFile(ref);
console.log(`[hero-logo] ${meta.width}×${meta.height} (aspect ${(meta.width / meta.height).toFixed(4)})\n  ` + written.join('\n  '));
