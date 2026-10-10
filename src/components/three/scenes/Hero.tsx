/**
 * HERO V2 — "The Core".
 * A large faceted glass crystal (real refraction, backside, chromatic
 * aberration) lit by a light-panel environment, with glowing facet edges and a
 * heartbeat-pulsing emissive core inside. Three thick light-trail rings with
 * travelling data packets draw themselves in on load. Frosted-glass devices
 * float at real depths and angles, their screens animating live. A perspective
 * grid floor (plus a faint reflection on high tier) recedes into dark-green fog.
 *
 * Scroll (scrubbed): the camera dives toward the core, the devices fly outward,
 * and the crystal dissolves into particles that pour down into the next section.
 * Mouse: damped camera parallax, crystal tilt, cursor light on the facets.
 * Tiers: 2 = everything; 1/lite = no transmission/reflector/contact glass,
 * fewer particles, slower screen redraws. Tier 0 never loads this file.
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, PerspectiveCamera, RoundedBox } from '@react-three/drei';

/**
 * The hero camera lives outside the (remounting) scene, inside the persistent hero View:
 * three keeps one transmission render target per camera id and never frees it, so a new
 * camera per home-page visit would leak one each time.
 */
export function HeroCamera() {
  return <PerspectiveCamera makeDefault fov={HERO.fov} position={[0, 0, HERO.cameraZ]} near={0.1} far={60} />;
}
import {
  BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, FogExp2, Group, IcosahedronGeometry,
  LineBasicMaterial, MathUtils, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial,
  PerspectiveCamera as PCam, PointLight, Points, PointsMaterial, Sprite, SpriteMaterial, TubeGeometry, Vector3,
} from 'three';
import { COLORS, HERO } from '../config';
import { mouse } from '../hooks/useMouse';
import { useThemeBlend } from '../hooks/useThemeBlend';
import { sectionProgress } from '../../../lib/scrollStore';
import { additiveGlowTexture, createGlassBackdrop, buildEdges, buildLightformerEnv, lightAdditive, createGridMaterial, createRingMaterial, radialAlphaTexture } from '../materials/heroMaterials';
import { LivePanel } from '../materials/heroPanels';
import type { Quality } from '../Experience';

const tmpV = new Vector3();
const tmpDir = new Vector3();

/** Deterministic PRNG so the composition is identical on every load. */
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

