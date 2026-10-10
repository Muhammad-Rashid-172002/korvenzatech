# 3D Experience — Progress

Branch: `feature/3d-experience` · Stack: Vite 6 + React 19 + TS (prerendered SSR, hydrated) · three 0.185.1 · R3F 9.8.1 · drei 10.7.9 · gsap 3.15.0 · lenis 1.3.26

## Checklist

- [x] Foundation
- [x] Hero
- [x] Process journey
- [x] Screenshot generation — **NEEDS RASHID REVIEW** (`tools/screens/contact-sheet.png`)
- [x] Product phones
- [x] Services bento
- [x] Tech orbit
- [x] CTA particles
- [x] Testimonials
- [x] Leadership
- [x] Global effects
- [x] Final audit

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

6. **Services micro-scenes are SVG + CSS, not WebGL.** The cards tilt in 3D (CSS perspective) and have opaque backgrounds; a WebGL view behind them would be hidden by the card or mis-align with the tilted border, and six extra scissored renders cost GPU for tiny visuals. SVG micro-scenes tilt with the card, work on every tier (incl. phones), and cost ~1 KB.

7. **Orbit hover is ray-cast manually.** drei `View` only routes R3F pointer events when the event target is the track element itself (and the last View to mount takes over `events.connected`), so R3F `onPointerOver` cannot work with tracks that sit under page content. The orbit listens on its stage element and ray-casts every frame (bonus: logos moving under a still cursor still highlight).
8. **three.js split into its own lazy vendor chunk** (`three-*.js`, 190 KB gzip) so the Experience chunk is ~89 KB and long-term cacheable; still only downloaded on tier 1/2 after load.

9. **Leadership fog/parallax is CSS + GSAP, not WebGL** — the brief asked for "subtle"; drifting gradient fog layers and scrubbed column parallax give that at near-zero cost on every tier, without a fourth always-on WebGL view behind photos.

## Known issues

- **R3F 9.8.1 portal leak (upstream):** every drei `<View>` portal subscribes to the root store and never unsubscribes, and each portal state keeps a closure to the previous one, so every root-state write is retained. Mitigated: Views are now mounted once per slot for the whole session (scenes inside mount/unmount per route), and root writes only happen when a value actually changes. Measured JS heap over 20-route SPA laps: was +1.8 MB/lap, now ~+0.4 MB/lap and flattening. A one-line upstream fix (or `patch-package`) would remove it fully — your call; not applied, to avoid patching node_modules.
- The `THREE.Clock` deprecation notice (created inside R3F 9.8.1) is dropped via three's official `setConsoleFunction` hook; every other three message is forwarded.
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

### Process "Journey" — done

**Files:** `src/components/ProcessTimeline.tsx`, `src/components/three/scenes/Process.tsx` (new), `src/components/three/materials/GlowTube.ts` (new shader), `src/components/three/Experience.tsx` (process view), `src/components/three/config.ts` (`PROCESS` block), `src/lib/scroll.ts` (pin via `gsap.matchMedia`), `src/lib/scrollStore.ts` (`pinRanges`, `scrollToY`), `src/index.css`.

**What it does:** on ≥1024×680 screens with the 3D layer, the phase stage pins for 250vh (section ≈350vh). Scroll flies the camera along a glowing CatmullRom tube through 7 phase nodes (travelled part lit, pulse runs along it, current node ignites); the list's progress line fills continuously; the phase card cross-fades (frosted glass so the path glows through). Clicking a phase / arrow keys / "Next phase" glide (Lenis) to that phase's scroll position. All 7 phases are now always in the HTML (stacked tab panels, inactive ones `inert`) — better for SEO and no-JS. Phones/tablets, reduced motion and tier 0: no pin, no 3D, the same accessible tab list (now with a cross-fade and a progress line).

**Bundle (gzip):** main +0.5 KB (118.76) · scroll chunk +0.3 KB (54.84) · Experience +2.4 KB (263.43) · CSS +0.3 KB.

