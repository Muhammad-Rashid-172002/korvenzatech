# KorvenzaTech — Master Build Plan

Branch: `feature/master-build` (from `main` @ b7d2415, which already contains the full 3D experience).
Previous logs: `3D_PROGRESS.md` (3D phases, kept as the detailed history). Its status is merged below.

Legend: `[x]` done · `[~]` done earlier, upgrade pending in this plan · `[ ]` to do · **TODO(Rashid)** = something only you can supply.

## Architecture decisions & push-backs (read first)

1. **Post-processing (Bloom / DOF / grain / CA) is not used inside the shared canvas.** `EffectComposer` composites the *whole* canvas, but every section renders into its own scissored drei `<View>`; a composer would need to own the full frame every frame (the cost of the hero on every section) and breaks other views. Equivalent looks are built per scene instead: real additive emission for glow (core, edges, rings, packets), a pre-blurred far device for depth-of-field, grain + vignette as a cheap CSS overlay on the hero. If you want true post later, the hero would move to its own canvas (2nd WebGL context, ~+40 MB GPU) — I don't recommend it.
2. **drei `MeshTransmissionMaterial` is not used.** It samples its refraction buffer in canvas screen space, which is wrong inside an offset `<View>` (verified: smeared content, invisible core). three's native physical transmission (+ `dispersion`) projects correctly and is used instead; same for the glass K.
3. **drei `<Html>` labels are not used for hero labels.** Inside `<View>` they position against the full canvas, not the view; the existing DOM captions are accessible, crisp and already clear of the devices. They are re-placed so they never overlap at 1280/1440/1920.
4. **zustand not installed** — a tiny module store does the same (ref-based reads in `useFrame`, zero re-renders).
5. **Frameloop:** renders only while a 3D view is on screen and the tab is visible (equivalent to `demand` for idle cost; scroll-driven scenes animate every visible frame anyway).
6. **Logo vector:** the new K is a shaded raster render. Its silhouette is traced exactly; the facets are re-drawn as clean flat gradients (`brand-source/k-logo.svg`). It reads correctly at all sizes, but a designer-made SVG would be the gold standard — **TODO(Rashid, optional)**.

## Phase 1 — Critical fixes
- [x] 1.1 Live homepage not prerendered — diagnosed (see log), `meta keywords` removed, HTML revalidation headers added. **TODO(Rashid):** purge the CDN cache for `/` (details in log).
- [x] 1.2 Visual bugs — label pills (AA), navbar dark band, spacing above "Problem-solving approach" / below "I have an idea", duplicate tech strip: all fixed earlier (3D_PROGRESS: Product phones, Global effects, Tech orbit); re-verified on this branch.
- [x] 1.3 Footer lists all 9 services.

## Phase 2 — Brand system: new K logo everywhere
- [x] 2.1 Vector master (`brand-source/k-logo.svg`, `k-mark.svg`) + original raster kept (`brand-source/`, not deployed)
- [x] 2.2 `scripts/build-brand.mjs` (sharp): favicon.ico/svg, apple-touch 180, manifest 192/512 + maskable, og-cover 1200×630, logo rasters
- [x] 2.3 Inline SVG logo in navbar, footer, mobile menu (fixed size, no CLS)
- [x] 2.4 Replaced everywhere; old logo files deleted (hero/3D scenes get the new K in Phase 3; CTA particles already sample the regenerated raster)

## Phase 3 — Hero: glass K + living device interfaces  ← **stop for review after this**
- [x] Hero V2 surroundings (rings, floor, fog) — kept and polished
- [x] 3.1 Extruded glass K (replaces crystal): shard fly-in intro + shockwave, idle float/sway/tilt, hover/click, shatter on scroll, low-tier version
- [x] 3.2 Surroundings polish: 3 particle depth layers, network behind panels + pulses into the logo, labels never overlapping (1280/1440/1920), floor dash + ring-through-glass fixes, AgX/grain/vignette/DOF look
- [x] 3.3 Devices: 2 phones (island, bezel, buttons) + 2 browsers; live code-drawn screens (IELTS, SkillLink, SaaS dashboard, AI agent with 3 scenarios); hover/click interactions; static frames on low tier
- [ ] **Waiting for your review of the hero look before Phase 6.1.**

## Phase 6.1 — AI security (early)
- [ ] Bundle scan for secrets; serverless proxy with rate limit, input/token caps, daily cost cap, scoped system prompt, fallback; env var list

