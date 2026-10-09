/**
 * Route transition: when the path changes, a brand curtain (already covering
 * the new page for one frame) lifts away upward. Purely visual, aria-hidden,
 * never blocks input, skipped on first load and for reduced motion.
 */
let el: HTMLDivElement | null = null;

export function playCurtain() {
  if (!el) {
    el = document.createElement('div');
    el.className = 'kz-curtain';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<span class="kz-curtain-mark"></span>';
    document.body.appendChild(el);
  }
  const c = el;
  c.classList.remove('is-leaving');
  c.classList.add('is-on');
  // Paint the cover, then animate it away (timers, not rAF, so it can never get stuck covering the page).
  void c.offsetWidth;
  window.setTimeout(() => c.classList.add('is-leaving'), 40);
  window.setTimeout(() => c.classList.remove('is-on', 'is-leaving'), 760);
}