**Lighthouse (local, `/`):** mobile Perf 95 · A11y 100 · BP 96 (sandbox fonts) · SEO 100.

**Known issues:** none found. Conflict note: the original section had `z-10` (would hide the canvas) — removed, same as the hero.

**Manual test checklist**
- Laptop: scroll into "From idea to launch" → the phase block locks in the middle of the screen; keep scrolling → phases 01→07 advance one by one, green line in the list grows, card cross-fades, a green path flies by behind the card with the current node glowing near the gap between list and card. After 07, the page releases and continues to the leadership section. Expected 55–60 FPS.
- Click "05" while locked → page glides to phase 05. Tab to the list and use ↑/↓ → same. "Next phase" → next phase.
- Scroll back up → phases reverse smoothly; nothing jumps when the lock releases at either end.
- Resize window below 1024px wide (or under 680px tall) → lock disappears, normal tabs.
- Light theme: path becomes a deep-green line (no glow), text stays readable on the frosted card.
- Android: no lock; tapping phases switches the card instantly with a soft fade; the list line fills to the active phase.

### Screenshot generation (5.4a) — done · NEEDS RASHID REVIEW

**Option B** (Flutter project paths were "not available"): HTML recreations in `tools/screens/` (outside `src/`/`public/`, never shipped). 4 screens per app — IELTS AI Master: dashboard with the 4 modules, writing feedback with band score + AI corrections, speaking recording, progress & personal plan. SkillLink: home with categories, nearby-workers map (stylised, no map-provider branding), worker profile, job status tracking.
- Neutral demo data only: initials avatars, "Sample learner/essay" labels, PKR prices; no store ratings, download counts or user numbers. No app repos touched.
- Output: `public/media/work/{ielts,skilllink}/screen-1..4.webp` (1170×2532 = 390×844 @3x, 54–90 KB each) + `screen-N-540.webp` texture variants (22–35 KB) for WebGL. Contact sheet: `tools/screens/contact-sheet.png`.
- **KTX2 skipped (safer):** the Basis transcoder adds ~200 KB of WASM/JS, more than all 8 textures together (~220 KB WebP); 540px WebP textures use ~2.5 MB GPU each and load only near the viewport.

### Product phones (5.4) — done

**Files:** `src/components/three/scenes/Product.tsx` (new), `src/components/three/materials/PhoneScreen.ts` (new: screen + backdrop shaders), `Experience.tsx` (one View per product card), `config.ts` (`PRODUCT`), `src/components/home/HomeSections.tsx` (track per card, pill class, body class), `src/index.css`.

**What it does:** each "Selected products" card gets two floating graphite phones showing the app screens, a brand light behind them (blue for IELTS AI Master, purple for SkillLink) and a contact shadow (tier 2; soft blob on tier 1). Hover (mouse): the front phone turns toward you and tilts with the pointer, and both phones push-scroll through the 4 screens every 1.5 s. Touch: screens auto-advance every 3.2 s while on screen. Textures (8 × ~28 KB) load only when a card is within 600 px of the viewport. The original project image stays as the poster and cross-fades out after the first 3D frame; tier 0 keeps the image.
- **Pill contrast fix:** the platform pill now has a near-solid dark background (`.kz-project-pill`), AA on any poster or 3D backdrop.
- The WebGL backdrop is drawn in clip space with rounded top corners matching the card radius, so the scissored rect never pokes out of the card. Cards are flex columns so the text panel always fills the card.
- Image/alt text, links and copy unchanged.

**Bundle (gzip):** main +0.2 KB (118.98) · Experience +4.4 KB (267.80, includes drei RoundedBox + ContactShadows) · CSS +0.1 KB · lazy textures ~220 KB total.

**Lighthouse (local, `/`):** mobile Perf 90 · A11y 100 · BP 96 (sandbox fonts) · SEO 100. axe (11 routes × 2 themes): no violations.

