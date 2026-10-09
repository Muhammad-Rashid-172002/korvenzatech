/**
 * CTA — "Particle K".
 * Thousands of shader particles drift as loose dust, then gather into the
 * KorvenzaTech K (positions + colours sampled from the real logo image) as
 * the closing section scrolls into view. The cursor pushes particles away.
 * Clicking the primary CTA bursts the K outward just before navigating.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, MathUtils, ShaderMaterial, Vector2, Vector3 } from 'three';
import { COLORS, CTA } from '../config';
import type { Quality } from '../Experience';

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** Sample opaque/dark pixels of the logo → points in a unit box centred on 0, plus their colours. */
async function sampleLogo(src: string, count: number) {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  await img.decode();
  const size = 160;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.drawImage(img, 0, 0, size, size);
  const data = g.getImageData(0, 0, size, size).data;
  const pts: number[] = [];
  const cols: number[] = [];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const a = data[i + 3] / 255;
    const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
    if (a > 0.5 && lum < 0.86) { pts.push(x / size - 0.5, 0.5 - y / size); cols.push(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255); }
  }
  const r = rng(11);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const n = pts.length / 2;
  for (let k = 0; k < count; k++) {
    const j = Math.floor(r() * n);
    pos[k * 3] = pts[j * 2] + (r() - 0.5) / size;
    pos[k * 3 + 1] = pts[j * 2 + 1] + (r() - 0.5) / size;
    pos[k * 3 + 2] = (r() - 0.5) * 0.06;
    col[k * 3] = cols[j * 3]; col[k * 3 + 1] = cols[j * 3 + 1]; col[k * 3 + 2] = cols[j * 3 + 2];
  }
  return { pos, col };
}

const tmp = new Vector3();

