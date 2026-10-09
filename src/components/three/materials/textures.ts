import { CanvasTexture, SRGBColorSpace } from 'three';
import { COLORS } from '../config';

/** All procedural textures are drawn once into canvases — zero network cost. */
function make(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, anisotropy = 4) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d')!);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = anisotropy;
  return t;
}

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

function frame(g: CanvasRenderingContext2D, w: number, h: number, r: number) {
  const fill = g.createLinearGradient(0, 0, w, h);
  fill.addColorStop(0, rgba(COLORS.mint, 0.16));
  fill.addColorStop(1, rgba(COLORS.accent, 0.04));
  g.fillStyle = fill;
  g.beginPath(); g.roundRect(2, 2, w - 4, h - 4, r); g.fill();
  g.strokeStyle = rgba(COLORS.mint, 0.7);
  g.lineWidth = 2.5;
  g.stroke();
  // fine blueprint grid
  g.save(); g.beginPath(); g.roundRect(2, 2, w - 4, h - 4, r); g.clip();
  g.strokeStyle = rgba(COLORS.mint, 0.08); g.lineWidth = 1;
  for (let x = 24; x < w; x += 24) { g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, h); g.stroke(); }
  for (let y = 24; y < h; y += 24) { g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(w, y + 0.5); g.stroke(); }
  g.restore();
}

/** Wide "dashboard" UI plane: sidebar, header, KPI cards, line chart, bars. */
export function dashboardTexture() {
  const W = 640, H = 400;
  return make(W, H, (g) => {
    frame(g, W, H, 22);
    const line = rgba(COLORS.mint, 0.75), soft = rgba(COLORS.mint, 0.35), acc = rgba(COLORS.accent, 0.95);
    g.fillStyle = soft; g.fillRect(22, 22, 110, H - 44);                    // sidebar
    for (let i = 0; i < 6; i++) { g.fillStyle = i === 1 ? acc : rgba(COLORS.mint, 0.5); g.fillRect(36, 52 + i * 34, 78, 9); }
    g.fillStyle = line; g.fillRect(152, 26, 200, 14); g.fillStyle = soft; g.fillRect(152, 48, 130, 8); // header
    for (let i = 0; i < 3; i++) {                                           // KPI cards
      g.strokeStyle = soft; g.lineWidth = 2; g.strokeRect(152 + i * 156, 76, 140, 70);
      g.fillStyle = i === 0 ? acc : line; g.fillRect(166 + i * 156, 92, 60, 12);
      g.fillStyle = soft; g.fillRect(166 + i * 156, 116, 100, 7);
    }
    g.strokeStyle = acc; g.lineWidth = 3; g.beginPath();                    // line chart
    const pts = [0.62, 0.5, 0.56, 0.38, 0.44, 0.3, 0.34, 0.2];
    pts.forEach((p, i) => { const x = 160 + i * 52, y = 170 + p * 170; i ? g.lineTo(x, y) : g.moveTo(x, y); });
    g.stroke();
    for (let i = 0; i < 8; i++) { const hgt = 20 + ((i * 37) % 60); g.fillStyle = rgba(COLORS.mint, 0.28); g.fillRect(162 + i * 52, H - 30 - hgt, 26, hgt); }
  });
}

/** Tall "mobile app" UI plane: notch, title, cards, list rows, primary button. */
export function mobileTexture() {
  const W = 260, H = 520;
  return make(W, H, (g) => {
    frame(g, W, H, 34);
    const line = rgba(COLORS.mint, 0.75), soft = rgba(COLORS.mint, 0.35), acc = rgba(COLORS.accent, 0.95);
    g.fillStyle = line; g.beginPath(); g.roundRect(W / 2 - 36, 14, 72, 14, 7); g.fill();       // notch
    g.fillStyle = line; g.fillRect(24, 54, 120, 14); g.fillStyle = soft; g.fillRect(24, 76, 170, 8);
    g.strokeStyle = soft; g.lineWidth = 2; g.beginPath(); g.roundRect(22, 100, W - 44, 110, 16); g.stroke();
    g.fillStyle = acc; g.beginPath(); g.arc(60, 140, 18, 0, Math.PI * 2); g.fill();
    g.fillStyle = line; g.fillRect(90, 128, 100, 10); g.fillStyle = soft; g.fillRect(90, 146, 70, 8);
    for (let i = 0; i < 4; i++) {                                                         // list rows
      const y = 232 + i * 52;
      g.fillStyle = rgba(COLORS.mint, 0.22); g.beginPath(); g.roundRect(22, y, W - 44, 40, 10); g.fill();
      g.fillStyle = line; g.fillRect(36, y + 12, 90, 8); g.fillStyle = soft; g.fillRect(36, y + 25, 60, 6);
    }
    g.fillStyle = acc; g.beginPath(); g.roundRect(22, H - 66, W - 44, 40, 14); g.fill();  // CTA
  });
}

/** Soft round sprite for points (network nodes, dissolve particles). */
export function dotTexture() {
  return make(64, 64, (g) => {
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.35, 'rgba(255,255,255,0.85)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  }, 1);
}

/** Emerald halo used as a cheap, per-view "bloom" behind emissive elements. */
export function glowTexture() {
  return make(128, 128, (g) => {
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, rgba(COLORS.accent, 0.55));
    grd.addColorStop(0.45, rgba(COLORS.accent, 0.14));
    grd.addColorStop(1, rgba(COLORS.accent, 0));
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  }, 1);
}