## Phase 4 — 3D storytelling
- [ ] 4.1 Exploded build (new section)
- [~] 4.2 Services bento — SVG micro-scenes + tilt/glow/magnetic done; WebGL micro-scenes + foil shader pending
- [~] 4.3 Selected products — 3D phones done; scroll rotation, X-ray architecture toggle pending
- [ ] 4.4 Tech ball pit (rapier) — replaces orbit
- [x] 4.5 Process journey — done (3D_PROGRESS)
- [ ] 4.6 Global reach globe (new section)
- [~] 4.7 Leadership — fog + parallax done; light sweep, LinkedIn TODO links, single title for Suliman pending
- [~] 4.8 Testimonials — draggable row done; auto-drift + new card structure + placeholders pending
- [~] 4.9 Final CTA — particle K done (old logo); new K sampling, warp-tunnel transition, booking button pending
- [ ] 4.10 Footer 3D wordmark

## Phase 5 — Global motion system
- [~] Lenis, progress bar, cursor (dot/ring/View), magnetic CTAs, CountUp, route curtain — done; "Drag" cursor state, shader wipe, SplitText on all pages pending

## Phase 6.2–6.3 — Ask Korvenza AI upgrade
- [ ] Orb, chips, rich cards (estimate/case study/booking), form prefill, streaming; scope engine on /start-project

## Phase 7 — Pages, content & trust
- [ ] 7.1 Insights article pages · [ ] 7.2 Legal pages · [ ] 7.3 Custom 404 · [ ] 7.4 Honest positioning · [ ] 7.5 Careers copy · [ ] 7.6 International clients section · [ ] 7.7 Engagement models · [ ] 7.8 Booking · [ ] 7.9 Social proof strip · [ ] 7.10 Case studies

## Phase 8 — Engineering, security & SEO
- [ ] 8.1 Forms · [ ] 8.2 Security headers · [ ] 8.3 SEO/JSON-LD · [ ] 8.4 Analytics/error tracking

## Phase 9 — Final QA & handover
- [ ] QA matrix, Lighthouse before/after, screenshots, final summary, consolidated TODO list

---

## Consolidated TODO(Rashid) (grows as we go)
- Purge CDN/hosting cache for `/` and check response headers (see 1.1).
- App-screen recreations review (`tools/screens/contact-sheet.png`).
- "Rony Sultana" testimonial (two different roles).
- Optional: designer-made SVG of the K.
- Hero device screens are illustrative recreations with DEMO labels (names "Ali R.", "Northwind Retail (demo client)", "Demo Supplies Co.", all numbers). Check you're happy with the wording; nothing real is shown.
- After deploy: re-share korvenzatech.com on LinkedIn/WhatsApp once so their link-preview caches pick up the new og-cover.

---

## Log

### Phase 1 — Critical fixes ✅
**1.1 Live homepage.** `dist/index.html` is complete (full homepage, ~1,900 words). Live `https://korvenzatech.com/index.html` serves this new page, but `https://korvenzatech.com/` serves a *different* document: the very first version of the site (`git show 05370c5:index.html` — `theme-color #08110f`, 25 words, h1 "KorvenzaTech"). Same deployment, different URL → `/` is answered from a **stale cache in front of the app**, not from the build. There is no rewrite/SPA fallback in the repo that could cause it (`vercel.json` has only headers; no netlify/firebase/_redirects/.htaccess files).
- Changed: `vercel.json` now sends `Cache-Control: public, max-age=0, must-revalidate` (+ `CDN-Cache-Control`) for every HTML route, so no cache layer can keep `/` stale again; `meta keywords` removed from the homepage (seo.ts, prerender script, runtime SeoManager).
- **What you need to do:** open `https://korvenzatech.com/` in Chrome DevTools → Network → the document request → Response headers.
  - `server: cloudflare` / `cf-cache-status: HIT` → Cloudflare dashboard → Caching → Configuration → **Purge Everything** (and remove any "Cache Everything" page rule for HTML).
  - `x-vercel-cache: HIT` / `age:` large → Vercel → Project → Deployments → latest → **Redeploy** (or Settings → Data Cache → Purge).
  - Then reload `/` and check the h1 is "Engineering ideas into exceptional digital products."
