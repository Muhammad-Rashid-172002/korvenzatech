/**
 * Live, code-drawn device screens for the hero (Canvas 2D → CanvasTexture).
 * Every screen is an illustrative recreation with clearly labelled DEMO data —
 * no real users, clients or metrics.
 *
 *  ielts      phone  · mic pulse → waveform → "Analyzing…" → band score 7.5 + criteria bars → tip card
 *  skilllink  phone  · map → pins drop → one selected → worker card → Requested → … → Completed ✓
 *  dashboard  browser· sidebar, 3 KPIs count up, line chart draws, bars stagger, "Live" pulse
 *  agent      browser· Korvenza AI Agent, 3 rotating scenarios (agentic onboarding, document
 *                      intelligence, voice → SQL → insight) with a thinking orb, stacked tool
 *                      cards and word-by-word streaming
 *
 * Each screen keeps its own clock (so hover can speed one loop up) and is drawn in
 * logical px at `scale` (2 = 2× DPR). `blur` < 1 renders through a smaller canvas
 * (cheap depth-of-field for the far device). `frozen` screens draw one frame only.
 */
import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three';

export type ScreenKind = 'ielts' | 'skilllink' | 'dashboard' | 'agent';
type G = CanvasRenderingContext2D;

const FONT = '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, Menlo, monospace';
const f = (w: number, s: number, mono = false) => `${mono ? Math.min(600, Math.max(500, w)) : w} ${s}px ${mono ? MONO : FONT}`; // only the weights the page loads
const cl = (v: number) => Math.min(1, Math.max(0, v));
/** progress of t through [a, b] (0..1) */
const seg = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const eo = (v: number) => 1 - Math.pow(1 - cl(v), 3); // power3 out
const expo = (v: number) => (v >= 1 ? 1 : 1 - Math.pow(2, -10 * cl(v)));
const backOut = (v: number) => { const x = cl(v) - 1; return 1 + 2.4 * x * x * x + 1.4 * x * x; };
const bounce = (v: number) => {
  const x = cl(v), n = 7.5625, d = 2.75;
  if (x < 1 / d) return n * x * x;
  if (x < 2 / d) { const y = x - 1.5 / d; return n * y * y + 0.75; }
  if (x < 2.5 / d) { const y = x - 2.25 / d; return n * y * y + 0.9375; }
  const y = x - 2.625 / d; return n * y * y + 0.984375;
};
const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
const words = (s: string, p: number) => { const w = s.split(' '); return w.slice(0, Math.ceil(cl(p) * w.length)).join(' '); };
const chars = (s: string, p: number) => s.slice(0, Math.floor(cl(p) * s.length));

function rr(g: G, x: number, y: number, w: number, h: number, r: number, fill?: string, stroke?: string, lw = 1) {
  g.beginPath(); g.roundRect(x, y, w, h, r);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
}
function text(g: G, s: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = 'left') {
  g.font = font; g.fillStyle = color; g.textAlign = align; g.textBaseline = 'alphabetic'; g.fillText(s, x, y);
}
function wrap(g: G, s: string, maxW: number, font: string) {
  g.font = font;
  const out: string[] = []; let line = '';
  for (const w of s.split(' ')) {
    const tryL = line ? line + ' ' + w : w;
    if (g.measureText(tryL).width > maxW && line) { out.push(line); line = w; } else line = tryL;
  }
  if (line) out.push(line);
  return out;
}
function demoChip(g: G, x: number, y: number, color = '#FFFFFF', align: 'left' | 'right' = 'right') {
  g.font = f(800, 8.5);
  const w = g.measureText('DEMO').width + 12;
  const x0 = align === 'right' ? x - w : x;
  rr(g, x0, y, w, 15, 7.5, rgba(color, 0.1), rgba(color, 0.35));
  text(g, 'DEMO', x0 + w / 2, y + 10.5, f(800, 8.5), rgba(color, 0.85), 'center');
}
function check(g: G, cx: number, cy: number, s: number, color: string, lw = 2) {
  g.strokeStyle = color; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(cx - s * 0.45, cy); g.lineTo(cx - s * 0.1, cy + s * 0.35); g.lineTo(cx + s * 0.5, cy - s * 0.35); g.stroke();
}
function spinner(g: G, cx: number, cy: number, r: number, t: number, color: string) {
  g.strokeStyle = color; g.lineWidth = 2; g.lineCap = 'round';
  g.beginPath(); g.arc(cx, cy, r, t * 6, t * 6 + 4.2); g.stroke();
}
/** phone status bar + dynamic island + home indicator */
function phoneChrome(g: G, W: number, H: number, light = '#FFFFFF') {
  text(g, '9:41', 30, 27, f(700, 12.5), light);
  for (let i = 0; i < 4; i++) rr(g, W - 78 + i * 5, 23 - i * 2.5, 3, 4 + i * 2.5, 1, rgba(light, 0.9));
  rr(g, W - 50, 16, 22, 11, 3.5, undefined, rgba(light, 0.5), 1);
  rr(g, W - 48, 18, 16, 7, 2, light);
  rr(g, W / 2 - 46, 10, 92, 26, 13, '#000');
  rr(g, W / 2 - 50, H - 12, 100, 4.5, 2.25, rgba(light, 0.55));
}
function browserChrome(g: G, W: number, url: string, t: number, live: boolean) {
  g.fillStyle = '#0D1714'; g.fillRect(0, 0, W, 34);
  g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(0, 33, W, 1);
  ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => { g.beginPath(); g.arc(18 + i * 17, 17, 5.5, 0, Math.PI * 2); g.fillStyle = c; g.fill(); });
  const pw = 250;
  rr(g, W / 2 - pw / 2, 8, pw, 19, 9.5, 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.08)');
  // lock
  rr(g, W / 2 - pw / 2 + 12, 15, 7, 6, 1.5, 'rgba(166,235,205,0.75)');
  g.strokeStyle = 'rgba(166,235,205,0.75)'; g.lineWidth = 1.3; g.beginPath(); g.arc(W / 2 - pw / 2 + 15.5, 15, 2.4, Math.PI, 0); g.stroke();
  text(g, url, W / 2 - pw / 2 + 26, 21.5, f(500, 10.5), 'rgba(220,235,228,0.8)');
  if (live) {
    const k = (Math.sin(t * 4) + 1) / 2;
    g.beginPath(); g.arc(W - 52, 17, 7 + k * 3, 0, Math.PI * 2); g.fillStyle = rgba('#19C784', 0.18 * (1 - k)); g.fill();
    g.beginPath(); g.arc(W - 52, 17, 3.5, 0, Math.PI * 2); g.fillStyle = '#19C784'; g.fill();
    text(g, 'Live', W - 42, 21, f(700, 10.5), '#A6EBCD');
  }
}

