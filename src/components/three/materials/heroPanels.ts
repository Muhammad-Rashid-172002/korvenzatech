import { CanvasTexture, SRGBColorSpace } from 'three';
import { COLORS, HERO } from '../config';

/**
 * Live UI screens for the hero's glass devices. Each panel owns a canvas that
 * is redrawn at HERO.panels.fps (not every frame) and uploaded as a texture:
 *  - dashboard: the line chart draws itself, bars grow with a small overshoot
 *    and settle, KPIs tick — then the cycle restarts.
 *  - mobile: list rows shimmer, the CTA button pulses.
 * Transparent background: the frosted RoundedBox behind provides the glass.
 */
const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (v: number) => 1 - Math.pow(1 - clamp01(v), 3);
/** Overshoot-then-settle (back-out) easing for bars. */
const backOut = (v: number) => { const x = clamp01(v) - 1; return 1 + 2.2 * x * x * x + 1.2 * x * x; };

export type PanelKind = 'dashboard' | 'mobile';

export class LivePanel {
  readonly texture: CanvasTexture;
  private g: CanvasRenderingContext2D;
  private w: number;
  private h: number;
  private last = -1;

  constructor(readonly kind: PanelKind, private seed: number, scale = 1) {
    const c = document.createElement('canvas');
    this.w = c.width = Math.round((kind === 'dashboard' ? 640 : 300) * scale);
    this.h = c.height = Math.round((kind === 'dashboard' ? 400 : 600) * scale);
    this.g = c.getContext('2d')!;
    this.g.scale(scale, scale);
    this.texture = new CanvasTexture(c);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 8;
  }

  /** Redraw if enough time passed. Returns true when the texture changed. */
  update(t: number, fps: number) {
    if (this.last >= 0 && t - this.last < 1 / fps) return false;
    this.last = t;
    const g = this.g;
    const W = this.kind === 'dashboard' ? 640 : 300;
    const H = this.kind === 'dashboard' ? 400 : 600;
    g.clearRect(0, 0, W, H);
    if (this.kind === 'dashboard') this.dashboard(g, W, H, t); else this.mobile(g, W, H, t);
    this.texture.needsUpdate = true;
    return true;
  }

  private border(g: CanvasRenderingContext2D, W: number, H: number, r: number) {
    // Thin emissive border (drawn bright; the material is not tone-mapped so it glows).
    g.strokeStyle = rgba(COLORS.accent, 0.9);
    g.lineWidth = 3;
    g.beginPath(); g.roundRect(3, 3, W - 6, H - 6, r); g.stroke();
    g.strokeStyle = rgba(COLORS.ice, 0.18);
    g.lineWidth = 1;
    g.beginPath(); g.roundRect(9, 9, W - 18, H - 18, r - 6); g.stroke();
  }

  private dashboard(g: CanvasRenderingContext2D, W: number, H: number, time: number) {
    const cycle = HERO.panels.cycle;
    const t = ((time + this.seed * 1.7) % cycle) / cycle; // 0..1
    const line = rgba(COLORS.ice, 0.85), soft = rgba(COLORS.mint, 0.38), acc = COLORS.accent;
    this.border(g, W, H, 26);
    // sidebar + header
    g.fillStyle = rgba(COLORS.mint, 0.1); g.beginPath(); g.roundRect(22, 22, 104, H - 44, 14); g.fill();
    for (let i = 0; i < 6; i++) { g.fillStyle = i === 1 ? acc : rgba(COLORS.mint, 0.45); g.beginPath(); g.roundRect(36, 52 + i * 34, i === 1 ? 70 : 60, 9, 4); g.fill(); }
    g.fillStyle = line; g.beginPath(); g.roundRect(148, 28, 190, 14, 6); g.fill();
    g.fillStyle = soft; g.beginPath(); g.roundRect(148, 50, 120, 8, 4); g.fill();
    // KPI cards with ticking fills
    for (let i = 0; i < 3; i++) {
      const x = 148 + i * 158;
      g.strokeStyle = rgba(COLORS.mint, 0.3); g.lineWidth = 2; g.beginPath(); g.roundRect(x, 74, 142, 70, 12); g.stroke();
      const k = easeOut((t - 0.05 - i * 0.06) / 0.25);
      g.fillStyle = i === 0 ? acc : line; g.beginPath(); g.roundRect(x + 14, 90, 24 + 50 * k, 12, 6); g.fill();
      g.fillStyle = soft; g.beginPath(); g.roundRect(x + 14, 114, 96, 7, 4); g.fill();
    }
    // bars grow, overshoot and settle
    const bars = [0.42, 0.66, 0.5, 0.82, 0.58, 0.95, 0.72, 0.88];
    bars.forEach((b, i) => {
      const k = backOut((t - 0.12 - i * 0.035) / 0.3);
      const hgt = Math.max(0, 118 * b * k);
      g.fillStyle = rgba(COLORS.mint, 0.22 + 0.1 * (i % 2));
      g.beginPath(); g.roundRect(156 + i * 56, H - 30 - hgt, 30, hgt, 6); g.fill();
    });
    // line chart draws itself (with a bright head)
    const pts = [0.66, 0.52, 0.58, 0.4, 0.46, 0.3, 0.34, 0.18];
    const draw = easeOut((t - 0.18) / 0.4) * (pts.length - 1);
    g.strokeStyle = acc; g.lineWidth = 3.5; g.lineJoin = 'round'; g.lineCap = 'round';
    g.beginPath();
    let hx = 0, hy = 0;
    for (let i = 0; i <= Math.floor(draw); i++) {
      const x = 162 + i * 56, y = 160 + pts[i] * 120;
      if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      hx = x; hy = y;
    }
    const f = draw - Math.floor(draw), i0 = Math.floor(draw);
    if (i0 < pts.length - 1 && f > 0) {
      hx = 162 + (i0 + f) * 56; hy = 160 + (pts[i0] + (pts[i0 + 1] - pts[i0]) * f) * 120;
      g.lineTo(hx, hy);
    }
    g.stroke();
    if (draw > 0) {
      const grd = g.createRadialGradient(hx, hy, 0, hx, hy, 16);
      grd.addColorStop(0, rgba(COLORS.ice, 0.95)); grd.addColorStop(1, rgba(COLORS.accent, 0));
      g.fillStyle = grd; g.beginPath(); g.arc(hx, hy, 16, 0, Math.PI * 2); g.fill();
    }
    // fade the whole screen out at the end of the cycle so the restart is soft
    const out = clamp01((t - 0.92) / 0.08);
    if (out > 0) { g.globalCompositeOperation = 'destination-out'; g.fillStyle = `rgba(0,0,0,${out})`; g.fillRect(14, 14, W - 28, H - 28); g.globalCompositeOperation = 'source-over'; this.border(g, W, H, 26); }
  }