**Manual test checklist**
- Laptop: scroll to "Proof, not inflated promises." → each card's image fades into two 3D phones on a dark brand-lit backdrop (~1 s after the card nears the screen). Hover a card → front phone turns to face you, follows the pointer slightly, screens slide up to the next app screen every ~1.5 s; leave → phones settle back. 60 FPS.
- Check the card corners: no square dark corners outside the rounded card; the text part of the card fills to the bottom.
- Light theme: media area stays dark/cinematic (as before), pill readable.
- Android: phones visible (smaller), screens change every ~3 s on their own; tapping the card opens the case study.
- `?kz3d=off`: original images, unchanged.

### Services "Living Bento" (5.5) — done

**Files:** `src/components/home/BentoScene.tsx` (new), `src/components/home/HomeSections.tsx` (HomeServices), `src/lib/interactions.ts` (new, lazy), `src/lib/scroll.ts` (binds interactions per route), `src/index.css`.

**What it does:** six live micro-scenes, one per service card (API packets travelling between endpoints, a phone whose screens scroll, a browser assembling its layout, code being typed, SaaS layers breathing, cloud sync). They animate only while on screen and are static for reduced motion. Mouse: cards tilt toward the pointer (max 8°, 4° on the large AI card), a green glow follows the cursor along the card border, and the ↗ arrow drifts magnetically toward the pointer. Touch and reduced motion: no tilt (the interaction code is never loaded for reduced motion).

**Bundle (gzip):** main +0.9 KB (119.93) · scroll chunk +0.6 KB (55.39) · CSS +0.9 KB (19.77) · Experience 0.

**Lighthouse (local, `/`):** mobile Perf 89 · A11y 100 · BP 96 (sandbox fonts) · SEO 100.

**Manual test checklist**
- Laptop: scroll to "One technology partner…" → small diagrams in each service card start moving. Move the mouse across a card → it tilts toward the cursor, a green highlight runs along the border under the cursor, the ↗ arrow nudges toward the cursor; leave → card settles flat. The AI card tilts less.
- Keyboard: Tab through the cards → normal focus ring, no tilt, links work.
- Light theme: diagrams in deep green, readable.
- Android: diagrams animate; no tilt on touch; tapping opens the service page.
- OS "reduce motion" on: diagrams static, no tilt/glow.

### Tech "Orbit of Tools" (5.6) — done

**Files:** `src/components/three/scenes/Orbit.tsx` (new), `src/components/TechStackSection.tsx`, `src/App.tsx` (strip removed from home), `src/components/TrustStrip.tsx` (deleted — consolidated), `Experience.tsx`, `config.ts` (`ORBIT`), `vite.config.ts` (three vendor chunk), `package.json` (+ `simple-icons@16.31.0`, exact), `src/index.css`.

**What it does:** 16 stack logos (simple-icons; AWS as a plain "AWS" text sprite, no logo) on a slowly turning sphere with faint orbit rings and a glowing core. Scroll velocity spins it faster (both directions), then it settles. Mouse over a logo: it grows and takes its brand colour, the others dim, a tooltip shows "Name · role"; spin slows while hovering. Light theme: deep-green logos, no additive glow. CSS rings are the poster (no layout shift); tier 0 keeps the poster.
- **Tech-strip consolidation:** the separate "Built with a modern, proven stack" strip under the hero was a duplicate of this section; its list (same copy, same 10 items incl. PostgreSQL) now sits beside the orbit, and the strip component is removed. The category cards (DOM text list) are unchanged. The orbit only shows tools named on the page.
- Every logo is decorative (`aria-hidden` stage); all names are in the DOM lists.

**Bundle (gzip):** main +0.3 KB (120.19, strip moved not added) · Experience chunk 89.2 KB + three vendor 190.6 KB (was one 267.8 KB chunk; +12 KB for icons/orbit) · CSS +0.2 KB.

**Lighthouse (local, `/`):** mobile Perf 95 · A11y 100 · BP 96 (sandbox fonts) · SEO 100. axe: no violations.