/* ======================================================================= IELTS */
const IELTS = { bg0: '#0F1A3D', bg1: '#0A1028', brand: '#2F5BEA', brandL: '#8FA9FF', accent: '#E2384D', cycle: 10.5 };
function drawIelts(g: G, W: number, H: number, t: number) {
  const C = IELTS;
  const grd = g.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, C.bg0); grd.addColorStop(1, C.bg1);
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
  phoneChrome(g, W, H);
  text(g, 'IELTS Speaking', 24, 76, f(800, 19), '#FFFFFF');
  text(g, 'Part 2 · Practice test', 24, 96, f(500, 11.5), 'rgba(200,212,255,0.65)');
  demoChip(g, W - 22, 63, '#BFD0FF');
  rr(g, 20, 114, W - 40, 86, 16, 'rgba(255,255,255,0.06)', 'rgba(143,169,255,0.18)');
  text(g, 'CUE CARD', 36, 136, f(800, 9.5), C.brandL);
  text(g, 'Describe a place you like', 36, 160, f(700, 15), '#F2F5FF');
  text(g, 'to visit and explain why.', 36, 181, f(700, 15), '#F2F5FF');

  const cx = W / 2, cy = 300;
  const rec = seg(t, 2.0, 4.6), anal = seg(t, 4.6, 5.7), score = seg(t, 5.7, 7.6);
  if (t < 4.6) {
    // mic button + pulse rings, then recording waveform
    const recording = t >= 2;
    const col = recording ? C.accent : C.brand;
    for (let i = 0; i < 2; i++) {
      const k = ((t * 0.9 + i * 0.5) % 1);
      g.beginPath(); g.arc(cx, cy, 34 + k * 34, 0, Math.PI * 2); g.strokeStyle = rgba(col, 0.5 * (1 - k)); g.lineWidth = 2; g.stroke();
    }
    g.beginPath(); g.arc(cx, cy, 34, 0, Math.PI * 2); g.fillStyle = col; g.fill();
    rr(g, cx - 6, cy - 16, 12, 20, 6, '#FFFFFF');
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.4; g.lineCap = 'round';
    g.beginPath(); g.arc(cx, cy - 2, 11, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
    g.beginPath(); g.moveTo(cx, cy + 9); g.lineTo(cx, cy + 15); g.stroke();
    if (!recording) {
      text(g, 'Tap to answer', cx, cy + 64, f(600, 12.5), 'rgba(220,228,255,0.7)', 'center');
    } else {
      const n = 30, bw = 4.4, gap = 3.2, x0 = cx - (n * (bw + gap)) / 2;
      for (let i = 0; i < n; i++) {
        const a = (0.25 + 0.75 * Math.abs(Math.sin(t * 7 + i * 0.7) * Math.sin(t * 3.1 + i * 0.33))) * eo(rec * 4);
        const h = 6 + a * 46;
        rr(g, x0 + i * (bw + gap), cy + 96 - h / 2, bw, h, 2.2, rgba(i / n < rec ? '#FF8A98' : C.brandL, 0.9));
      }
      text(g, `Recording · 00:${String(Math.floor(rec * 46) + 10).padStart(2, '0')}`, cx, cy + 148, f(600, 12), 'rgba(255,190,198,0.85)', 'center');
    }
  } else if (t < 5.7) {
    spinner(g, cx, cy, 30, t, C.brandL);
    text(g, 'Analyzing' + '.'.repeat(1 + (Math.floor(t * 4) % 3)), cx - 34, cy + 64, f(700, 14), '#E8EDFF');
    for (let i = 0; i < 3; i++) {
      const y = cy + 94 - Math.max(0, Math.sin(t * 8 - i * 0.8)) * 6;
      g.beginPath(); g.arc(cx - 12 + i * 12, y, 3.5, 0, Math.PI * 2); g.fillStyle = rgba(C.brandL, 0.4 + 0.6 * anal); g.fill();
    }
  } else {
    // band score ring counts to 7.5
    const v = 7.5 * eo(score);
    g.beginPath(); g.arc(cx, cy - 6, 52, 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,0.08)'; g.lineWidth = 9; g.stroke();
    const arc = g.createLinearGradient(cx - 52, 0, cx + 52, 0); arc.addColorStop(0, C.brand); arc.addColorStop(1, '#7CF2C2');
    g.beginPath(); g.arc(cx, cy - 6, 52, -Math.PI / 2, -Math.PI / 2 + (v / 9) * Math.PI * 2); g.strokeStyle = arc; g.lineCap = 'round'; g.stroke();
    text(g, v.toFixed(1), cx, cy + 6, f(800, 32), '#FFFFFF', 'center');
    text(g, 'Band score', cx, cy + 24, f(600, 10.5), 'rgba(200,212,255,0.7)', 'center');
    const rows: [string, number][] = [['Fluency', 7.5], ['Vocabulary', 7.0], ['Grammar', 7.0], ['Pronunciation', 8.0]];
    rows.forEach(([name, val], i) => {
      const y = cy + 70 + i * 34, p = eo(seg(t, 6.0 + i * 0.22, 7.2 + i * 0.22));
      text(g, name, 26, y, f(600, 11.5), 'rgba(226,232,255,0.85)');
      text(g, (val * p).toFixed(1), W - 26, y, f(800, 11.5), '#FFFFFF', 'right');
      rr(g, 26, y + 7, W - 52, 6, 3, 'rgba(255,255,255,0.08)');
      if (p > 0.01) rr(g, 26, y + 7, (W - 52) * (val / 9) * p, 6, 3, i === 3 ? '#7CF2C2' : C.brandL);
    });
  }
  // tip card slides up
  const tip = expo(seg(t, 7.7, 8.5));
  if (tip > 0) {
    const y = H - 22 - 104 * tip + (1 - tip) * 30;
    g.globalAlpha = tip;
    rr(g, 16, y, W - 32, 92, 16, '#18245A', 'rgba(143,169,255,0.35)');
    g.beginPath(); g.arc(40, y + 26, 11, 0, Math.PI * 2); g.fillStyle = '#FFD166'; g.fill();
    rr(g, 36.5, y + 35, 7, 4, 1.5, '#FFD166');
    text(g, 'Tip to reach 8.0', 58, y + 31, f(800, 12.5), '#FFFFFF');
    text(g, 'Link ideas with phrases like', 28, y + 58, f(500, 11.5), 'rgba(226,232,255,0.85)');
    text(g, '“On top of that…” to lift Fluency.', 28, y + 76, f(500, 11.5), 'rgba(226,232,255,0.85)');
    g.globalAlpha = 1;
  }
}

