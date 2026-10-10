/**
 * HERO (Phase 3) — the glass "K".
 * The brand K, extruded from the vector master, in emerald glass with real
 * refraction (tier 2), a thin glowing contour with a light sweep, glowing circuit
 * traces and a pulsing emissive core where the arm, bar and stem meet.
 *
 * Intro: ~100 shards fly in from depth with a staggered expo ease and lock into
 * the logo; at the lock a shockwave ring expands and the network + floor ripple.
 * Idle: float, ±12° sway, damped mouse tilt. Hover speeds the sway and brightens
 * the core; click fires the shockwave again. Scroll-out: the K shatters into
 * shards that drift down into the next section.
 *
 * Around it: thick light-trail rings with packets (refracted correctly through the
 * glass), a grid floor in dark-green fog (+ faint reflection on tier 2), three
 * particle depth layers (far stars, mid network with pulses running into the logo,
 * near bokeh) and four devices with live, code-drawn screens (two phones, two
 * browsers; the far one defocused). Hover a device → it comes forward and its loop
 * speeds up; click a phone → its case study; click the AI browser → Ask Korvenza AI.
 *
 * Tiers: 2 = everything; 1/lite = no transmission/reflector/bokeh/shards, simple
 * scale-in, static screen frames, fewer particles. Tier 0 never loads this file.
 * Post look without a composer (see MASTER_PLAN push-back 1): AgX tone mapping for
 * this view only, additive glow for bloom, dispersion for CA, pre-blurred far screen
 * for DOF, CSS grain + vignette in the DOM.
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import {
  AgXToneMapping, BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, CatmullRomCurve3, Color, FogExp2, Group,
  IcosahedronGeometry, LineBasicMaterial, MathUtils, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial,
  PerspectiveCamera as PCam, PlaneGeometry, PointLight, Points, PointsMaterial, Raycaster, Shape, ShapeGeometry,
  Sprite, SpriteMaterial, SRGBColorSpace, TubeGeometry, Vector2, Vector3, type ToneMapping, type WebGLRenderer,
} from 'three';
import { COLORS, HERO } from '../config';
import { mouse } from '../hooks/useMouse';
import { useThemeBlend } from '../hooks/useThemeBlend';
import { sectionProgress, scrollToElement } from '../../../lib/scrollStore';
import {
  additiveGlowTexture, buildLightformerEnv, buildSegmentGlow, createGlassBackdrop, createGridMaterial, createRingMaterial,
  createGlassTintMaterial, createShockwaveMaterial, gateToPass, lightAdditive, radialAlphaTexture,
} from '../materials/heroMaterials';
import { buildGlassK, createShardUniforms, patchShardMaterial } from '../materials/glassK';
import { DeviceScreen } from '../materials/heroScreens';
import type { Quality } from '../Experience';

/**
 * The hero camera lives outside the (remounting) scene, inside the persistent hero View:
 * three keeps one transmission render target per camera id and never frees it, so a new
 * camera per home-page visit would leak one each time.
 */
export function HeroCamera() {
  return <PerspectiveCamera makeDefault fov={HERO.fov} position={[0, 0, HERO.cameraZ]} near={0.1} far={60} />;
}