**Manual test checklist**
- Laptop: below the hero, the page now goes straight to services (the old badge strip is gone — its list is in the tech section). Scroll to "Modern technology, chosen with purpose." → right side shows a turning sphere of logos. Scroll fast up/down → it spins faster in that direction, then calms. Hover logos → logo pops in brand colour, others fade, tooltip names it. ~60 FPS.
- Category filter buttons still filter the cards below.
- Light theme: logos dark green, tooltip readable.
- Android: sphere turns (no hover); scroll flick speeds it up. `/industries` shows the same section and orbit.

### CTA "Particle K" (5.7) — done

**Files:** `src/components/three/scenes/Cta.tsx` (new), `src/components/home/HomeSections.tsx` (ClosingCTA), `src/lib/interactions.ts` (magnetic + ripple), `Experience.tsx`, `config.ts` (`CTA`), `src/index.css`.

**What it does:** 6,000 shader particles (2,200 on lite) drift as dust and gather into the K as the closing section scrolls in — positions and colours are sampled at runtime from the real logo (`/media/brand/logo-256.webp`), pulled toward brand emerald so the graphite parts glow too. The cursor pushes particles aside. Both CTA buttons are magnetic (drift toward the pointer) and show a ripple from the press point. Clicking "Start a project" bursts the K outward (520 ms) and then navigates; with modifier keys / middle click, or without the 3D layer, it navigates immediately as before.

**Bundle (gzip):** main +0.2 KB (120.41) · scroll chunk +0.4 KB (55.75) · Experience +2.1 KB (91.32) · CSS +0.1 KB.

**Lighthouse (local, `/`):** mobile Perf 95 · A11y 100 · BP 96 (sandbox fonts) · SEO 100.

**Manual test checklist**
- Laptop: scroll to "Have something ambitious in mind?" → green dust drifts in and forms the K behind the heading; headline stays readable. Move the mouse over the section → particles part around the cursor. Hover the buttons → they lean toward the pointer. Click "Start a project" → ripple + the K blows outward, then the project page opens (~0.5 s). Cmd/Ctrl-click → opens in a new tab with no delay.
- Android: K forms on scroll (fewer particles), tap ripple; tap navigates after the short burst.
- Reduced motion / `?kz3d=off`: no particles, button navigates immediately, no ripple.

### Testimonials (5.8) + Leadership (5.9) — done (one commit; they share a component file)

**Files:** `src/components/LeadershipTestimonialsSection.tsx`, `src/lib/interactions.ts` (drag-scroll with inertia, live toggling), `src/lib/scroll.ts` (parallax), `src/index.css`.

**Testimonials:** the 2×2 grid is now one horizontal row (4 cards, no duplicates, text untouched) that bleeds to the screen edge and starts aligned with the page content. Mouse: drag with inertia (a drag never triggers a click), cards tilt toward the pointer (max 6°, flattened while dragging). Touch: native swipe with soft snapping. Keyboard: the row is a focusable region (arrow keys scroll) and there are Previous/Next buttons (44 px, labelled). No cylinder.

**Leadership:** two slow fog layers drift behind the portraits (only while on screen; static for reduced motion) and the two portrait columns drift at different speeds on scroll (≥768 px). Existing portrait tilt unchanged.

**Bundle (gzip):** main +0.3 KB (120.71) · scroll chunk +0.5 KB (56.27) · CSS +0.6 KB (20.65) · Experience 0.

**Lighthouse (local, `/`):** mobile Perf 91 · A11y 100 · BP 96 (sandbox fonts) · SEO 100. axe: no violations.

**Manual test checklist**
- Laptop, testimonials: grab a card and fling left → row glides and slows down; release over a card → nothing is "clicked". Hover a card → gentle tilt. Use ← → buttons. Tab to the row and press → / ←.
- Android: swipe the row; it settles on a card. Buttons work.
- Leadership: scroll slowly past the founders → left and right columns move at slightly different speeds; soft green haze drifts in the background. No layout jumps.
- Reduced motion: row still scrolls (buttons jump without smooth scroll), no tilt/fog/parallax.