/* =================================================================== SKILLLINK */
const SL = { bg: '#15132A', block: '#1D1A38', road: '#2A2652', main: '#3A3474', brand: '#6D5CF0', light: '#A99BFF', cycle: 12 };
const PINS: [number, number][] = [[78, 210], [222, 238], [196, 340], [96, 366], [246, 300]];
function drawSkilllink(g: G, W: number, H: number, t: number) {
  const C = SL;
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  // city blocks + roads (deterministic)
  for (let y = 60; y < H; y += 74) for (let x = -10; x < W; x += 82) rr(g, x + ((y / 74) % 2) * 18, y, 64, 56, 8, C.block);
  rr(g, 170, 128, 96, 70, 10, '#1E3A36');
  g.lineCap = 'round';
  g.strokeStyle = C.road; g.lineWidth = 9;
  for (let y = 124; y < H; y += 74) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.strokeStyle = C.main; g.lineWidth = 13;
  g.beginPath(); g.moveTo(-10, 520); g.bezierCurveTo(120, 420, 160, 260, 320, 150); g.stroke();
  g.strokeStyle = rgba(C.light, 0.25); g.lineWidth = 1.5; g.setLineDash([6, 8]);
  g.beginPath(); g.moveTo(-10, 520); g.bezierCurveTo(120, 420, 160, 260, 320, 150); g.stroke(); g.setLineDash([]);

  // search pill
  rr(g, 16, 50, W - 32, 40, 20, 'rgba(24,21,48,0.92)', 'rgba(169,155,255,0.25)');
  g.beginPath(); g.arc(38, 70, 6, 0, Math.PI * 2); g.strokeStyle = C.light; g.lineWidth = 2; g.stroke();
  text(g, 'Electrician near you', 54, 74.5, f(700, 12.5), '#EEEAFF');
  demoChip(g, W - 26, 62, '#CFC6FF');

  // user location
  const ux = 150, uy = 450;
  const k = (t * 0.8) % 1;
  g.beginPath(); g.arc(ux, uy, 8 + k * 22, 0, Math.PI * 2); g.fillStyle = rgba('#5EA8FF', 0.25 * (1 - k)); g.fill();
  g.beginPath(); g.arc(ux, uy, 7, 0, Math.PI * 2); g.fillStyle = '#5EA8FF'; g.fill(); g.strokeStyle = '#FFF'; g.lineWidth = 2.5; g.stroke();

  // route to the selected pin
  const sel = 2, sp = PINS[sel];
  const route = eo(seg(t, 2.8, 3.6));
  if (route > 0) {
    g.strokeStyle = C.light; g.lineWidth = 3.5; g.setLineDash([2, 7]); g.lineCap = 'round';
    g.beginPath(); g.moveTo(ux, uy); g.lineTo(ux + (sp[0] - ux) * route, uy + (sp[1] + 6 - uy) * route); g.stroke(); g.setLineDash([]);
  }
  // pins drop with bounce
  PINS.forEach(([x, y], i) => {
    const d = seg(t, 0.4 + i * 0.22, 1.2 + i * 0.22);
    if (d <= 0) return;
    const yy = y - (1 - bounce(d)) * 90;
    const selected = i === sel && t > 2.6;
    const s = selected ? 1 + 0.35 * backOut(seg(t, 2.6, 3.0)) : 1;
    if (selected) {
      const kk = (t * 1.2) % 1;
      g.beginPath(); g.ellipse(x, y + 4, 12 + kk * 18, 5 + kk * 7, 0, 0, Math.PI * 2); g.strokeStyle = rgba(C.light, 0.6 * (1 - kk)); g.lineWidth = 2; g.stroke();
    }
    g.beginPath(); g.ellipse(x, y + 4, 6 * s, 2.5 * s, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fill();
    g.save(); g.translate(x, yy); g.scale(s, s);
    g.beginPath(); g.moveTo(0, 2); g.bezierCurveTo(-12, -12, -12, -30, 0, -30); g.bezierCurveTo(12, -30, 12, -12, 0, 2);
    g.fillStyle = selected ? '#8C7DFF' : C.brand; g.fill();
    g.beginPath(); g.arc(0, -19, 4.5, 0, Math.PI * 2); g.fillStyle = '#FFFFFF'; g.fill();
    g.restore();
  });

  // bottom sheet with the worker card + live job stepper
  const sh = expo(seg(t, 3.5, 4.3));
  if (sh > 0) {
    const y0 = H - 262 * sh;
    rr(g, 0, y0, W, 290, 22, '#1B1838', 'rgba(169,155,255,0.22)');
    rr(g, W / 2 - 18, y0 + 9, 36, 4, 2, 'rgba(255,255,255,0.25)');
    g.beginPath(); g.arc(44, y0 + 50, 22, 0, Math.PI * 2);
    const av = g.createLinearGradient(22, y0 + 28, 66, y0 + 72); av.addColorStop(0, '#8C7DFF'); av.addColorStop(1, '#4A3BD0');
    g.fillStyle = av; g.fill();
    text(g, 'AR', 44, y0 + 55, f(800, 13), '#FFFFFF', 'center');
    text(g, 'Ali R.', 76, y0 + 44, f(800, 14), '#FFFFFF');
    text(g, 'Electrician · demo profile', 76, y0 + 62, f(500, 10.5), 'rgba(220,214,255,0.65)');
    for (let i = 0; i < 5; i++) star(g, 80 + i * 13, y0 + 78, 5, i < 4 ? '#FFC94D' : 'rgba(255,201,77,0.45)');
    text(g, '4.8 · 1.2 km away', 148, y0 + 82, f(600, 10.5), 'rgba(238,234,255,0.8)');

    const steps = ['Requested', 'Accepted', 'On the way', 'Completed'];
    const sx = [36, 112, 188, 264], sy = y0 + 128;
    const done = (i: number) => t > 4.6 + i * 1.5;
    g.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 3; g.beginPath(); g.moveTo(sx[i] + 11, sy); g.lineTo(sx[i + 1] - 11, sy); g.stroke();
      const p = eo(seg(t, 4.6 + i * 1.5, 4.6 + (i + 1) * 1.5));
      if (p > 0) { g.strokeStyle = C.light; g.beginPath(); g.moveTo(sx[i] + 11, sy); g.lineTo(sx[i] + 11 + (sx[i + 1] - sx[i] - 22) * p, sy); g.stroke(); }
    }
    steps.forEach((s, i) => {
      const d = done(i), active = !d && (i === 0 || done(i - 1));
      const last = i === 3 && d;
      const pop = last ? backOut(seg(t, 4.6 + i * 1.5, 4.6 + i * 1.5 + 0.35)) : 1;
      g.beginPath(); g.arc(sx[i], sy, 10 * (last ? 1 + 0.25 * pop : 1), 0, Math.PI * 2);
      g.fillStyle = last ? '#2BD48A' : d ? C.brand : active ? 'rgba(109,92,240,0.25)' : 'rgba(255,255,255,0.08)'; g.fill();
      if (active) { g.strokeStyle = C.light; g.lineWidth = 2; g.stroke(); }
      if (d) check(g, sx[i], sy, last ? 10 : 8, '#FFFFFF', 2.2);
      text(g, s, sx[i], sy + 27, f(d || active ? 700 : 500, 9.5), d || active ? '#EEEAFF' : 'rgba(238,234,255,0.45)', 'center');
    });
    // confetti burst on completion
    const cf = seg(t, 9.1, 10.6);
    if (cf > 0 && cf < 1) {
      const cols = ['#FFC94D', '#2BD48A', '#A99BFF', '#FF7AA2', '#5EA8FF'];
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * Math.PI * 2 + i * 0.37;
        const v = 40 + (i % 5) * 14;
        const x = sx[3] + Math.cos(a) * v * eo(cf);
        const y = sy + Math.sin(a) * v * eo(cf) + cf * cf * 40;
        g.save(); g.translate(x, y); g.rotate(a + cf * 6); g.globalAlpha = 1 - cf;
        g.fillStyle = cols[i % 5]; g.fillRect(-3, -1.5, 6, 3); g.restore();
      }
      g.globalAlpha = 1;
    }
    const complete = t > 9.1;
    rr(g, 18, y0 + 188, W - 36, 44, 14, complete ? '#1F9D67' : C.brand);
    text(g, complete ? 'Job completed  ✓' : 'Track job', W / 2, y0 + 215, f(800, 13), '#FFFFFF', 'center');
  }
  phoneChrome(g, W, H);
}
function star(g: G, cx: number, cy: number, r: number, color: string) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r * 0.45 : r;
    g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  g.closePath(); g.fillStyle = color; g.fill();
}

