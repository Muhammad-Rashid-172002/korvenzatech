/**
 * AI SHOWCASE — an "AI command center": three glass dashboard panels (support assistant,
 * workflow automation, document intelligence) floating in front of a live neural network.
 * Nodes pulse, data particles travel along the connections, and a workflow line lights up
 * from panel to panel. Panels drift independently; the camera eases toward the pointer.
 * Everything fades/flies in the first time the showcase becomes visible.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, Group, LineBasicMaterial, MathUtils,
  Mesh, MeshBasicMaterial, PerspectiveCamera as Cam, PlaneGeometry, ShaderMaterial, SRGBColorSpace, Texture, TextureLoader, TubeGeometry, Vector3,
} from 'three';
import { SHOWCASE } from '../config';
import { mouse } from '../hooks/useMouse';
import { createBackdropMaterial } from '../materials/PhoneScreen';
import { dotTexture } from '../materials/textures';
import type { Quality } from '../Experience';

const CFG = SHOWCASE.ai;
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

/** Deterministic pseudo-random (same network every load). */
function rng(seed: number) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

function buildNetwork(n: number) {
  const r = rng(7);
  const nodes: Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const front = i % 6 === 0; // a few nodes come forward around the panels
    nodes.push(new Vector3((r() * 2 - 1) * 3.6, (r() * 2 - 1) * 1.75, front ? -0.4 - r() * 0.8 : -1.6 - r() * 2.2));
  }
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  nodes.forEach((a, i) => {
    nodes.map((b, j) => [j, a.distanceToSquared(b)] as const).filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]).slice(0, 3)
      .forEach(([j]) => { const k = i < j ? `${i}-${j}` : `${j}-${i}`; if (!seen.has(k)) { seen.add(k); edges.push([i, j]); } });
  });
  return { nodes, edges };
}

const POINT_VS = /* glsl */ `
  attribute float aSize; attribute float aPhase; attribute vec3 aColor;
  uniform float uTime, uScale, uFade; varying vec3 vColor; varying float vAlpha;
  void main() {
    vColor = aColor;
    float pulse = 0.65 + 0.35 * sin(uTime * 1.6 + aPhase);
    vAlpha = uFade * pulse;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (0.8 + 0.4 * pulse) * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }`;
const POINT_FS = /* glsl */ `
  uniform sampler2D uMap; varying vec3 vColor; varying float vAlpha;
  void main() { vec4 t = texture2D(uMap, gl_PointCoord); gl_FragColor = vec4(vColor, t.a * vAlpha); }`;

function pointsMaterial(map: Texture) {
  return new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending, toneMapped: false,
    uniforms: { uTime: { value: 0 }, uScale: { value: 300 }, uFade: { value: 0 }, uMap: { value: map } },
    vertexShader: POINT_VS, fragmentShader: POINT_FS,
  });
}

