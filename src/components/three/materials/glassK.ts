/**
 * The 3D glass "K" — extruded from the brand vector master (brand-source/k-mark.svg,
 * the same polygons the favicon and inline logo use), so the hero logo is the logo.
 *
 * Geometry: four extruded pieces (stem+arm, bar, two legs) with a smooth bevel.
 * Triangles are subdivided and grouped into ~100 Voronoi "shards" (prisms through
 * the full depth). Every vertex carries its shard's centre, a fly direction and a
 * random value, so one vertex shader (patched into three's physical material)
 * animates both the intro (shards fly in from depth and lock) and the scroll
 * shatter (shards drift apart and fall). At uIntro = 1, uShatter = 0 the mesh is
 * exactly the extruded logo.
 *
 * Colour: per-vertex tint — emerald glass, with the logo's charcoal parts (upper
 * stem face, bar) as smoky glass.
 */
import {
  BufferAttribute, BufferGeometry, Color, ExtrudeGeometry, Shape, Vector2,
  type Material, type MeshPhysicalMaterial,
} from 'three';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { HERO } from '../config';

type P = [number, number];
const parse = (d: string): P[] => d.replace(/[MZ]/g, '').trim().split('L').map((s) => s.trim().split(/\s+/).map(Number) as P);

/** Polygons in the SVG master's 2048 space (viewBox 480 350 1200 1400). */
const PIECES = {
  main: parse('M1656 475L1373 491L836 985L833 909L870 868L852 374L504 611L514 1463L850 1727L850 1319L898 1274L903 1213L1626 548Z'),
  bar: parse('M1349 861L1534 868L1513 910L1187 1220L984 1188Z'),
  leg1: parse('M984 1188L1187 1220L1394 1504L1462 1573L1440 1592L1306 1590L971 1254Z'),
  leg2: parse('M1200 1222L1276 1228L1537 1482L1517 1502L1408 1503Z'),
};
/** Charcoal face of the stem (upper-left of the main piece). */
const STEM_FACE = parse('M504 611L852 374L870 868L833 909L836 985L600 1205L514 1270Z');
/** Circuit traces on the stem (glowing lines on the front face) and their end dots. */
const TRACES: P[][] = [
  [[700, 700], [700, 930], [650, 980], [650, 1120]],
  [[760, 690], [760, 860], [730, 890], [730, 1010]],
  [[810, 700], [810, 840]],
  [[700, 1460], [700, 1600]],
  [[760, 1400], [760, 1520], [800, 1560]],
];
const CENTER: P = [1080, 1050];
const SVG_H = 1400;