/* =================================================================== DASHBOARD */
const DASH = { bg: '#09130F', card: '#0F1D18', line: 'rgba(166,235,205,0.08)', accent: '#19C784', mint: '#A6EBCD', cycle: 10 };
const SERIES = [22, 30, 27, 38, 34, 46, 43, 55, 52, 63, 60, 72];
const BARS = [0.45, 0.62, 0.5, 0.78, 0.66, 0.9, 0.72];
function drawDashboard(g: G, W: number, H: number, t: number) {
  const C = DASH;
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  browserChrome(g, W, 'app.analytics.demo', t, true);
  // sidebar
  g.fillStyle = '#0B1813'; g.fillRect(0, 34, 118, H - 34);
  rr(g, 14, 50, 22, 22, 6, C.accent);
  text(g, 'Analytics', 44, 66, f(800, 12), '#FFFFFF');
  ['Overview', 'Revenue', 'Customers', 'Products', 'Reports', 'Settings'].forEach((s, i) => {
    const y = 96 + i * 30;
    if (i === 0) rr(g, 8, y - 14, 102, 26, 7, 'rgba(25,199,132,0.14)');
    rr(g, 18, y - 6, 10, 10, 3, i === 0 ? C.accent : 'rgba(166,235,205,0.28)');
    text(g, s, 36, y + 3, f(i === 0 ? 700 : 500, 11), i === 0 ? '#E8FFF5' : 'rgba(200,225,214,0.6)');
  });
  // header
  text(g, 'Overview', 134, 62, f(800, 16), '#FFFFFF');
  demoChip(g, 220, 50, '#A6EBCD', 'left');
  rr(g, W - 132, 47, 116, 20, 6, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.08)');
  text(g, 'Last 30 days ▾', W - 74, 61, f(600, 10), 'rgba(220,240,232,0.75)', 'center');
  // KPIs
  const kp = eo(seg(t, 0.3, 2.0));
  const kpis: [string, string, string][] = [
    ['Revenue', `$${(48.2 * kp).toFixed(1)}k`, '+12.4%'],
    ['Active users', Math.round(3184 * kp).toLocaleString('en-US'), '+8.1%'],
    ['Conversion', `${(4.6 * kp).toFixed(1)}%`, '+0.6 pt'],
  ];
  const kw = (W - 134 - 14 - 20) / 3;
  kpis.forEach(([l, v, d], i) => {
    const x = 134 + i * (kw + 10);
    rr(g, x, 78, kw, 64, 10, C.card, C.line);
    text(g, l, x + 12, 97, f(600, 10), 'rgba(200,225,214,0.6)');
    text(g, v, x + 12, 124, f(800, 20), '#FFFFFF');
    text(g, d, x + kw - 12, 124, f(700, 10), C.accent, 'right');
  });
  // line chart
  const cx0 = 134, cy0 = 152, cw = 320, ch = 148;
  rr(g, cx0, cy0, cw, ch, 10, C.card, C.line);
  text(g, 'Revenue trend', cx0 + 12, cy0 + 20, f(700, 11), '#E8FFF5');
  const px = (i: number) => cx0 + 16 + (i / (SERIES.length - 1)) * (cw - 32);
  const py = (v: number) => cy0 + ch - 16 - (v / 80) * (ch - 48);
  for (let i = 0; i < 4; i++) { g.fillStyle = C.line; g.fillRect(cx0 + 12, cy0 + 40 + i * 28, cw - 24, 1); }
  const lp = seg(t, 1.0, 3.6) * (SERIES.length - 1);
  if (lp > 0) {
    const n = Math.floor(lp), fr = lp - n;
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) pts.push([px(i), py(SERIES[i])]);
    if (n < SERIES.length - 1) pts.push([px(n) + (px(n + 1) - px(n)) * fr, py(SERIES[n] + (SERIES[n + 1] - SERIES[n]) * fr)]);
    const area = g.createLinearGradient(0, cy0 + 40, 0, cy0 + ch);
    area.addColorStop(0, 'rgba(25,199,132,0.35)'); area.addColorStop(1, 'rgba(25,199,132,0)');
    g.beginPath(); g.moveTo(pts[0][0], cy0 + ch - 12); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(pts[pts.length - 1][0], cy0 + ch - 12); g.closePath();
    g.fillStyle = area; g.fill();
    g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.strokeStyle = C.accent; g.lineWidth = 2.4; g.lineJoin = 'round'; g.stroke();
    const [hx, hy] = pts[pts.length - 1];
    g.beginPath(); g.arc(hx, hy, 7, 0, Math.PI * 2); g.fillStyle = 'rgba(25,199,132,0.25)'; g.fill();
    g.beginPath(); g.arc(hx, hy, 3.5, 0, Math.PI * 2); g.fillStyle = '#E8FFF5'; g.fill();
  }
  // bars
  const bx0 = cx0 + cw + 10, bw = W - 14 - bx0;
  rr(g, bx0, cy0, bw, ch, 10, C.card, C.line);
  text(g, 'Weekly orders', bx0 + 12, cy0 + 20, f(700, 11), '#E8FFF5');
  const slot = (bw - 24) / BARS.length;
  BARS.forEach((v, i) => {
    const p = backOut(seg(t, 1.6 + i * 0.12, 2.5 + i * 0.12));
    const h = (ch - 52) * v * p;
    rr(g, bx0 + 12 + i * slot + slot * 0.2, cy0 + ch - 14 - h, slot * 0.6, Math.max(0, h), 3, i === 5 ? C.accent : 'rgba(166,235,205,0.35)');
  });
  // recent table
  const ty = 310;
  rr(g, 134, ty, W - 148, H - ty - 10, 10, C.card, C.line);
  ['#1042 · Starter plan', '#1041 · Team plan', '#1040 · Starter plan'].forEach((r, i) => {
    const y = ty + 24 + i * 22, a = seg(t, 2.6 + i * 0.25, 3.2 + i * 0.25);
    g.globalAlpha = a;
    text(g, r, 148, y, f(600, 10.5), 'rgba(226,240,234,0.85)');
    rr(g, W - 96, y - 11, 64, 15, 7.5, 'rgba(25,199,132,0.15)');
    text(g, 'Paid', W - 64, y, f(700, 9.5), C.mint, 'center');
    g.globalAlpha = 1;
  });
}

