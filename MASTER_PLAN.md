# KorvenzaTech — Master Plan (brief v3)

Branch: `feature/master-v3` (from `main` @ 5b5dcf8, which contains the v2 phases 1–3 + your merge).
Supersedes the v2 checklist; finished v2 work is ticked below and its log is kept at the bottom.
`3D_PROGRESS.md` = detailed history of the first 3D pass (status merged here).

Legend: `[x]` done · `[~]` partly done earlier · `[ ]` to do · **TODO(Rashid)** = only you can supply it.

## Architecture decisions & push-backs (read first)
1. **No EffectComposer in the shared canvas.** Every section renders into a scissored drei `<View>`; a composer composites the whole canvas, so bloom/DOF would cost the hero's price on every section and breaks the other views. Equivalent looks are built per scene: additive emission (bloom), pre-blurred far device (DOF), dispersion (CA), CSS grain + vignette, AgX tone mapping switched for the hero view only. `@react-three/postprocessing` is therefore not installed. If you ever want true post, the hero moves to its own canvas (2nd WebGL context, ≈ +40 MB GPU) — not recommended.
2. **No drei `MeshTransmissionMaterial`** — samples screen space and breaks inside offset Views; three's native physical transmission (+ `dispersion`) is used.
3. **No drei `<Html>` inside Views** (positions against the full canvas) — labels are DOM, placed and checked at 1280/1440/1920.
4. **No zustand** — a tiny ref-based module store (`lib/scrollStore.ts`) does the same with zero dependencies and zero re-renders.
5. **Frameloop**: renders only while a 3D view is on screen and the tab is visible (= `demand` for idle cost).
6. **Logo vector**: traced from your raster; a designer SVG is still the gold standard — TODO(Rashid, optional).
7. **Build stamp**: every page has `<meta name="kz-build" content="<commit> <time>">` and `/build.json` exists — compare them to see instantly whether a route is served from an old cache.
8. **verify-build** (`npm run verify`) is wired into `npm run build` once Phase 2.1/2.2 make it green (it currently fails, correctly, on the plain-text legal items and the unlinked "Read full article").

## Phase 1 — Deploy consistency
- [x] 1.1 All 20 routes rebuilt and audited: every `dist/**/index.html` has the 9-service footer, the inline K, full content. (Legal links + article links → 2.1/2.2, enforced by 1.3.)
- [x] 1.2 UI brand rasters are imported → content-hashed (`logo-128.[hash].webp`, `logo-256.[hash].webp`; `logo-64.[hash].webp` for the route-curtain mark). Stable `/media/brand/*` copies stay (now the new K) for old cached pages, manifest and JSON-LD.
- [x] 1.3 `scripts/verify-build.ts` (`npm run verify`)
- [x] 1.4 Hosting = Vercel (`vercel.json`; `server.ts` is the local/Node fallback). Cache headers fixed in both. Redeploy + purge steps in the log.

## Phase 2 — Trust, legal & content
- [ ] 2.1 /privacy, /terms, /cookies + footer links (lawyer review TODO)
- [ ] 2.2 Three full Insight articles + routes, JSON-LD, progress bar; links wired
- [ ] 2.3 Testimonials data model; hide placeholder entries; TODO list
- [ ] 2.4 Leadership: Suliman single title; LinkedIn icons (hidden until URLs)
- [ ] 2.5 Copy corrections (FAQ, process deliverables, CTA label, latency, benchmarks, industries split, tech list confirmation)
- [ ] 2.6 Homepage shows all 9 services
- [ ] 2.7 Full FAQ only on About #faq (+FAQPage JSON-LD); 3-question teasers on Home/Insights
- [ ] 2.8 Careers copy per track
- [ ] 2.9 Custom 404 with floating glass K

## Phase 3 — Hero polish  ← **stop for review after this**
- [x] (v2) Glass K, shard intro + shockwave, hover/click, shatter, low-tier version; 4 devices with live demo screens; rings/floor/particles; AgX
- [ ] 3.1 Clear glass (not frosted), stronger key/rim lightformers, device + particles refracted behind the K
- [ ] 3.2 Remove stem slit artifacts; ring streak no longer cuts through the K
- [x] 3.3 Shard intro / hover / click / shatter / low tier (v2)
- [ ] 3.4 IELTS phone + AI browser closer/larger (readable at 1440), others back + blurred, brighter screens, lighter phone UIs
- [~] 3.5 Screen content — done in v2; agent scenario 1 to match the new tool list (read contract → … → "5 tasks completed · 6.2s"), values flying into a table in scenario 2, pause offscreen, static WebP frames on low tier
- [ ] 3.6 Floor −40–50 %, faster fade, calm backdrop for "Connected systems"
- [ ] 3.7 Composition up + ~10 % larger; nothing touches labels/edges at 1280/1440/1920; clean mobile
- [~] 3.8 Post look (see push-back 1): AgX ✓, glow ✓, grain ✓, vignette ✓; DOF/CA refinement + MSAA check

## Phase 6.1 — AI security
- [ ] Bundle secret scan; serverless proxy with rate limit, input/token caps, daily cost cap, scoped prompt, fallback; env var list

