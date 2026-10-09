import { useEffect, useRef } from 'react';

/** Shared motion language (GSAP ease names + seconds). Calm, engineered: expo/power3 outs, no linear except loops. */
export const EASE = {
  out: 'power3.out',
  settle: 'expo.out',
  inOut: 'power3.inOut',
  soft: 'sine.inOut',
} as const;

export const DUR = {
  fast: 0.25,
  base: 0.45,
  slow: 0.8,
  reveal: 0.9,
} as const;

/**
 * One shared IntersectionObserver drives every `.kz-reveal` element.
 * Elements already on screen are marked visible *before* `.kz-js` is added to
 * <html>, so server-rendered content above the fold never flashes or hides.
 * Re-scans when `key` (the route) changes.
 */
export function useRevealObserver(key: string) {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.kz-reveal:not(.is-in)'));
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      root.classList.add('kz-js');
      return;
    }
    const vh = window.innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('is-in');
    });
    root.classList.add('kz-js');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0 });
    els.filter((el) => !el.classList.contains('is-in')).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}

/** Subtle pointer-driven tilt/parallax via CSS custom properties (no re-renders). */
export function useTilt<T extends HTMLElement>(maxDeg = 5, shiftPx = 8) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    let raf = 0;
    const set = (x: number, y: number) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--ry', `${(x * maxDeg).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-y * maxDeg).toFixed(2)}deg`);
        el.style.setProperty('--px', `${(-x * shiftPx).toFixed(1)}px`);
        el.style.setProperty('--py', `${(-y * shiftPx).toFixed(1)}px`);
      });
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      set((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    };
    const leave = () => set(0, 0);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [maxDeg, shiftPx]);
  return ref;
}
