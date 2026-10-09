import { scrollStore, sectionProgress } from '../../../lib/scrollStore';

/**
 * Scroll is the single source of truth: Lenis → ScrollTrigger → this store.
 * Read these values inside useFrame — they are plain mutable numbers, never
 * React state, so reading them costs nothing and causes no re-renders.
 */
export function useScrollProgress(section?: string) {
  return {
    store: scrollStore,
    progress: () => (section ? sectionProgress[section] ?? 0 : 0),
  };
}