**1.2** Re-verified on this branch (Playwright screenshots, desktop + mobile; kept out of git in `tools/qa/`): pills readable, no dark band under the navbar, spacing tightened, single tech list.
**1.3** Footer now lists all 9 services (adds Cloud Solutions, UI/UX Design, Digital Growth Strategy).
- Files: `vercel.json`, `src/data/seo.ts`, `scripts/generate-seo-pages.mjs`, `src/components/SeoManager.tsx`, `src/components/Footer.tsx`, `MASTER_PLAN.md`.
- Bundle: ±0.
- Test: open `/` after deploy → view source has no `<meta name="keywords">`; footer "Services" column shows 9 links on desktop and mobile.

### Phase 2 — Brand system ✅
**2.1 Vector master.** The K is a shaded raster (4096², transparent). Its silhouette is taken from the solid alpha and simplified to straight edges (the logo is all straight edges), facets re-drawn as flat gradients with the circuit traces: `brand-source/k-logo.svg` (colour) and `k-mark.svg` (one colour, for favicons/masks/3D). Compared at 600 px against the original: same proportions and silhouette; the soft shading of the render is replaced by gradients. The original PNG stays the source for places where shading matters (app icons, OG, AI avatar).
**2.2 `node scripts/build-brand.mjs`** (rerunnable, `sharp@0.35.4` dev dependency; `--og-hero render.png` swaps the OG artwork) writes: `favicon.svg` (emerald mark on dark tile), `favicon.ico` (16/32/48), `favicon-48.png`, `media/brand/apple-touch-icon.png` (180, opaque), `icon-192/512.png`, `icon-maskable-512.png` (logo inside the safe zone), `logo-{64,128,256,512}.webp`, `logo-512.png` (Organization logo), `k-logo.svg`, `k-mark.svg`, `og-cover.png` (1200×630: K + wordmark + tagline on brand background).
**2.3** `src/components/BrandMark.tsx` — inline SVG generated from the master (unique gradient ids per instance, explicit width/height → no CLS). Used in the navbar, footer, mobile menu header and the 404 page.
**2.4 Replaced:** navbar, footer, mobile menu, 404, favicon links (`index.html`), web manifest (+ maskable icon, theme colours), Organization JSON-LD logo (`/media/brand/logo-512.png`), AI widget avatar + route-curtain mark + CTA particle K (all use the regenerated `logo-*.webp`). **Deleted:** `public/korvenza-logo.png`, `public/favicon.png` (622 KB each), `public/media/brand/logo-128.png`, unused legacy `HeroVisual.tsx`, `Navbar.tsx`. Email templates: the API sends plain-text email (no logo) — nothing to replace. Hero 3D logo: Phase 3.
- Files: `brand-source/*`, `scripts/build-brand.mjs`, `src/components/BrandMark.tsx`, `SiteNavbar.tsx`, `Footer.tsx`, `home/HomeSections.tsx`, `src/data/seo.ts`, `index.html`, `public/site.webmanifest`, `public/favicon.*`, `public/og-cover.png`, `public/media/brand/*`, `package.json`.
- Bundle (gzip): main +1.1 KB (inline logo) → 120.6 KB; CSS −0.6 KB (legacy components removed).
- Test (laptop + Android): browser tab shows the green K on a dark tile; navbar/footer logos crisp at any zoom, no layout jump on load; open the mobile menu → small K row at the top; add to home screen on Android → K icon on dark background; paste the site link into WhatsApp after deploy → new preview card.

