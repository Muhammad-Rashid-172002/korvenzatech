import { TIERS } from '../tiers';

export type Tier = 0 | 1 | 2;
export type TierInfo = { tier: Tier; reason: string; renderer: string };

let cached: TierInfo | null = null;

/**
 * Classify the device once per page load (see TIERS in config.ts).
 * Pure function — safe to call from effects; never call during SSR render.
 */
export function detectTier(): TierInfo {
  if (cached) return cached;
  const q = window.location.search;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer = '';
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      renderer = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    } else {
      return (cached = { tier: 0, reason: 'no-webgl', renderer });
    }
  } catch {
    return (cached = { tier: 0, reason: 'no-webgl', renderer });
  }

  // QA overrides: ?kz3d=off | lite | force
  if (/[?&]kz3d=off\b/.test(q)) return (cached = { tier: 0, reason: 'override-off', renderer });
  if (/[?&]kz3d=lite\b/.test(q)) return (cached = { tier: 1, reason: 'override-lite', renderer });
  if (/[?&]kz3d=force\b/.test(q)) return (cached = { tier: 2, reason: 'override-force', renderer });

  if (reduced) return (cached = { tier: 0, reason: 'reduced-motion', renderer });
  if (nav.connection?.saveData) return (cached = { tier: 0, reason: 'save-data', renderer });
  if (TIERS.SOFTWARE_GPU.test(renderer)) return (cached = { tier: 0, reason: 'software-gpu', renderer });

  const lite =
    window.innerWidth <= TIERS.TIER1_MAX_WIDTH ||
    window.matchMedia('(pointer: coarse)').matches ||
    (nav.hardwareConcurrency ?? 8) <= TIERS.TIER1_MAX_CORES ||
    (nav.deviceMemory ?? 8) <= TIERS.TIER1_MAX_MEMORY ||
    TIERS.MOBILE_GPU.test(renderer);
  return (cached = { tier: lite ? 1 : 2, reason: lite ? 'lite-device' : 'full', renderer });
}