### Global effects (5.10) — done

**Files:** `src/components/fx/{Cursor,ScrollProgress,RouteCurtain,CountUp}.ts` (new, lazy), `src/lib/scroll.ts` (wires them; route setup now runs in small staged tasks), `src/components/three/ExperienceGate.tsx` (curtain on route change), `src/lib/motion.ts` (reveal threshold), `Hero.tsx` + `SiteNavbar.tsx` (magnetic + ripple on "Start a project"), `HomeSections.tsx` (`data-kz-cursor="view"` on case-study images), `TechStackSection.tsx` (count-up), `src/index.css`.

- **Cursor:** dot + lagging ring; ring grows over links/buttons, becomes a green "View" disc over case-study images; native cursor returns over text fields. Only tier 2 + fine pointer + motion allowed (off on touch, low/mid tiers, reduced motion).
- **Route curtain:** on client-side navigation a dark brand curtain with the K mark lifts away (620 ms). Timer-driven so it can never stay stuck; pointer-events none; not on first load.
- **Scroll progress:** 2 px emerald bar at the top edge, driven by Lenis.
- **CountUp:** the tech category counts (01–04) count up when they come into view (only real values; final value is in the HTML).
- **Magnetic CTAs:** hero + navbar "Start a project" and both closing CTAs (ripple on press too).
- **AI widget:** launcher has a slow breathing glow; the chat panel opens with a spring. Reduced motion: plain fade.
- **Theme blend of 3D:** process path, orbit and product scenes cross-fade colours/blending with the theme (damped, no hard swap); hero + product media stay cinematic-dark by design (as before).
- **Navbar "black bar" fix:** the scrolled navbar's drop shadow (`0 10px 30px -20px rgba(0,0,0,.35)`) read as a thick dark band under the bar, most visibly on light sections. Now a short, faint shadow over the existing 1 px border. *If the bar you saw was elsewhere, tell me the page/width and I'll look again.*
- **Spacing fixes:** (1) reveal animations now start as soon as an element enters the viewport (was 8 % of the element + 8 % margin, which left tall blocks invisible = "empty space" while scrolling) and travel 18 px instead of 26 px; (2) "Problem-solving approach" section top padding ×0.75; (3) two consecutive same-background sections no longer stack two full paddings (e.g. below the "I have an idea" panel → tech section: 240 px → 174 px).
- **Perf:** route setup (interactions, pin, parallax, hero split, refresh) now runs as separate small tasks → mobile TBT ~190–250 ms (was up to 370 ms).

**Bundle (gzip):** main +0.1 KB (120.8) · scroll chunk +1.0 KB (57.3) · CSS +0.7 KB (21.4).

**Lighthouse (local, `/`):** mobile Perf 93–95 · A11y 100 · BP 96 (sandbox fonts) · SEO 100; desktop 100 / 100 / 96 / 100. axe: no violations.

**Manual test checklist**
- Laptop: move the mouse → green dot + ring; over buttons the ring grows; over the two product images it becomes "View". Click inside a form field → normal text cursor.
- Click any nav link → dark curtain with the K lifts upward, new page underneath; back button works the same.
- Thin green bar at the very top grows as you scroll.
- Tech section: category counts tick up to 04.
- Hover "Start a project" (nav, hero, closing section) → button leans toward the pointer; click → ripple.
- Chat bubble bottom-right breathes softly; open it → panel springs open.
- Scroll the light theme past a white section → no dark band under the navbar.
- Scroll from "Selected products" to "You bring the challenge…" and past the "I have an idea" panel → no large blank gaps; content fades in as it enters.
- Android: no custom cursor; progress bar + curtain + ripples work.

### Final audit (5.11) — done

**Fixes made during the audit:** scene remount keys (hero/orbit/product posters now re-fade correctly after navigating back to `/`), persistent Views + guarded root writes (leak mitigation above), phones/orbit stay hidden until their card/stage has revealed, Clock notice filtered. Files: `src/components/three/Experience.tsx`, `scenes/Product.tsx`, `scenes/Orbit.tsx`.

