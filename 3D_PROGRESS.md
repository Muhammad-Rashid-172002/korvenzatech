# 3D Experience — Progress

Branch: `feature/3d-experience` · Stack: Vite 6 + React 19 + TS (prerendered SSR, hydrated) · three 0.185.1 · R3F 9.8.1 · drei 10.7.9 · gsap 3.15.0 · lenis 1.3.26

## Checklist

- [x] Foundation
- [x] Hero
- [ ] Process journey
- [ ] Product phones (+ screenshot generation — NEEDS RASHID REVIEW)
- [ ] Services bento
- [ ] Tech orbit
- [ ] CTA particles
- [ ] Testimonials
- [ ] Leadership
- [ ] Global effects
- [ ] Final audit

## Prerender check (live issue)

- Local build is correct: `dist/index.html` contains the full homepage text (~14k chars); all 20 routes prerender.
- Live: `korvenzatech.com/index.html`, `/about`, `/services` serve the **new** prerendered pages. Only `/` (and `www/`) still return the old noscript shell.
- Conclusion: the deploy is current; `/` is served from a **stale cache layer**. Fix: check `cf-cache-status` / `x-vercel-cache` / `age` headers for `/` in devtools, purge the CDN/host cache (or redeploy), re-test. No code change needed.

## Decisions / deviations from the brief (safer option chosen)

1. **Postprocessing (bloom/grain/vignette):** `EffectComposer` renders the whole canvas and does not work per-`<View>` (scissored scenes). Using it would force a full-screen composite every frame. Instead: additive glow sprites (cheap per-view bloom) + CSS grain/vignette already in the hero. `@react-three/postprocessing` / `postprocessing` are **not installed** (0 KB).
2. **zustand:** not installed. A tiny module store (`src/lib/scrollStore.ts`) holds scroll/velocity/section progress, read inside `useFrame` (no React re-renders). Same result, ~0 KB.
3. **Frameloop:** canvas runs `always` only while a 3D view is on screen and the tab is visible, otherwise `never` (`VisibilityLoop`). Scroll-driven scenes animate every frame while visible, so `demand` + `invalidate` would invalidate every frame anyway; the visibility gate gives the same idle cost (0 frames when off-screen).
4. **Chunk size:** R3F 9 imports the full `three` namespace, so the lazy Experience chunk is 261 KB gzip (was 136 KB for the old imperative scene). It loads only after `load` + idle on tier 1/2 devices; tier 0 never downloads it. `chunkSizeWarningLimit` raised to 1000 with a comment.
5. **Lighthouse note:** headless Lighthouse reports a software GPU, so it runs tier 0 (poster only). Scores therefore measure the real first-paint path; 3D cost is checked separately with forced-3D Playwright runs (`?kz3d=force`).

## Known issues

- `THREE.Clock: This module has been deprecated` warning comes from inside R3F 9.8.1 (not our code); appears only when the 3D layer boots. Will re-check in the final audit.
- In the sandbox, Google Fonts fail to load (proxy) → Lighthouse "errors-in-console" (best-practices 96). Not reproducible on the real host.

---

## Section log

### Foundation + Hero — done

**Files:** `package.json` (removed `motion`; added gsap, @gsap/react, lenis, R3F, drei — exact pins), `vite.config.ts`, `src/components/three/{config.ts, Experience.tsx, ExperienceGate.tsx, hooks/*, materials/textures.ts, scenes/Hero.tsx}`, `src/lib/{scroll.ts, scrollStore.ts, motion.ts}`, `src/components/Hero.tsx`, `src/components/hero3d/HeroStage.tsx` (poster only), removed `hero3d/scene.ts`, `src/index.css`, `src/App.tsx` (Lenis-aware scroll helpers + gate), `data-lenis-prevent` on chat body, mobile menu, Insights + Legal dialogs, `TrustStrip.tsx` (z-index so the canvas layers correctly).

**What it does:** one fixed, `aria-hidden`, pointer-events-none canvas; scenes render into DOM tracks via `<View>`. Device tiers: 0 = poster only (no WebGL / software GPU / Save-Data / reduced motion), 1 = lite (no transmission, fewer particles, dpr ≤ 1.25), 2 = full (dpr ≤ 1.75). QA overrides: `?kz3d=off|lite|force`. Hero: transmission crystal + metallic core, 3 glowing rings, 4 UI panels, particle network with live links, cursor light + parallax, scroll dolly + dissolve into the next section. Headline split (SplitText) after paint, movement only; "exceptional" CSS shimmer. Poster stays until the first 3D frame, then cross-fades.

**Bundle (gzip):** main 116.85 → 118.23 KB (**+1.4 KB**) · scroll chunk 54.5 KB (lazy, after paint) · Experience chunk 261 KB (lazy, tier 1/2 only) · CSS 18.48 KB.

**Lighthouse (local prod build, `/`):** mobile Perf 90 · A11y 100 · BP 96 · SEO 100 (LCP 2.5 s, TBT 240 ms, CLS 0). Desktop 100 / 100 / 96 / 100.

**Manual test checklist**
- Laptop (Chrome, dark + light): page loads with poster; within ~1 s the live crystal fades in at the same spot (no jump). Move the mouse over the hero → composition tilts subtly, a green light follows the cursor on the crystal. Scroll 0 → 100% of hero: camera dollies in, crystal particles dissolve downward into the tech strip, all smooth (Lenis). Expected 60 FPS on integrated GPU.
- Headline: visible immediately; words lift slightly once after load; never invisible. "exceptional" shimmers slowly.
- Scroll past the hero → canvas stops rendering (DevTools Performance: no GPU frames). Switch tab and return → resumes.
- Nav links / hash links / "back to top" scroll smoothly and land below the sticky nav; chat widget and mobile menu scroll internally (not the page).
- Android mid-range: tier 1 (`html[data-kz-tier="1"]`): no glass refraction, fewer particles, 45–60 FPS; mobile scroll still native-feeling. Low-end / Save-Data / reduced motion: poster only, no JS 3D download.
- `?kz3d=off` → poster only; `?kz3d=lite` → tier 1 on desktop.
