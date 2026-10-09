/**
 * Pointer micro-interactions (lazy chunk with lib/scroll.ts — never loaded for
 * reduced motion). Everything writes CSS variables; CSS does the rendering.
 *
 *  [data-kz-tilt="<deg>"]  card tilts toward the pointer (max <deg>), border
 *                          glow follows the cursor, `.kz-magnetic-arrow`
 *                          inside drifts toward the pointer.
 *  .kz-bento-scene,        SVG micro-scenes / ambient layers animate only
 *  [data-kz-live]          while on screen (.is-live).
 *  [data-kz-magnetic]      element drifts toward the pointer while it is
 *                          inside the nearest [data-kz-magnetic-zone] (or itself).
 *  [data-kz-ripple]        click ripple from the press point.
 *  [data-kz-drag-scroll]   horizontal row: mouse drag with inertia (touch,
 *                          wheel and keyboard keep native scrolling).
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

function bindMagnetic(el: HTMLElement, strength = 0.28, max = 10): Cleanup {
  const zone = el.closest<HTMLElement>('[data-kz-magnetic-zone]') ?? el;
  let raf = 0;
  let tx = 0;
  let ty = 0;
  const apply = () => { raf = 0; el.style.translate = `${tx.toFixed(1)}px ${ty.toFixed(1)}px`; };
  const move = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const reach = Math.max(r.width, r.height) * 0.9;
    const k = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
    tx = Math.max(-max, Math.min(max, dx * strength * k));
    ty = Math.max(-max, Math.min(max, dy * strength * k));
    if (!raf) raf = requestAnimationFrame(apply);
  };
  const leave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); };
  el.classList.add('kz-magnetic');
  zone.addEventListener('pointermove', move);
  zone.addEventListener('pointerleave', leave);
  return () => { cancelAnimationFrame(raf); el.style.translate = ''; el.classList.remove('kz-magnetic'); zone.removeEventListener('pointermove', move); zone.removeEventListener('pointerleave', leave); };
}

function bindRipple(el: HTMLElement): Cleanup {
  const down = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const d = Math.hypot(r.width, r.height) * 2;
    const s = document.createElement('span');
    s.className = 'kz-ripple';
    s.setAttribute('aria-hidden', 'true');
    s.style.width = s.style.height = `${d}px`;
    s.style.left = `${e.clientX - r.left - d / 2}px`;
    s.style.top = `${e.clientY - r.top - d / 2}px`;
    el.appendChild(s);
    s.addEventListener('animationend', () => s.remove(), { once: true });
  };
  el.addEventListener('pointerdown', down);
  return () => el.removeEventListener('pointerdown', down);
}

function bindDragScroll(el: HTMLElement): Cleanup {
  let down = false;
  let moved = 0;
  let startX = 0;
  let startLeft = 0;
  let lastX = 0;
  let lastT = 0;
  let v = 0; // px per ms
  let raf = 0;
  const stopInertia = () => { cancelAnimationFrame(raf); raf = 0; };
  const pdown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    stopInertia();
    down = true; moved = 0; v = 0;
    startX = lastX = e.clientX; startLeft = el.scrollLeft; lastT = performance.now();
  };
  const pmove = (e: PointerEvent) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 4) return;
    if (!moved) { el.setPointerCapture(e.pointerId); el.dataset.dragging = 'true'; }
    moved = Math.max(moved, Math.abs(dx));
    el.scrollLeft = startLeft - dx;
    const now = performance.now();
    const dt = Math.max(1, now - lastT);
    v = v * 0.6 + ((lastX - e.clientX) / dt) * 0.4;
    lastX = e.clientX; lastT = now;
  };
  const pup = (e: PointerEvent) => {
    if (!down) return;
    down = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (!moved) return;
    let t0 = performance.now();
    const step = (t: number) => {
      const dt = Math.min(32, t - t0); t0 = t;
      el.scrollLeft += v * dt;
      v *= Math.pow(0.94, dt / 16.7);
      if (Math.abs(v) > 0.02) raf = requestAnimationFrame(step);
      else { raf = 0; delete el.dataset.dragging; }
    };
    raf = requestAnimationFrame(step);
  };
  // A drag must not click whatever is under the pointer.
  const click = (e: MouseEvent) => { if (moved > 4) { e.preventDefault(); e.stopPropagation(); moved = 0; } };
  const wheel = () => stopInertia();
  el.addEventListener('pointerdown', pdown);
  el.addEventListener('pointermove', pmove);
  el.addEventListener('pointerup', pup);
  el.addEventListener('pointercancel', pup);
  el.addEventListener('click', click, true);
  el.addEventListener('wheel', wheel, { passive: true });
  return () => {
    stopInertia(); delete el.dataset.dragging;
    el.removeEventListener('pointerdown', pdown); el.removeEventListener('pointermove', pmove);
    el.removeEventListener('pointerup', pup); el.removeEventListener('pointercancel', pup);
    el.removeEventListener('click', click, true); el.removeEventListener('wheel', wheel);
  };
}

/** Bind all pointer/visibility micro-interactions under `root`. Returns one cleanup. */
export function bindInteractions(root: ParentNode = document): Cleanup {
  const cleanups: Cleanup[] = [];
  if (finePointer()) {
    root.querySelectorAll<HTMLElement>('[data-kz-tilt]').forEach((el) => cleanups.push(bindTilt(el)));
    root.querySelectorAll<HTMLElement>('[data-kz-magnetic]').forEach((el) => cleanups.push(bindMagnetic(el)));
    root.querySelectorAll<HTMLElement>('[data-kz-drag-scroll]').forEach((el) => cleanups.push(bindDragScroll(el)));
  }
  root.querySelectorAll<HTMLElement>('[data-kz-ripple]').forEach((el) => cleanups.push(bindRipple(el)));

  const scenes = root.querySelectorAll<Element>('.kz-bento-scene, [data-kz-live]');
  if (scenes.length) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-live', e.isIntersecting)));
    scenes.forEach((s) => io.observe(s));
    cleanups.push(() => { io.disconnect(); scenes.forEach((s) => s.classList.remove('is-live')); });
  }
  return () => cleanups.forEach((c) => c());
}