**Console:** 0 errors / 0 warnings in: forced-3D runs (desktop dark + light, mobile lite), 20-route × 2 SPA walk, reduced-motion, WebGL-off, lite tier, product/orbit/CTA/process interaction tests. (Only sandbox-only Google-Fonts network errors, filtered.)

**Lighthouse (local prod build; headless = tier 0 poster path):**

| Route | Mobile P / A11y / BP / SEO | Desktop P / A11y / BP / SEO |
|---|---|---|
| `/` | 91–95 / 100 / 96* / 100 | 100 / 100 / 96* / 100 |
| `/services` | 99 / 100 / 96* / 100 | 100 / 100 / 96* / 100 |
| `/work/skilllink` | 99 / 100 / 96* / 100 | 100 / 100 / 96* / 100 |
| `/about` | 97 / 100 / 96* / 100 | 100 / 100 / 96* / 100 |
| `/start-project` | 99 / 100 / 96* / 100 | 100 / 100 / 96* / 100 |

\* BP 96 is only "errors in console" from Google Fonts being blocked in this sandbox. CLS 0 everywhere. Light theme: axe (11 routes × dark + light) — no violations; Lighthouse can't switch the stored theme, so light-theme contrast is covered by axe.

**Checks:**
- Reduced motion: no Lenis/GSAP/WebGL download, tier 0, all reveal content visible, no cursor/curtain/progress/ripple.
- WebGL off (`?kz3d=off` / no GPU): posters only, no canvas, process not pinned, everything readable.
- Low tier (`?kz3d=lite`): canvas with lite materials, no cursor, no pin < 1024 px.
- Keyboard: first 40 tab stops all visible with focus rings; process phases, testimonials row and buttons operable by keyboard.
- 20-route walk: exactly 1 canvas, 1 cursor, 1 curtain, 1 pin-spacer on `/` after returning; heap trend as above.
- Copy, routes, SEO meta, sitemap, structured data: unchanged (`src/data/*`, sitemap, robots, llms.txt untouched; SEO audit: 1 h1/page, canonical + JSON-LD intact, no duplicate titles/descriptions).

**Final bundle (gzip):** main 120.8 KB (+4.0 KB vs 116.85 before the 3D work) · CSS 21.4 KB (+2.9) · lazy, after paint: scroll/motion 57.3 KB · Experience 91.7 KB + three vendor 190.6 KB (tier 1/2 only) · 3D textures ~220 KB (8 × WebP, loaded near view) — total 3D assets < 2 MB.

## Final summary

All 11 items done on `feature/3d-experience` (one commit per section; testimonials + leadership share one). Not deployed.

**Needs Rashid:**
1. Review the app-screen recreations (`tools/screens/contact-sheet.png`) — **NEEDS RASHID REVIEW**.
2. Run `npm install` locally (new dependency `simple-icons@16.31.0`) before `npm run build`.
3. Fix the live-site cache for `/` (see "Prerender check").
4. Decide on patching the upstream R3F portal leak (see Known issues).
5. Testimonial "Rony Sultana" text — untouched, as agreed.

---

### Hero V2 — done

**Files:** `src/components/three/scenes/Hero.tsx` (rewritten), `materials/heroMaterials.ts` (new: light-panel env, glowing edges, light-trail rings, grid floor, glass backdrop, alpha-safe additive blending), `materials/heroPanels.ts` (new: live device screens), `config.ts` (`HERO` V2 block), `tiers.ts` (new), `hooks/useDeviceTier.ts`, `Experience.tsx` (persistent hero camera), `src/index.css`, `public/media/hero/sculpture-{640,1100}.webp` (new poster rendered from the V2 scene).

