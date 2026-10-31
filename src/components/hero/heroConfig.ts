/**
 * Homepage hero (DOM/CSS composition) — tunables in one place.
 * Movement values are pixels at the 1200 px design width; the stage is zoomed down on
 * smaller screens (see hero.css), so motion scales with it.
 */
export const HERO_MOTION = {
  /** Pointer depth: max offset (px) for a layer with depth 1; damping per second (higher = snappier). */
  pointerPx: 14,
  pointerDamping: 4.5,
  /** Logo tilt toward the pointer (deg). */
  logoTiltDeg: 7,
  /** Scroll parallax: px a layer with depth 1 drifts while the hero scrolls out. */
  scrollPx: 90,
} as const;

/** Original KorvenzaTech K artwork (background removed only; see scripts/build-hero-logo.mjs). */
export const HERO_LOGO = {
  src: '/media/brand/k-original-640.webp',
  srcSet: '/media/brand/k-original-480.webp 480w, /media/brand/k-original-640.webp 640w, /media/brand/k-original-800.webp 800w, /media/brand/k-original-1200.webp 1200w',
  /** Intrinsic aspect of the trimmed artwork (1483 × 1821). */
  width: 1483,
  height: 1821,
  /** Rendered width: 340 px on the desktop stage, up to 300 px on tablets and 280 px on phones. */
  sizes: '(min-width: 1024px) 340px, (min-width: 640px) 300px, 280px',
} as const;

/** AI agent demo loop: one step every `stepMs`, `holdSteps` steps showing the finished state. */
export const AGENT_LOOP = { stepMs: 1150, holdSteps: 4 } as const;