/* ======================================================================= AGENT */
const AG = { bg: '#07110E', card: '#0E1B17', line: 'rgba(166,235,205,0.1)', accent: '#19C784', mint: '#A6EBCD', scene: 12.5 };
function orb(g: G, x: number, y: number, r: number, t: number, busy: boolean) {
  const sp = busy ? 3.2 : 1.1;
  const k = (Math.sin(t * sp * 2) + 1) / 2;
  g.beginPath(); g.arc(x, y, r * (1.5 + k * 0.4), 0, Math.PI * 2); g.fillStyle = `rgba(25,199,132,${0.1 + k * 0.12})`; g.fill();
  const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  gr.addColorStop(0, '#E8FFF5'); gr.addColorStop(0.45, '#2FE0A0'); gr.addColorStop(1, '#087F5B');
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
  g.strokeStyle = 'rgba(232,255,245,0.85)'; g.lineWidth = 1.6;
  g.beginPath(); g.arc(x, y, r * 0.62, t * sp * 3, t * sp * 3 + 1.6); g.stroke();
}
function bubble(g: G, x: number, y: number, maxW: number, s: string, user: boolean) {
  const lines = wrap(g, s, maxW - 24, f(500, 11.5));
  const h = lines.length * 16 + 16;
  rr(g, x, y, maxW, h, 11, user ? 'rgba(25,199,132,0.14)' : AG.card, user ? 'rgba(25,199,132,0.3)' : AG.line);
  lines.forEach((l, i) => text(g, l, x + 12, y + 22 + i * 16, f(500, 11.5), '#E6F6EF'));
  return h;
}
function toolCard(g: G, x: number, y: number, w: number, name: string, done: boolean, ms: string, t: number, alpha: number) {
  g.globalAlpha = alpha;
  rr(g, x, y, w, 44, 10, '#0F201A', done ? 'rgba(25,199,132,0.35)' : 'rgba(166,235,205,0.14)');
  rr(g, x + 10, y + 11, 22, 22, 6, done ? 'rgba(25,199,132,0.2)' : 'rgba(255,255,255,0.06)');
  if (done) check(g, x + 21, y + 22, 9, AG.accent, 2); else spinner(g, x + 21, y + 22, 6, t, AG.mint);
  text(g, name, x + 42, y + 20, f(600, 10.5, true), '#E6F6EF');
  text(g, done ? `done · ${ms}` : 'running…', x + 42, y + 35, f(500, 9.5), done ? AG.mint : 'rgba(200,225,214,0.55)');
  g.globalAlpha = 1;
}
function drawAgent(g: G, W: number, H: number, t: number) {
  const C = AG;
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  browserChrome(g, W, 'agents.workspace.demo', t, false);
  const scene = Math.floor(t / C.scene) % 3;
  const st = t % C.scene;
  const busy = scene === 0 ? st > 1.4 && st < 8.8 : scene === 1 ? st > 0.5 && st < 8.2 : st > 0.3 && st < 9.6;
  orb(g, 28, 54, 11, t, busy);
  text(g, 'Korvenza AI Agent', 48, 58.5, f(800, 13), '#FFFFFF');
  demoChip(g, 172, 46, '#A6EBCD', 'left');
  const tabs = ['Onboarding', 'Documents', 'Voice → Insight'];
  let tx = W - 14;
  for (let i = tabs.length - 1; i >= 0; i--) {
    g.font = f(700, 10); const w = g.measureText(tabs[i]).width + 20; tx -= w;
    rr(g, tx, 44, w, 20, 10, i === scene ? 'rgba(25,199,132,0.18)' : 'rgba(255,255,255,0.04)', i === scene ? 'rgba(25,199,132,0.45)' : 'rgba(255,255,255,0.07)');
    text(g, tabs[i], tx + w / 2, 57.5, f(700, 10), i === scene ? '#E8FFF5' : 'rgba(200,225,214,0.55)', 'center');
    tx -= 6;
  }
  g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(0, 74, W, 1);
  if (scene === 0) agentOnboarding(g, W, H, st);
  else if (scene === 1) agentDocs(g, W, H, st);
  else agentVoice(g, W, H, st);
  // scene cross-fade
  const fade = Math.max(seg(st, C.scene - 0.45, C.scene), 1 - seg(st, 0, 0.3));
  if (fade > 0) { g.fillStyle = rgba(C.bg, fade); g.fillRect(0, 75, W, H - 75); }
}
function agentOnboarding(g: G, W: number, H: number, t: number) {
  const ask = 'Onboard Northwind Retail (demo client): create their CRM account, send the welcome pack and book a kickoff call.';
  const h = bubble(g, 16, 88, 356, words(ask, seg(t, 0.2, 1.4)), true);
  const plan = ['Create CRM account', 'Provision workspace', 'Send welcome email', 'Draft statement of work', 'Book kickoff call'];
  const tools = ['crm.create_account', 'workspace.provision', 'email.send_template', 'docs.generate_sow', 'calendar.book_meeting'];
  const ms = ['0.9s', '1.4s', '0.6s', '2.1s', '1.2s'];
  const y0 = 88 + h + 12;
  if (t > 1.5) {
    text(g, t < 2.2 ? 'Planning' + '.'.repeat(1 + (Math.floor(t * 4) % 3)) : 'Plan', 16, y0 + 12, f(800, 11), C_MINT);
    plan.forEach((p, i) => {
      const a = seg(t, 2.0 + i * 0.12, 2.3 + i * 0.12);
      if (a <= 0) return;
      const y = y0 + 32 + i * 25;
      const start = 2.6 + i * 1.2, done = t > start + 1.0, running = t > start && !done;
      g.globalAlpha = a;
      rr(g, 16, y - 12, 16, 16, 5, done ? 'rgba(25,199,132,0.22)' : 'rgba(255,255,255,0.05)', done ? 'rgba(25,199,132,0.5)' : 'rgba(255,255,255,0.12)');
      if (done) check(g, 24, y - 4, 7, AG.accent, 1.8); else if (running) spinner(g, 24, y - 4, 4.5, t, AG.mint);
      text(g, p, 42, y, f(done ? 600 : 500, 11.5), done ? '#E6F6EF' : running ? '#FFFFFF' : 'rgba(200,225,214,0.6)');
      g.globalAlpha = 1;
    });
  }
  // stacked tool cards (newest on top, older ones step down and dim)
  const started = tools.map((_, i) => 2.6 + i * 1.2).filter((s) => t > s).length;
  for (let j = 0; j < started; j++) {
    const i = started - 1 - j; // newest first
    const s = 2.6 + i * 1.2;
    const enter = expo(seg(t, s, s + 0.45));
    const depth = Math.min(j, 3);
    const x = 388 + (1 - enter) * 60 + depth * 6;
    const y = 88 + depth * 54;
    if (j > 3) continue;
    toolCard(g, x, y, W - 16 - 388 - depth * 12, tools[i], t > s + 1.0, ms[i], t, enter * (1 - depth * 0.22));
  }
  const res = expo(seg(t, 8.8, 9.4));
  if (res > 0) {
    g.globalAlpha = res;
    rr(g, 388, H - 62, W - 404, 40, 20, 'rgba(25,199,132,0.16)', 'rgba(25,199,132,0.55)');
    check(g, 410, H - 42, 10, AG.accent, 2.2);
    text(g, '5 tasks completed · 6.2s', 426, H - 38, f(800, 12), '#E8FFF5');
    g.globalAlpha = 1;
  }
}
const C_MINT = '#A6EBCD';
function agentDocs(g: G, W: number, H: number, t: number) {
  // document page
  const dx = 18, dy = 88, dw = 184, dh = 298;
  rr(g, dx, dy, dw, dh, 8, '#EEF3F0');
  text(g, 'INVOICE', dx + 14, dy + 28, f(800, 14), '#11201A');
  text(g, 'Demo Supplies Co.', dx + 14, dy + 46, f(600, 9.5), '#41524B');
  text(g, '14 Mar 2026', dx + dw - 14, dy + 28, f(600, 9.5), '#41524B', 'right');
  for (let i = 0; i < 3; i++) { rr(g, dx + 14, dy + 64 + i * 9, 90 - i * 18, 4, 2, '#C9D3CE'); }
  const rows: [string, string][] = [['Cloud hosting', '480.00'], ['Support plan', '280.00'], ['Support plan', '280.00'], ['Setup fee', '200.00']];
  rows.forEach(([a, b], i) => {
    const y = dy + 120 + i * 24;
    text(g, a, dx + 14, y, f(500, 10), '#22332C');
    text(g, b, dx + dw - 14, y, f(600, 10), '#22332C', 'right');
    g.fillStyle = '#DCE3DF'; g.fillRect(dx + 14, y + 8, dw - 28, 1);
  });
  text(g, 'Total', dx + 14, dy + 236, f(800, 11), '#11201A');
  text(g, '$1,240.00', dx + dw - 14, dy + 236, f(800, 11), '#11201A', 'right');
  // scan line
  const sc = seg(t, 0.5, 2.1);
  if (sc > 0 && sc < 1) {
    const y = dy + sc * dh;
    const gr = g.createLinearGradient(0, y - 30, 0, y);
    gr.addColorStop(0, 'rgba(25,199,132,0)'); gr.addColorStop(1, 'rgba(25,199,132,0.35)');
    g.fillStyle = gr; g.fillRect(dx, y - 30, dw, 30);
    g.fillStyle = '#19C784'; g.fillRect(dx, y, dw, 2);
  }
  // bounding boxes
  const boxes: [number, number, number, number, string][] = [
    [dx + 8, dy + 34, 100, 18, 'vendor'], [dx + dw - 82, dy + 15, 74, 18, 'date'],
    [dx + 8, dy + 106, dw - 16, 98, 'line_items'], [dx + 8, dy + 222, dw - 16, 22, 'total'],
  ];
  boxes.forEach(([x, y, w, h, l], i) => {
    const a = eo(seg(t, 2.2 + i * 0.45, 2.6 + i * 0.45));
    if (a <= 0) return;
    g.globalAlpha = a;
    rr(g, x, y, w, h, 4, 'rgba(25,199,132,0.08)', '#19C784', 1.5);
    g.font = f(700, 8.5); const lw = g.measureText(l).width + 8;
    // tag: outside right for the small vendor box, top-right corner otherwise (never over the text)
    const lx = i === 0 ? x + w + 3 : x + w - lw, ly = i === 0 ? y + 4 : y - 11;
    rr(g, lx, ly, lw, 11, 3, '#19C784');
    text(g, l, lx + 4, ly + 8, f(700, 8.5, true), '#04130D');
    g.globalAlpha = 1;
  });
  // flagged duplicate row
  const fl = seg(t, 8.0, 8.4);
  if (fl > 0) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 6);
    rr(g, dx + 6, dy + 133, dw - 12, 44, 5, `rgba(255,170,60,${0.12 + 0.1 * pulse})`, '#FFAA3C', 1.8);
  }
  // JSON stream
  const jx = 218, jy = 88, jw = W - jx - 16;
  rr(g, jx, jy, jw, 210, 10, C_CARD, AG.line);
  text(g, 'extracted.json', jx + 12, jy + 20, f(700, 10, true), 'rgba(200,225,214,0.6)');
  const json = ['{', '  "vendor": "Demo Supplies Co.",', '  "date": "2026-03-14",', '  "line_items": 4,', '  "total": 1240.00,', '  "currency": "USD",', '  "confidence": 0.97', '}'];
  const jp = seg(t, 3.0, 7.4) * json.length;
  json.forEach((l, i) => {
    if (jp <= i) return;
    const s = jp >= i + 1 ? l : chars(l, jp - i);
    const m = s.match(/^(\s*)("[^"]+")(:\s*)?(.*)$/);
    const y = jy + 44 + i * 19;
    if (m) {
      g.font = f(500, 11, true);
      let x = jx + 14 + g.measureText(m[1]).width;
      text(g, m[2], x, y, f(500, 11, true), '#7CF2C2'); x += g.measureText(m[2]).width;
      if (m[3]) { text(g, m[3], x, y, f(500, 11, true), '#C9D9D2'); x += g.measureText(m[3]).width; }
      text(g, m[4], x, y, f(500, 11, true), '#FFD38A');
    } else text(g, s, jx + 14, y, f(500, 11, true), '#C9D9D2');
  });
  if (fl > 0) {
    g.globalAlpha = eo(fl);
    rr(g, jx, jy + 222, jw, 40, 20, 'rgba(255,170,60,0.14)', 'rgba(255,170,60,0.6)');
    g.beginPath(); g.moveTo(jx + 22, jy + 233); g.lineTo(jx + 31, jy + 250); g.lineTo(jx + 13, jy + 250); g.closePath(); g.fillStyle = '#FFAA3C'; g.fill();
    text(g, 'Flagged: duplicate charge', jx + 40, jy + 246.5, f(800, 12), '#FFE2BC');
    text(g, 'Support plan ×2', jx + jw - 14, jy + 246.5, f(600, 10), 'rgba(255,226,188,0.7)', 'right');
    g.globalAlpha = 1;
  }
}
const C_CARD = '#0E1B17';
function agentVoice(g: G, W: number, H: number, t: number) {
  // voice input + transcript
  rr(g, 16, 88, 356, 74, 12, C_CARD, AG.line);
  const live = t < 2.8;
  g.beginPath(); g.arc(42, 116, 13, 0, Math.PI * 2); g.fillStyle = live ? '#E2384D' : 'rgba(25,199,132,0.25)'; g.fill();
  rr(g, 39, 107, 6, 11, 3, '#FFFFFF');
  for (let i = 0; i < 34; i++) {
    const a = live ? 0.2 + 0.8 * Math.abs(Math.sin(t * 8 + i * 0.6) * Math.sin(t * 2.7 + i * 0.25)) : 0.12;
    const h = 4 + a * 22;
    rr(g, 66 + i * 8.6, 116 - h / 2, 4, h, 2, rgba('#A6EBCD', live ? 0.85 : 0.35));
  }
  text(g, '“' + words('Which region grew fastest last quarter?', seg(t, 0.4, 2.6)) + '”', 30, 150, f(600, 12), '#E6F6EF');
  // SQL
  const sqlA = seg(t, 2.8, 3.1);
  if (sqlA > 0) {
    g.globalAlpha = sqlA;
    rr(g, 16, 172, 356, 92, 12, '#0A1713', AG.line);
    text(g, 'SQL', 28, 191, f(800, 9.5, true), 'rgba(200,225,214,0.55)');
    const sql = ['SELECT region, SUM(revenue) AS rev', "FROM orders WHERE quarter = 'Q3'", 'GROUP BY region ORDER BY rev DESC;'];
    const sp = seg(t, 3.0, 5.4) * sql.length;
    sql.forEach((l, i) => {
      if (sp <= i) return;
      const s = sp >= i + 1 ? l : chars(l, sp - i);
      text(g, s, 28, 213 + i * 18, f(500, 11, true), i === 0 ? '#7CF2C2' : '#C9D9D2');
    });
    g.globalAlpha = 1;
  }
  // chart
  const chA = seg(t, 5.2, 5.5);
  if (chA > 0) {
    g.globalAlpha = chA;
    const x0 = 386, y0 = 88, w = W - x0 - 16, h = 176;
    rr(g, x0, y0, w, h, 12, C_CARD, AG.line);
    text(g, 'Revenue growth by region · QoQ', x0 + 12, y0 + 20, f(700, 10), '#E6F6EF');
    const data: [string, number][] = [['North', 18], ['East', 11], ['West', 7], ['South', 4]];
    data.forEach(([n, v], i) => {
      const p = backOut(seg(t, 5.4 + i * 0.15, 6.3 + i * 0.15));
      const bh = (h - 70) * (v / 20) * p;
      const bx = x0 + 18 + i * ((w - 30) / 4);
      rr(g, bx, y0 + h - 30 - bh, (w - 30) / 4 - 14, Math.max(0, bh), 4, i === 0 ? '#19C784' : 'rgba(166,235,205,0.3)');
      text(g, n, bx + ((w - 30) / 4 - 14) / 2, y0 + h - 14, f(600, 9.5), 'rgba(200,225,214,0.7)', 'center');
      if (p > 0.6) text(g, `+${v}%`, bx + ((w - 30) / 4 - 14) / 2, y0 + h - 36 - bh, f(800, 9.5), i === 0 ? '#E8FFF5' : 'rgba(200,225,214,0.7)', 'center');
    });
    g.globalAlpha = 1;
  }
  // insight (streams word by word)
  const inA = seg(t, 7.0, 7.3);
  if (inA > 0) {
    g.globalAlpha = inA;
    rr(g, 16, 276, W - 32, 74, 12, 'rgba(25,199,132,0.1)', 'rgba(25,199,132,0.35)');
    orb(g, 36, 300, 8, t, t < 9.6);
    text(g, 'Insight', 52, 304, f(800, 11), C_MINT);
    text(g, words('North grew fastest: +18% quarter on quarter (demo data).', seg(t, 7.3, 8.6)), 30, 326, f(600, 12), '#FFFFFF');
    text(g, words('Repeat orders from existing customers drove most of the lift.', seg(t, 8.6, 9.8)), 30, 343, f(500, 11.5), 'rgba(230,246,239,0.8)');
    g.globalAlpha = 1;
  }
}