**What changed (vs. the flat V1):**
1. **Crystal:** 25 % larger; real glass lit by a Lightformer-style environment (soft white key top-left, emerald rim right, teal strip behind, dim fill below); glowing emerald facet edges (thin instanced tubes, MSAA-smooth) with a light sweep every ~3.6 s; an emissive inner core that counter-rotates and beats like a heart (emissive 1 → 2.5), magnified and fractured through the glass, with a pulsing glow behind it.
2. **Rings:** thick tube rings that read as light trails (bright head, long fading tail, faint glass tube elsewhere), 2–3 bright data packets per ring at different speeds, and a pen-stroke draw-in on load (staggered).
3. **Panels:** rounded frosted-glass slabs with thickness (transmission 0.6, roughness 0.35, clearcoat 1, emissive border) at fixed depths and 20–35° angles — one behind the crystal, one near the camera — each bobbing and swaying on its own. Live screens: the dashboard's line chart draws itself, bars grow/overshoot/settle, KPIs tick; phones shimmer their list rows and pulse the CTA (canvas textures, 20 fps on tier 2 / 8 fps tier 1).
4. **Depth:** the flat CSS grid hands over to a 3D perspective grid floor that recedes into exponential dark-green fog (with a slow pulse travelling outward), plus a faint blurred reflection on tier 2. Camera tilts slightly down so the floor reads.

**Deviations (safer option):**
- **No drei `MeshTransmissionMaterial` / `<Environment>`**: MTM samples its refraction buffer in canvas screen space, which is wrong inside a drei `<View>` whose rect is offset/taller than the canvas (the hero view extends 35vh below the hero) — the glass showed smeared, misplaced content and the core was invisible. Used three's native physical transmission instead (`thickness 1.5, roughness 0.05, ior 1.5`, `dispersion` for chromatic aberration), which projects correctly per view. No backside pass / anisotropic blur / temporal distortion as a result (three's double-sided transmission produced a milky fill). `<Environment>` + `<Lightformer>` would add another React portal (the R3F leak noted above) — the same four light panels are rendered once into a PMREM map in plain three.js instead.
- **Bloom:** still not possible per View; the heartbeat glow, packets, ring heads and edges use real additive emission so they glow without a post pass.
- **Transparent-canvas fixes:** three's transmission pass clears to half-white on a transparent canvas (= milky glass) → a backdrop plane visible only inside that pass gives the glass the hero's green to refract; three's `AdditiveBlending` also adds alpha (dim glow turned into opaque black bands) → custom RGB-only additive blending for all glow materials.
- **Tier 1 / lite:** clear-coat translucent glass instead of transmission, no reflector, no transmissive panels, 8 fps screens — grid floor, rings, edges and core kept.
- Persistent hero camera (three keeps one transmission target per camera and never frees it) and a zero-size guard during route changes.

**Bundle (gzip):** main 119.6 KB (−1.7 KB: config/tunables moved out of the main bundle into a lazy shared chunk) · Experience 95.2 KB (+3.5 KB) · poster 25/50 KB (was 102/173 KB).

**Lighthouse (local, `/`, poster path):** mobile 98 · desktop 100; A11y 100, SEO 100, CLS 0. Console clean across forced-3D, lite, reduced-motion, WebGL-off and the 20-route walk; heap trend unchanged (~0.4 MB per 20 navigations).

**Manual test checklist**
- Laptop (Chrome, good GPU): within ~1 s the poster cross-fades to the live hero; rings draw themselves in one after another; packets run along them; the crystal edges catch a passing light sweep every few seconds; the core visibly "beats" inside the glass. Panels drift at different depths; watch the right dashboard: chart line draws, bars bounce up and settle. Grid floor recedes into green haze, faint reflection under the crystal. Move the mouse → parallax/tilt. Scroll → dive + dissolve as before. Expect 50–60 FPS on integrated GPUs (transmission is the heaviest part; PerformanceMonitor drops to lite on sustained low FPS).
- Android mid-range (tier 1): same composition with simpler glass, no reflection; 45–60 FPS.
- `?kz3d=off` / reduced motion: new poster (still frame of this scene), flat CSS grid kept.