const tmpV = new Vector3();
const tmpDir = new Vector3();
const ndc = new Vector2();
const ray = new Raycaster();

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
/** Heartbeat: a quick double pulse then rest, 0..1. */
function heartbeat(t: number, bpm: number) {
  const ph = (t * bpm / 60) % 1;
  const beat = (c: number, w: number) => Math.exp(-Math.pow((ph - c) / w, 2));
  return Math.min(1, beat(0.08, 0.045) + 0.65 * beat(0.27, 0.05));
}
const smooth = (a: number, b: number, v: number) => { const x = MathUtils.clamp((v - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
const eo3 = (v: number) => 1 - Math.pow(1 - MathUtils.clamp(v, 0, 1), 3);

/** Rounded-rectangle plane with 0..1 UVs (device screens). */
function roundedRect(w: number, h: number, r: number) {
  const s = new Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  const g = new ShapeGeometry(s, 8);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
  return g;
}
/** Diagonal light streak on black (additive glass sheen over the screens). */
function sheenTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#000'; g.fillRect(0, 0, 256, 256);
  const gr = g.createLinearGradient(0, 0, 256, 256);
  gr.addColorStop(0, 'rgba(255,255,255,0.0)'); gr.addColorStop(0.32, 'rgba(255,255,255,0.0)');
  gr.addColorStop(0.42, 'rgba(255,255,255,0.55)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.12)');
  gr.addColorStop(0.62, 'rgba(255,255,255,0.3)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}

const SCREEN_GLOW: Record<string, string> = { ielts: '#3D6BFF', skilllink: '#7B6BFF', agent: '#22D892', dashboard: '#22D892' };

export function HeroScene({ track, quality }: { track: HTMLElement; quality: Quality }) {
  const { gl, scene } = useThree();
  const section = useMemo(() => track.closest('section'), [track]);
  const stage = useMemo(() => section?.querySelector<HTMLElement>('.kz-hero-stage') ?? null, [section]);
  const tier = quality.tier;
  const lite = quality.lite;
  const high = tier === 2 && !lite;
  const tierKey = high ? 2 : 1;

  const camera = useThree((st) => st.camera) as PCam;
  const root = useRef<Group>(null);
  const kFloat = useRef<Group>(null);
  const kGroup = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const glow = useRef<Sprite>(null);
  const shockMesh = useRef<Mesh>(null);
  const ringGroups = useRef<(Group | null)[]>([]);
  const packets = useRef<(Sprite | null)[][]>(HERO.rings.map(() => []));
  const devices = useRef<(Group | null)[]>([]);
  const netGroup = useRef<Group>(null);
  const cursorLight = useRef<PointLight>(null);
  const theme = useThemeBlend();
  const first = useRef(true);
  const born = useRef<number | null>(null);

  // Composition placement: the 3D "stage" sits exactly where the DOM poster sits.
  const layout = useRef({ x: 0, y: 0, s: 1 });
  const computeLayout = () => {
    if (!stage) return;
    const tr = track.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    if (!tr.height) return;
    const visH = 2 * HERO.cameraZ * Math.tan(MathUtils.degToRad(HERO.fov / 2));
    const wpp = visH / tr.height;
    // Side-by-side layout: the composition centre sits a little left of the stage centre, so the
    // front AI browser on the right has room to be large enough to read.
    const sideBySide = window.innerWidth >= 1024;
    const cx = sr.left + sr.width / 2 + (sideBySide ? sr.width * HERO.shiftX : 0);
    layout.current = {
      x: (cx - tr.left - tr.width / 2) * wpp,
      y: -(sr.top + sr.height / 2 - tr.top - tr.height / 2) * wpp,
      s: Math.min(
        (Math.min(sr.width, sr.height) * wpp) / HERO.compositionSize,
        // keep the outer devices on screen when the stage hugs the viewport edge (≈1280 px)
        ((tr.right - cx) * wpp) / HERO.halfWidth,
      ),
    };
  };
  useLayoutEffect(() => {
    computeLayout();
    const ro = new ResizeObserver(computeLayout);
    ro.observe(track);
    if (stage) ro.observe(stage);
    document.fonts?.ready.then(computeLayout).catch(() => {});
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, stage]);

  // Light-panel environment (what the glass reflects/refracts) + exponential dark-green fog.
  useEffect(() => {
    const env = buildLightformerEnv(gl);
    scene.environment = env.texture;
    scene.environmentIntensity = HERO.envIntensity;
    scene.fog = new FogExp2(COLORS.fogDark, HERO.fogDensity);
    return () => { scene.environment = null; scene.fog = null; env.dispose(); };
  }, [gl, scene]);

  // AgX tone mapping for this view only: a sentinel at the very start of the opaque list
  // switches the renderer, one at the very end of the transparent list restores it.
  const toneSentinels = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(9), 3));
    let prev: { tm: ToneMapping; ex: number } | null = null;
    const mk = (order: number, transparent: boolean, fn: (r: WebGLRenderer) => void) => {
      const m = new MeshBasicMaterial({ colorWrite: false, depthWrite: false, depthTest: false, transparent });
      const mesh = new Mesh(geo, m);
      mesh.renderOrder = order; mesh.frustumCulled = false;
      mesh.onBeforeRender = (r) => { if (!r.getRenderTarget()) fn(r); };
      return { mesh, m };
    };
    const begin = mk(-1e6, false, (r) => { prev = { tm: r.toneMapping, ex: r.toneMappingExposure }; r.toneMapping = AgXToneMapping; r.toneMappingExposure = HERO.agxExposure; });
    const end = mk(1e6, true, (r) => { if (prev) { r.toneMapping = prev.tm; r.toneMappingExposure = prev.ex; prev = null; } });
    return { begin: begin.mesh, end: end.mesh, dispose: () => { geo.dispose(); begin.m.dispose(); end.m.dispose(); } };
  }, []);
  useEffect(() => () => toneSentinels.dispose(), [toneSentinels]);

  // ---------------------------------------------------------------- assets
  const textures = useMemo(() => ({
    dot: additiveGlowTexture('#cfeee0', true), glow: additiveGlowTexture(HERO.coreGlow.color), packet: additiveGlowTexture('#9ff5d2', true),
    radial: radialAlphaTexture(), bokeh: additiveGlowTexture('#7fe8bf'), sheen: sheenTexture(),
    halo: Object.fromEntries(Object.entries(SCREEN_GLOW).map(([k, c]) => [k, additiveGlowTexture(c)])) as Record<string, CanvasTexture>,
  }), []);
  useEffect(() => () => { const { halo, ...rest } = textures; Object.values(rest).forEach((t) => t.dispose()); Object.values(halo).forEach((t) => t.dispose()); }, [textures]);

  // ---------------------------------------------------------------- glass K
  // Two versions of the K: shard geometry (subdivided, only for the intro / shatter) and the
  // clean extrusion shown at rest. Subdivision leaves hairline T-junction cracks that glass
  // makes visible, so the solid one takes over as soon as the shards have locked.
  const K = useMemo(() => buildGlassK(high), [high]);
  const Ksolid = useMemo(() => (high ? buildGlassK(false) : K), [high, K]);
  const shardGroup = useRef<Group>(null);
  const solidGroup = useRef<Group>(null);
  const shardU = useMemo(() => createShardUniforms(), []);
  const kMat = useMemo(() => {
    const k = HERO.k;
    const m = high
      ? new MeshPhysicalMaterial({
        ...k.transmission, color: '#FFFFFF', vertexColors: true, transmission: 1, metalness: 0,
        attenuationColor: new Color(k.attenuationColor), attenuationDistance: k.attenuationDistance, envMapIntensity: k.envIntensity,
      })
      : new MeshPhysicalMaterial({
        color: '#7FE6B9', vertexColors: true, metalness: 0.15, roughness: 0.12, transmission: 0, transparent: true, opacity: 0.78,
        clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.9, ior: 1.5,
        emissive: '#0E6B47', emissiveIntensity: 0.35,
      });
    return patchShardMaterial(m, shardU);
  }, [high, shardU]);
  const edges = useMemo(() => buildSegmentGlow(K.segments, { ...HERO.k.edge, span: HERO.k.height * 0.6, backDim: 0.3 }), [K]);
  const traces = useMemo(() => buildSegmentGlow(K.traceSegments, { radius: HERO.k.trace.radius, base: HERO.k.trace.base, period: HERO.k.edge.period, width: HERO.k.edge.width, span: HERO.k.height * 0.6, sides: 5 }), [K]);
  const traceDots = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(K.traceDots), 3));
    const m = lightAdditive(new PointsMaterial({ map: textures.packet, color: COLORS.ice, size: 0.11, sizeAttenuation: true, toneMapped: false }));
    return { points: new Points(g, m), g, m };
  }, [K, textures.packet]);
  const coreGeo = useMemo(() => new IcosahedronGeometry(0.13, 1), []);
  const coreMat = useMemo(() => new MeshStandardMaterial({
    color: HERO.crystal.core.color, emissive: HERO.crystal.core.emissive, emissiveIntensity: HERO.crystal.core.emissiveMin,
    metalness: 0.4, roughness: 0.25, flatShading: true, toneMapped: false,
  }), []);
  const glowMat = useMemo(() => lightAdditive(new SpriteMaterial({ map: textures.glow, toneMapped: false })), [textures.glow]);
  const shockMat = useMemo(() => createShockwaveMaterial(), []);
  const tintMat = useMemo(() => createGlassTintMaterial(HERO.k.bodyTint.color, HERO.k.bodyTint.fill, HERO.k.bodyTint.rim), []);
  useEffect(() => () => tintMat.dispose(), [tintMat]);
  const kHit = useMemo(() => new Mesh(new BoxGeometry(2.4, HERO.k.height, 0.5), new MeshBasicMaterial()), []);
  useEffect(() => () => {
    K.dispose(); if (Ksolid !== K) Ksolid.dispose(); kMat.dispose(); edges.dispose(); traces.dispose(); traceDots.g.dispose(); traceDots.m.dispose();
    coreGeo.dispose(); coreMat.dispose(); glowMat.dispose(); shockMat.dispose(); kHit.geometry.dispose(); (kHit.material as MeshBasicMaterial).dispose();
  }, [K, Ksolid, kMat, edges, traces, traceDots, coreGeo, coreMat, glowMat, shockMat, kHit]);

  const backdrop = useMemo(() => createGlassBackdrop(HERO.glassBackdrop), []);
  useEffect(() => {
    const prev = gl.transmissionResolutionScale;
    gl.transmissionResolutionScale = HERO.crystal.transmissionScale;
    return () => { gl.transmissionResolutionScale = prev; };
  }, [gl]);
  useEffect(() => () => backdrop.dispose(), [backdrop]);
  // Glass backdrop rides on the camera (far plane-filling quad).
  useEffect(() => {
    backdrop.mesh.position.set(0, 0, -40);
    backdrop.mesh.scale.set(200, 200, 1);
    camera.add(backdrop.mesh);
    return () => { camera.remove(backdrop.mesh); };
  }, [camera, backdrop]);

  // ---------------------------------------------------------------- particles
  // Mid layer — network: drifting nodes + dynamic links between near neighbours. The links
  // live in the opaque list (additive, no depth write) so devices paint over them: lines always
  // read as behind the panels, and the glass K refracts them.
  const net = useMemo(() => {
    const n = HERO.network.count[tierKey];
    const r = rng(11);
    const base = new Float32Array(n * 3);
    const pos = new Float32Array(n * 3);
    const phase = new Float32Array(n);
    const [r0, r1] = HERO.network.shell;
    for (let i = 0; i < n; i++) {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = r0 + r() * (r1 - r0), s = Math.sqrt(1 - u * u);
      base[i * 3] = Math.cos(th) * s * rad;
      base[i * 3 + 1] = u * rad * 0.7;
      base[i * 3 + 2] = Math.sin(th) * s * rad * 0.8;
      phase[i] = r() * Math.PI * 2;
    }
    pos.set(base);
    const pGeo = new BufferGeometry();
    pGeo.setAttribute('position', new BufferAttribute(pos, 3));
    const pMat = lightAdditive(new PointsMaterial({ map: textures.dot, color: COLORS.mint, size: HERO.network.pointSize, sizeAttenuation: true, fog: true }));
    pMat.transparent = false; // opaque list → also drawn into the transmission buffer: nodes behind the K are seen refracted
    const points = new Points(pGeo, pMat);
    const lPos = new Float32Array(HERO.network.maxLinks * 6);
    const lGeo = new BufferGeometry();
    lGeo.setAttribute('position', new BufferAttribute(lPos, 3));
    lGeo.setDrawRange(0, 0);
    const lMat = lightAdditive(new LineBasicMaterial({ color: COLORS.accent, opacity: 0.26, fog: true }));
    lMat.transparent = false;
    return { n, base, pos, phase, points, pGeo, pMat, lPos, lGeo, lMat };
  }, [tierKey, textures.dot]);
  useEffect(() => () => { net.pGeo.dispose(); net.pMat.dispose(); net.lGeo.dispose(); net.lMat.dispose(); }, [net]);

  // Pulses: light packets running from network nodes into the logo's heart.
  const pulses = useMemo(() => {
    const n = HERO.pulses.count[tierKey];
    const r = rng(41);
    const st = Array.from({ length: n }, (_, i) => ({ node: Math.floor(r() * net.n), p: -i * (1 / n) * 1.6, speed: HERO.pulses.speed * (0.7 + r() * 0.6) }));
    const pos = new Float32Array(n * 3);
    const g = new BufferGeometry(); g.setAttribute('position', new BufferAttribute(pos, 3));
    const m = lightAdditive(new PointsMaterial({ map: textures.packet, color: COLORS.ice, size: HERO.pulses.size, sizeAttenuation: true, toneMapped: false }));
    const points = new Points(g, m); points.frustumCulled = false;
    return { st, pos, g, m, points, r };
  }, [tierKey, net.n, textures.packet]);
  useEffect(() => () => { pulses.g.dispose(); pulses.m.dispose(); }, [pulses]);

  // Far layer — stars on a large shell, mostly behind.
  const stars = useMemo(() => {
    const n = HERO.stars.count[tierKey];
    const r = rng(5);
    const pos = new Float32Array(n * 3);
    const [a, b] = HERO.stars.radius;
    for (let i = 0; i < n; i++) {
      const th = r() * Math.PI * 2, u = r() * 1.4 - 0.7, rad = a + r() * (b - a);
      pos[i * 3] = Math.cos(th) * rad; pos[i * 3 + 1] = u * rad * 0.6; pos[i * 3 + 2] = -Math.abs(Math.sin(th)) * rad - 2;
    }
    const g = new BufferGeometry(); g.setAttribute('position', new BufferAttribute(pos, 3));
    const m = lightAdditive(new PointsMaterial({ map: textures.dot, color: COLORS.ice, size: HERO.stars.size, sizeAttenuation: true, fog: false, opacity: 0.55 }));
    m.transparent = false; // refracted through the K too
    const points = new Points(g, m); points.frustumCulled = false;
    return { g, m, points };
  }, [tierKey, textures.dot]);
  useEffect(() => () => { stars.g.dispose(); stars.m.dispose(); }, [stars]);

  // Near layer — a few large, soft bokeh discs between the camera and the logo (tier 2).
  const bokeh = useMemo(() => {
    const n = HERO.bokeh.count[tierKey];
    const r = rng(77);
    const mat = lightAdditive(new SpriteMaterial({ map: textures.bokeh, opacity: HERO.bokeh.opacity, toneMapped: false, fog: false }));
    const items = Array.from({ length: n }, () => ({
      x: (r() * 2 - 1) * 4.2, y: (r() * 2 - 1) * 2.6, z: 2.2 + r() * 2.2,
      s: HERO.bokeh.size[0] + r() * (HERO.bokeh.size[1] - HERO.bokeh.size[0]), ph: r() * 6.28,
    }));
    return { mat, items };
  }, [tierKey, textures.bokeh]);
  const bokehRefs = useRef<(Sprite | null)[]>([]);
  useEffect(() => () => bokeh.mat.dispose(), [bokeh]);

  // ---------------------------------------------------------------- rings
  const ringGeos = useMemo(() => HERO.rings.map((r) => {
    const pts = Array.from({ length: 96 }, (_, i) => { const a = (i / 96) * Math.PI * 2; return new Vector3(Math.cos(a) * r.radius, Math.sin(a) * r.radius, 0); });
    return new TubeGeometry(new CatmullRomCurve3(pts, true), 360, r.tube, high ? 10 : 6, true);
  }), [high]);
  const ringMats = useMemo(() => HERO.rings.map(() => createRingMaterial('main')), []);
  const ringRtMats = useMemo(() => HERO.rings.map(() => createRingMaterial('rt')), []);
  const packetMat = useMemo(() => lightAdditive(new SpriteMaterial({ map: textures.packet, toneMapped: false })), [textures.packet]);
  useEffect(() => () => { ringGeos.forEach((g) => g.dispose()); ringMats.forEach((m) => m.dispose()); ringRtMats.forEach((m) => m.dispose()); packetMat.dispose(); }, [ringGeos, ringMats, ringRtMats, packetMat]);

  // ---------------------------------------------------------------- devices
  const D = HERO.devices;
  const dev = useMemo(() => {
    const scale = D.screenScale[tierKey];
    // QA: ?kzqa&kzt=<s> starts every screen loop at that time (poster renders on slow GPUs).
    const t0 = typeof location !== 'undefined' && location.search.includes('kzqa') ? Number(new URLSearchParams(location.search).get('kzt') ?? 0) : 0;
    const screens = D.items.map((it, i) => new DeviceScreen(it.screen, scale, it.blur, t0 + i * 1.7));
    const geo = {
      phone: roundedRect(D.phone.w - D.phone.bezel * 2, D.phone.h - D.phone.bezel * 2, D.phone.r - D.phone.bezel),
      browser: roundedRect(D.browser.w - D.browser.bezel * 2, D.browser.h - D.browser.bezel * 2, D.browser.r - D.browser.bezel),
      button: new BoxGeometry(0.014, 1, 0.03),
      halo: new PlaneGeometry(1, 1),
      hit: new BoxGeometry(1, 1, 0.2),
    };
    // Screens are emissive: no fog (the far one is dimmed instead so it still sits back).
    const screenMats = screens.map((s, i) => new MeshBasicMaterial({ map: s.texture, toneMapped: false, fog: false, color: new Color().setScalar(D.items[i].blur < 1 ? D.farScreenGain : D.screenGain) }));
    const sheenMat = lightAdditive(new MeshBasicMaterial({ map: textures.sheen, opacity: 0.16, toneMapped: false }));
    const haloMats = D.items.map((it) => lightAdditive(new MeshBasicMaterial({ map: textures.halo[it.screen], opacity: 0.32, toneMapped: false })));
    const bodyMat = new MeshStandardMaterial({ color: D.bodyColor, metalness: 0.75, roughness: 0.32, envMapIntensity: 1.2 });
    const hits = D.items.map(() => new Mesh(geo.hit, new MeshBasicMaterial()));
    return { screens, geo, screenMats, sheenMat, haloMats, bodyMat, hits };
  }, [D, tierKey, textures.sheen, textures.halo]);
  useEffect(() => () => {
    dev.screens.forEach((s) => s.dispose()); Object.values(dev.geo).forEach((g) => g.dispose());
    dev.screenMats.forEach((m) => m.dispose()); dev.sheenMat.dispose(); dev.haloMats.forEach((m) => m.dispose()); dev.bodyMat.dispose();
    dev.hits.forEach((h) => (h.material as MeshBasicMaterial).dispose());
  }, [dev]);
  // Low tier: one static frame per screen (redrawn once the brand fonts are ready).
  // Tier 2: one immediate frame each too, so no screen ever shows blank before its first turn.
  useEffect(() => {
    const drawAll = () => dev.screens.forEach((s) => s.draw(!high));
    drawAll();
    document.fonts?.ready.then(drawAll).catch(() => {});
  }, [dev, high]);

  // Floor.
  const gridMat = useMemo(() => createGridMaterial(), []);
  useEffect(() => () => gridMat.dispose(), [gridMat]);

  // ---------------------------------------------------------------- interaction
  const ui = useRef({ overUI: false, hover: -2 as number, shockAt: -10, locked: false, clickQueued: false, freeze: null as number | null });
  useEffect(() => {
    if (!section) return;
    const interactive = 'a,button,input,textarea,select,label,h1,p,li,[role="button"],.kz-hero-chip,.kz-hero-caption,.kz-capability-pill';
    const onMove = (e: PointerEvent) => { ui.current.overUI = !!(e.target as HTMLElement)?.closest?.(interactive); };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(interactive)) return;
      ui.current.clickQueued = true;
    };
    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('click', onClick);
    return () => { section.removeEventListener('pointermove', onMove); section.removeEventListener('click', onClick); section.style.cursor = ''; };
  }, [section]);
  // QA hook: window.dispatchEvent(new Event('kz:hero-replay')) replays the intro;
  // a CustomEvent with detail { freeze: 0..1 } holds the intro at that point (screenshots).
  useEffect(() => {
    const replay = (ev: Event) => { born.current = null; ui.current.locked = false; ui.current.freeze = (ev as CustomEvent).detail?.freeze ?? null; };
    window.addEventListener('kz:hero-replay', replay);
    return () => window.removeEventListener('kz:hero-replay', replay);
  }, []);
  const activate = (hit: number) => {
    if (hit === -1) { ui.current.shockAt = -1; return; } // K → shockwave (time set in the frame loop)
    const target = D.items[hit]?.target ?? '';
    if (target === 'ai') window.dispatchEvent(new CustomEvent('kz:open-ai'));
    else if (target.startsWith('case:')) {
      const el = document.querySelector<HTMLElement>(`[data-kz-view="product-${target.slice(5)}"]`)?.closest<HTMLElement>('.kz-project')
        ?? document.querySelector<HTMLElement>('.kz-project');
      if (el) scrollToElement(el);
    }
  };

  // ---------------------------------------------------------------- frame loop
  const eased = useRef({ p: 0, px: 0, py: 0, tx: 0, ty: 0, lx: 0, ly: 0, sway: 0, speed: 1, coreBoost: 1, flash: 0, rr: 0 });
  const devState = useRef(D.items.map(() => ({ fwd: 0, speed: 1 })));
  const frame = useRef(0);
  const qa = useMemo(() => typeof location !== 'undefined' && location.search.includes('kzqa'), []);
  useFrame((state, delta) => {
    // Never render into a zero-sized view (route transitions): the transmission pass would
    // allocate a 0×0 render target ("framebuffer incomplete").
    const tr0 = track.getBoundingClientRect();
    if (root.current) root.current.visible = tr0.width > 2 && tr0.height > 2;
    if (!root.current?.visible) return;
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    if (born.current === null) born.current = t;
    const age = t - born.current;
    const e = eased.current;
    const L = layout.current;
    const k = HERO.k;
    // Stacked layout (stage below the copy, < lg): progress starts when the stage itself has
    // been scrolled into view, so phones see the full K before it shatters.
    let target = sectionProgress.hero ?? 0;
    if (stage && window.innerWidth < 1024) {
      const sr = stage.getBoundingClientRect();
      target = MathUtils.clamp((window.innerHeight * 0.12 - sr.top) / Math.max(1, sr.height), 0, 1);
    }
    e.p = MathUtils.damp(e.p, target, 7, dt);
    const p = e.p;
    const pe = p * p * (3 - 2 * p);
    theme.tick(dt); // hero stays cinematic-dark in both themes
    frame.current++;

    e.px = MathUtils.damp(e.px, mouse.x, HERO.parallaxDamping, dt);
    e.py = MathUtils.damp(e.py, mouse.y, HERO.parallaxDamping, dt);

    // Camera: parallax + scroll dolly.
    const c = camera;
    const z = HERO.cameraZ * (1 - (1 - HERO.dollyTo) * pe);
    c.position.set(L.x * pe * 0.9 + e.px * HERO.parallax, L.y * pe * 0.9 + e.py * HERO.parallax * 0.6 + 0.35, z);
    c.lookAt(L.x * pe * 0.9, L.y * pe * 0.9 - 0.15, 0);

    const g = root.current;
    g.position.set(L.x, L.y + HERO.liftY * L.s, 0);
    g.scale.setScalar(L.s);
    g.rotation.y = e.px * 0.08;
    g.rotation.x = -e.py * 0.04;

    // ---- pointer → hover target (K = -1, device index ≥ 0, none = -2)
    let hover = -2;
    if (mouse.active && !ui.current.overUI && pe < 0.2) {
      const tr = tr0;
      ndc.set(((mouse.clientX - tr.left) / tr.width) * 2 - 1, -(((mouse.clientY - tr.top) / tr.height) * 2 - 1));
      if (Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1) {
        ray.setFromCamera(ndc, c);
        const targets = [kHit, ...dev.hits];
        const hits = ray.intersectObjects(targets, false);
        if (hits.length) hover = hits[0].object === kHit ? -1 : dev.hits.findIndex((h) => h === hits[0].object);
      }
    }
    if (hover >= 0 && !D.items[hover].target) hover = -2; // the far dashboard is decorative
    if (hover !== ui.current.hover && section) section.style.cursor = hover === -2 ? '' : 'pointer';
    ui.current.hover = hover;
    if (ui.current.clickQueued) { ui.current.clickQueued = false; if (hover !== -2) activate(hover); }

    // ---- glass K: intro → idle → shatter
    const intro = high ? ui.current.freeze ?? MathUtils.clamp((age - k.introDelay) / k.introDuration, 0, 1) : 1;
    shardU.uIntro.value = intro;
    shardU.uTime.value = t;
    if (intro >= 1 && !ui.current.locked) { ui.current.locked = true; if (high) ui.current.shockAt = t; }
    if (ui.current.shockAt === -1) ui.current.shockAt = t;
    shardU.uShatter.value = high ? smooth(0.04, 0.8, p) : 0;
    // at rest (locked, not shattering) the crack-free solid K is shown instead of the shards
    const atRest = intro >= 1 && shardU.uShatter.value <= 0.0001;
    if (shardGroup.current && solidGroup.current) { shardGroup.current.visible = !atRest; solidGroup.current.visible = atRest; }
    else if (shardGroup.current) shardGroup.current.visible = true; // lite (incl. a runtime downgrade): one geometry only

    const hoverK = hover === -1;
    e.speed = MathUtils.damp(e.speed, hoverK ? k.hoverSpeed : 1, 3, dt);
    e.coreBoost = MathUtils.damp(e.coreBoost, hoverK ? k.hoverCore : 1, 4, dt);
    e.sway += dt * e.speed * (Math.PI * 2 / k.swayPeriod);
    e.tx = MathUtils.damp(e.tx, -e.py * k.tilt, 3, dt);
    e.ty = MathUtils.damp(e.ty, e.px * k.tilt, 3, dt);
    if (kFloat.current) {
      kFloat.current.position.set(HERO.kOffset[0], HERO.kOffset[1] + Math.sin(t * 0.7) * k.float * (1 - pe), 0);
      const sIn = high ? 1 : eo3((age - 0.1) / 1.0) * 0.12 + 0.88;
      const sOut = high ? 1 : Math.max(0.001, 1 - pe * 0.9);
      kFloat.current.scale.setScalar(sIn * sOut);
      kFloat.current.visible = high ? shardU.uShatter.value < 0.995 : sOut > 0.02;
    }
    if (kGroup.current) kGroup.current.rotation.set(e.tx + Math.sin(e.sway * 0.5) * 0.04, Math.sin(e.sway) * k.sway + e.ty, 0);
    kMat.opacity = high ? 1 : 0.78 * (1 - pe * 0.6) * (lite ? eo3(age / 0.9) : 1);

    // shockwave (lock / click): ring in the logo plane, network + floor ripple
    const sp = (t - ui.current.shockAt) / k.shock.duration;
    const shockR = sp >= 0 && sp <= 1 ? eo3(sp) * k.shock.radius : -10;
    const shockA = sp >= 0 && sp <= 1 ? Math.pow(1 - sp, 1.5) : 0;
    shockMat.uniforms.uR.value = shockR;
    shockMat.uniforms.uA.value = shockA * 1.3;
    if (shockMesh.current) shockMesh.current.visible = shockA > 0.002;
    gridMat.uniforms.uShockR.value = shockR * 0.9;
    gridMat.uniforms.uShockA.value = shockA;
    e.flash = Math.max(e.flash - dt * 1.6, sp >= 0 && sp < 0.1 ? 1 : 0);

    // edges + traces: appear at the lock (flash), sweep every ~6 s, fade on shatter
    const edgeIn = high ? smooth(0.82, 1, intro) : eo3(age / 1.1);
    const out = 1 - smooth(0, 0.18, p);
    for (const m of [edges.mat, traces.mat]) {
      m.uniforms.uTime.value = t;
      m.uniforms.uFade.value = edgeIn * out;
      m.uniforms.uFlash.value = e.flash * 1.4;
    }
    (traceDots.m as PointsMaterial).opacity = edgeIn * out;

    // pulsing core (+ hover boost, + small flash when a pulse arrives)
    const hb = heartbeat(t, HERO.crystal.core.bpm);
    const { emissiveMin, emissiveMax } = HERO.crystal.core;
    coreMat.emissiveIntensity = (emissiveMin + (emissiveMax - emissiveMin) * hb) * e.coreBoost + e.flash * 2;
    if (core.current) core.current.scale.setScalar(Math.max(0.001, (1 - pe) * (high ? smooth(0.6, 1, intro) : 1)) * (1 + hb * 0.12));
    if (glow.current) {
      glow.current.scale.setScalar(HERO.coreGlow.size * 0.95 * (1 + hb * 0.2) * (1 - pe * 0.6));
      glowMat.opacity = (0.45 + hb * 0.35) * e.coreBoost * (1 - pe * 0.8) * (high ? smooth(0.3, 1, intro) : 1);
    }

    // ---- rings: draw in, travelling trail heads, packets
    HERO.rings.forEach((r, i) => {
      const grp = ringGroups.current[i];
      const draw = MathUtils.clamp((age - 0.5 - i * HERO.ringStagger) / HERO.ringDrawIn, 0, 1);
      const dv = 1 - Math.pow(1 - draw, 3);
      if (kGroup.current) ringMats[i].uniforms.uToK.value.copy(kGroup.current.matrixWorld).invert();
      for (const m of [ringMats[i], ringRtMats[i]]) {
        m.uniforms.uDraw.value = dv;
        m.uniforms.uHead.value = ((t * r.speed) % 1 + 1) % 1;
        m.uniforms.uFade.value = 1 - pe;
      }
      if (grp) grp.scale.setScalar(1 + pe * (0.35 + i * 0.15));
      packets.current[i].forEach((spr, kk) => {
        if (!spr) return;
        const a = (t * r.packets[kk] + kk / r.packets.length) * Math.PI * 2;
        spr.position.set(Math.cos(a) * r.radius, Math.sin(a) * r.radius, 0);
        const frac = (((a / (Math.PI * 2)) % 1) + 1) % 1;
        spr.visible = frac <= dv && pe < 0.95;
        spr.scale.setScalar(HERO.packetSize * (1 + 0.2 * Math.sin(t * 6 + kk)));
      });
    });
    packetMat.opacity = 1 - pe;

    // ---- devices: bob, hover forward, fly out on scroll; live screens (round-robin uploads)
    D.items.forEach((it, i) => {
      const grp = devices.current[i];
      const st = devState.current[i];
      const hv = hover === i;
      st.fwd = MathUtils.damp(st.fwd, hv ? D.hoverForward : 0, 5, dt);
      st.speed = MathUtils.damp(st.speed, hv ? D.hoverSpeed : 1, 4, dt);
      dev.screens[i].clock += dt * st.speed;
      if (!grp) return;
      const [bx, bs] = D.bob;
      const din = eo3((age - 0.55 - i * 0.14) / 1.1);
      const fo = 1 + D.flyOut * pe;
      tmpDir.set(0, 0, 1).applyEuler(grp.rotation);
      grp.position.set(
        it.pos[0] * fo + tmpDir.x * st.fwd,
        it.pos[1] * (1 + pe * 0.5) + Math.sin(t * bs + i * 1.7) * bx - (1 - din) * 0.5,
        it.pos[2] * (1 + pe * 0.3) + tmpDir.z * st.fwd,
      );
      grp.rotation.set(it.rot[0] + Math.sin(t * bs * 0.7 + i) * 0.035, it.rot[1] + Math.sin(t * bs * 0.5 + i * 2) * 0.05, it.rot[2]);
      grp.scale.setScalar(it.scale * Math.max(0.001, din) * (1 - pe * 0.15));
      grp.visible = din > 0.01 && pe < 0.98;
      dev.haloMats[i].opacity = 0.3 * din * (1 - pe) * (hv ? 1.6 : 1);
      // the hit proxy follows the device
      dev.hits[i].position.copy(grp.position);
      dev.hits[i].rotation.copy(grp.rotation);
      const sz = it.frame === 'phone' ? D.phone : D.browser;
      dev.hits[i].scale.set(sz.w * it.scale, sz.h * it.scale, 1);
    });
    if (high) {
      const n = dev.screens.length;
      for (let u = 0; u < D.uploadsPerFrame; u++) {
        const idx = (frame.current * D.uploadsPerFrame + u) % n;
        if (D.items[idx].blur < 1 && Math.floor(frame.current / n) % 2) continue; // far screen: half rate
        if (devices.current[idx]?.visible) dev.screens[idx].draw();
      }
    }
    dev.sheenMat.opacity = 0.16 * (1 - pe);
    dev.hits.forEach((h) => h.updateMatrixWorld());
    kHit.updateMatrixWorld();

    // ---- floor
    gridMat.uniforms.uTime.value = t;
    gridMat.uniforms.uFade.value = (1 - pe * 0.8) * Math.min(1, age / 1.5);

    // ---- network drift + shock ripple + links
    const N = net;
    const drift = HERO.network.drift;
    for (let i = 0; i < N.n; i++) {
      const ph = N.phase[i];
      const bx = N.base[i * 3], by = N.base[i * 3 + 1], bz = N.base[i * 3 + 2];
      let rip = 0;
      if (shockA > 0) { const d = Math.hypot(bx, by, bz); rip = Math.exp(-Math.pow((d - shockR) * 2.2, 2)) * 0.32 * shockA / Math.max(d, 0.001); }
      N.pos[i * 3] = bx * (1 + rip) + Math.sin(t * drift + ph) * 0.12;
      N.pos[i * 3 + 1] = by * (1 + rip) + Math.cos(t * drift * 1.3 + ph) * 0.1;
      N.pos[i * 3 + 2] = bz * (1 + rip) + Math.sin(t * drift * 0.7 + ph * 2) * 0.1;
    }
    (N.pGeo.attributes.position as BufferAttribute).needsUpdate = true;
    const maxD2 = HERO.network.linkDistance * HERO.network.linkDistance;
    let links = 0;
    for (let i = 0; i < N.n && links < HERO.network.maxLinks; i++) {
      const ax = N.pos[i * 3], ay = N.pos[i * 3 + 1], az = N.pos[i * 3 + 2];
      for (let j = i + 1; j < N.n && links < HERO.network.maxLinks; j++) {
        const dx = N.pos[j * 3] - ax, dy = N.pos[j * 3 + 1] - ay, dz = N.pos[j * 3 + 2] - az;
        if (dx * dx + dy * dy + dz * dz < maxD2) {
          const o = links * 6;
          N.lPos[o] = ax; N.lPos[o + 1] = ay; N.lPos[o + 2] = az;
          N.lPos[o + 3] = N.pos[j * 3]; N.lPos[o + 4] = N.pos[j * 3 + 1]; N.lPos[o + 5] = N.pos[j * 3 + 2];
          links++;
        }
      }
    }
    N.lGeo.setDrawRange(0, links * 2);
    (N.lGeo.attributes.position as BufferAttribute).needsUpdate = true;
    const ng = netGroup.current;
    if (ng) ng.rotation.y += HERO.spin.network * dt;
    N.pMat.opacity = (1 - pe * 0.85) * Math.min(1, age / 1.2);
    N.lMat.opacity = 0.26 * (1 - pe) * Math.min(1, age / 1.6);

    // ---- pulses: node → heart (in the network group's rotated frame)
    if (ng) {
      const ry = ng.rotation.y, cs = Math.cos(-ry), sn = Math.sin(-ry);
      const kx = K.heart.x + HERO.kOffset[0];
      const hx = kx * cs, hz = -kx * sn, hy = K.heart.y + HERO.kOffset[1];
      const P = pulses;
      P.st.forEach((s, i) => {
        s.p += dt * s.speed * (intro >= 1 ? 1 : 0);
        if (s.p >= 1) { s.p = 0; s.node = Math.floor(P.r() * N.n); e.flash = Math.max(e.flash, 0.25); }
        const q = Math.max(0, s.p), qe = q * q;
        const nx = N.pos[s.node * 3], ny = N.pos[s.node * 3 + 1], nz = N.pos[s.node * 3 + 2];
        P.pos[i * 3] = nx + (hx - nx) * qe; P.pos[i * 3 + 1] = ny + (hy - ny) * qe; P.pos[i * 3 + 2] = nz + (hz - nz) * qe;
      });
      (P.g.attributes.position as BufferAttribute).needsUpdate = true;
      P.m.opacity = (1 - pe) * (intro >= 1 ? 1 : 0);
    }

    // ---- far stars + near bokeh drift
    stars.m.opacity = 0.55 * (1 - pe * 0.5) * Math.min(1, age / 2);
    bokeh.items.forEach((b, i) => {
      const s = bokehRefs.current[i];
      if (!s) return;
      s.position.set(b.x + Math.sin(t * 0.13 + b.ph) * 0.3, b.y + Math.cos(t * 0.11 + b.ph) * 0.25 + pe * 1.5, b.z);
      s.scale.setScalar(b.s);
    });
    bokeh.mat.opacity = HERO.bokeh.opacity * (1 - pe) * Math.min(1, age / 2.5);

    // ---- cursor light: facets near the pointer catch light
    const lt = cursorLight.current;
    if (lt) {
      const tr = tr0;
      const nx = ((mouse.clientX - tr.left) / tr.width) * 2 - 1;
      const ny = -(((mouse.clientY - tr.top) / tr.height) * 2 - 1);
      tmpV.set(nx, ny, 0.5).unproject(c);
      tmpDir.copy(tmpV).sub(c.position).normalize();
      const planeZ = 1.4;
      const kk = (planeZ - c.position.z) / tmpDir.z;
      tmpV.copy(c.position).addScaledVector(tmpDir, kk);
      g.worldToLocal(tmpV);
      e.lx = MathUtils.damp(e.lx, tmpV.x, 6, dt);
      e.ly = MathUtils.damp(e.ly, tmpV.y, 6, dt);
      lt.position.set(e.lx, e.ly, planeZ);
      lt.intensity = mouse.active ? HERO.crystal.cursorLight.intensity * (1 - pe) : MathUtils.damp(lt.intensity, 0, 2, dt);
    }

    if (qa) (window as unknown as { __kzHero: unknown }).__kzHero = { p, intro, L: { ...L }, shatter: shardU.uShatter.value, kVis: kFloat.current?.visible, solid: solidGroup.current?.visible, shard: shardGroup.current?.visible };
    if (first.current) {
      first.current = false;
      // Cross-fade: poster out, live canvas in (see .kz-hero-stage[data-ready]); the flat CSS grid
      // hands over to the 3D floor (#hero[data-kz3d]).
      requestAnimationFrame(() => { stage?.setAttribute('data-ready', 'true'); if (section) section.dataset.kz3d = 'ready'; });
    }
  });

  useEffect(() => () => { stage?.setAttribute('data-ready', 'false'); if (section) delete section.dataset.kz3d; }, [stage, section]);

  // Pass gating for the ring twins (main frame vs transmission render target).
  const gateRing = (pass: 'main' | 'rt', i: number) => (el: Mesh | null) => { if (el) gateToPass(el, pass === 'main' ? ringMats[i] : ringRtMats[i], pass); };
  const reflector = HERO.floor.reflector;

  return (
    <>
      <primitive object={toneSentinels.begin} />
      <primitive object={toneSentinels.end} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[-3.5, 4.5, 4]} intensity={1.6} color="#F3FFF9" />
      <pointLight position={[3.2, 0.6, 1.2]} intensity={18} distance={12} color={COLORS.accent} />
      <pointLight position={[0, 2.5, -3.5]} intensity={10} distance={12} color="#2DD4BF" />

      <group ref={root}>
        <pointLight ref={cursorLight} intensity={0} distance={HERO.crystal.cursorLight.distance} color={COLORS.ice} />

        {/* far layer */}
        <primitive object={stars.points} />

        {/* the glass K */}
        <group ref={kFloat}>
          <sprite ref={glow} material={glowMat} position={[K.heart.x, K.heart.y, -0.6]} renderOrder={-1} />
          <group ref={kGroup}>
            <mesh ref={core} geometry={coreGeo} material={coreMat} position={[K.heart.x, K.heart.y, 0]} />
            <group ref={shardGroup}>{K.geos.map((geo, i) => <mesh key={i} geometry={geo} material={kMat} renderOrder={1} />)}</group>
            {Ksolid !== K && (
              <group ref={solidGroup} visible={false}>
                {Ksolid.geos.map((geo, i) => <mesh key={i} geometry={geo} material={kMat} renderOrder={1} />)}
                {Ksolid.geos.map((geo, i) => <mesh key={`t${i}`} geometry={geo} material={tintMat} renderOrder={2} />)}
              </group>
            )}
            <primitive object={edges.mesh} renderOrder={2} />
            {HERO.k.trace.enabled && <primitive object={traces.mesh} renderOrder={2} />}
            {HERO.k.trace.enabled && <primitive object={traceDots.points} renderOrder={2} frustumCulled={false} />}
            <primitive object={kHit} visible={false} />
          </group>
          <mesh ref={shockMesh} material={shockMat} renderOrder={3} visible={false}>
            <planeGeometry args={[HERO.k.shock.radius * 2.4, HERO.k.shock.radius * 2.4]} />
          </mesh>
        </group>

        {HERO.rings.map((r, i) => (
          <group key={i} ref={(el) => { ringGroups.current[i] = el; }} position={[HERO.kOffset[0], HERO.kOffset[1], 0]} rotation={[r.rx, r.ry, 0]}>
            <mesh ref={gateRing('main', i)} geometry={ringGeos[i]} material={ringMats[i]} renderOrder={3} />
            <mesh ref={gateRing('rt', i)} geometry={ringGeos[i]} material={ringRtMats[i]} renderOrder={-5} />
            {r.packets.map((_, kk) => (
              <sprite key={kk} ref={(el) => { packets.current[i][kk] = el; }} material={packetMat} renderOrder={4} />
            ))}
          </group>
        ))}

        {D.items.map((it, i) => {
          const sz = it.frame === 'phone' ? D.phone : D.browser;
          const zf = sz.d / 2 + 0.002;
          return (
            <group key={i} ref={(el) => { devices.current[i] = el; }} position={it.pos} rotation={it.rot}>
              <mesh position={[0, 0, -sz.d / 2 - 0.12]} scale={[sz.w * 2.1, sz.h * 2.1, 1]} geometry={dev.geo.halo} material={dev.haloMats[i]} renderOrder={-1} />
              <RoundedBox args={[sz.w, sz.h, sz.d]} radius={Math.min(sz.r, sz.d / 2 - 0.001)} smoothness={4} material={dev.bodyMat} />
              <mesh position={[0, 0, zf]} geometry={it.frame === 'phone' ? dev.geo.phone : dev.geo.browser} material={dev.screenMats[i]} />
              <mesh position={[0, 0, zf + 0.002]} geometry={it.frame === 'phone' ? dev.geo.phone : dev.geo.browser} material={dev.sheenMat} renderOrder={6} />
              {it.frame === 'phone' && (
                <>
                  <mesh geometry={dev.geo.button} material={dev.bodyMat} position={[-sz.w / 2 - 0.004, 0.42, 0]} scale={[1, 0.11, 1]} />
                  <mesh geometry={dev.geo.button} material={dev.bodyMat} position={[-sz.w / 2 - 0.004, 0.26, 0]} scale={[1, 0.11, 1]} />
                  <mesh geometry={dev.geo.button} material={dev.bodyMat} position={[sz.w / 2 + 0.004, 0.32, 0]} scale={[1, 0.2, 1]} />
                </>
              )}
            </group>
          );
        })}
        {dev.hits.map((h, i) => <primitive key={i} object={h} visible={false} />)}

        <group position={[0, HERO.floor.y, 0]}>
          {high && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
              <planeGeometry args={[HERO.floor.fadeRadius * 2, HERO.floor.fadeRadius * 2]} />
              <MeshReflectorMaterial
                resolution={reflector.resolution}
                blur={reflector.blur}
                mixBlur={reflector.mixBlur}
                mixStrength={reflector.mixStrength}
                mixContrast={reflector.mixContrast}
                depthScale={reflector.depthScale}
                minDepthThreshold={reflector.minDepthThreshold}
                maxDepthThreshold={reflector.maxDepthThreshold}
                mirror={0}
                color="#04100C"
                metalness={0.6}
                roughness={0.9}
                transparent
                opacity={reflector.opacity}
                alphaMap={textures.radial}
                depthWrite={false}
              />
            </mesh>
          )}
          <mesh rotation={[-Math.PI / 2, 0, 0]} material={gridMat} renderOrder={-2}>
            <planeGeometry args={[HERO.floor.size, HERO.floor.size]} />
          </mesh>
        </group>

        {/* mid layer: network (+ pulses into the logo) */}
        <group ref={netGroup}>
          <primitive object={net.points} frustumCulled={false} />
          <lineSegments geometry={net.lGeo} material={net.lMat} frustumCulled={false} renderOrder={-10} />
          <primitive object={pulses.points} />
        </group>

        {/* near layer: soft bokeh */}
        {bokeh.items.map((_, i) => (
          <sprite key={i} ref={(el) => { bokehRefs.current[i] = el; }} material={bokeh.mat} renderOrder={8} />
        ))}
      </group>
    </>
  );
}
