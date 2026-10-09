/**
 * Shared scroll state — tiny, dependency-free, in the main bundle.
 * The lazy smooth-scroll module (lib/scroll.ts) writes here; 3D scenes read here.
 */
type LenisLike = { scrollTo: (target: number | HTMLElement, opts?: { immediate?: boolean; offset?: number; duration?: number }) => void; stop: () => void; start: () => void };

export const scrollStore = {
  /** Current scroll position (px). */
  y: 0,
  /** Smoothed scroll velocity (px/frame, signed). */
  velocity: 0,
  /** Whole-page progress 0..1. */
  progress: 0,
  /** Active Lenis instance, when smooth scrolling is running. */
  lenis: null as LenisLike | null,
};

/** Scrubbed per-section progress (0..1), keyed by section id (e.g. "hero"). */
export const sectionProgress: Record<string, number> = {};

/** Scroll ranges (px) of pinned sections, written on every ScrollTrigger refresh. */
export const pinRanges: Record<string, { start: number; end: number }> = {};

/** Scroll to an absolute Y position, cooperating with Lenis when it is active. */
export function scrollToY(y: number, smooth = true) {
  if (scrollStore.lenis) scrollStore.lenis.scrollTo(y, { immediate: !smooth });
  else window.scrollTo({ top: y, behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior) });
}

/** Jump/scroll to the top, cooperating with Lenis when it is active. */
export function scrollToTop(immediate = true) {
  if (scrollStore.lenis) scrollStore.lenis.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, left: 0, behavior: immediate ? ('instant' as ScrollBehavior) : 'smooth' });
}

/** Scroll an element into view, cooperating with Lenis when it is active. */
export function scrollToElement(el: HTMLElement, smooth = true) {
  if (scrollStore.lenis) scrollStore.lenis.scrollTo(el, { immediate: !smooth, offset: -80 });
  else el.scrollIntoView({ behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior), block: 'start' });
}
