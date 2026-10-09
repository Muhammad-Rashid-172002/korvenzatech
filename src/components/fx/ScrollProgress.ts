/** Thin brand-coloured reading-progress bar at the very top of the viewport. */
export function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'kz-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  return {
    update(progress: number) { bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress)).toFixed(4)})`; },
    destroy() { bar.remove(); },
  };
}
