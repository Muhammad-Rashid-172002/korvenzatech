/**
 * TECH — "Orbit of Tools".
 * The stack as a slowly turning sphere of logo sprites around a glowing core.
 * Spin speeds up with scroll velocity. Hover a logo: it grows and takes its
 * brand colour, the rest dim, and a small tooltip names it. The same names are
 * always listed in the DOM next to it (this is decoration, never the only source).
 * AWS is a styled text sprite (no unofficial AWS logo).
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { AdditiveBlending, CanvasTexture, Color, Group, MathUtils, Raycaster, Sprite, SpriteMaterial, SRGBColorSpace, Vector2, Vector3 } from 'three';
import {
  siDocker, siFastapi, siFirebase, siFlutter, siGooglecloud, siNextdotjs, siNodedotjs,
  siPostgresql, siPython, siReact, siTailwindcss, siTypescript, type SimpleIcon,
} from 'simple-icons';
import { COLORS, ORBIT } from '../config';
import { useThemeBlend } from '../hooks/useThemeBlend';
import { scrollStore } from '../../../lib/scrollStore';
import { glowTexture } from '../materials/textures';
import type { Quality } from '../Experience';

type Tool = { name: string; group: string; icon?: SimpleIcon; text?: string; hex: string };

// Every entry appears in the stack lists on the page (companyData TECH_STACK / "Built with" list).
const TOOLS: Tool[] = [
  { name: 'Flutter', group: 'Mobile', icon: siFlutter, hex: siFlutter.hex },
  { name: 'React', group: 'Web', icon: siReact, hex: siReact.hex },
  { name: 'Next.js', group: 'Web', icon: siNextdotjs, hex: 'FFFFFF' },
  { name: 'TypeScript', group: 'Web', icon: siTypescript, hex: siTypescript.hex },
  { name: 'Tailwind CSS', group: 'UI', icon: siTailwindcss, hex: siTailwindcss.hex },
  { name: 'Node.js', group: 'Backend', icon: siNodedotjs, hex: siNodedotjs.hex },
  { name: 'Python', group: 'AI engine', icon: siPython, hex: siPython.hex },
  { name: 'FastAPI', group: 'APIs', icon: siFastapi, hex: siFastapi.hex },
  { name: 'Firebase', group: 'Cloud DB', icon: siFirebase, hex: siFirebase.hex },
  { name: 'PostgreSQL', group: 'Database', icon: siPostgresql, hex: siPostgresql.hex },
  { name: 'Google Cloud', group: 'Cloud', icon: siGooglecloud, hex: siGooglecloud.hex },
  { name: 'AWS', group: 'Cloud', text: 'AWS', hex: 'FF9900' },
  { name: 'Docker', group: 'Containers', icon: siDocker, hex: siDocker.hex },
];

/** White glyph on transparent — tinted per frame through the sprite colour. */
function glyphTexture(tool: Tool) {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  g.fillStyle = '#fff';
  if (tool.icon) {
    g.translate(s * 0.14, s * 0.14);
    g.scale((s * 0.72) / 24, (s * 0.72) / 24);
    g.fill(new Path2D(tool.icon.path));
  } else {
    g.font = `800 ${s * 0.36}px Inter, system-ui, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(tool.text ?? tool.name, s / 2, s * 0.47);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const tmp = new Vector3();
const DIM_DARK = new Color(COLORS.mint);
const DIM_LIGHT = new Color(COLORS.primary);
const TMP_C = new Color();
const BRAND = new Color();

export function OrbitScene({ track, quality }: { track: HTMLElement; quality: Quality }) {
  const stage = useMemo(() => track.closest<HTMLElement>('.kz-orbit-stage'), [track]);
  const tip = useMemo(() => stage?.querySelector<HTMLElement>('.kz-orbit-tip') ?? null, [stage]);
  const spin = useRef<Group>(null);
  const sprites = useRef<(Sprite | null)[]>([]);
  const onScreen = useRef(false);
  // Hover is ray-cast here every frame (drei View only routes R3F events to a track element
  // that is itself the event target, and logos keep moving under a still cursor anyway).
  const hoverRef = useRef(-1);
  const pointer = useRef({ v: new Vector2(), inside: false });
  const raycaster = useMemo(() => new Raycaster(), []);
  const level = useRef<number[]>(TOOLS.map(() => 0));
  const speed = useRef<number>(ORBIT.baseSpeed);
  const theme = useThemeBlend();
  const ready = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { onScreen.current = e.isIntersecting; });
    io.observe(track);
    return () => io.disconnect();
  }, [track]);
  useEffect(() => () => { if (stage) stage.dataset.ready = 'false'; if (tip) tip.dataset.show = 'false'; }, [stage, tip]);
  useEffect(() => {
    if (!stage) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = track.getBoundingClientRect();
      pointer.current.v.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      pointer.current.inside = true;
    };
    const leave = () => { pointer.current.inside = false; };
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', leave);
    return () => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', leave); };
  }, [stage, track]);

  // Even distribution on a sphere (Fibonacci lattice).
  const positions = useMemo(() => TOOLS.map((_, i) => {
    const y = 1 - ((i + 0.5) / TOOLS.length) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * Math.PI * (3 - Math.sqrt(5));
    return new Vector3(Math.cos(th) * r, y * 0.92, Math.sin(th) * r).multiplyScalar(ORBIT.radius);
  }), []);
  const mats = useMemo(() => TOOLS.map((t) => new SpriteMaterial({ map: glyphTexture(t), transparent: true, depthWrite: false, toneMapped: false })), []);
  const glow = useMemo(() => {
    const map = glowTexture();
    return { map, mat: new SpriteMaterial({ map, blending: AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.9 }) };
  }, []);
  useEffect(() => () => { mats.forEach((m) => { m.map?.dispose(); m.dispose(); }); glow.map.dispose(); glow.mat.dispose(); }, [mats, glow]);

  const all = useRef<Group>(null);
  useFrame((state, delta) => {
    // Stay hidden until the stage's scroll-in reveal has happened.
    if (all.current) all.current.visible = !stage || stage.classList.contains('is-in') || !document.documentElement.classList.contains('kz-js');
    if (!onScreen.current || !spin.current) return;
    const dt = Math.min(delta, 0.05);
    const light = theme.tick(dt);

    // Spin follows scroll velocity (Lenis px/frame), damped back to the idle speed.
    const v = scrollStore.velocity || 0;
    const target = ORBIT.baseSpeed + MathUtils.clamp(v * ORBIT.scrollGain, -ORBIT.maxBoost, ORBIT.maxBoost);
    speed.current = MathUtils.damp(speed.current, hoverRef.current >= 0 ? target * 0.25 : target, 3, dt);
    spin.current.rotation.y += speed.current * dt;
    spin.current.rotation.x = MathUtils.damp(spin.current.rotation.x, 0.28 + state.pointer.y * 0.12, 2, dt);

    // Hover pick: nearest logo under the pointer.
    let picked = -1;
    if (pointer.current.inside) {
      raycaster.setFromCamera(pointer.current.v, state.camera);
      const hits = raycaster.intersectObjects(sprites.current.filter(Boolean) as Sprite[], false);
      if (hits.length) picked = sprites.current.indexOf(hits[0].object as Sprite);
    }
    if (picked !== hoverRef.current) {
      hoverRef.current = picked;
      if (tip) {
        if (picked >= 0) tip.textContent = `${TOOLS[picked].name} · ${TOOLS[picked].group}`;
        tip.dataset.show = picked >= 0 ? 'true' : 'false';
      }
    }

    const dim = TMP_C.copy(DIM_DARK).lerp(DIM_LIGHT, light);
    const h = hoverRef.current;
    for (let i = 0; i < TOOLS.length; i++) {
      const s = sprites.current[i];
      if (!s) continue;
      s.getWorldPosition(tmp);
      const depth = MathUtils.clamp((tmp.z + ORBIT.radius) / (2 * ORBIT.radius), 0, 1); // 0 back → 1 front
      level.current[i] = MathUtils.damp(level.current[i], i === h ? 1 : 0, 10, dt);
      const lv = level.current[i];
      const m = mats[i];
      BRAND.set(`#${TOOLS[i].hex}`);
      if (TOOLS[i].hex.toUpperCase() === 'FFFFFF' && light > 0.5) BRAND.set('#111111');
      m.color.copy(dim).lerp(BRAND, lv);
      const others = h >= 0 && i !== h ? ORBIT.dimOthers : 1;
      m.opacity = MathUtils.lerp(0.28, 1, depth) * others;
      s.scale.setScalar(ORBIT.iconSize * (1 + lv * 0.45));
    }
    glow.mat.opacity = (0.75 + Math.sin(state.clock.elapsedTime * 1.4) * 0.12) * (1 - light * 0.75);

    // Tooltip follows the hovered logo.
    if (tip && h >= 0 && sprites.current[h]) {
      sprites.current[h]!.getWorldPosition(tmp).project(state.camera);
      const r = track.getBoundingClientRect();
      const sr = stage!.getBoundingClientRect();
      const x = (tmp.x * 0.5 + 0.5) * r.width + (r.left - sr.left);
      const y = (-tmp.y * 0.5 + 0.5) * r.height + (r.top - sr.top);
      tip.style.transform = `translate(${x.toFixed(1)}px, ${(y - 42).toFixed(1)}px) translate(-50%, -100%)`;
    }

    if (!ready.current) { ready.current = true; requestAnimationFrame(() => { if (stage) stage.dataset.ready = 'true'; }); }
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={ORBIT.fov} position={[0, 0, ORBIT.cameraZ]} near={0.1} far={30} />
      <group ref={all}>
      <sprite material={glow.mat} scale={ORBIT.radius * 1.5} renderOrder={-1} />
      <group ref={spin}>
        {quality.tier === 2 && [0, 1, 2].map((k) => (
          <mesh key={k} rotation={[Math.PI / 2 + k * 0.6, k * 1.1, 0]}>
            <torusGeometry args={[ORBIT.radius * (1 - k * 0.04), 0.004, 6, 128]} />
            <meshBasicMaterial color={COLORS.accent} transparent opacity={0.22} toneMapped={false} depthWrite={false} />
          </mesh>
        ))}
        {TOOLS.map((t, i) => (
          <sprite
            key={t.name}
            ref={(el) => { sprites.current[i] = el; }}
            position={positions[i]}
            material={mats[i]}
            scale={ORBIT.iconSize}
          />
        ))}
      </group>
      </group>
    </>
  );
}
