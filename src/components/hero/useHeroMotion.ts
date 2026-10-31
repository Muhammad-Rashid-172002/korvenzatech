import { useEffect, type RefObject } from 'react';
import { HERO_MOTION } from './heroConfig';

/**
 * One rAF loop for the whole hero, running only while the hero is on screen and the tab is
 * visible. It writes three CSS custom properties on the section — no React state, no re-renders:
 *   --mx, --my  damped pointer position (-1..1) → layer depth + logo tilt (fine pointers only)
 *   --hp        scroll progress of the hero (0 at top → 1 when scrolled past) → parallax
 * Under prefers-reduced-motion nothing runs and the variables stay at 0.
 */
export function useHeroMotion(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0, p: -1 };
    let raf = 0, last = 0, visible = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => { target.x = 0; target.y = 0; };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const k = 1 - Math.exp(-HERO_MOTION.pointerDamping * dt);
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      el.style.setProperty('--mx', cur.x.toFixed(4));
      el.style.setProperty('--my', cur.y.toFixed(4));
      if (Math.abs(p - cur.p) > 0.0005) { cur.p = p; el.style.setProperty('--hp', p.toFixed(4)); }
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };

    // Off screen: stop the loop and pause every CSS animation in the hero (hero.css [data-offscreen]).
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      el.toggleAttribute('data-offscreen', !visible);
      start();
    });
    io.observe(el);
    const onVis = () => start();
    document.addEventListener('visibilitychange', onVis);
    if (finePointer) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.removeAttribute('data-offscreen');
      ['--mx', '--my', '--hp'].forEach((v) => el.style.removeProperty(v));
    };
  }, [ref]);
}

/** Runs `onVisible`/`onHidden` as an element enters/leaves the viewport (for loops and count-ups). */
export function useInView(ref: RefObject<Element | null>, onChange: (inView: boolean) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => onChange(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
