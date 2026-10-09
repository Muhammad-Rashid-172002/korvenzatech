# KorvenzaTech Production Website

Production-ready corporate website for KorvenzaTech with a multilingual, memory-aware Korvenza AI assistant, intelligent project scope analysis, light/dark themes, responsive layouts, and server-side API routes.

## Local development

```bash
npm install
cp .env.example .env
```

Configure the server-only values in `.env`:

```env
AI_API_KEY=YOUR_SERVER_SIDE_API_KEY
AI_MODEL=YOUR_MODEL_IDENTIFIER
PUBLIC_SITE_URL=https://korvenzatech.com
PUBLIC_CONTACT_EMAIL=
PUBLIC_CONTACT_PHONE=
CONTACT_WEBHOOK_URL=
```

Then run:

```bash
npm run dev
```

The local development server is available at `http://localhost:3000`.

## Production verification

Before deployment:

```bash
npm run check
```

This runs TypeScript validation and the full production build:

1. `vite build` — client bundle (the Three.js hero scene is a separate, lazy, homepage-only chunk).
2. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` — a build-time render bundle (never deployed).
3. `node scripts/generate-seo-pages.mjs` — prerenders every route to `dist/<route>/index.html` with the real page markup, route-specific metadata and one JSON-LD graph, writes `dist/404.html` (noindex) and `dist/sitemap.xml`, then deletes `dist-ssr/`.

The browser hydrates the prerendered markup (`hydrateRoot`). Page metadata and structured data come from one source, `src/data/seo.ts`, used by both the prerenderer and client-side navigation.

## Deploy to Vercel

1. Push this project to a private or public Git repository.
2. Import the repository into Vercel.
3. Add the server-only environment variables from `.env.example` in **Project Settings → Environment Variables**.
4. Do not create any `VITE_` variable for private API credentials.
5. Deploy the project.
6. Add `korvenzatech.com` and `www.korvenzatech.com` under **Settings → Domains**.
7. Update the domain DNS using the exact records shown by Vercel.

The `vercel.json` file provides static asset caching and security headers. Every route is served as its own prerendered `index.html`; unknown paths receive the branded `404.html` with a 404 status.

## API routes

- `POST /api/chat` — Korvenza AI conversation endpoint
- `POST /api/ai-scope-analyst` — project scope analysis
- `POST /api/contact` — project inquiry form
- `GET /api/health` — deployment health check

## Project inquiries

For production lead delivery, set `CONTACT_WEBHOOK_URL` to a secure HTTPS endpoint that sends the inquiry to your CRM, automation workflow, or email pipeline. If it is not configured, the local server logs only non-sensitive lead metadata for development.

## Security notes

- Never commit `.env`.
- Keep private API keys on the server only.
- The browser talks only to `/api/*`.
- The assistant is instructed not to invent company contact details, leadership facts, pricing, metrics, or office locations.
- Add real public contact details only through environment variables or verified website content.
- Rotate any credential that has ever been shared publicly or committed to source control.

## Brand and production behavior

The public site presents the technology as KorvenzaTech and Korvenza AI. It does not expose the name of the underlying intelligence provider in visible website copy.

## Leadership & client proof section
The leadership section uses the verified names, roles and original photographs in `public/team/`. Optimised WebP derivatives for display live in `public/media/team/` (originals remain as fallbacks). Leader data is in `src/components/LeadershipTestimonialsSection.tsx`.

## Design system (2026 emerald redesign)

- **Tokens** — all colours, type scale, spacing, radii, shadows, motion durations/easings and z-layers are CSS custom properties at the top of `src/index.css`. Tailwind's `emerald-*` scale is re-tuned to the brand in the `@theme` block, so every `emerald-*` utility is on-brand.
- **Themes** — light/dark via `<html data-theme>`. Sections with the `kz-cinematic` class (hero, page heroes, leadership, closing CTA, footer) stay dark in both themes.
- **Primitives** — `kz-container`, `kz-section`, `kz-h1/h2/h3`, `kz-lead`, `kz-eyebrow`, `kz-btn kz-btn-primary|secondary`, `kz-card`, `kz-field`; React helpers in `src/components/ui.tsx`.
- **Links** — use `<Link to="/path">` from `src/lib/router.tsx` so every link is a real, crawlable `<a href>` that still navigates client-side.
- **Motion** — add `kz-reveal` (optionally `style={{ '--d': n }}` for stagger) to animate on scroll. Content is visible without JavaScript and with `prefers-reduced-motion`; one shared IntersectionObserver drives everything (`src/lib/motion.ts`).
- **3D hero** — `src/components/hero3d/`. The scene loads only on the homepage after the page is idle, pauses off-screen, renders at ~30 fps on low-power devices, and is replaced by a poster frame of the same scene (`public/media/hero/`) when WebGL is unavailable, the GPU is software-only, Save-Data is on, or the context is lost. Append `?kz3d=force` to the URL to bypass the GPU check during QA.
