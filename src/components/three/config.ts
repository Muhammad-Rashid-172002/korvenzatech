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
/** Tier thresholds live in ./tiers.ts (main-bundle safe) — re-exported here. */
export { TIERS } from './tiers';
import { logo256 } from '../../assets/brand';

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
  /** Exposure under AgX tone mapping (hero view only; other views keep ACES). */
  agxExposure: 1.35,
  /** Size (world units) of the composition that maps onto the poster stage box. */
  compositionSize: 6.0,
  /** Composition half-width incl. the outer devices (world units): the stage is shrunk so this always fits on screen. */
  halfWidth: 4.4,
  /** Composition centre offset as a fraction of the stage width (desktop only; negative = left). */
  shiftX: -0.1,
  /** Lift the whole composition (world units) to balance the headline. */
  liftY: 0.3,
  /** Offset of the K inside the composition (up-left, making room for the front AI browser). */
  kOffset: [-0.4, 0.25] as [number, number],
  /** Mouse parallax: max camera offset (world units) and smoothing (higher = snappier). */
  parallax: 0.35,
  parallaxDamping: 2.2,
  /** Max crystal tilt toward the cursor (radians). */
  crystalTilt: 0.22,
  /** Idle rotation speeds (radians / second). */
  spin: { crystal: 0.16, network: -0.025 },

  crystal: {
    /** Outer glass crystal radius (V2: +25% so it is clearly the hero). */
    radius: 1.15,
    /** Real glass (tier 2 only). `samples`/`resolution` are the main cost drivers: the scene is
     *  re-rendered into a resolution² buffer each frame (twice with backside). */
    /** Physically-based glass (tier 2): three's native transmission, double-sided (back faces
     *  refract too), `dispersion` = chromatic aberration. See 3D_PROGRESS.md for why not drei's
     *  MeshTransmissionMaterial (it samples screen-space and breaks inside offset drei Views). */
    transmission: { thickness: 1.5, roughness: 0.05, ior: 1.5, dispersion: 1.6, specularIntensity: 1, clearcoat: 1, clearcoatRoughness: 0.02 },
    /** Transmission buffer resolution scale (1 = full view resolution; lower = cheaper, softer). */
    transmissionScale: 0.75,
    /** Glass tint: clear with an emerald cast (attenuation colours light as it travels through). */
    tint: '#E9FFF5',
    attenuationColor: '#3FE0A6',
    attenuationDistance: 10,
    /** Glowing facet edges: tube radius (world units), base glow, shimmer sweep period (s) and width. */
    edges: { radius: 0.01, base: 0.6, sweepPeriod: 3.6, sweepWidth: 0.35 },
    /** Inner emissive core: size relative to the crystal, heartbeat (bpm) and emissive range. */
    core: { scale: 0.34, color: '#06402C', emissive: '#14C483', bpm: 54, emissiveMin: 1, emissiveMax: 2.5, spin: -0.5 },
    /** Cursor light that makes facets near the pointer light up. */
    cursorLight: { intensity: 14, distance: 3.2 },
  },
  /** Image-based lighting built from procedural light panels (no HDR download). Each is a bright
   *  emissive plane rendered once into a PMREM env map: what the glass reflects and refracts. */
  lightformers: [
    /** Large soft white key, top-left. */
    { color: '#FFFFFF', intensity: 3.2, position: [-4.5, 4.5, 3.5] as [number, number, number], scale: [4.5, 2.2] as [number, number] },
    /** Thin hard white strip, top-left: crisp specular line along the K's bevels. */
    { color: '#FFFFFF', intensity: 9, position: [-3.2, 2.6, 4.2] as [number, number, number], scale: [0.35, 4] as [number, number] },
    /** Emerald rim strip on the right. */
    { color: '#19C784', intensity: 11, position: [5.5, 0.2, 1.2] as [number, number, number], scale: [0.6, 7] as [number, number] },
    /** Cool teal strip behind. */
    { color: '#2DD4BF', intensity: 4, position: [0, 1.2, -6] as [number, number, number], scale: [9, 0.6] as [number, number] },
    /** Soft panels behind the camera: as the K sways, its face picks up a moving reflection gradient. */
    { color: '#E6FFF4', intensity: 1.1, position: [0, 3.5, 9] as [number, number, number], scale: [12, 4] as [number, number] },
    { color: '#5FE3AE', intensity: 0.5, position: [0, -2.5, 9] as [number, number, number], scale: [12, 3] as [number, number] },
    /** Dim fill below. */
    { color: '#A6EBCD', intensity: 0.7, position: [0, -6, 0] as [number, number, number], scale: [10, 10] as [number, number] },
  ],
  /** What the glass 'sees' behind it (transmission backdrop) — the hero background tone. */
  glassBackdrop: '#1F5440',
  /** Env-map strength on the glass/panels. */
  envIntensity: 1.15,
  /** Exponential fog density (dark green); higher = space fades sooner. */
  fogDensity: 0.055,
  rings: [
    /** radius, tube thickness, tilt x, tilt y, trail head speed (rev/s), packet count + speeds. */
    { radius: 2.05, tube: 0.042, rx: 1.28, ry: 0.1, speed: 0.11, packets: [0.17, -0.09] },
    { radius: 2.5, tube: 0.034, rx: 1.62, ry: -0.42, speed: -0.08, packets: [0.12, 0.21, -0.06] },
    { radius: 2.95, tube: 0.028, rx: 0.42, ry: 0.9, speed: 0.06, packets: [-0.14, 0.08] },
  ],
  /** Ring draw-in on load (s) and stagger between rings (s). Trail length = fraction of the ring lit. */
  ringDrawIn: 1.6,
  ringStagger: 0.25,
  ringTrail: 0.75,
  /** Brightness of the unlit part of each ring (0 = invisible, 0.2 = faint glass tube). */
  ringBase: 0.2,
  /** Data packet sprite size (world units). */
  packetSize: 0.34,
  /** Core glow sprite size (× crystal radius) and colour. */
  coreGlow: { size: 4.2, color: '#2fe0a0' },
  /** Glass "K" logo (Phase 3) — extruded from brand-source/k-mark.svg. */
  k: {
    /** Height of the K (world units). The old crystal was 2.3 across; the K is a bit larger. */
    height: 3.05,
    /** Extrusion depth, bevel size/thickness and bevel segments (smooth bevel). */
    depth: 0.35,
    bevel: 0.03,
    bevelSegments: 3,
    /** Normals are smoothed across angles below this (rounded bevel, crisp caps). */
    creaseAngle: 0.6,
    /** Glass tints: emerald body, smoky charcoal for the bar / upper stem (logo colours). */
    tint: '#BFFFE2',
    charcoalTint: '#8E9C96',
    /** Physical transmission (tier 2). thickness/ior/dispersion (= chromatic aberration). */
    transmission: { thickness: 1.2, roughness: 0.015, ior: 1.5, dispersion: 0.35, specularIntensity: 1, clearcoat: 1, clearcoatRoughness: 0.02 },
    attenuationColor: '#1FD08A',
    attenuationDistance: 1.1,
    /** Reflection strength of the light panels on the glass (specular edges). */
    envIntensity: 2.4,
    /** Additive emerald body tint + fresnel rim over the clear glass (0 = invisible slab). */
    bodyTint: { color: '#1FD08A', fill: 0.07, rim: 0.55 },
    /** Shards: total count, max triangle edge before subdividing, intro stagger (0..1 of the intro). */
    shards: 100,
    maxEdge: 0.24,
    stagger: 0.55,
    /** Where shards start: sideways spread and how far behind the logo (world units). */
    flyRadius: 3.2,
    flyDepth: 9,
    /** Intro: delay after first frame, duration (s). Lock = end of intro → shockwave. */
    introDelay: 0.15,
    introDuration: 1.65,
    /** Idle: float amplitude (world), rotation amplitude (rad, ±12°) and period (s), mouse tilt (rad). */
    float: 0.07,
    sway: 0.21,
    swayPeriod: 9,
    tilt: 0.18,
    /** Hover: rotation speed multiplier and core brightness boost. */
    hoverSpeed: 2.6,
    hoverCore: 1.6,
    /** Edge glow: tube radius, base intensity, sweep period (s). Circuit traces are brighter. */
    edge: { radius: 0.0075, base: 0.45, period: 6, width: 0.3 },
    /** The logo's circuit traces as glowing lines on the stem. Off: at hero scale they read as slits in the glass. */
    trace: { enabled: false, radius: 0.007, base: 0.8 },
    /** Shockwave ring: max radius (world), duration (s). Also ripples the network and floor. */
    shock: { radius: 6.5, duration: 1.5 },
  },
  devices: {
    /** Four devices around the K at different depths. kind → screen; frame = phone | browser.
     *  pos/rot are in composition space; `blur` < 1 = far, defocused screen (cheap DOF);
     *  `target` = what clicking does (scroll to a case study or open the AI widget). */
    items: [
      // The readable "hero device": closest and largest, bottom-right in front of the K's leg tips.
      { screen: 'agent', frame: 'browser', pos: [1.85, -1.55, 1.5], rot: [-0.04, -0.28, 0.0], scale: 1.45, blur: 1, target: 'ai' },
      { screen: 'ielts', frame: 'phone', pos: [-2.45, -0.15, 0.9], rot: [0.03, 0.42, 0.04], scale: 1.05, blur: 1, target: 'case:ielts-ai-master' },
      // Smaller and further back, defocused.
      { screen: 'skilllink', frame: 'phone', pos: [2.55, 1.3, -1.9], rot: [0.06, -0.32, 0.03], scale: 0.85, blur: 0.6, target: 'case:skilllink' },
      // Directly behind the K: seen refracted through the glass.
      { screen: 'dashboard', frame: 'browser', pos: [0.35, 0.55, -3.8], rot: [0.05, -0.1, 0], scale: 1.05, blur: 0.42, target: '' },
    ] as { screen: 'ielts' | 'skilllink' | 'dashboard' | 'agent'; frame: 'phone' | 'browser'; pos: [number, number, number]; rot: [number, number, number]; scale: number; blur: number; target: string }[],
    /** Phone body (w, h, depth, corner) and browser body (w, h, depth, corner), world units. */
    phone: { w: 0.9, h: 1.9, d: 0.085, r: 0.13, bezel: 0.032 },
    browser: { w: 2.3, h: 1.45, d: 0.055, r: 0.07, bezel: 0.028 },
    /** Screen canvas scale (DPR) per tier; tier 1 screens are static frames. */
    screenScale: { 1: 1.25, 2: 2 } as Record<number, number>,
    /** Screen texture uploads per rendered frame (round-robin; 1 → each of 4 screens ≈ 15 fps at 60). */
    uploadsPerFrame: 1,
    /** Hover: pull toward the camera (world) and loop speed multiplier. */
    hoverForward: 0.35,
    hoverSpeed: 1.8,
    /** Screen brightness (emissive gain; not tone-mapped) for near and far (defocused) devices. */
    screenGain: 1.15,
    farScreenGain: 0.6,
    /** Body finish. */
    bodyColor: '#151A19',
    /** Bob amplitude/speed. */
    bob: [0.06, 0.6] as [number, number],
    /** Scroll: devices fly outward (position × (1 + flyOut)). */
    flyOut: 1.4,
  },
  /** Three particle depth layers: far stars, mid network (below), near bokeh. */
  stars: { count: { 1: 220, 2: 520 } as Record<number, number>, radius: [9, 16] as [number, number], size: 0.05 },
  bokeh: { count: { 1: 0, 2: 12 } as Record<number, number>, size: [0.35, 0.8] as [number, number], opacity: 0.16 },
  /** Light pulses running along network links into the logo. */
  pulses: { count: { 1: 4, 2: 10 } as Record<number, number>, speed: 0.55, size: 0.18 },
  floor: {
    /** Perspective grid floor below the crystal (local y), size, cell size and line glow. */
    y: -2.35,
    size: 26,
    cell: 0.55,
    lineOpacity: 0.3,
    /** Radius (world units) over which the floor fades into the page — no hard edges. */
    fadeRadius: 6.5,
    /** Reflection (tier 2 only, not lite): blur, strength, resolution. Kept faint. */
    reflector: { resolution: 512, blur: [400, 120] as [number, number], mixBlur: 1, mixStrength: 0.9, mixContrast: 1, depthScale: 1.1, minDepthThreshold: 0.35, maxDepthThreshold: 1.4, opacity: 0.55 },
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
  logo: logo256,
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