/** Workflow line: dim tube with a bright fill that sweeps along it (uv.x = position along the curve). */
function flowMaterial() {
  return new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending, toneMapped: false,
    uniforms: { uFill: { value: 0 }, uPulse: { value: 0 }, uA: { value: new Color('#19C784') }, uB: { value: new Color('#7DF9FF') } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uFill, uPulse; uniform vec3 uA, uB; varying vec2 vUv;
      void main() {
        float lit = smoothstep(uFill, uFill - 0.04, vUv.x);
        float pulse = exp(-pow((vUv.x - uPulse) * 18.0, 2.0));
        vec3 col = mix(uA, uB, pulse);
        gl_FragColor = vec4(col, 0.12 + lit * 0.55 + pulse * lit * 0.9);
      }`,
  });
}

export function AiShowcaseScene({ track, quality }: { track: HTMLElement; quality: Quality }) {
  const host = useMemo(() => track.closest<HTMLElement>('.kz-showcase'), [track]);
  const [maps, setMaps] = useState<Texture[] | null>(null);
  const onScreen = useRef(false);
  const enter = useRef(-1);
  const cam = useRef<Cam>(null);
  const panelRefs = useRef<(Mesh | null)[]>([]);
  const net = useRef<Group>(null);
  const ready = useRef(false);
  const full = quality.tier === 2 && !quality.lite;
  const nNodes = full ? CFG.nodes : Math.round(CFG.nodes * 0.6);
  const nParticles = full ? CFG.particles : Math.round(CFG.particles * 0.6);

  useEffect(() => {
    let cancelled = false;
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      const loader = new TextureLoader();
      Promise.all(CFG.panels.map((p) => loader.loadAsync(`/media/ai/panel-${p.name}.webp`)))
        .then((tx) => {
          if (cancelled) { tx.forEach((t) => t.dispose()); return; }
          tx.forEach((t) => { t.colorSpace = SRGBColorSpace; t.anisotropy = 4; t.needsUpdate = true; });
          setMaps(tx);
        })
        .catch(() => {});
    }, { rootMargin: SHOWCASE.preloadMargin });
    near.observe(track);
    const vis = new IntersectionObserver(([e]) => { onScreen.current = e.isIntersecting; });
    vis.observe(track);
    return () => { cancelled = true; near.disconnect(); vis.disconnect(); };
  }, [track]);
  useEffect(() => () => maps?.forEach((t) => t.dispose()), [maps]);
  useEffect(() => () => { if (host) host.dataset.ready = 'false'; }, [host]);

  // ---- network geometry (built once per mount)
  const g = useMemo(() => {
    const { nodes, edges } = buildNetwork(nNodes);
    const sprite = dotTexture();
    const r = rng(11);
    const emerald = new Color('#19C784'); const cyan = new Color('#22D3EE'); const mint = new Color('#A6EBCD');

    const nodeGeo = new BufferGeometry();
    nodeGeo.setAttribute('position', new BufferAttribute(new Float32Array(nodes.flatMap((v) => [v.x, v.y, v.z])), 3));
    nodeGeo.setAttribute('aSize', new BufferAttribute(new Float32Array(nodes.map(() => 0.09 + r() * 0.09)), 1));
    nodeGeo.setAttribute('aPhase', new BufferAttribute(new Float32Array(nodes.map(() => r() * 6.28)), 1));
    nodeGeo.setAttribute('aColor', new BufferAttribute(new Float32Array(nodes.flatMap((_, i) => (i % 3 === 0 ? cyan : emerald).toArray())), 3));
    const nodeMat = pointsMaterial(sprite);

    const lineGeo = new BufferGeometry();
    lineGeo.setAttribute('position', new BufferAttribute(new Float32Array(edges.flatMap(([a, b]) => [...nodes[a].toArray(), ...nodes[b].toArray()])), 3));
    const lineMat = new LineBasicMaterial({ color: '#2FD39A', transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, toneMapped: false });

    const parts = Array.from({ length: nParticles }, () => ({ edge: Math.floor(r() * edges.length), t: r(), speed: 0.18 + r() * 0.35, dir: r() > 0.5 ? 1 : -1 }));
    const partGeo = new BufferGeometry();
    partGeo.setAttribute('position', new BufferAttribute(new Float32Array(nParticles * 3), 3));
    partGeo.setAttribute('aSize', new BufferAttribute(new Float32Array(parts.map(() => 0.06 + r() * 0.035)), 1));
    partGeo.setAttribute('aPhase', new BufferAttribute(new Float32Array(parts.map(() => r() * 6.28)), 1));
    partGeo.setAttribute('aColor', new BufferAttribute(new Float32Array(parts.flatMap((_, i) => (i % 2 ? mint : cyan).toArray())), 3));
    const partMat = pointsMaterial(sprite);

    // Workflow curve through the three panels' right/left edges.
    const P = CFG.panels;
    const curve = new CatmullRomCurve3([
      new Vector3(P[0].pos[0] - 0.4, P[0].pos[1] - 0.75, P[0].pos[2] + 0.05),
      new Vector3(P[0].pos[0] + 0.55, P[0].pos[1] - 0.95, P[0].pos[2] + 0.35),
      new Vector3(P[1].pos[0] - 0.6, P[1].pos[1] - 0.8, P[1].pos[2] + 0.05),
      new Vector3(P[1].pos[0] + 0.6, P[1].pos[1] - 0.82, P[1].pos[2] + 0.05),
      new Vector3(P[2].pos[0] - 0.2, P[2].pos[1] - 0.92, P[2].pos[2] + 0.3),
      new Vector3(P[2].pos[0] + 0.5, P[2].pos[1] - 0.72, P[2].pos[2] + 0.05),
    ]);
    const flowGeo = new TubeGeometry(curve, 160, 0.013, 6, false);
    const flowMat = flowMaterial();

    const panelGeo = new PlaneGeometry(CFG.panelSize[0], CFG.panelSize[1]);
    const panelMats = P.map(() => new MeshBasicMaterial({ transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    return { nodes, edges, sprite, nodeGeo, nodeMat, lineGeo, lineMat, parts, partGeo, partMat, flowGeo, flowMat, panelGeo, panelMats };
  }, [nNodes, nParticles]);
  useEffect(() => () => {
    [g.nodeGeo, g.lineGeo, g.partGeo, g.flowGeo, g.panelGeo].forEach((x) => x.dispose());
    [g.nodeMat, g.lineMat, g.partMat, g.flowMat, ...g.panelMats].forEach((x) => x.dispose());
    g.sprite.dispose();
  }, [g]);
  useEffect(() => { if (maps) g.panelMats.forEach((m, i) => { m.map = maps[i]; m.needsUpdate = true; }); }, [maps, g]);

  const backdrop = useMemo(() => {
    const m = createBackdropMaterial(CFG.brand, CFG.accent);
    m.uniforms.uLight.value = [0.48, 0.5];
    return m;
  }, []);
  const quad = useMemo(() => new PlaneGeometry(2, 2), []);
  useEffect(() => () => { backdrop.dispose(); quad.dispose(); }, [backdrop, quad]);

  useFrame((state, delta) => {
    if (!onScreen.current || !maps) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const r = track.getBoundingClientRect();
    backdrop.uniforms.uSize.value = [r.width, r.height];
    if (host) backdrop.uniforms.uRadius.value = parseFloat(getComputedStyle(host).borderTopLeftRadius) || 24;
    const dpr = state.gl.getPixelRatio();
    const scale = (r.height * dpr) / (2 * Math.tan(MathUtils.degToRad(CFG.fov / 2)));

    if (enter.current < 0) enter.current = 0;
    enter.current += dt;
    const e = enter.current / SHOWCASE.enterDuration;

    // Network fade + pulses.
    const netK = ease(e * 1.2);
    g.nodeMat.uniforms.uTime.value = t; g.nodeMat.uniforms.uFade.value = netK; g.nodeMat.uniforms.uScale.value = scale;
    g.partMat.uniforms.uTime.value = t; g.partMat.uniforms.uFade.value = netK; g.partMat.uniforms.uScale.value = scale;
    g.lineMat.opacity = 0.16 * netK;
    if (net.current) { net.current.rotation.y = Math.sin(t * 0.08) * 0.08; net.current.rotation.x = Math.sin(t * 0.06) * 0.03; }

    // Data particles travel along their edge, then hop to a connected edge.
    const pos = g.partGeo.attributes.position as BufferAttribute;
    g.parts.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        p.t = 0;
        const end = g.edges[p.edge][p.dir > 0 ? 1 : 0];
        const next = g.edges.map((ed, k) => [ed, k] as const).filter(([ed]) => ed[0] === end || ed[1] === end);
        const [ed, k] = next[(i + Math.floor(t)) % next.length];
        p.edge = k; p.dir = ed[0] === end ? 1 : -1;
      }
      const [a, b] = g.edges[p.edge];
      const A = g.nodes[p.dir > 0 ? a : b], B = g.nodes[p.dir > 0 ? b : a];
      pos.setXYZ(i, A.x + (B.x - A.x) * p.t, A.y + (B.y - A.y) * p.t, A.z + (B.z - A.z) * p.t);
    });
    pos.needsUpdate = true;

    // Workflow line: fills once on entrance, then a pulse keeps travelling.
    g.flowMat.uniforms.uFill.value = MathUtils.clamp((e - 0.5) * 0.9, 0, 1.05);
    g.flowMat.uniforms.uPulse.value = ((t * 0.22) % 1.3) - 0.15;

    // Panels: staggered fly-in, then independent float.
    CFG.panels.forEach((p, i) => {
      const m = panelRefs.current[i];
      if (!m) return;
      const k = ease(e - 0.15 - i * 0.18);
      g.panelMats[i].opacity = k;
      m.position.set(p.pos[0], p.pos[1] + Math.sin(t * 0.6 + i * 2) * 0.06, p.pos[2] - (1 - k) * 2.2);
      m.rotation.set(p.rot[0] + Math.sin(t * 0.4 + i) * 0.025 - mouse.y * 0.04, p.rot[1] + Math.sin(t * 0.3 + i * 1.7) * 0.04 + mouse.x * 0.06, p.rot[2]);
    });

    if (cam.current) {
      const c = cam.current;
      c.position.x = MathUtils.damp(c.position.x, mouse.x * SHOWCASE.parallax.x, 2.5, dt);
      c.position.y = MathUtils.damp(c.position.y, mouse.y * SHOWCASE.parallax.y, 2.5, dt);
      c.lookAt(0, 0, -0.6);
    }

    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(() => { if (host) host.dataset.ready = 'true'; });
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={CFG.fov} position={[0, 0, CFG.cameraZ]} near={0.1} far={30} />
      <mesh geometry={quad} material={backdrop} renderOrder={-10} frustumCulled={false} position={[0, 0, -12]} />
      {maps && (
        <>
          <group ref={net}>
            <lineSegments geometry={g.lineGeo} material={g.lineMat} renderOrder={1} />
            <points geometry={g.nodeGeo} material={g.nodeMat} renderOrder={2} frustumCulled={false} />
            <points geometry={g.partGeo} material={g.partMat} renderOrder={3} frustumCulled={false} />
          </group>
          <mesh geometry={g.flowGeo} material={g.flowMat} renderOrder={4} />
          {CFG.panels.map((p, i) => (
            <mesh key={p.name} ref={(m) => { panelRefs.current[i] = m; }} geometry={g.panelGeo} material={g.panelMats[i]} position={p.pos} rotation={p.rot} renderOrder={[6, 7, 5][i]} />
          ))}
        </>
      )}
    </>
  );
}
