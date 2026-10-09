/**
 * HERO — "The Core".
 * A faceted crystal (real refraction on capable GPUs) holds a machined emerald
 * core; three thin orbital rings and translucent UI panels (dashboards, mobile
 * screens) circle it inside a living network of connected nodes —
 * "Design · Build · Scale" and "Connected Systems" made literal.
 *
 * Scroll (scrubbed): the camera dives toward the core, the panels fly outward,
 * and the crystal dissolves into particles that pour down into the next section.
 * Mouse: damped camera parallax, crystal tilt, and a cursor light that makes
 * the facets nearest the pointer catch light.
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, PerspectiveCamera } from '@react-three/drei';
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Color, Group, IcosahedronGeometry, LineBasicMaterial,
  MathUtils, Mesh, MeshBasicMaterial, PerspectiveCamera as PCam, PMREMGenerator, PointLight, Points,
  PointsMaterial, Vector3, DoubleSide,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { COLORS, HERO } from '../config';
import { mouse } from '../hooks/useMouse';
import { useThemeBlend } from '../hooks/useThemeBlend';
import { sectionProgress } from '../../../lib/scrollStore';
import { dashboardTexture, dotTexture, glowTexture, mobileTexture } from '../materials/textures';
import type { Quality } from '../Experience';

const tmpV = new Vector3();
const tmpDir = new Vector3();

/** Deterministic PRNG so the composition is identical on every load. */
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function HeroScene({ track, quality }: { track: HTMLElement; quality: Quality }) {
  const { gl, scene } = useThree();
  const stage = useMemo(() => track.closest('section')?.querySelector<HTMLElement>('.kz-hero-stage') ?? null, [track]);
  const tier = quality.tier;
  const lite = quality.lite;

  const cam = useRef<PCam>(null);
  const root = useRef<Group>(null);
  const crystal = useRef<Mesh>(null);
  const inner = useRef<Mesh>(null);
  const rings = useRef<(Mesh | null)[]>([]);
  const panels = useRef<(Mesh | null)[]>([]);
  const glow = useRef<Mesh>(null);
  const netGroup = useRef<Group>(null);
  const cursorLight = useRef<PointLight>(null);
  const theme = useThemeBlend();
  const first = useRef(true);

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

  // Image-based lighting for believable reflections (no HDR download).
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    scene.environmentIntensity = 0.8;
    return () => { scene.environment = null; env.dispose(); pmrem.dispose(); };
  }, [gl, scene]);

  // ---------------------------------------------------------------- assets
  const textures = useMemo(() => ({ dash: dashboardTexture(), mob: mobileTexture(), dot: dotTexture(), glow: glowTexture() }), []);
  useEffect(() => () => Object.values(textures).forEach((t) => t.dispose()), [textures]);

  const crystalGeo = useMemo(() => new IcosahedronGeometry(HERO.crystal.radius, 0), []);
  const innerGeo = useMemo(() => new IcosahedronGeometry(HERO.crystal.radius * 0.46, 0), []);
  useEffect(() => () => { crystalGeo.dispose(); innerGeo.dispose(); }, [crystalGeo, innerGeo]);

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
    const pMat = new PointsMaterial({ map: textures.dot, color: COLORS.mint, size: HERO.network.pointSize, sizeAttenuation: true, transparent: true, depthWrite: false, blending: AdditiveBlending, fog: true });
    const points = new Points(pGeo, pMat);
    const lPos = new Float32Array(HERO.network.maxLinks * 6);
    const lGeo = new BufferGeometry();
    lGeo.setAttribute('position', new BufferAttribute(lPos, 3));
    lGeo.setDrawRange(0, 0);
    const lMat = new LineBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0.26, depthWrite: false, blending: AdditiveBlending, fog: true });
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
    const mat = new PointsMaterial({ map: textures.dot, color: COLORS.mint, size: 0.05, sizeAttenuation: true, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
    const points = new Points(geo, mat);
    points.visible = false;
    return { n, base, dir, speed, pos, geo, mat, points };
  }, [tier, crystalGeo, textures.dot]);
  useEffect(() => () => { dissolve.geo.dispose(); dissolve.mat.dispose(); }, [dissolve]);

  const panelMats = useMemo(() => HERO.panels.items.map((p) => new MeshBasicMaterial({
    map: p.kind === 'dashboard' ? textures.dash : textures.mob, transparent: true, opacity: HERO.panels.opacity, depthWrite: false, side: DoubleSide,
  })), [textures]);
  useEffect(() => () => panelMats.forEach((m) => m.dispose()), [panelMats]);

  const ringMat = useMemo(() => new MeshBasicMaterial({ color: COLORS.mint, transparent: true, opacity: 0.9, toneMapped: false }), []);
  const glowMat = useMemo(() => new MeshBasicMaterial({ map: textures.glow, transparent: true, depthWrite: false, blending: AdditiveBlending, toneMapped: false }), [textures.glow]);
  useEffect(() => () => { ringMat.dispose(); glowMat.dispose(); }, [ringMat, glowMat]);

  const fogColor = useMemo(() => new Color(COLORS.fogDark), []);
  const fogDark = useMemo(() => new Color(COLORS.fogDark), []);
  const fogLight = useMemo(() => new Color(COLORS.fogLight), []);

  // ---------------------------------------------------------------- frame loop
  const eased = useRef({ p: 0, px: 0, py: 0, tx: 0, ty: 0, lx: 0, ly: 0 });
  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    const e = eased.current;
    const L = layout.current;
    // Scroll progress, lightly damped so scrubbing feels weighty rather than mechanical.
    e.p = MathUtils.damp(e.p, sectionProgress.hero ?? 0, 7, dt);
    const p = e.p;
    const pe = p * p * (3 - 2 * p); // smoothstep

    // Theme: hero is cinematic-dark in both themes; light theme only lifts the atmosphere a touch.
    const th = theme.tick(dt);
    fogColor.copy(fogDark).lerp(fogLight, th);
    if (scene.fog) (scene.fog as unknown as { color: Color }).color.copy(fogColor);

    // Mouse (damped, never snappy).
    e.px = MathUtils.damp(e.px, mouse.x, HERO.parallaxDamping, dt);
    e.py = MathUtils.damp(e.py, mouse.y, HERO.parallaxDamping, dt);

    // Camera: parallax + scroll dolly toward the core.
    const c = cam.current;
    if (c) {
      const z = HERO.cameraZ * (1 - (1 - HERO.dollyTo) * pe);
      c.position.set(L.x * pe * 0.9 + e.px * HERO.parallax, L.y * pe * 0.9 + e.py * HERO.parallax * 0.6, z);
    }

    // Composition placed on the poster stage.
    const g = root.current;
    if (g) {
      g.position.set(L.x, L.y, 0);
      g.scale.setScalar(L.s);
      g.rotation.y = e.px * 0.12;
      g.rotation.x = -e.py * 0.06;
    }

    // Crystal + inner core.
    const cr = crystal.current;
    if (cr) {
      e.tx = MathUtils.damp(e.tx, -e.py * HERO.crystalTilt, 3, dt);
      e.ty = MathUtils.damp(e.ty, e.px * HERO.crystalTilt, 3, dt);
      cr.rotation.set(t * HERO.spin.crystal * 0.6 + e.tx, t * HERO.spin.crystal + e.ty, 0);
      const s = Math.max(0.001, 1 - pe * 0.92);
      cr.scale.setScalar(s);
      cr.visible = s > 0.02;
    }
    if (inner.current) {
      inner.current.rotation.set(-t * 0.3, t * 0.42, 0);
      inner.current.scale.setScalar(Math.max(0.001, 1 - pe));
    }
    if (glow.current) {
      glow.current.scale.setScalar(5.2 * (1 - pe * 0.6));
      (glow.current.material as MeshBasicMaterial).opacity = 0.9 * (1 - pe * 0.7);
    }

    // Rings.
    rings.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.z += HERO.spin.rings[i] * dt;
      m.scale.setScalar(1 + pe * (0.35 + i * 0.15));
    });
    ringMat.opacity = 0.9 * (1 - pe);

    // Panels: orbit, face the camera, fly outward and fade on scroll.
    panels.current.forEach((m, i) => {
      if (!m) return;
      const it = HERO.panels.items[i];
      const a = it.phase + t * HERO.spin.panels;
      const R = it.radius * (1 + HERO.panels.flyOut * pe);
      m.position.set(Math.cos(a) * R, it.y * (1 + pe * 0.8), Math.sin(a) * R * 0.55);
      if (c) m.quaternion.copy(c.quaternion);
      m.rotateY(Math.sin(a) * 0.35);
      panelMats[i].opacity = HERO.panels.opacity * Math.pow(1 - pe, 1.6) * (0.55 + 0.45 * (0.5 + 0.5 * Math.sin(a)));
    });

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
      // Cross-fade: poster out, live canvas in (see .kz-hero-stage[data-ready]).
      requestAnimationFrame(() => stage?.setAttribute('data-ready', 'true'));
    }
  });

  useEffect(() => () => { stage?.setAttribute('data-ready', 'false'); }, [stage]);

  const useTransmission = tier === 2 && !lite;

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={HERO.fov} position={[0, 0, HERO.cameraZ]} near={0.1} far={40} />
      <fog attach="fog" args={[COLORS.fogDark, 7, 15]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3.5, 4.5, 5]} intensity={2.1} color="#F3FFF9" />
      <pointLight position={[-2.6, 1.4, -2.8]} intensity={26} distance={14} color={COLORS.accent} />
      <pointLight position={[1.8, -2.2, 1.5]} intensity={8} distance={10} color={COLORS.primary} />

      <group ref={root}>
        <pointLight ref={cursorLight} intensity={0} distance={HERO.crystal.cursorLight.distance} color={COLORS.ice} />

        <mesh ref={glow} position={[0, 0, -1.6]} material={glowMat} renderOrder={-1}>
          <planeGeometry args={[1, 1]} />
        </mesh>

        <mesh ref={inner} geometry={innerGeo}>
          <meshPhysicalMaterial color={COLORS.primary} metalness={1} roughness={0.25} clearcoat={0.6} flatShading envMapIntensity={1.1} />
        </mesh>

        <mesh ref={crystal} geometry={crystalGeo}>
          {useTransmission ? (
            <MeshTransmissionMaterial
              {...HERO.crystal.transmission}
              transmission={1}
              flatShading
              color={COLORS.ice}
              attenuationColor={COLORS.accent}
              attenuationDistance={2.2}
              background={new Color(COLORS.heroBg)}
              backside={false}
            />
          ) : (
            <meshPhysicalMaterial
              color={COLORS.mint}
              metalness={0.15}
              roughness={0.08}
              transparent
              opacity={0.42}
              clearcoat={1}
              clearcoatRoughness={0.05}
              flatShading
              envMapIntensity={1.4}
            />
          )}
        </mesh>

        {HERO.rings.map((r, i) => (
          <mesh key={i} ref={(m) => { rings.current[i] = m; }} rotation={[r.rx, r.ry, 0]} material={ringMat}>
            <torusGeometry args={[r.radius, r.tube, 8, 220]} />
          </mesh>
        ))}

        {HERO.panels.items.map((it, i) => (
          <mesh key={i} ref={(m) => { panels.current[i] = m; }} material={panelMats[i]} renderOrder={2}>
            <planeGeometry args={[it.size[0], it.size[1]]} />
          </mesh>
        ))}

        <group ref={netGroup}>
          <primitive object={net.points} frustumCulled={false} />
          <lineSegments geometry={net.lGeo} material={net.lMat} frustumCulled={false} />
        </group>
        <primitive object={dissolve.points} frustumCulled={false} />
      </group>
    </>
  );
}
