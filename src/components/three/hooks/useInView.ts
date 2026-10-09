import { useEffect, useRef } from 'react';

/** Ref-based visibility (no re-render): `visible.current` is true while el intersects the viewport. */
export function useInViewRef(el: Element | null, rootMargin = '10% 0px') {
  const visible = useRef(false);
  useEffect(() => {
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [el, rootMargin]);
  return visible;
}
