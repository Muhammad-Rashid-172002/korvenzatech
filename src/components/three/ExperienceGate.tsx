import React, { useEffect, useRef, useState } from 'react';
import { detectTier, type Tier } from './hooks/useDeviceTier';
import { bindMouse } from './hooks/useMouse';

type ExperienceComponent = React.ComponentType<{ path: string; tier: Exclude<Tier, 0> }>;
type ScrollModule = typeof import('../../lib/scroll');

/**
 * Progressive-enhancement gate. Renders nothing on the server and on first
 * client render (so hydration always matches), then — after `load` and an
 * idle slot — lazily boots:
 *   1. smooth scroll + scroll-driven motion (unless prefers-reduced-motion)
 *   2. the single persistent WebGL canvas (only on tier 1/2 devices)
 * Tier 0 devices (no/software WebGL, Save-Data, reduced motion) keep the
 * server-rendered posters and never download any WebGL code.
 */
export function ExperienceGate({ path }: { path: string }) {
  const [Experience, setExperience] = useState<ExperienceComponent | null>(null);
  const [tier, setTier] = useState<Exclude<Tier, 0>>(1);
  const scrollMod = useRef<ScrollModule | null>(null);
  const pathRef = useRef(path);
  pathRef.current = path;

  useEffect(() => {
    let cancelled = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const boot = () => {
      if (cancelled) return;
      bindMouse();
      if (!reduced) {
        import('../../lib/scroll').then((m) => {
          if (cancelled) return;
          scrollMod.current = m;
          m.initSmoothScroll();
          m.setupRoute();
        }).catch(() => {});
      }
      const info = detectTier();
      document.documentElement.dataset.kzTier = String(info.tier);
      if (info.tier === 0) return;
      import('./Experience').then((m) => {
        if (cancelled) return;
        setTier(info.tier as Exclude<Tier, 0>);
        setExperience(() => m.default);
      }).catch(() => { document.documentElement.dataset.kzTier = '0'; });
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const schedule = () => (w.requestIdleCallback ? w.requestIdleCallback(boot, { timeout: 1500 }) : window.setTimeout(boot, 300));
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => { cancelled = true; window.removeEventListener('load', schedule); };
  }, []);

  // Rebuild scroll-driven timelines after every route change (after the new DOM is painted).
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => scrollMod.current?.setupRoute()));
    return () => cancelAnimationFrame(id);
  }, [path]);

  return Experience ? <Experience path={path} tier={tier} /> : null;
}
