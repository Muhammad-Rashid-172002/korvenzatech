# KorvenzaTech Production Launch

## 1. Install and verify locally

```bash
npm install
npm run lint
npm run build
```

## 2. Environment variables

Create `.env` locally or configure the same variables in Vercel. Never commit a real API key.

```env
AI_API_KEY=
AI_MODEL=
AI_FALLBACK_MODEL=
AI_FALLBACK_MODEL_2=
AI_FALLBACK_MODEL_3=
CONTACT_WEBHOOK_URL=
PUBLIC_SITE_URL=https://korvenzatech.com
PUBLIC_CONTACT_EMAIL=
PUBLIC_CONTACT_PHONE=
```

## 3. Domain

Use `https://korvenzatech.com` as the canonical production domain and redirect `www.korvenzatech.com` to it (or the opposite, but keep only one canonical host).

## 4. Search launch

- Verify the domain property in Google Search Console.
- Submit `https://korvenzatech.com/sitemap.xml`.
- Request indexing for the homepage and core service pages after deployment.
- Add Google Analytics only if needed and configure consent appropriately.
- Keep service pages useful and distinct; do not create hundreds of thin keyword pages.
- Publish real case studies, screenshots, client outcomes and useful technical/business insights over time.
- Earn genuine links/mentions from relevant directories, partner sites, product listings and client websites.

## 5. Priority search pages

- `/services/custom-software`
- `/services/saas-development`
- `/services/ai-solutions`
- `/services/mobile-app-development`
- `/services/web-development`
- `/services/api-development`
- `/services/cloud-solutions`

The website is technically optimized for discovery, but no implementation can guarantee first position for every IT-related search. Ranking depends on relevance, competition, authority, content quality, links, user signals and time.
