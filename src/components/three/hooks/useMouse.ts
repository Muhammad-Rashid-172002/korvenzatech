/**
 * Global pointer store (normalised -1..1, y up). One passive listener for the
 * whole app; read it inside useFrame without causing React renders.
 */
export const mouse = { x: 0, y: 0, clientX: 0, clientY: 0, active: false };

let bound = false;
export function bindMouse() {
  if (bound || typeof window === 'undefined') return;
  bound = true;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return; // touch never drives parallax
    mouse.clientX = e.clientX;
    mouse.clientY = e.clientY;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    mouse.active = true;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.active = false; });
}

export const useMouse = () => mouse;