## Phase 4 — 3D storytelling
- [ ] 4.1 Exploded build (new)
- [~] 4.2 Services living bento (SVG micro-scenes + tilt/glow/magnetic done; WebGL scenes, foil shader, all 9)
- [~] 4.3 Selected products (3D phones done; scroll rotation, X-ray architecture, pill contrast)
- [ ] 4.4 Tech ball pit (rapier)
- [~] 4.5 Process journey (built in the first 3D pass; you report the live site shows the click-based version → verify why)  ← **stop for review after this**
- [ ] 4.6 Global reach globe + time zones
- [~] 4.7 Leadership (fog + parallax done; light sweep)
- [~] 4.8 Testimonials (draggable row done; auto-drift, tilt)
- [~] 4.9 Final CTA (particle K done; new-K sampling from the SVG, warp tunnel, booking button)
- [ ] 4.10 Footer 3D wordmark

## Phase 5 — Global motion system
- [~] Lenis, progress bar, cursor, magnetic CTAs, CountUp, route curtain done; "Drag" cursor, shader wipe, theme blend check, SplitText site-wide, inner-page motion

## Phase 6.2–6.3 — Ask Korvenza AI as project assistant
- [ ] Orb, chips, rich cards, form prefill, streaming; scope engine on /start-project

## Phase 7 — International conversion
- [ ] 7.1 International clients section · [ ] 7.2 Engagement models · [ ] 7.3 Booking · [ ] 7.4 Badge strip · [ ] 7.5 Case studies · [ ] 7.6 Start-project form hardening

## Phase 8 — Engineering, security & SEO
- [ ] 8.1 Security headers/CSP · [ ] 8.2 JSON-LD + sitemap · [ ] 8.3 Analytics/error tracking · [ ] 8.4 Accessibility pass

## Phase 9 — Final QA & handover
- [ ] QA matrix, Lighthouse before/after, screenshots, final summary, consolidated TODO

---

## Consolidated TODO(Rashid)
- Purge the Cloudflare/CDN cache **for everything** (not just `/`) and redeploy — see Phase 1 log.
- Uncommitted local edit in `src/components/AboutSection.tsx` on your machine (an older version of the file). I have not touched it; commit or discard it yourself.
- `Claude outputs/*.png` (review screenshots) are committed in the repo (~2.5 MB). Suggest removing them from git and adding `Claude outputs/` to `.gitignore`.
- App-screen recreations review (`tools/screens/contact-sheet.png`); hero device demo wording.
- "Rony Sultana" testimonial (two different roles).
- Optional: designer-made SVG of the K.
- After deploy: re-share korvenzatech.com on LinkedIn/WhatsApp so link previews refresh.

---

## Log (v3)

### Phase 1 — Deploy consistency ✅
**1.1** `npm run build` writes 20 routes; each has the 9-service footer, inline K logo and full server-rendered content (420–2,260 words). The live site is mixed: `/` serves the current build, `/insights` an older one (6-service footer, `logo-64.webp`) — the same deployment can't produce both, so a cache in front of Vercel is still serving old HTML for the sub-routes (most likely only `/` was purged last time).
**1.2** `scripts/build-brand.mjs` also writes `src/assets/brand/logo-{64,128,256}.webp`; `src/assets/brand/index.ts` imports them, so the shipped URLs are content-hashed. Used by the AI widget avatar, the CTA particle K and the route-curtain mark. The build-brand script no longer overwrites `og-cover.png` unless run with `--og` / `--og-hero`.
**1.3** `scripts/verify-build.ts` checks every route for: footer with the 9 service links and `/privacy` `/terms` `/cookies` links, inline K logo, no legacy logo files, title/description/canonical, ≥120 words in `<main>`, no unlinked "Read full article", no plain-text legal items. Today it reports exactly the known gaps (legal links on 20 routes, Insights article links) → becomes part of `npm run build` when 2.1/2.2 land.
**1.4 Hosting.** Vercel (`vercel.json`, README). Headers now: `/assets/*` 1 year immutable (hashed), `/media/*` 1 hour + revalidate, every HTML route `max-age=0, must-revalidate` (+ `CDN-Cache-Control`). `server.ts` (Node fallback) used to send `immutable` 1-year headers for every image including `/media/brand/logo-64.webp` — fixed to the same policy. Build stamp in every page + `/build.json`.
**What you do (once, after pushing this branch and merging):**
1. Vercel → Project → Deployments → latest Production → ⋯ → **Redeploy** (untick "Use existing Build Cache").
2. If the domain is proxied by Cloudflare (orange cloud in DNS): Cloudflare → Caching → Configuration → **Purge Everything**; Rules → remove any "Cache Everything" rule that matches HTML.
3. Check: open `https://korvenzatech.com/build.json` and view-source of `/insights` → the `kz-build` meta must show the same commit. Footer must list 9 services.
- Files: `scripts/verify-build.ts`, `scripts/build-brand.mjs`, `scripts/generate-seo-pages.mjs`, `src/assets/brand/*`, `src/vite-env.d.ts`, `src/components/KorvenzaAIChat.tsx`, `src/components/three/config.ts`, `src/index.css`, `vercel.json`, `server.ts`, `package.json`, `MASTER_PLAN.md`.
- Bundle (gzip): main ±0, CSS ±0 (logos are separate hashed files).
- Test (laptop): after the steps above, `/insights`, `/about`, `/services` show the 9-service footer and the new K; `/build.json` matches. Android: same pages in Chrome after a hard refresh.

## Archive — v2 build log (feature/master-build, merged to main as 5b5dcf8)

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
