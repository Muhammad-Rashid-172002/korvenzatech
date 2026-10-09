import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, View } from '@react-three/drei';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { PRODUCT, RENDER } from './config';
import { HeroScene } from './scenes/Hero';
import { ProcessScene } from './scenes/Process';
import { ProductScene } from './scenes/Product';

export type Quality = { tier: 1 | 2; lite: boolean };

/** Finds the DOM element a scene renders into (`data-kz-view="<key>"`), re-queried per route. */
function useViewTarget(key: string, path: string) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const find = () => setEl(document.querySelector<HTMLElement>(`[data-kz-view="${key}"]`));
    find();
    const id = requestAnimationFrame(find);
    return () => cancelAnimationFrame(id);
  }, [key, path]);
  return el;
}

/** All DOM tracks whose key starts with `prefix` (e.g. one per product card). */
function useViewTargets(prefix: string, path: string) {
  const [els, setEls] = useState<HTMLElement[]>([]);
  useEffect(() => {
    const find = () => setEls(Array.from(document.querySelectorAll<HTMLElement>(`[data-kz-view^="${prefix}"]`)));
    find();
    const id = requestAnimationFrame(find);
    return () => cancelAnimationFrame(id);
  }, [prefix, path]);
  return els;
}

/**
 * Renders only while at least one 3D view is on screen and the tab is visible.
 * When stopping, the canvas is cleared first so no stale frame lingers.
 */
function VisibilityLoop({ targets }: { targets: (HTMLElement | null)[] }) {
  const { setFrameloop, gl } = useThree();
  useEffect(() => {
    const els = targets.filter(Boolean) as HTMLElement[];
    const visible = new Set<Element>();
    const apply = () => {
      const on = visible.size > 0 && !document.hidden;
      if (!on) { gl.setScissorTest(false); gl.clear(); }
      setFrameloop(on ? 'always' : 'never');
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      apply();
    });
    els.forEach((el) => io.observe(el));
    document.addEventListener('visibilitychange', apply);
    if (!els.length) apply();
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', apply); };
  }, [targets, setFrameloop, gl]);
  return null;
}

/**
 * The one persistent WebGL context for the whole site. Fixed behind page
 * content (z-index between section backgrounds and section content); each
 * section's scene renders into its own DOM rectangle through drei <View>.
 */
export default function Experience({ path, tier }: { path: string; tier: 1 | 2 }) {
  const hero = useViewTarget('hero', path);
  const heroRef = useMemo(() => ({ current: hero as HTMLElement }), [hero]);
  const process = useViewTarget('process', path);
  const processRef = useMemo(() => ({ current: process as HTMLElement }), [process]);
  const productEls = useViewTargets('product-', path);
  const products = useMemo(
    () => productEls.filter((el) => (el.dataset.kzView ?? '').replace('product-', '') in PRODUCT.apps).map((el) => ({ el, ref: { current: el } })),
    [productEls],
  );
  const [lite, setLite] = useState(tier === 1);
  const declines = useRef(0);
  const [dpr, setDpr] = useState<number>(RENDER.dpr[tier][1]);
  const quality = useMemo<Quality>(() => ({ tier, lite }), [tier, lite]);
  const targets = useMemo(() => [hero, process, ...products.map((p) => p.el)], [hero, process, products]);
  const eventSource = useMemo(() => document.getElementById('root') ?? undefined, []);

  return (
    <Canvas
      className="kz-canvas-layer"
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      aria-hidden="true"
      eventSource={eventSource}
      eventPrefix="client"
      dpr={dpr}
      gl={{ antialias: RENDER.antialias[tier], alpha: true, powerPreference: 'high-performance', stencil: false }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = RENDER.exposure;
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); document.documentElement.dataset.kzTier = '0'; });
      }}
    >
      <PerformanceMonitor
        bounds={() => [RENDER.fpsLower, RENDER.fpsUpper]}
        onDecline={() => {
          declines.current += 1;
          setDpr((d) => Math.max(1, +(d - 0.25).toFixed(2)));
          if (declines.current >= RENDER.maxDeclines) setLite(true);
        }}
        onIncline={() => setDpr((d) => Math.min(RENDER.dpr[tier][1], +(d + 0.25).toFixed(2)))}
      />
      <AdaptiveDpr pixelated={false} />
      <VisibilityLoop targets={targets} />
      {hero && (
        <View track={heroRef} index={1}>
          <Suspense fallback={null}>
            <HeroScene key={hero.dataset.kzViewId ?? 'hero'} track={hero} quality={quality} />
          </Suspense>
        </View>
      )}
      {process && (
        <View track={processRef} index={2}>
          <Suspense fallback={null}>
            <ProcessScene track={process} quality={quality} steps={Number(process.closest<HTMLElement>('[data-steps]')?.dataset.steps) || 7} />
          </Suspense>
        </View>
      )}
      {products.map(({ el, ref }, i) => (
        <View key={el.dataset.kzView} track={ref} index={10 + i}>
          <Suspense fallback={null}>
            <ProductScene track={el} quality={quality} app={(el.dataset.kzView ?? '').replace('product-', '')} />
          </Suspense>
        </View>
      ))}
    </Canvas>
  );
}