function pointInPoly(x: number, y: number, poly: P[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** Split triangles until every edge is shorter than `max` (non-indexed position + normal). */
function subdivide(pos: number[], nor: number[], max: number) {
  const outP: number[] = [], outN: number[] = [];
  const max2 = max * max;
  const stack: number[][] = [];
  for (let i = 0; i < pos.length; i += 9) stack.push([...pos.slice(i, i + 9), ...nor.slice(i, i + 9)]);
  while (stack.length) {
    const t = stack.pop()!;
    const d = (a: number, b: number) => (t[a * 3] - t[b * 3]) ** 2 + (t[a * 3 + 1] - t[b * 3 + 1]) ** 2 + (t[a * 3 + 2] - t[b * 3 + 2]) ** 2;
    const e = [d(0, 1), d(1, 2), d(2, 0)];
    const k = e.indexOf(Math.max(...e));
    if (e[k] <= max2 || stack.length > 60000) { for (let i = 0; i < 9; i++) { outP.push(t[i]); outN.push(t[9 + i]); } continue; }
    const a = k, b = (k + 1) % 3, c = (k + 2) % 3;
    const m: number[] = [], mn: number[] = [];
    for (let i = 0; i < 3; i++) { m.push((t[a * 3 + i] + t[b * 3 + i]) / 2); mn.push((t[9 + a * 3 + i] + t[9 + b * 3 + i]) / 2); }
    const l = Math.hypot(mn[0], mn[1], mn[2]) || 1; mn[0] /= l; mn[1] /= l; mn[2] /= l;
    const v = (j: number) => t.slice(j * 3, j * 3 + 3);
    const vn = (j: number) => t.slice(9 + j * 3, 9 + j * 3 + 3);
    // keep winding: (a, m, c) and (m, b, c)
    stack.push([...v(a), ...m, ...v(c), ...vn(a), ...mn, ...vn(c)]);
    stack.push([...m, ...v(b), ...v(c), ...mn, ...vn(b), ...vn(c)]);
  }
  return { outP, outN };
}

export type GlassK = ReturnType<typeof buildGlassK>;

/**
 * @param shards false = one solid piece per part (low tier: no shard animation).
 */
export function buildGlassK(shards: boolean) {
  const cfg = HERO.k;
  const s = cfg.height / SVG_H;
  const toW = ([x, y]: P) => new Vector2((x - CENTER[0]) * s, -(y - CENTER[1]) * s);
  const emerald = new Color(cfg.tint);
  const charcoal = new Color(cfg.charcoalTint);
  const r = rng(7);
  const half = cfg.depth / 2;
  const geos: BufferGeometry[] = [];
  let shardId = 0;

  // Areas for distributing the shard count.
  const area = (poly: P[]) => Math.abs(poly.reduce((a, [x, y], i) => { const [x2, y2] = poly[(i + 1) % poly.length]; return a + x * y2 - x2 * y; }, 0) / 2);
  const totalArea = Object.values(PIECES).reduce((a, p) => a + area(p), 0);

  for (const [name, poly] of Object.entries(PIECES)) {
    const shape = new Shape(poly.map(toW));
    let g: BufferGeometry = new ExtrudeGeometry(shape, {
      depth: cfg.depth, bevelEnabled: true, bevelThickness: cfg.bevel, bevelSize: cfg.bevel, bevelSegments: cfg.bevelSegments, curveSegments: 1,
    });
    g.translate(0, 0, -half);
    g = toCreasedNormals(g, cfg.creaseAngle);
    const P0 = Array.from(g.attributes.position.array as Float32Array);
    const N0 = Array.from(g.attributes.normal.array as Float32Array);
    g.dispose();
    const { outP, outN } = shards ? subdivide(P0, N0, cfg.maxEdge) : { outP: P0, outN: N0 };

    // Voronoi seeds inside the polygon (2D), count ∝ area.
    const n = shards ? Math.max(3, Math.round((cfg.shards * area(poly)) / totalArea)) : 1;
    const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
    const seeds: P[] = [];
    let guard = 0;
    while (seeds.length < n && guard++ < 20000) {
      const x = Math.min(...xs) + r() * (Math.max(...xs) - Math.min(...xs));
      const y = Math.min(...ys) + r() * (Math.max(...ys) - Math.min(...ys));
      if (pointInPoly(x, y, poly)) seeds.push([x, y]);
    }
    const seedW = seeds.map(toW);
    const seedDir = seedW.map(() => {
      // fly direction: mostly outward from the logo centre + toward/away from the camera
      const a = r() * Math.PI * 2;
      return [Math.cos(a), Math.sin(a), (r() - 0.35) * 2];
    });
    const seedRand = seedW.map(() => r());

    const tri = outP.length / 9;
    const aCenter = new Float32Array(outP.length);
    const aDir = new Float32Array(outP.length);
    const aRand = new Float32Array(outP.length / 3);
    const col = new Float32Array(outP.length);
    const c = new Color();
    for (let t = 0; t < tri; t++) {
      const cx = (outP[t * 9] + outP[t * 9 + 3] + outP[t * 9 + 6]) / 3;
      const cy = (outP[t * 9 + 1] + outP[t * 9 + 4] + outP[t * 9 + 7]) / 3;
      let best = 0, bd = Infinity;
      for (let k = 0; k < seedW.length; k++) {
        const dd = (seedW[k].x - cx) ** 2 + (seedW[k].y - cy) ** 2;
        if (dd < bd) { bd = dd; best = k; }
      }
      const sc = seedW[best], sd = seedDir[best];
      // offset seed centres along the shard direction a little so pieces read as 3D chunks
      for (let v = 0; v < 3; v++) {
        const o = t * 9 + v * 3;
        aCenter[o] = sc.x; aCenter[o + 1] = sc.y; aCenter[o + 2] = 0;
        aDir[o] = sd[0]; aDir[o + 1] = sd[1]; aDir[o + 2] = sd[2];
        aRand[t * 3 + v] = seedRand[best];
        // tint: charcoal on the bar and on the upper stem face (soft fade into the emerald)
        const sx = outP[o] / s + CENTER[0], sy = -outP[o + 1] / s + CENTER[1];
        let k = 0;
        if (name === 'bar') k = 1;
        else if (name === 'main' && pointInPoly(sx, sy, STEM_FACE)) k = 1 - Math.min(1, Math.max(0, (sy - 1020) / 220));
        c.copy(emerald).lerp(charcoal, k);
        col[o] = c.r; col[o + 1] = c.g; col[o + 2] = c.b;
      }
    }
    shardId += seeds.length;

    const out = new BufferGeometry();
    out.setAttribute('position', new BufferAttribute(new Float32Array(outP), 3));
    out.setAttribute('normal', new BufferAttribute(new Float32Array(outN), 3));
    out.setAttribute('color', new BufferAttribute(col, 3));
    out.setAttribute('aCenter', new BufferAttribute(aCenter, 3));
    out.setAttribute('aDir', new BufferAttribute(aDir, 3));
    out.setAttribute('aRand', new BufferAttribute(aRand, 1));
    out.computeBoundingSphere();
    geos.push(out);
  }

  // Glowing contour segments: outline of every piece on the front and back cap, plus
  // the circuit traces on the front face. Flat [x0,y0,z0,x1,y1,z1,...] list.
  const segs: number[] = [];
  const zf = half + cfg.bevel + 0.004;
  for (const poly of Object.values(PIECES)) {
    for (let i = 0; i < poly.length; i++) {
      const a = toW(poly[i]), b = toW(poly[(i + 1) % poly.length]);
      segs.push(a.x, a.y, zf, b.x, b.y, zf);
      segs.push(a.x, a.y, -zf, b.x, b.y, -zf);
    }
  }
  const traceSegs: number[] = [];
  const dots: number[] = [];
  for (const tr of TRACES) {
    for (let i = 0; i < tr.length - 1; i++) {
      const a = toW(tr[i]), b = toW(tr[i + 1]);
      traceSegs.push(a.x, a.y, zf, b.x, b.y, zf);
    }
    const e = toW(tr[tr.length - 1]);
    dots.push(e.x, e.y, zf);
  }

  return {
    geos,
    shardCount: shardId,
    segments: segs,
    traceSegments: traceSegs,
    traceDots: dots,
    /** Where the arm, bar and stem meet — the core sits behind this point. */
    heart: toW([1010, 1150]),
    dispose: () => geos.forEach((g) => g.dispose()),
  };
}

/** Uniforms shared by every K piece (and its transmission-pass twin). */
export function createShardUniforms() {
  return {
    uIntro: { value: 1 },
    uShatter: { value: 0 },
    uTime: { value: 0 },
  };
}

/**
 * Patch a physical material so its vertices follow the shard animation.
 *  intro:   each shard starts far behind / around the logo, rotated, and flies in with a
 *           staggered expo-out ease; it locks exactly into place at uIntro = 1.
 *  shatter: shards drift outward, tumble and fall (scroll-out).
 */
export function patchShardMaterial<T extends MeshPhysicalMaterial | Material>(mat: T, uniforms: ReturnType<typeof createShardUniforms>) {
  const cfg = HERO.k;
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', /* glsl */ `#include <common>
        uniform float uIntro, uShatter, uTime;
        attribute vec3 aCenter; attribute vec3 aDir; attribute float aRand;
        mat3 kzRot(vec3 ax, float a) {
          ax = normalize(ax); float s = sin(a), c = cos(a), oc = 1.0 - c;
          return mat3(oc*ax.x*ax.x + c, oc*ax.x*ax.y + ax.z*s, oc*ax.z*ax.x - ax.y*s,
                      oc*ax.x*ax.y - ax.z*s, oc*ax.y*ax.y + c, oc*ax.y*ax.z + ax.x*s,
                      oc*ax.z*ax.x + ax.y*s, oc*ax.y*ax.z - ax.x*s, oc*ax.z*ax.z + c);
        }
        float kzExpoOut(float x) { return x >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x); }`)
      .replace('#include <beginnormal_vertex>', /* glsl */ `
        // per-shard progress: staggered by the shard's random value
        float kzLp = clamp((uIntro * (1.0 + ${cfg.stagger.toFixed(3)}) - aRand * ${cfg.stagger.toFixed(3)}), 0.0, 1.0);
        float kzIn = 1.0 - kzExpoOut(kzLp);                     // 1 = far away, 0 = locked
        float kzSh = uShatter;
        vec3 kzAxis = normalize(vec3(aDir.y, -aDir.x, 0.6 + aRand));
        float kzAng = kzIn * (2.2 + aRand * 3.0) + kzSh * (1.5 + aRand * 4.0);
        mat3 kzR = kzRot(kzAxis, kzAng);
        vec3 kzOff = kzIn * (vec3(aDir.xy * ${cfg.flyRadius.toFixed(2)}, -${cfg.flyDepth.toFixed(2)} + aDir.z * 2.0))
                   + kzSh * vec3(aDir.x * 1.6, -kzSh * (2.0 + aRand * 3.5), aDir.z * 1.2);
        vec3 objectNormal = kzR * vec3( normal );
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3( tangent.xyz );
        #endif`)
      .replace('#include <begin_vertex>', /* glsl */ `
        vec3 transformed = kzR * (position - aCenter) + aCenter + kzOff;`);
  };
  mat.customProgramCacheKey = () => 'kz-shard-v1';
  return mat;
}
