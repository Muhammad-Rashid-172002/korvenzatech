/**
 * [data-kz-countup]: when it scrolls into view, the first number in the
 * element's text counts up from 0 to its real value (keeps zero padding and
 * any text around it). The server-rendered final value is what no-JS,
 * reduced-motion and screen-reader users get.
 */
export function bindCountUp(root: ParentNode = document): () => void {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-kz-countup]'));
  if (!els.length) return () => {};
  const rafs = new Set<number>();
  const run = (el: HTMLElement) => {
    const text = el.textContent ?? '';
    const m = text.match(/\d+/);
    if (!m || m.index === undefined) return;
    const target = Number(m[0]);
    const pad = m[0].length;
    const before = text.slice(0, m.index);
    const after = text.slice(m.index + m[0].length);
    el.setAttribute('aria-label', text);
    const t0 = performance.now();
    const dur = 900 + Math.min(600, target * 20);
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const v = Math.round(target * (1 - Math.pow(1 - k, 3)));
      el.textContent = before + String(v).padStart(pad, '0') + after;
      if (k < 1) rafs.add(requestAnimationFrame(step));
      else el.removeAttribute('aria-label');
    };
    rafs.add(requestAnimationFrame(step));
  };
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    run(e.target as HTMLElement);
  }), { threshold: 0.6 });
  els.forEach((el) => { if (!el.dataset.kzCounted) { el.dataset.kzCounted = '1'; io.observe(el); } });
  return () => { io.disconnect(); rafs.forEach((r) => cancelAnimationFrame(r)); };
}