  private mobile(g: CanvasRenderingContext2D, W: number, H: number, time: number) {
    const line = rgba(COLORS.ice, 0.85), soft = rgba(COLORS.mint, 0.36), acc = COLORS.accent;
    this.border(g, W, H, 40);
    g.fillStyle = rgba(COLORS.ice, 0.75); g.beginPath(); g.roundRect(W / 2 - 38, 18, 76, 16, 8); g.fill(); // island
    g.fillStyle = line; g.beginPath(); g.roundRect(26, 60, 130, 15, 7); g.fill();
    g.fillStyle = soft; g.beginPath(); g.roundRect(26, 84, 180, 8, 4); g.fill();
    // hero card
    g.strokeStyle = rgba(COLORS.mint, 0.32); g.lineWidth = 2; g.beginPath(); g.roundRect(24, 108, W - 48, 118, 18); g.stroke();
    g.fillStyle = acc; g.beginPath(); g.arc(64, 150, 20, 0, Math.PI * 2); g.fill();
    g.fillStyle = line; g.beginPath(); g.roundRect(96, 138, 110, 10, 5); g.fill();
    g.fillStyle = soft; g.beginPath(); g.roundRect(96, 156, 80, 8, 4); g.fill();
    // list rows with a shimmer sweeping down the list
    const sweep = ((time * 0.45 + this.seed) % 1.6) - 0.3; // 0..1 down the list
    for (let i = 0; i < 4; i++) {
      const y = 248 + i * 58;
      const near = Math.exp(-Math.pow((i / 3 - sweep) * 4, 2));
      g.fillStyle = rgba(COLORS.mint, 0.12 + near * 0.18); g.beginPath(); g.roundRect(24, y, W - 48, 44, 12); g.fill();
      if (near > 0.05) {
        const sx = 24 + ((time * 260 + i * 70) % (W + 120)) - 60;
        const grd = g.createLinearGradient(sx - 50, 0, sx + 50, 0);
        grd.addColorStop(0, rgba(COLORS.ice, 0)); grd.addColorStop(0.5, rgba(COLORS.ice, 0.22 * near)); grd.addColorStop(1, rgba(COLORS.ice, 0));
        g.save(); g.beginPath(); g.roundRect(24, y, W - 48, 44, 12); g.clip(); g.fillStyle = grd; g.fillRect(sx - 50, y, 100, 44); g.restore();
      }
      g.fillStyle = line; g.beginPath(); g.roundRect(40, y + 13, 100, 8, 4); g.fill();
      g.fillStyle = soft; g.beginPath(); g.roundRect(40, y + 27, 64, 6, 3); g.fill();
    }
    // CTA pulses
    const pulse = 0.5 + 0.5 * Math.sin(time * 3.2 + this.seed);
    const by = H - 78, bh = 46;
    g.fillStyle = rgba(COLORS.accent, 0.18 * pulse); g.beginPath(); g.roundRect(18 - 4 * pulse, by - 4 * pulse, W - 36 + 8 * pulse, bh + 8 * pulse, 18); g.fill();
    g.fillStyle = acc; g.beginPath(); g.roundRect(24, by, W - 48, bh, 15); g.fill();
    g.fillStyle = rgba('#04110C', 0.85); g.beginPath(); g.roundRect(W / 2 - 40, by + 19, 80, 9, 4); g.fill();
  }

  dispose() { this.texture.dispose(); }
}