export function HeroScene({ track, quality }: { track: HTMLElement; quality: Quality }) {
  const { gl, scene } = useThree();
  const section = useMemo(() => track.closest('section'), [track]);
  const stage = useMemo(() => section?.querySelector<HTMLElement>('.kz-hero-stage') ?? null, [section]);
  const tier = quality.tier;
  const lite = quality.lite;
  const high = tier === 2 && !lite;

  const camera = useThree((st) => st.camera) as PCam;
  const root = useRef<Group>(null);
  const crystal = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const ringGroups = useRef<(Group | null)[]>([]);
  const packets = useRef<(Sprite | null)[][]>(HERO.rings.map(() => []));
  const panels = useRef<(Group | null)[]>([]);
  const glow = useRef<Sprite>(null);
  const floor = useRef<Group>(null);
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
    layout.current = {
      x: (sr.left + sr.width / 2 - tr.left - tr.width / 2) * wpp,
      y: -(sr.top + sr.height / 2 - tr.top - tr.height / 2) * wpp,
      s: (Math.min(sr.width, sr.height) * wpp) / HERO.compositionSize,
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

  // ---------------------------------------------------------------- assets
  const textures = useMemo(() => ({
    dot: additiveGlowTexture('#cfeee0', true), glow: additiveGlowTexture(HERO.coreGlow.color), packet: additiveGlowTexture('#9ff5d2', true), radial: radialAlphaTexture(),
  }), []);
  useEffect(() => () => Object.values(textures).forEach((t) => t.dispose()), [textures]);

  const crystalGeo = useMemo(() => new IcosahedronGeometry(HERO.crystal.radius, 0), []);
  const coreGeo = useMemo(() => new IcosahedronGeometry(HERO.crystal.radius * HERO.crystal.core.scale, 0), []);
  const edges = useMemo(() => buildEdges(crystalGeo), [crystalGeo]);
  useEffect(() => () => { crystalGeo.dispose(); coreGeo.dispose(); edges.dispose(); }, [crystalGeo, coreGeo, edges]);

  const coreMat = useMemo(() => new MeshStandardMaterial({
    color: HERO.crystal.core.color, emissive: HERO.crystal.core.emissive, emissiveIntensity: HERO.crystal.core.emissiveMin,
    metalness: 0.4, roughness: 0.25, flatShading: true, toneMapped: false,
  }), []);
  const glassLite = useMemo(() => new MeshPhysicalMaterial({
    color: HERO.crystal.tint, metalness: 0, roughness: 0.04, transmission: 0, transparent: true, opacity: 0.28,
    clearcoat: 1, clearcoatRoughness: 0.03, flatShading: true, envMapIntensity: 1.8, ior: 1.5,
  }), []);
  const glassHigh = useMemo(() => new MeshPhysicalMaterial({
    ...HERO.crystal.transmission, color: HERO.crystal.tint, transmission: 1, metalness: 0, flatShading: true,
    attenuationColor: new Color(HERO.crystal.attenuationColor), attenuationDistance: HERO.crystal.attenuationDistance,
    envMapIntensity: HERO.envIntensity * 0.8,
  }), []);
  const backdrop = useMemo(() => createGlassBackdrop(HERO.glassBackdrop), []);
  useEffect(() => {
    const prev = gl.transmissionResolutionScale;
    gl.transmissionResolutionScale = HERO.crystal.transmissionScale;
    return () => { gl.transmissionResolutionScale = prev; };
  }, [gl]);
  useEffect(() => () => { coreMat.dispose(); glassLite.dispose(); glassHigh.dispose(); backdrop.dispose(); }, [coreMat, glassLite, glassHigh, backdrop]);
  // Glass backdrop rides on the camera (far plane-filling quad).
  useEffect(() => {
    backdrop.mesh.position.set(0, 0, -40);
    backdrop.mesh.scale.set(200, 200, 1);
    camera.add(backdrop.mesh);
    return () => { camera.remove(backdrop.mesh); };
  }, [camera, backdrop]);

  // Network: drifting nodes + dynamically drawn links between near neighbours.
  const net = useMemo(() => {
    const n = HERO.network.count[tier];
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
    const points = new Points(pGeo, pMat);
    const lPos = new Float32Array(HERO.network.maxLinks * 6);
    const lGeo = new BufferGeometry();
    lGeo.setAttribute('position', new BufferAttribute(lPos, 3));
    lGeo.setDrawRange(0, 0);
    const lMat = lightAdditive(new LineBasicMaterial({ color: COLORS.accent, opacity: 0.26, fog: true }));
    return { n, base, pos, phase, points, pGeo, pMat, lPos, lGeo, lMat };
  }, [tier, textures.dot]);
  useEffect(() => () => { net.pGeo.dispose(); net.pMat.dispose(); net.lGeo.dispose(); net.lMat.dispose(); }, [net]);

  // Dissolve: particles sampled on the crystal's faces that pour downward on scroll.
  const dissolve = useMemo(() => {
    const n = HERO.dissolve.count[tier];
    const r = rng(23);
    const src = crystalGeo.attributes.position.array as ArrayLike<number>;
    const faces = src.length / 9;
    const base = new Float32Array(n * 3);
    const dir = new Float32Array(n * 3);
    const speed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const f = Math.floor(r() * faces) * 9;
      let a = r(), b = r(); if (a + b > 1) { a = 1 - a; b = 1 - b; }
      for (let k = 0; k < 3; k++) {
        base[i * 3 + k] = src[f + k] + (src[f + 3 + k] - src[f + k]) * a + (src[f + 6 + k] - src[f + k]) * b;
      }
      tmpV.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]).normalize();
      dir[i * 3] = tmpV.x; dir[i * 3 + 1] = tmpV.y; dir[i * 3 + 2] = tmpV.z;
      speed[i] = 0.55 + r() * 0.9;
    }
    const pos = new Float32Array(base);
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    const mat = lightAdditive(new PointsMaterial({ map: textures.dot, color: COLORS.mint, size: 0.05, sizeAttenuation: true, opacity: 0 }));
    const points = new Points(geo, mat);
    points.visible = false;
    return { n, base, dir, speed, pos, geo, mat, points };
  }, [tier, crystalGeo, textures.dot]);
  useEffect(() => () => { dissolve.geo.dispose(); dissolve.mat.dispose(); }, [dissolve]);


  // Rings: tubes along circles in their own plane; trail + draw-in in the shader.
  const ringGeos = useMemo(() => HERO.rings.map((r) => {
    const pts = Array.from({ length: 96 }, (_, i) => { const a = (i / 96) * Math.PI * 2; return new Vector3(Math.cos(a) * r.radius, Math.sin(a) * r.radius, 0); });
    return new TubeGeometry(new CatmullRomCurve3(pts, true), 360, r.tube, tier === 2 ? 10 : 6, true);
  }), [tier]);
  const ringMats = useMemo(() => HERO.rings.map(() => createRingMaterial()), []);
  const packetMat = useMemo(() => lightAdditive(new SpriteMaterial({ map: textures.packet, toneMapped: false })), [textures.packet]);
  const glowMat = useMemo(() => lightAdditive(new SpriteMaterial({ map: textures.glow, toneMapped: false })), [textures.glow]);
  useEffect(() => () => { ringGeos.forEach((g) => g.dispose()); ringMats.forEach((m) => m.dispose()); packetMat.dispose(); glowMat.dispose(); }, [ringGeos, ringMats, packetMat, glowMat]);

  // Glass devices with live screens.
  const live = useMemo(() => HERO.panels.items.map((p, i) => new LivePanel(p.kind, i, tier === 2 ? 1 : 0.75)), [tier]);
  const screenMats = useMemo(() => live.map((lp) => new MeshBasicMaterial({ map: lp.texture, transparent: true, depthWrite: false, toneMapped: false })), [live]);
  const glassMat = useMemo(() => new MeshPhysicalMaterial({
    color: HERO.panels.tint, roughness: HERO.panels.roughness, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12,
    transmission: high ? HERO.panels.transmission : 0, thickness: 0.4, ior: 1.45,
    transparent: true, opacity: high ? 1 : 0.38, envMapIntensity: HERO.panels.envIntensity,
    attenuationColor: new Color(COLORS.accent), attenuationDistance: 2.5,
  }), [high]);
  useEffect(() => () => { live.forEach((l) => l.dispose()); screenMats.forEach((m) => m.dispose()); glassMat.dispose(); }, [live, screenMats, glassMat]);

  // Floor.
  const gridMat = useMemo(() => createGridMaterial(), []);
  useEffect(() => () => gridMat.dispose(), [gridMat]);

  // ---------------------------------------------------------------- frame loop
  const eased = useRef({ p: 0, px: 0, py: 0, tx: 0, ty: 0, lx: 0, ly: 0 });
  useFrame((state, delta) => {
    // Never render into a zero-sized view (route transitions): the transmission pass would
    // allocate a 0×0 render target ("framebuffer incomplete").
    const tr0 = track.getBoundingClientRect();
    if (root.current) root.current.visible = tr0.width > 2 && tr0.height > 2;
    if (!root.current?.visible) return;
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    if (born.current === null) born.current = t;
    const age = t - born.current; // seconds since the scene first rendered (draw-in)
    const e = eased.current;
    const L = layout.current;
    e.p = MathUtils.damp(e.p, sectionProgress.hero ?? 0, 7, dt);
    const p = e.p;
    const pe = p * p * (3 - 2 * p);
    theme.tick(dt); // hero stays cinematic-dark in both themes

    e.px = MathUtils.damp(e.px, mouse.x, HERO.parallaxDamping, dt);
    e.py = MathUtils.damp(e.py, mouse.y, HERO.parallaxDamping, dt);

    // Camera: parallax + scroll dolly toward the core.
    const c = camera;
    if (c) {
      const z = HERO.cameraZ * (1 - (1 - HERO.dollyTo) * pe);
      c.position.set(L.x * pe * 0.9 + e.px * HERO.parallax, L.y * pe * 0.9 + e.py * HERO.parallax * 0.6 + 0.35, z);
      c.lookAt(L.x * pe * 0.9, L.y * pe * 0.9 - 0.15, 0);
    }

    const g = root.current;
    if (g) {
      g.position.set(L.x, L.y, 0);
      g.scale.setScalar(L.s);
      g.rotation.y = e.px * 0.12;
      g.rotation.x = -e.py * 0.05;
    }

    // Crystal (glass + edges) and heartbeat core.
    const cr = crystal.current;
    if (cr) {
      e.tx = MathUtils.damp(e.tx, -e.py * HERO.crystalTilt, 3, dt);
      e.ty = MathUtils.damp(e.ty, e.px * HERO.crystalTilt, 3, dt);
      cr.rotation.set(t * HERO.spin.crystal * 0.6 + e.tx, t * HERO.spin.crystal + e.ty, 0);
      const s = Math.max(0.001, 1 - pe * 0.92);
      cr.scale.setScalar(s * (0.94 + 0.06 * Math.min(1, age / 1.2)));
      cr.visible = s > 0.02;
    }
    edges.mat.uniforms.uTime.value = t;
    edges.mat.uniforms.uFade.value = (1 - pe) * Math.min(1, age / 0.8);
    const hb = heartbeat(t, HERO.crystal.core.bpm);
    const { emissiveMin, emissiveMax } = HERO.crystal.core;
    coreMat.emissiveIntensity = emissiveMin + (emissiveMax - emissiveMin) * hb;
    if (core.current) {
      core.current.rotation.set(t * HERO.crystal.core.spin * 0.7, t * HERO.crystal.core.spin, 0);
      core.current.scale.setScalar(Math.max(0.001, (1 - pe)) * (1 + hb * 0.06));
    }
    if (glow.current) {
      glow.current.scale.setScalar(HERO.crystal.radius * HERO.coreGlow.size * (1 + hb * 0.25) * (1 - pe * 0.6));
      glowMat.opacity = (0.55 + hb * 0.45) * (1 - pe * 0.7);
    }

    // Rings: draw in on load, trail heads travel, packets ride along.
    HERO.rings.forEach((r, i) => {
      const grp = ringGroups.current[i];
      const m = ringMats[i];
      const draw = MathUtils.clamp((age - 0.15 - i * HERO.ringStagger) / HERO.ringDrawIn, 0, 1);
      m.uniforms.uDraw.value = 1 - Math.pow(1 - draw, 3);
      m.uniforms.uHead.value = ((t * r.speed) % 1 + 1) % 1;
      m.uniforms.uFade.value = 1 - pe;
      if (grp) grp.scale.setScalar(1 + pe * (0.35 + i * 0.15));
      packets.current[i].forEach((sp, k) => {
        if (!sp) return;
        const a = (t * r.packets[k] + k / r.packets.length) * Math.PI * 2;
        sp.position.set(Math.cos(a) * r.radius, Math.sin(a) * r.radius, 0);
        const frac = (((a / (Math.PI * 2)) % 1) + 1) % 1;
        sp.visible = frac <= m.uniforms.uDraw.value && pe < 0.95;
        sp.scale.setScalar(HERO.packetSize * (1 + 0.2 * Math.sin(t * 6 + k)));
      });
    });
    packetMat.opacity = 1 - pe;

    // Glass devices: own bob/sway at fixed depths & angles; fly out on scroll; live screens.
    const fps = HERO.panels.fps[tier];
    HERO.panels.items.forEach((it, i) => {
      const grp = panels.current[i];
      live[i].update(t, fps);
      if (!grp) return;
      const [bx, bs] = it.bob;
      const intro = MathUtils.clamp((age - 0.4 - i * 0.15) / 1.1, 0, 1);
      const k = 1 + HERO.panels.flyOut * pe;
      grp.position.set(it.pos[0] * k, it.pos[1] * (1 + pe * 0.6) + Math.sin(t * bs + i * 1.7) * bx - (1 - intro) * 0.4, it.pos[2] * (1 + pe * 0.4));
      grp.rotation.set(it.rot[0] + Math.sin(t * bs * 0.7 + i) * 0.04, it.rot[1] + Math.sin(t * bs * 0.5 + i * 2) * 0.06, it.rot[2]);
      const fade = Math.pow(1 - pe, 1.6) * (1 - Math.pow(1 - intro, 2));
      screenMats[i].opacity = fade;
      grp.visible = fade > 0.01;
    });
    glassMat.opacity = (high ? 1 : 0.38) * Math.pow(1 - pe, 1.6);

    // Floor.
    gridMat.uniforms.uTime.value = t;
    gridMat.uniforms.uFade.value = (1 - pe * 0.8) * Math.min(1, age / 1.5);

    // Network drift + links.
    const N = net;
    const drift = HERO.network.drift;
    for (let i = 0; i < N.n; i++) {
      const ph = N.phase[i];
      N.pos[i * 3] = N.base[i * 3] + Math.sin(t * drift + ph) * 0.12;
      N.pos[i * 3 + 1] = N.base[i * 3 + 1] + Math.cos(t * drift * 1.3 + ph) * 0.1;
      N.pos[i * 3 + 2] = N.base[i * 3 + 2] + Math.sin(t * drift * 0.7 + ph * 2) * 0.1;
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
    if (netGroup.current) netGroup.current.rotation.y += HERO.spin.network * dt;
    N.pMat.opacity = 1 - pe * 0.85;
    N.lMat.opacity = 0.26 * (1 - pe);

    // Dissolve particles pour down into the next section.
    const D = dissolve;
    if (pe > 0.01) {
      D.points.visible = true;
      const flow = HERO.dissolve.flow, spread = HERO.dissolve.spread;
      for (let i = 0; i < D.n; i++) {
        const k = pe * D.speed[i];
        const sway = Math.sin(t * 0.8 + i) * 0.05 * pe;
        D.pos[i * 3] = D.base[i * 3] * (1 - pe * 0.5) + D.dir[i * 3] * k * spread + sway;
        D.pos[i * 3 + 1] = D.base[i * 3 + 1] * (1 - pe * 0.5) - k * k * flow;
        D.pos[i * 3 + 2] = D.base[i * 3 + 2] * (1 - pe * 0.5) + D.dir[i * 3 + 2] * k * spread * 0.6;
      }
      (D.geo.attributes.position as BufferAttribute).needsUpdate = true;
      D.mat.opacity = Math.min(1, pe * 3) * (1 - Math.max(0, (pe - 0.7) / 0.3));
    } else {
      D.points.visible = false;
    }

    // Cursor light: the facets nearest the pointer catch light.
    const lt = cursorLight.current;
    if (lt && c) {
      const tr = track.getBoundingClientRect();
      const nx = ((mouse.clientX - tr.left) / tr.width) * 2 - 1;
      const ny = -(((mouse.clientY - tr.top) / tr.height) * 2 - 1);
      tmpV.set(nx, ny, 0.5).unproject(c);
      tmpDir.copy(tmpV).sub(c.position).normalize();
      const planeZ = 1.4;
      const k = (planeZ - c.position.z) / tmpDir.z;
      tmpV.copy(c.position).addScaledVector(tmpDir, k);
      if (g) g.worldToLocal(tmpV);
      e.lx = MathUtils.damp(e.lx, tmpV.x, 6, dt);
      e.ly = MathUtils.damp(e.ly, tmpV.y, 6, dt);
      lt.position.set(e.lx, e.ly, planeZ);
      lt.intensity = mouse.active ? HERO.crystal.cursorLight.intensity * (1 - pe) : MathUtils.damp(lt.intensity, 0, 2, dt);
    }


    if (first.current) {
      first.current = false;
      // Cross-fade: poster out, live canvas in (see .kz-hero-stage[data-ready]); the flat CSS grid
      // hands over to the 3D floor (#hero[data-kz3d]).
      requestAnimationFrame(() => { stage?.setAttribute('data-ready', 'true'); if (section) section.dataset.kz3d = 'ready'; });
    }
  });

  useEffect(() => () => { stage?.setAttribute('data-ready', 'false'); if (section) delete section.dataset.kz3d; }, [stage, section]);

  const { depth, corner } = HERO.panels;
  const reflector = HERO.floor.reflector;

  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[-3.5, 4.5, 4]} intensity={1.6} color="#F3FFF9" />
      <pointLight position={[3.2, 0.6, 1.2]} intensity={18} distance={12} color={COLORS.accent} />
      <pointLight position={[0, 2.5, -3.5]} intensity={10} distance={12} color="#2DD4BF" />

      <group ref={root}>
        <pointLight ref={cursorLight} intensity={0} distance={HERO.crystal.cursorLight.distance} color={COLORS.ice} />

        {/* Core glow (bloom stand-in: per-view post-processing isn't possible with drei Views). */}
        <sprite ref={glow} material={glowMat} position={[0, 0, -0.4]} renderOrder={-1} />

        <group ref={crystal}>
          <mesh ref={core} geometry={coreGeo} material={coreMat} />
          <mesh geometry={crystalGeo} renderOrder={1}>
            <primitive object={high ? glassHigh : glassLite} attach="material" />
          </mesh>
          <primitive object={edges.mesh} renderOrder={2} />
        </group>

        {HERO.rings.map((r, i) => (
          <group key={i} ref={(el) => { ringGroups.current[i] = el; }} rotation={[r.rx, r.ry, 0]}>
            <mesh geometry={ringGeos[i]} material={ringMats[i]} renderOrder={3} />
            {r.packets.map((_, k) => (
              <sprite key={k} ref={(el) => { packets.current[i][k] = el; }} material={packetMat} renderOrder={4} />
            ))}
          </group>
        ))}

        {HERO.panels.items.map((it, i) => (
          <group key={i} ref={(el) => { panels.current[i] = el; }} position={it.pos} rotation={it.rot}>
            <RoundedBox args={[it.size[0], it.size[1], depth]} radius={corner} smoothness={4} material={glassMat} />
            <mesh position={[0, 0, depth / 2 + 0.004]} material={screenMats[i]} renderOrder={5}>
              <planeGeometry args={[it.size[0] * 0.98, it.size[1] * 0.98]} />
            </mesh>
          </group>
        ))}

        <group ref={floor} position={[0, HERO.floor.y, 0]}>
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

        <group ref={netGroup}>
          <primitive object={net.points} frustumCulled={false} />
          <lineSegments geometry={net.lGeo} material={net.lMat} frustumCulled={false} />
        </group>
        <primitive object={dissolve.points} frustumCulled={false} />
      </group>
    </>
  );
}
