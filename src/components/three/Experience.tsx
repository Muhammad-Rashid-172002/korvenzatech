import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, View } from '@react-three/drei';
import { ACESFilmicToneMapping, SRGBColorSpace, setConsoleFunction } from 'three';

// three's official console hook. @react-three/fiber 9.8 creates a THREE.Clock internally, which
// three 0.185 flags as deprecated on every boot; that single known third-party notice is dropped,
// everything else is forwarded unchanged.
setConsoleFunction((type: string, message: string, ...params: unknown[]) => {
  if (type === 'warn' && message.startsWith('THREE.Clock: This module has been deprecated')) return;
  const fn = (console as unknown as Record<string, (...a: unknown[]) => void>)[type] ?? console.log;
  fn(message, ...params);
});

/** Stable unique key per DOM element, so a scene remounts when its section is re-rendered (route change). */
const elIds = new WeakMap<Element, number>();
let elSeq = 0;
const elKey = (el: Element) => { let k = elIds.get(el); if (k === undefined) { k = ++elSeq; elIds.set(el, k); } return `v${k}`; };
import { PRODUCT, RENDER } from './config';
import { HeroScene } from './scenes/Hero';
import { ProcessScene } from './scenes/Process';
import { ProductScene } from './scenes/Product';
import { OrbitScene } from './scenes/Orbit';
import { CtaScene } from './scenes/Cta';

export type Quality = { tier: 1 | 2; lite: boolean };

/**
 * drei <View> points R3F's `events.connected` at its track and restores the
 * previous value on unmount — after a route change that "previous" track is a
 * detached DOM tree, which would then be kept alive forever. Reset it to the
 * real event source after every route's views have mounted.
 */
function EventsReset({ deps, source }: { deps: unknown; source?: HTMLElement }) {
  const setEvents = useThree((s) => s.setEvents);
  const get = useThree((s) => s.get);
  useEffect(() => { if (source && get().events.connected !== source) setEvents({ connected: source }); }, [deps, source, setEvents, get]);
  return null;
}

/**
 * Renders only while at least one 3D view is on screen and the tab is visible.
 * When stopping, the canvas is cleared first so no stale frame lingers.
 */
function VisibilityLoop({ targets }: { targets: (HTMLElement | null)[] }) {
  const { setFrameloop, gl, get } = useThree();
  useEffect(() => {
    const els = targets.filter(Boolean) as HTMLElement[];
    const visible = new Set<Element>();
    const apply = () => {
      const on = visible.size > 0 && !document.hidden;
      const next = on ? 'always' : 'never';
      if (get().frameloop === next) return; // every root-state write is retained by R3F portals (see useViewSlots), so only write on change
      if (!on) { gl.setScissorTest(false); gl.clear(); }
      setFrameloop(next);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      apply();
    });
    els.forEach((el) => io.observe(el));
    document.addEventListener('visibilitychange', apply);
    if (!els.length) apply();
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', apply); };
  }, [targets, setFrameloop, gl, get]);
  return null;
}

/**
 * The one persistent WebGL context for the whole site. Fixed behind page
 * content (z-index between section backgrounds and section content); each
 * section's scene renders into its own DOM rectangle through drei <View>.
 */
const PRODUCT_SLOTS = Object.keys(PRODUCT.apps).map((id) => `product-${id}`);
const SLOTS = ['hero', 'process', 'orbit', 'cta', ...PRODUCT_SLOTS];

/**
 * Finds every slot's DOM track for the current route. Views stay mounted for the
 * whole session (one per slot) — @react-three/fiber 9.8 portals never unsubscribe
 * from the root store, so remounting Views per route would leak their scenes.
 * A second pass two frames later re-renders once so each View picks up its new rect.
 */
function useViewSlots(path: string) {
  const [state, setState] = useState<{ els: Record<string, HTMLElement | null>; tick: number }>({ els: {}, tick: 0 });
  useEffect(() => {
    const find = () => {
      const els: Record<string, HTMLElement | null> = {};
      SLOTS.forEach((k) => { els[k] = document.querySelector<HTMLElement>(`[data-kz-view="${k}"]`); });
      setState((s) => ({ els, tick: s.tick + 1 }));
    };
    find();
    let id = requestAnimationFrame(() => { id = requestAnimationFrame(find); });
    return () => cancelAnimationFrame(id);
  }, [path]);
  return state.els;
}

export default function Experience({ path, tier }: { path: string; tier: 1 | 2 }) {
  const els = useViewSlots(path);
  const hero = els.hero ?? null;
  const process = els.process ?? null;
  const orbit = els.orbit ?? null;
  const cta = els.cta ?? null;
  // One stable ref object per slot *element* (identity change tells drei the track changed).
  const refs = useMemo(() => Object.fromEntries(SLOTS.map((k) => [k, { current: els[k] ?? null }])), [els]) as Record<string, { current: HTMLElement | null }>;
  const [lite, setLite] = useState(tier === 1);
  const declines = useRef(0);
  const [dpr, setDpr] = useState<number>(RENDER.dpr[tier][1]);
  const quality = useMemo<Quality>(() => ({ tier, lite }), [tier, lite]);
  const targets = useMemo(() => SLOTS.map((k) => els[k] ?? null), [els]);
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
      {/* Persistent views (see useViewSlots); a scene mounts only while its section is on the page. */}
      <View track={refs.hero as React.MutableRefObject<HTMLElement>} index={1}>
        <Suspense fallback={null}>{hero && <HeroScene key={elKey(hero)} track={hero} quality={quality} />}</Suspense>
      </View>
      <View track={refs.process as React.MutableRefObject<HTMLElement>} index={2}>
        <Suspense fallback={null}>
          {process && <ProcessScene key={elKey(process)} track={process} quality={quality} steps={Number(process.closest<HTMLElement>('[data-steps]')?.dataset.steps) || 7} />}
        </Suspense>
      </View>
      <View track={refs.orbit as React.MutableRefObject<HTMLElement>} index={3}>
        <Suspense fallback={null}>{orbit && <OrbitScene key={elKey(orbit)} track={orbit} quality={quality} />}</Suspense>
      </View>
      <View track={refs.cta as React.MutableRefObject<HTMLElement>} index={4}>
        <Suspense fallback={null}>{cta && <CtaScene key={elKey(cta)} track={cta} quality={quality} />}</Suspense>
      </View>
      {PRODUCT_SLOTS.map((k, i) => {
        const el = els[k];
        return (
          <View key={k} track={refs[k] as React.MutableRefObject<HTMLElement>} index={10 + i}>
            <Suspense fallback={null}>{el && <ProductScene key={elKey(el)} track={el} quality={quality} app={k.replace('product-', '')} />}</Suspense>
          </View>
        );
      })}
      <EventsReset deps={refs} source={eventSource} />
    </Canvas>
  );
}