### Phase 3 — Hero: glass K + living devices ✅ (awaiting review)
**3.1 Glass K** (`materials/glassK.ts`). The four logo pieces (stem+arm, bar, two legs) are extruded from the same polygons as `brand-source/k-mark.svg` (depth 0.35, bevel 0.03 ×3 segments, smoothed bevel normals), subdivided and grouped into 100 Voronoi shards (prisms through the full depth). A vertex-shader patch on three's physical material drives both the intro (shards start up to 9 units behind and around the logo, staggered expo-out, lock at ~1.8 s) and the scroll shatter (shards drift apart, tumble and fall). Glass: native transmission (thickness 1.2, ior 1.5, dispersion = chromatic aberration, emerald attenuation), per-vertex tint so the bar and upper stem are smoky charcoal like the logo. Thin glowing contour (front bright, back dim) + the logo's circuit traces, light sweep every 6 s, flash at lock. Pulsing emissive core + glow where arm, bar and stem meet. At lock a shockwave ring expands and the network and floor ripple; clicking the K fires it again; hover speeds the ±12° sway and brightens the core. Low tier: same K without shards or transmission (tinted clear-coat glass), simple scale-in.
**3.2 Surroundings.** Rings now refract correctly through the glass (a twin of each ring is drawn only into three's transmission buffer; the visible ring is depth-tested, so it passes in front of / behind the K and devices). Network links render in the opaque pass before the devices → always behind panels. Three depth layers: far stars (520), mid network (130 nodes) with light pulses travelling into the logo, near bokeh (12, tier 2). Grid lines fade out where cells get sub-pixel (no more dashed fragments). AgX tone mapping for the hero view only (sentinel objects switch it at the start/end of the hero render; other sections keep ACES), CSS film grain over the hero. Captions moved to the top/bottom centre of the stage; checked at 1280/1440/1920 against the devices and the AI launcher. The composition shrinks if the stage hugs the right edge (1280 px) so the outer devices stay on screen. On stacked (mobile/tablet) layouts the shatter starts only once the stage itself is scrolled, so phones see the whole K.
**3.3 Devices** (`materials/heroScreens.ts`). Phones: rounded body, rounded screen inset by a thin bezel, dynamic island + status bar + home bar, side buttons, glass sheen. Browsers: traffic lights, URL pill (`app.analytics.demo`, `agents.workspace.demo`). Screens drawn in Canvas 2D at 2× (1.25× on low tier), one texture upload per frame round-robin (≈15 fps each), far dashboard defocused (rendered through a ~0.4× canvas) and half-rate. A IELTS: mic pulse → waveform → Analyzing… → band 7.5 + 4 criteria bars → tip card. B SkillLink: map → 5 pins drop with bounce → selected + route → worker card (demo name, ★ 4.8, 1.2 km) → Requested → Accepted → On the way → Completed + confetti. C SaaS dashboard: KPIs count up, line chart draws, bars stagger, Live pulse. D Korvenza AI Agent: thinking orb, 3 rotating scenarios (agentic onboarding with plan checklist + stacked tool cards → "5 tasks completed · 6.2s"; document intelligence with scan, bounding boxes → JSON stream → "Flagged: duplicate charge"; voice → SQL typing → chart → 2-line insight streamed word by word). Every screen carries a DEMO chip. Hover a device → it comes forward and its loop speeds up; click IELTS/SkillLink → scrolls to that case study; click the AI browser → opens Ask Korvenza AI (`kz:open-ai` event). Low tier: each screen is one static "result" frame. New poster (LCP image) and og-cover regenerated from the new hero render.
- Files: `src/components/three/scenes/Hero.tsx` (rewritten), `materials/glassK.ts` (new), `materials/heroScreens.ts` (new), `materials/heroMaterials.ts` (segment glow, shockwave, ring pass gating, grid fix), `materials/heroPanels.ts` (deleted), `config.ts` (HERO.k, HERO.devices, stars/bokeh/pulses, agxExposure, halfWidth), `src/components/Hero.tsx` (grain layer, caption positions), `src/index.css` (grain), `KorvenzaAIChat.tsx` (open event), `public/media/hero/sculpture-*.webp`, `public/og-cover.png`.
- Bundle (gzip): main +0.05 KB (120.7), CSS +0.3 KB, lazy 3D chunk (`Experience`) +14.2 KB → 109.4 KB, three +0.8 KB. Lighthouse (no GPU → poster path): mobile 98 / a11y 100 / BP 96 / SEO 100, LCP 1.9 s, CLS 0; desktop 100 / 100 / 96 / 100.
- Known issues: screenshots here are from a software GPU (SwiftShader) — glass looks a little flatter than on a real GPU; please judge colour/brightness on your laptop. QA hook: `window.dispatchEvent(new Event('kz:hero-replay'))` replays the intro.
- Test (laptop): hard-reload `/` → poster, then shards fly in and lock with a ring pulse (~2 s); hover the K (cursor = pointer, sway speeds up, core brighter), click it (shockwave); hover each device (comes forward, loop faster); click the blue phone → IELTS case study, purple phone → SkillLink, top-right browser → AI chat opens; scroll down → K shatters and falls, devices fly out; check DevTools Performance ≈ 60 fps.
- Test (Android): `/` → hero visual below the copy shows the K (no shards), 4 devices with static screens; scroll → K shrinks/fades smoothly; no jank; Lighthouse mobile ≥ 85.
