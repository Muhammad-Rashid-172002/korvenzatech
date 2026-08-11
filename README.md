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

This runs TypeScript validation and the production Vite build.

## Deploy to Vercel

1. Push this project to a private or public Git repository.
2. Import the repository into Vercel.
3. Add the server-only environment variables from `.env.example` in **Project Settings → Environment Variables**.
4. Do not create any `VITE_` variable for private API credentials.
5. Deploy the project.
6. Add `korvenzatech.com` and `www.korvenzatech.com` under **Settings → Domains**.
7. Update the domain DNS using the exact records shown by Vercel.

The `vercel.json` file provides static asset caching, security headers, API-function routing, and SPA fallback.

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