/* ===================================================================== class */
const SIZES: Record<ScreenKind, [number, number]> = { ielts: [300, 648], skilllink: [300, 648], dashboard: [640, 400], agent: [640, 400] };
const CYCLE: Record<ScreenKind, number> = { ielts: IELTS.cycle, skilllink: SL.cycle, dashboard: DASH.cycle, agent: AG.scene * 3 };
/** The frame shown when a screen is frozen (low tier / reduced motion): the "result" moment. */
const STILL: Record<ScreenKind, number> = { ielts: 9.2, skilllink: 9.6, dashboard: 6, agent: 10.2 };
const DRAW: Record<ScreenKind, (g: G, W: number, H: number, t: number) => void> = { ielts: drawIelts, skilllink: drawSkilllink, dashboard: drawDashboard, agent: drawAgent };

export class DeviceScreen {
  readonly texture: CanvasTexture;
  readonly W: number;
  readonly H: number;
  /** Own clock (s) — advanced by the scene with a per-device speed (hover speeds it up). */
  clock = 0;
  private main: HTMLCanvasElement;
  private g: G;
  private out?: CanvasRenderingContext2D;

  constructor(readonly kind: ScreenKind, private scale: number, blur = 1, seedOffset = 0) {
    [this.W, this.H] = SIZES[kind];
    this.main = document.createElement('canvas');
    this.main.width = Math.round(this.W * scale);
    this.main.height = Math.round(this.H * scale);
    this.g = this.main.getContext('2d')!;
    let target = this.main;
    if (blur < 1) {
      // Far device: draw at full size, then sample into a small canvas → soft, defocused texture.
      const o = document.createElement('canvas');
      o.width = Math.max(8, Math.round(this.W * scale * blur));
      o.height = Math.max(8, Math.round(this.H * scale * blur));
      this.out = o.getContext('2d')!;
      this.out.imageSmoothingQuality = 'high';
      target = o;
    }
    this.texture = new CanvasTexture(target);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 4;
    this.texture.generateMipmaps = false;
    this.texture.minFilter = LinearFilter;
    this.clock = seedOffset;
  }

  /** Draw the frame for the current clock (looping) and flag the texture for upload. */
  draw(frozen = false) {
    const t = frozen ? STILL[this.kind] : ((this.clock % CYCLE[this.kind]) + CYCLE[this.kind]) % CYCLE[this.kind];
    const g = this.g;
    g.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    g.clearRect(0, 0, this.W, this.H);
    DRAW[this.kind](g, this.W, this.H, t);
    // gentle loop cross-fade for the single-scene screens
    if (!frozen && this.kind !== 'agent') {
      const c = CYCLE[this.kind];
      const fade = Math.max(seg(t, c - 0.4, c), 1 - seg(t, 0, 0.25));
      if (fade > 0) { g.fillStyle = `rgba(0,0,0,${fade * 0.85})`; g.fillRect(0, 0, this.W, this.H); }
    }
    if (this.out) {
      const o = this.out.canvas;
      this.out.clearRect(0, 0, o.width, o.height);
      this.out.drawImage(this.main, 0, 0, o.width, o.height);
    }
    this.texture.needsUpdate = true;
  }

  dispose() { this.texture.dispose(); }
}
