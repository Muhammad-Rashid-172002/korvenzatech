/**
 * Custom cursor: a small dot that tracks the pointer exactly and a ring that
 * follows with a soft lag. Grows over links/buttons; shows "View" over
 * [data-kz-cursor="view"] (case-study cards). Only on fine pointers, tier 2,
 * and never for reduced motion (this module is not even loaded then).
 * The native cursor stays visible over text fields.
 */
export function initCursor(): () => void {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine || document.documentElement.dataset.kzTier !== '2') return () => {};
  const root = document.createElement('div');
  root.className = 'kz-cursor';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<span class="kz-cursor-ring"><span class="kz-cursor-label">View</span></span><span class="kz-cursor-dot"></span>';
  document.body.appendChild(root);
  const ring = root.firstElementChild as HTMLElement;
  const dot = root.lastElementChild as HTMLElement;
  const html = document.documentElement;
  let x = -100, y = -100, rx = -100, ry = -100, raf = 0, shown = false;

  const loop = () => {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
    raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(loop) : 0;
  };
  const move = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!shown) { shown = true; rx = x; ry = y; html.classList.add('kz-cursor-on'); }
    const t = e.target as Element | null;
    const view = t?.closest?.('[data-kz-cursor="view"]');
    const field = t?.closest?.('input, textarea, select, [contenteditable="true"]');
    const hot = !view && t?.closest?.('a, button, [role="tab"], [role="button"], label, summary');
    root.dataset.state = field ? 'hidden' : view ? 'view' : hot ? 'hot' : '';
    if (!raf) raf = requestAnimationFrame(loop);
  };
  const leave = () => { shown = false; html.classList.remove('kz-cursor-on'); root.dataset.state = 'hidden'; };
  const down = () => root.classList.add('is-down');
  const up = () => root.classList.remove('is-down');
  window.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', leave);
  window.addEventListener('pointerdown', down);
  window.addEventListener('pointerup', up);
  return () => {
    cancelAnimationFrame(raf); root.remove(); html.classList.remove('kz-cursor-on');
    window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave);
    window.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up);
  };
}
