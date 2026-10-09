/**
 * PROCESS — "The Journey".
 * A glowing path winds into depth through seven phase nodes. While the stage
 * is pinned, scroll flies the camera along the path: the travelled part lights
 * up, a pulse runs along it, and each node ignites as its phase becomes active.
 * Everything the user reads stays in the HTML; this is atmosphere only.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, Fog, Group, MathUtils, Mesh,
  MeshBasicMaterial, PerspectiveCamera as PCam, PointsMaterial, TubeGeometry, Vector3,
} from 'three';
import { COLORS, PROCESS } from '../config';
import { mouse } from '../hooks/useMouse';
import { useThemeBlend } from '../hooks/useThemeBlend';
import { sectionProgress } from '../../../lib/scrollStore';
import { dotTexture, glowTexture } from '../materials/textures';
import { createGlowTubeMaterial, setTubeTheme } from '../materials/GlowTube';
import type { Quality } from '../Experience';

const tmpA = new Vector3();
const tmpB = new Vector3();
const tmpC = new Vector3();
const DARK_NODE = new Color(COLORS.accent);
const LIGHT_NODE = new Color(COLORS.primary);
const DIM_DARK = new Color('#2A4A3E');
const DIM_LIGHT = new Color('#9DBDB0');
const NODE_C = new Color();
const DIM_C = new Color();

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function ProcessScene({ track, quality, steps = 7 }: { track: HTMLElement; quality: Quality; steps?: number }) {
  const { scene } = useThree();
  const tier = quality.tier;
  const cam = useRef<PCam>(null);
  const root = useRef<Group>(null);
  const nodes = useRef<(Group | null)[]>([]);
  const theme = useThemeBlend();
  const onScreen = useRef(false);
  const camU = useRef(0);
  const bgColor = useRef(new Color(COLORS.fogDark));

  // Only animate while the track is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { onScreen.current = e.isIntersecting; });
    io.observe(track);
    return () => io.disconnect();
  }, [track]);

  // Fog matches the section's real background so the far path melts into the page.
  useEffect(() => {
    const section = track.closest('section');
    const read = () => { if (section) bgColor.current.set(getComputedStyle(section).backgroundColor || COLORS.fogDark); };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    scene.fog = new Fog(bgColor.current.clone(), PROCESS.fog[0], PROCESS.fog[1]);
    return () => { mo.disconnect(); scene.fog = null; };
  }, [track, scene]);

  const path = useMemo(() => {
    const pts: Vector3[] = [new Vector3(-PROCESS.wanderX * 0.6, -0.3, PROCESS.nodeSpacing * 1.2)];
    for (let i = 0; i < steps; i++) {
      pts.push(new Vector3(Math.sin(i * 1.35 + 0.4) * PROCESS.wanderX, Math.cos(i * 0.95) * PROCESS.wanderY, -i * PROCESS.nodeSpacing));
    }
    pts.push(new Vector3(0, 0.2, -(steps + 0.8) * PROCESS.nodeSpacing));
    const curve = new CatmullRomCurve3(pts, false, 'centripetal');
    // Arc-length position (0..1) of every node — TubeGeometry's uv.x is arc-length.
    const div = 2000;
    const lengths = curve.getLengths(div);
    const total = lengths[div];
    const nodeU = Array.from({ length: steps }, (_, i) => lengths[Math.round(((i + 1) / (pts.length - 1)) * div)] / total);
    return { curve, nodeU, nodePos: pts.slice(1, steps + 1) };
  }, [steps]);

  const tube = useMemo(() => new TubeGeometry(path.curve, PROCESS.tubeSegments[tier], PROCESS.tubeRadius, PROCESS.tubeSides[tier], false), [path, tier]);
  const halo = useMemo(() => new TubeGeometry(path.curve, Math.round(PROCESS.tubeSegments[tier] / 2), PROCESS.haloRadius, 8, false), [path, tier]);
  const tubeMat = useMemo(() => createGlowTubeMaterial({ bright: COLORS.accent, dim: '#3A8A6A', deep: COLORS.primary, opacity: 1 }), []);
  const haloMat = useMemo(() => createGlowTubeMaterial({ bright: COLORS.accent, dim: '#1D5A44', deep: '#0B6B4D', opacity: 0.35, halo: true }), []);
  const textures = useMemo(() => ({ dot: dotTexture(), glow: glowTexture() }), []);

  const dust = useMemo(() => {
    const n = PROCESS.dust[tier];
    const r = rng(23);
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      path.curve.getPointAt(r(), tmpA);
      pos[i * 3] = tmpA.x + (r() - 0.5) * 5;
      pos[i * 3 + 1] = tmpA.y + (r() - 0.5) * 3;
      pos[i * 3 + 2] = tmpA.z + (r() - 0.5) * 3;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    const mat = new PointsMaterial({ map: textures.dot, size: 0.05, sizeAttenuation: true, transparent: true, depthWrite: false, blending: AdditiveBlending, color: COLORS.mint, opacity: 0.55, toneMapped: false });
    return { geo, mat };
  }, [tier, path, textures]);

  const nodeMats = useMemo(() => Array.from({ length: steps }, () => ({
    core: new MeshBasicMaterial({ color: COLORS.accent, transparent: true, toneMapped: false }),
    ring: new MeshBasicMaterial({ color: COLORS.accent, transparent: true, toneMapped: false, depthWrite: false }),
    glow: new MeshBasicMaterial({ map: textures.glow, transparent: true, depthWrite: false, blending: AdditiveBlending, toneMapped: false }),
  })), [steps, textures]);

  useEffect(() => () => {
    tube.dispose(); halo.dispose(); tubeMat.dispose(); haloMat.dispose();
    dust.geo.dispose(); dust.mat.dispose();
    nodeMats.forEach((m) => { m.core.dispose(); m.ring.dispose(); m.glow.dispose(); });
    Object.values(textures).forEach((t) => t.dispose());
  }, [tube, halo, tubeMat, haloMat, dust, nodeMats, textures]);

  const nodeLevel = useRef<number[]>(Array(steps).fill(0));

  useFrame((state, delta) => {
    if (!onScreen.current || !cam.current) return;
    const dt = Math.min(delta, 0.05);
    const light = theme.tick(dt);
    const p = sectionProgress.process ?? 0;

    // Phase position along the path: phase i is "current" across the middle of its scroll band.
    const f = MathUtils.clamp(p * steps - 0.5, 0, steps - 1);
    const i0 = Math.floor(f);
    const i1 = Math.min(steps - 1, i0 + 1);
    const ease = MathUtils.smootherstep(f - i0, 0, 1);
    const targetU = MathUtils.lerp(path.nodeU[i0], path.nodeU[i1], ease);
    const startU = path.nodeU[0] * 0.55;
    const u = p <= 0 ? startU : targetU;
    camU.current = MathUtils.damp(camU.current, u, PROCESS.cameraDamp, dt);
    const cu = camU.current;

    // Camera: a 3/4 view just behind the current point, looking a little ahead.
    path.curve.getPointAt(MathUtils.clamp(cu, 0, 1), tmpA);
    path.curve.getPointAt(MathUtils.clamp(cu + PROCESS.lookAhead, 0, 1), tmpB);
    const [ox, oy, oz] = PROCESS.cameraOffset;
    tmpC.set(tmpA.x + ox + mouse.x * 0.35, tmpA.y + oy + mouse.y * 0.2, tmpA.z + oz);
    cam.current.position.lerp(tmpC, 1 - Math.exp(-6 * dt));
    cam.current.lookAt(tmpB);
    // Shift the projection so the current phase sits at PROCESS.screenX (behind the glass card).
    const c = cam.current;
    const fo = -(PROCESS.screenX * 2 - 1) * c.getFilmWidth() * Math.tan(MathUtils.degToRad(c.fov / 2)) * c.aspect;
    if (Math.abs(c.filmOffset - fo) > 0.01) { c.filmOffset = fo; c.updateProjectionMatrix(); }

    // Fade the whole scene in/out as the stage enters/leaves the viewport (no hard scissor edges).
    const r = track.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const fade = MathUtils.clamp(1.25 - Math.abs(r.top + r.height / 2 - vh / 2) / (vh * 0.55), 0, 1);

    // Path materials.
    const t = state.clock.elapsedTime * PROCESS.pulseSpeed;
    for (const m of [tubeMat, haloMat]) {
      m.uniforms.uProgress.value = cu;
      m.uniforms.uOpacity.value = (m === tubeMat ? 1 + light * 0.4 : 0.35 * (1 - light * 0.8)) * fade;
      m.uniforms.uTime.value = t;
      setTubeTheme(m, light);
    }
    dust.mat.opacity = 0.55 * (1 - light) * fade;
    dust.mat.visible = light < 0.98;

    // Nodes: ignite when reached, the current one pulses.
    const nodeColor = NODE_C.copy(DARK_NODE).lerp(LIGHT_NODE, light);
    const dimColor = DIM_C.copy(DIM_DARK).lerp(DIM_LIGHT, light);
    for (let i = 0; i < steps; i++) {
      const g = nodes.current[i];
      if (!g) continue;
      const reached = cu >= path.nodeU[i] - 0.004 ? 1 : 0;
      const current = Math.max(0, 1 - Math.abs(cu - path.nodeU[i]) * 22);
      nodeLevel.current[i] = MathUtils.damp(nodeLevel.current[i], reached, 5, dt);
      const lv = nodeLevel.current[i];
      const m = nodeMats[i];
      m.core.color.copy(dimColor).lerp(nodeColor, Math.max(lv, current));
      m.ring.color.copy(nodeColor);
      m.ring.opacity = (0.15 + lv * 0.45 + current * 0.4) * fade;
      m.glow.opacity = (0.15 + lv * 0.5 + current * 0.6) * (1 - light) * fade;
      m.core.opacity = fade;
      const s = 1 + current * (0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.06);
      g.scale.setScalar(s);
      g.quaternion.copy(cam.current.quaternion);
      const ring = g.children[1];
      if (ring) ring.rotation.z += dt * (0.3 + current);
    }

    if (scene.fog) (scene.fog as Fog).color.copy(bgColor.current);
    if (root.current) root.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.02;
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={PROCESS.fov} position={[0, 1, 6]} near={0.1} far={30} />
      <group ref={root}>
        <mesh geometry={halo} material={haloMat} renderOrder={1} />
        <mesh geometry={tube} material={tubeMat} renderOrder={2} />
        <points geometry={dust.geo} material={dust.mat} />
        {path.nodePos.map((pos, i) => (
          <group key={i} position={pos} ref={(el) => { nodes.current[i] = el; }}>
            <mesh material={nodeMats[i].core} renderOrder={3}>
              <sphereGeometry args={[PROCESS.nodeCore, 16, 12]} />
            </mesh>
            <mesh material={nodeMats[i].ring} renderOrder={3}>
              <ringGeometry args={[PROCESS.nodeRing, PROCESS.nodeRing * 1.1, 48, 1, 0, Math.PI * 1.6]} />
            </mesh>
            <mesh material={nodeMats[i].glow} renderOrder={0}>
              <planeGeometry args={[PROCESS.nodeGlow, PROCESS.nodeGlow]} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}
