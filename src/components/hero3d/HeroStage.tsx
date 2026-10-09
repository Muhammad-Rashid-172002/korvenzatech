import React, { useEffect, useRef, useState } from 'react';

/**
 * Hosts the WebGL sculpture. Renders an art-directed CSS 2.5D composition
 * immediately (server-rendered, zero JS cost); the real-time scene is
 * lazy-loaded after the page is interactive and cross-fades in on its first
 * frame. Falls back permanently when WebGL is unavailable, on Save-Data, or
 * if the GPU context is lost.
 */
function canUseWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    // Software rasterisers (no GPU) would block the main thread every frame — use the static composition instead.
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    if (/[?&]kz3d=force\b/.test(window.location.search)) return true; // QA override
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

export const HERO_POSTER_SRCSET = '/media/hero/sculpture-640.webp 640w, /media/hero/sculpture-1100.webp 1100w';
export const HERO_POSTER_SIZES = '(min-width: 1024px) 620px, (min-width: 640px) 520px, 380px';

export function HeroStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (nav.connection?.saveData || !canUseWebGL()) { setFailed(true); return; }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
      || (nav.hardwareConcurrency ?? 8) <= 4
      || (nav.deviceMemory ?? 8) <= 4;

    let disposed = false;
    let handle: { dispose: () => void } | undefined;

    const boot = () => import('./scene').then(({ createHeroScene }) => {
      if (disposed) return;
      handle = createHeroScene({
        canvas,
        quality: lowPower ? 'low' : 'high',
        reducedMotion,
        onFirstFrame: () => setReady(true),
        onFail: () => { setReady(false); setFailed(true); },
      });
    }).catch(() => setFailed(true));

    // Defer the 3D chunk until the browser is idle so it never competes with LCP.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idleId: number | undefined;
    let timer: number | undefined;
    const schedule = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(boot, { timeout: 1500 });
      else timer = window.setTimeout(boot, 300);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener('load', schedule);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timer !== undefined) clearTimeout(timer);
      handle?.dispose();
    };
  }, []);

  return (
    <div className="kz-hero-stage" data-ready={ready && !failed ? 'true' : 'false'}>
      <div className="kz-hero-floor pointer-events-none absolute inset-x-0 bottom-0 h-1/2" aria-hidden="true" />
      {/* Poster frame rendered from the same scene: first paint, reduced-data, GPU-less and no-WebGL fallback. */}
      <div className="kz-hero-fallback" aria-hidden="true">
        <img
          className="kz-hero-poster"
          src="/media/hero/sculpture-640.webp"
          srcSet={HERO_POSTER_SRCSET}
          sizes={HERO_POSTER_SIZES}
          alt=""
          width={1100}
          height={1100}
          decoding="async"
        />
      </div>
      {!failed && <canvas ref={canvasRef} aria-hidden="true" />}
    </div>
  );
}
