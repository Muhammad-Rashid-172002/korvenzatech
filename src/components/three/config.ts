/**
 * KorvenzaTech 3D experience — single place to tune the look and the cost.
 *
 * Every visual/perf knob of the WebGL layer lives here. Values are grouped by
 * concern; each one says what it does and what raising/lowering it costs.
 * Colours are brand tokens (see src/index.css) so 3D and DOM stay in sync.
 */

/* ------------------------------------------------------------------ colours */
export const COLORS = {
  /** Brand emerald accent — rims, rings, nodes, glows. */
  accent: '#19C784',
  /** Deep brand emerald — crystal body tint, inner core metal. */
  primary: '#087F5B',
  /** Pale mint — highlights, panel line-work, ring metal. */
  mint: '#A6EBCD',
  /** Very light mint — specular-ish whites without going pure white. */
  ice: '#D2F5E5',
  /** Hero background behind the crystal; used by the transmission sampler so
   *  refraction picks up the same green-black the page shows. */
  heroBg: '#0A1A14',
  /** Fog / atmosphere colours per theme (hero stays cinematic-dark in both,
   *  so the light value only nudges it a little brighter). */
  fogDark: '#07110E',
  fogLight: '#0C1E18',
} as const;

/* -------------------------------------------------------------- device tiers */
/**
 * Tier 0 → no WebGL at all (static poster): no WebGL, software rasteriser,
 *          Save-Data, or prefers-reduced-motion.
 * Tier 1 → "lite": phones/tablets, ≤ TIER1_MAX_CORES cores, ≤ TIER1_MAX_MEMORY GB,
 *          or a known mobile GPU. No transmission, fewer particles, lower DPR.
 * Tier 2 → "full": desktop-class GPU — everything on.
 */
export const TIERS = {
  /** Logical CPU cores at or below which a device is treated as tier 1. */
  TIER1_MAX_CORES: 4,
  /** navigator.deviceMemory (GB) at or below which a device is tier 1. */
  TIER1_MAX_MEMORY: 4,
  /** Viewport width (px) below which we always use the lite tier. */
  TIER1_MAX_WIDTH: 767,
  /** GPU renderer strings that indicate a mobile/low-power GPU (→ tier 1). */
  MOBILE_GPU: /mali|adreno|powervr|apple gpu|sgx|tegra|videocore|intel\(r\) (hd|uhd) graphics [0-9]{3}\b/i,
  /** GPU renderer strings that mean "no real GPU" (→ tier 0, poster only). */
  SOFTWARE_GPU: /swiftshader|llvmpipe|softpipe|software|basic render/i,
} as const;

/* ---------------------------------------------------------------- renderer */
export const RENDER = {
  /** Device-pixel-ratio range per tier. Higher = sharper but quadratic GPU cost. */
  dpr: { 1: [1, 1.25] as [number, number], 2: [1, 1.75] as [number, number] },
  /** Hardware MSAA. Off on lite devices (big win on mobile fill-rate). */
  antialias: { 1: false, 2: true },
  /** PerformanceMonitor: average FPS below `lower` for a while → degrade
   *  (drop DPR, disable transmission); above `upper` → allow recovery. */
  fpsLower: 45,
  fpsUpper: 58,
  /** How many decline events before we permanently switch to lite materials. */
  maxDeclines: 2,
  /** Tone-mapping exposure for the whole canvas. */
  exposure: 1.05,
} as const;

/* -------------------------------------------------------------------- hero */
export const HERO = {
  /** Camera vertical field of view (deg) — narrower feels more "product shot". */
  fov: 32,
  /** Camera distance from the core at rest (world units). */
  cameraZ: 8.6,
  /** Scroll dolly: camera ends at cameraZ * dollyTo when the hero has scrolled out. */
  dollyTo: 0.62,
  /** Size (world units) of the composition that maps onto the poster stage box. */
  compositionSize: 5.6,
  /** Mouse parallax: max camera offset (world units) and smoothing (higher = snappier). */
  parallax: 0.35,
  parallaxDamping: 2.2,
  /** Max crystal tilt toward the cursor (radians). */
  crystalTilt: 0.22,
  /** Idle rotation speeds (radians / second). */
  spin: { crystal: 0.16, rings: [0.07, -0.05, 0.035], panels: 0.06, network: -0.025 },

  crystal: {
    radius: 0.92,
    /** Transmission material (tier 2 only). `samples`/`resolution` are the main
     *  cost drivers: each frame the scene is re-rendered into a resolution² buffer. */
    transmission: { samples: 6, resolution: 512, thickness: 0.65, roughness: 0.06, ior: 1.42, chromaticAberration: 0.06, anisotropicBlur: 0.12, distortion: 0.12, distortionScale: 0.4, temporalDistortion: 0.06 },
    /** Cursor light that makes facets near the pointer light up. */
    cursorLight: { intensity: 14, distance: 3.2 },
  },
  rings: [
    /** radius, tube, tilt x, tilt y — three thin glowing orbits on different axes. */
    { radius: 1.75, tube: 0.011, rx: 1.28, ry: 0.1 },
    { radius: 2.15, tube: 0.008, rx: 1.62, ry: -0.42 },
    { radius: 2.55, tube: 0.006, rx: 0.42, ry: 0.9 },
  ],
  panels: {
    /** "UI" planes orbiting the core: kind, size [w,h], orbit radius, orbit phase, height. */
    items: [
      { kind: 'dashboard', size: [1.7, 1.05], radius: 2.35, phase: 0.4, y: 0.75 },
      { kind: 'mobile', size: [0.62, 1.22], radius: 2.1, phase: 2.3, y: -0.55 },
      { kind: 'dashboard', size: [1.45, 0.9], radius: 2.55, phase: 3.9, y: -0.2 },
      { kind: 'mobile', size: [0.55, 1.1], radius: 2.25, phase: 5.2, y: 0.9 },
    ],
    opacity: 0.92,
    /** Scroll: panels fly outward to radius * (1 + flyOut) as the hero scrolls away. */
    flyOut: 1.8,
  },
  network: {
    /** Points in the "connected systems" field per tier. Lines are O(n²) per frame. */
    count: { 1: 64, 2: 130 },
    /** Shell the points live in (inner/outer radius, world units). */
    shell: [2.1, 3.3] as [number, number],
    /** Two points closer than this get a connection line. */
    linkDistance: 0.95,
    /** Hard cap on drawn connection lines (memory + fill-rate guard). */
    maxLinks: 420,
    /** Point sprite size (world units) and drift speed. */
    pointSize: 0.06,
    drift: 0.12,
  },
  dissolve: {
    /** Particles the crystal dissolves into on scroll, per tier. */
    count: { 1: 260, 2: 700 },
    /** How far (world units) particles fall into the next section at full scroll. */
    flow: 5.2,
    /** Sideways spread of the flow. */
    spread: 1.4,
  },
  /** Extra height (in vh) the hero view extends below the hero so dissolve
   *  particles can visibly flow into the next section. */
  overflowVh: 35,
} as const;

/* --------------------------------------------------------- motion (DOM/GSAP) */
export const SCROLL = {
  /** Lenis smoothing: lower = heavier, longer glide. 0.1 is calm and premium. */
  lerp: 0.1,
  /** Mouse-wheel multiplier. */
  wheelMultiplier: 1,
} as const;
