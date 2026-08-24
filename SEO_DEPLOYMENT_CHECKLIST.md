# KorvenzaTech SEO & Launch Checklist

The project includes crawlable static HTML for the main pages and each service route, unique titles/descriptions/canonicals, Organization/WebSite/Service/Breadcrumb structured data, sitemap.xml, robots.txt, internal service URLs, and responsive client-side pages.

## Before launch
1. Buy and connect `korvenzatech.com` to the production deployment.
2. Set production environment variables from `.env.example` in the hosting dashboard. Never commit the real API key.
3. Run `npm install`, then `npm run check` on your Mac.
4. Deploy and confirm these URLs return HTTP 200:
   - `/`
   - `/services`
   - `/services/saas-development`
   - `/services/ai-solutions`
   - `/services/mobile-app-development`
   - `/services/web-development`
   - `/work`
   - `/about`
   - `/contact`
   - `/sitemap.xml`
   - `/robots.txt`
5. Add the domain property in Google Search Console and submit `https://korvenzatech.com/sitemap.xml`.
6. Inspect the homepage and important service pages in Search Console URL Inspection.
7. Validate structured data with Google's Rich Results Test.
8. Create a real Google Business Profile only when you have business details that comply with Google's eligibility rules.
9. Build genuine authority over time: real case studies, client reviews, useful insights, reputable mentions/backlinks, LinkedIn/Clutch presence, and consistent company information.

## Target keyword clusters
Do not try to stuff every IT keyword into one page. Each page targets a focused intent:
- `/services/saas-development`: SaaS development company, custom SaaS development, SaaS product development
- `/services/ai-solutions`: AI development company, AI solutions, business automation
- `/services/mobile-app-development`: mobile app development company, Flutter app development, iOS/Android app development
- `/services/web-development`: website development company, web application development, corporate website development
- `/services/api-development`: custom API development, API integration services
- `/services/custom-software`: custom software development company, business software development
- `/services/cloud-solutions`: cloud backend development, cloud solutions
- `/services/ui-ux-design`: UI UX design services, app UI design, SaaS UX design
- `/services/digital-marketing`: technology digital marketing, SEO and digital growth

## Important reality
Technical SEO makes the website easier to crawl, understand and compete in Search. No implementation can guarantee a #1 ranking for all IT-related searches. Rankings also depend on query intent, content quality, competition, authority, links/mentions, user value, location, and time.

## 2026 SEO hardening added
- Homepage now explicitly targets the broad entity/topic "software development company" while service pages target narrower commercial intent.
- Organization, WebSite/WebPage and Service structured data are emitted per route; service FAQs also receive FAQPage markup when available.
- Canonical URL and social metadata are route-aware.
- Production build generates crawlable route HTML in addition to the client application.
- robots.txt points crawlers to the production sitemap and excludes API endpoints.
- Avoid doorway pages and keyword stuffing. Expand rankings through real case studies, expert content, citations/links and Search Console data.
