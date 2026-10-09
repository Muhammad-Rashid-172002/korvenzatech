/**
 * Pointer micro-interactions (lazy chunk with lib/scroll.ts — never loaded for
 * reduced motion). Everything writes CSS variables; CSS does the rendering.
 *
 *  [data-kz-tilt="<deg>"]  card tilts toward the pointer (max <deg>), border
 *                          glow follows the cursor, `.kz-magnetic-arrow`
 *                          inside drifts toward the pointer.
 *  .kz-bento-scene         SVG micro-scenes animate only while on screen.
 */
type Cleanup = () => void;

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function bindTilt(el: HTMLElement): Cleanup {
  const max = Number(el.dataset.kzTilt) || 8;
  const arrow = el.querySelector<HTMLElement>('.kz-magnetic-arrow');
  let raf = 0;
  let px = 0.5;
  let py = 0.5;
  const apply = () => {
    raf = 0;
    el.style.setProperty('--rx', `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    if (arrow) {
      const r = el.getBoundingClientRect();
      const a = arrow.getBoundingClientRect();
      const dx = px * r.width - (a.left - r.left + a.width / 2);
      const dy = py * r.height - (a.top - r.top + a.height / 2);
      const k = Math.min(1, 140 / Math.max(1, Math.hypot(dx, dy)));
      arrow.style.setProperty('--ax', `${(dx * 0.08 * k).toFixed(1)}px`);
      arrow.style.setProperty('--ay', `${(dy * 0.08 * k).toFixed(1)}px`);
    }
  };
  const move = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    el.dataset.tilting = 'true';
    if (!raf) raf = requestAnimationFrame(apply);
  };
  const leave = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    delete el.dataset.tilting;
    ['--rx', '--ry'].forEach((v) => el.style.setProperty(v, '0deg'));
    arrow?.style.setProperty('--ax', '0px');
    arrow?.style.setProperty('--ay', '0px');
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => { leave(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
}

/** Bind all pointer/visibility micro-interactions under `root`. Returns one cleanup. */
export function bindInteractions(root: ParentNode = document): Cleanup {
  const cleanups: Cleanup[] = [];
  if (finePointer()) root.querySelectorAll<HTMLElement>('[data-kz-tilt]').forEach((el) => cleanups.push(bindTilt(el)));

  const scenes = root.querySelectorAll<Element>('.kz-bento-scene');
  if (scenes.length) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-live', e.isIntersecting)));
    scenes.forEach((s) => io.observe(s));
    cleanups.push(() => { io.disconnect(); scenes.forEach((s) => s.classList.remove('is-live')); });
  }
  return () => cleanups.forEach((c) => c());
}
