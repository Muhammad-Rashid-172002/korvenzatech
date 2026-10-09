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

/* --------------------------------------------------------- process journey */
export const PROCESS = {
  /** Pin only at/above this viewport width (px). Below it the section is a normal tab list. */
  pinMinWidth: 1024,
  /** …and only when the viewport is at least this tall, so the pinned stage always fits. */
  pinMinHeight: 680,
  /** Extra scroll distance (vh) the stage stays pinned. 250 → the section spends ~350vh on screen. */
  pinLengthVh: 250,
  /** Distance between phase nodes along the path (world units). Larger = longer "flight" between phases. */
  nodeSpacing: 3.2,
  /** Sideways / vertical wander of the path (world units). 0 = straight line. */
  wanderX: 1.5,
  wanderY: 0.65,
  /** Tube radius (core line) and halo radius. Thicker = bolder, more fill-rate on the halo. */
  tubeRadius: 0.04,
  haloRadius: 0.16,
  /** Tube tessellation (segments along the path, radial sides). */
  tubeSegments: { 1: 260, 2: 480 },
  tubeSides: { 1: 6, 2: 10 },
  /** Camera offset from the current phase point (x right, y up, z towards viewer). */
  cameraOffset: [-1.6, 1.3, 4.6] as [number, number, number],
  /** How far ahead (fraction of path) the camera looks; bigger = sees more upcoming phases. */
  lookAhead: 0.1,
  /** Where the current phase sits horizontally on screen (0 = left edge, 1 = right edge).
   *  ~0.47 puts it in the gutter between the phase list and the frosted card. */
  /** Fog start/end distance (world units): the path ahead melts into the section background. */
  fog: [6, 22] as [number, number],
  screenX: 0.47,
  /** Node sizes (world units): core sphere radius, ring radius, glow sprite size. */
  nodeCore: 0.085,
  nodeRing: 0.17,
  nodeGlow: 1.8,
  /** Camera follow damping (higher = snappier, lower = floatier). */
  cameraDamp: 3.2,
  /** Field of view of the journey camera. */
  fov: 42,
  /** Floating dust particles around the path, per tier (0 cost when off-screen). */
  dust: { 1: 140, 2: 360 },
  /** Speed of the light pulse that runs along the travelled part of the tube. */
  pulseSpeed: 0.35,
} as const;

/* -------------------------------------------------------- product phones */
export const PRODUCT = {
  /** Per case study (id from companyData): screen folder in /media/work, brand light, accent glow. */
  apps: {
    'ielts-ai-master': { dir: 'ielts', brand: '#2F5BEA', accent: '#E2384D' },
    skilllink: { dir: 'skilllink', brand: '#6D5CF0', accent: '#A99BFF' },
  } as Record<string, { dir: string; brand: string; accent: string }>,
  /** Number of screens per app (screen-1..N-540.webp). */
  screens: 4,
  /** Start loading screen textures when the card is this close to the viewport. */
  preloadMargin: '600px',
  /** Seconds between screen swaps while hovered (desktop) / auto-cycling (touch). */
  swapEvery: 1.5,
  autoSwapEvery: 3.2,
  /** Duration (s) of one screen transition. */
  swapDuration: 0.6,
  /** Phone body size (world units) and corner radius. Screen aspect is 390:844. */
  body: { w: 1, h: 2.08, d: 0.1, r: 0.15 },
  /** Body colour / finish (graphite). */
  bodyColor: '#14171B',
  /** Max hover tilt toward the pointer (radians). */
  tilt: 0.16,
  /** Camera distance and field of view. */
  cameraZ: 5.5,
  fov: 28,
  /** Contact shadow under the phones (tier 2 only; tier 1 uses a soft blob). */
  shadow: { opacity: 0.55, blur: 2.2, resolution: 256 },
} as const;

/* ------------------------------------------------------------ tech orbit */
export const ORBIT = {
  /** Sphere radius (world units) the logos sit on. */
  radius: 1.55,
  /** Logo sprite size (world units). */
  iconSize: 0.34,
  /** Idle spin (rad/s). */
  baseSpeed: 0.18,
  /** Extra spin per px/frame of scroll velocity, and its cap (rad/s). */
  scrollGain: 0.035,
  maxBoost: 1.4,
  /** Opacity multiplier for the other logos while one is hovered. */
  dimOthers: 0.3,
  /** Camera. */
  fov: 35,
  cameraZ: 6,
} as const;

/* ------------------------------------------------------------- CTA particles */
export const CTA = {
  /** Logo image the K is sampled from (dark/opaque pixels become particles). */
  logo: '/media/brand/logo-256.webp',
  /** Particle count per tier (1 = lite, 2 = full). Linear GPU cost. */
  count: { 1: 2200, 2: 6000 } as Record<number, number>,
  /** Size of the formed K (world units) and base point size (px at dpr 1). */
  size: 3.1,
  pointSize: 3.4,
  /** How much the logo's own colours are pulled toward brand emerald (0 = logo colours, 1 = all emerald). */
  brandMix: 0.8,
  /** Cursor repel radius (world units). */
  repelRadius: 0.55,
  /** Burst duration before navigating (ms). Also used by the button. */
  burstMs: 520,
  fov: 35,
  cameraZ: 6,
} as const;

/* --------------------------------------------------------- motion (DOM/GSAP) */
export const SCROLL = {
  /** Lenis smoothing: lower = heavier, longer glide. 0.1 is calm and premium. */
  lerp: 0.1,
  /** Mouse-wheel multiplier. */
  wheelMultiplier: 1,
} as const;