export function CtaScene({ track, quality }: { track: HTMLElement; quality: Quality }) {
  const count = CTA.count[quality.lite ? 1 : quality.tier];
  const [sample, setSample] = useState<{ pos: Float32Array; col: Float32Array } | null>(null);
  const onScreen = useRef(false);
  const local = useRef({ v: new Vector2(9, 9), inside: false });
  const burst = useRef(0);
  const morph = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      sampleLogo(CTA.logo, count).then((s) => { if (!cancelled) setSample(s); }).catch(() => {});
    }, { rootMargin: '400px' });
    near.observe(track);
    const vis = new IntersectionObserver(([e]) => { onScreen.current = e.isIntersecting; });
    vis.observe(track);
    return () => { cancelled = true; near.disconnect(); vis.disconnect(); };
  }, [track, count]);

  // Pointer relative to the section (mouse only) + the burst trigger from the CTA button.
  useEffect(() => {
    const section = track.closest('section');
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = track.getBoundingClientRect();
      local.current.v.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      local.current.inside = true;
    };
    const leave = () => { local.current.inside = false; };
    const onBurst = () => { burst.current = 0.0001; };
    section?.addEventListener('pointermove', move);
    section?.addEventListener('pointerleave', leave);
    window.addEventListener('kz:cta-burst', onBurst);
    return () => { section?.removeEventListener('pointermove', move); section?.removeEventListener('pointerleave', leave); window.removeEventListener('kz:cta-burst', onBurst); };
  }, [track]);

  const geo = useMemo(() => {
    if (!sample) return null;
    const r = rng(7);
    const scatter = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let k = 0; k < count; k++) {
      const th = r() * Math.PI * 2;
      const rad = 0.6 + Math.pow(r(), 0.6) * 2.4;
      scatter[k * 3] = Math.cos(th) * rad * 1.6;
      scatter[k * 3 + 1] = Math.sin(th) * rad * 0.8;
      scatter[k * 3 + 2] = (r() - 0.5) * 2.5;
      seed[k] = r();
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(sample.pos, 3));
    g.setAttribute('aScatter', new BufferAttribute(scatter, 3));
    g.setAttribute('aColor', new BufferAttribute(sample.col, 3));
    g.setAttribute('aSeed', new BufferAttribute(seed, 1));
    return g;
  }, [sample, count]);

  const mat = useMemo(() => new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
    uniforms: {
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uScale: { value: CTA.size },
      uMouse: { value: new Vector3(99, 99, 0) },
      uRepel: { value: CTA.repelRadius },
      uBurst: { value: 0 },
      uPx: { value: 1 },
      uPointSize: { value: CTA.pointSize },
      uTint: { value: new Color(COLORS.accent) },
      uMintMix: { value: CTA.brandMix },
      uAlpha: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aScatter; attribute vec3 aColor; attribute float aSeed;
      uniform float uMorph, uTime, uScale, uRepel, uBurst, uPx, uPointSize, uMintMix;
      uniform vec3 uMouse, uTint;
      varying vec3 vColor; varying float vA;
      void main() {
        float d = clamp(uMorph * 1.35 - aSeed * 0.35, 0.0, 1.0);
        d = d * d * (3.0 - 2.0 * d);
        vec3 k = position * uScale;
        vec3 drift = aScatter + vec3(sin(uTime * 0.3 + aSeed * 30.0), cos(uTime * 0.25 + aSeed * 20.0), 0.0) * 0.15;
        vec3 p = mix(drift, k, d);
        p.xy += vec2(sin(uTime * 1.3 + aSeed * 50.0), cos(uTime * 1.1 + aSeed * 40.0)) * 0.012 * d;
        // Cursor repel (in the K plane).
        vec2 dm = p.xy - uMouse.xy;
        float dist = length(dm);
        float f = smoothstep(uRepel, 0.0, dist);
        p.xy += normalize(dm + 1e-5) * f * 0.45;
        p.z += f * 0.4;
        // Burst: everything flies outward from the centre.
        p += normalize(p + vec3(0.0, 0.0, 0.001) + (aScatter * 0.2)) * uBurst * (2.5 + aSeed * 3.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uPointSize * uPx * (0.6 + aSeed * 0.8) * (6.0 / -mv.z);
        vColor = mix(mix(aColor, uTint, uMintMix), uTint, f * 0.8) * (0.55 + 0.45 * d) + f * 0.35;
        vA = mix(0.35, 1.0, d) * (1.0 - uBurst);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uAlpha;
      varying vec3 vColor; varying float vA;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float a = smoothstep(0.5, 0.0, length(c));
        gl_FragColor = vec4(vColor, a * vA * uAlpha);
      }`,
  }), []);
  useEffect(() => () => { geo?.dispose(); }, [geo]);
  // Tell the CTA button the burst is available (it then delays navigation for the effect).
  useEffect(() => {
    if (!geo) return;
    document.documentElement.dataset.kzCta = 'ready';
    return () => { delete document.documentElement.dataset.kzCta; };
  }, [geo]);
  useEffect(() => () => mat.dispose(), [mat]);

  useFrame((state, delta) => {
    if (!onScreen.current || !geo) return;
    const dt = Math.min(delta, 0.05);
    const r = track.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // Gather into the K as the section enters (fully formed when its centre reaches mid-screen).
    const target = MathUtils.clamp((vh - r.top) / (vh * 0.5 + r.height * 0.5), 0, 1);
    morph.current = MathUtils.damp(morph.current, target, 2.5, dt);
    mat.uniforms.uMorph.value = morph.current;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPx.value = state.gl.getPixelRatio();

    if (local.current.inside) {
      tmp.set(local.current.v.x, local.current.v.y, 0.5).unproject(state.camera).sub(state.camera.position).normalize();
      const t = -state.camera.position.z / tmp.z;
      tmp.multiplyScalar(t).add(state.camera.position);
      mat.uniforms.uMouse.value.lerp(tmp, 1 - Math.exp(-12 * dt));
    } else {
      mat.uniforms.uMouse.value.set(99, 99, 0);
    }

    if (burst.current > 0) {
      burst.current = Math.min(1, burst.current + dt / (CTA.burstMs / 1000));
      mat.uniforms.uBurst.value = MathUtils.smootherstep(burst.current, 0, 1);
      if (burst.current >= 1) { burst.current = 0; mat.uniforms.uBurst.value = 0; morph.current = 0; } // re-gather if we stay
    }
  });

  if (!geo) return null;
  return (
    <>
      <PerspectiveCamera makeDefault fov={CTA.fov} position={[0, 0, CTA.cameraZ]} near={0.1} far={30} />
      <points geometry={geo} material={mat} frustumCulled={false} />
    </>
  );
}
