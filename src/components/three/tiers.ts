/**
 * Device-tier thresholds. Kept in their own tiny module because the tier check runs in
 * the main bundle (ExperienceGate) — importing config.ts there would pull every 3D
 * tunable into the critical bundle. Re-exported from config.ts, which stays the one
 * place to look for all tunables.
 */
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

