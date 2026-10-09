import { useEffect, useRef } from 'react';
import { MathUtils } from 'three';

/**
 * 0 = dark theme, 1 = light theme, eased over time so materials, fog and
 * lights cross-fade instead of hard-swapping. Call `tick(delta)` in useFrame.
 */
export function useThemeBlend() {
  const target = useRef(0);
  const value = useRef(0);
  useEffect(() => {
    const read = () => { target.current = document.documentElement.dataset.theme === 'light' ? 1 : 0; };
    read();
    value.current = target.current;
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);
  return {
    value,
    tick(delta: number) { value.current = MathUtils.damp(value.current, target.current, 3, delta); return value.current; },
  };
}
