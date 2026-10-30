# Google Analytics 4 — KorvenzaTech

Property: Web data stream for `https://korvenzatech.com/` · Measurement ID **G-QB25ZM8KNL**

## How it is wired

| Piece | Where | What it does |
|---|---|---|
| Google tag | `index.html` `<head>` (async) | Loads gtag.js once, sets Consent Mode defaults, `gtag('config', 'G-QB25ZM8KNL', { send_page_view: false })`. Prerendered into every route's HTML. |
| SPA tracking + events | `src/lib/analytics.ts` | `trackPageView()`, `trackEvent()`, one delegated click listener, consent helpers. Never loads or re-initialises the tag. |
| Hook-up | `src/App.tsx` | `installAnalytics()` once; `trackPageView()` in an effect on every route change. |
| Forms | `src/components/StartProjectSection.tsx` | `form_start`, `form_submit`, `generate_lead`. |
| Consent | `src/components/ConsentBanner.tsx`, footer "Cookie preferences" | Accept / Decline analytics; choice stored as `kz-consent`. |
| CSP | `vercel.json`, `server.ts` | Allows `www.googletagmanager.com` (script) and `*.google-analytics.com`, `*.analytics.google.com`, `*.googletagmanager.com` (connect/img). Without this the tag was blocked in production. |
| Tests | `tests/analytics.test.ts` (`npm test`) | Page-view dedupe, back/forward, hash, trailing slash, UTM, content views, click classification, PII stripping, consent, debug. |

## Page views — one strategy: manual, from the router

Why manual (and not GA4's automatic "page changes based on browser history events"):

1. **Correct titles.** The router calls `history.pushState()` *before* React renders the new page; GA's history listener would read the **previous** page's `document.title`. Our effect runs after `SeoManager` has set the new title.
2. **No false page views.** The site pushes history entries for same-page hash jumps (`/about#faq`); manual tracking ignores hash-only changes.
3. **Exactly once.** Dedupe key = normalised path + query, so React re-renders, StrictMode double effects and trailing slashes (`/about/`) never create a second hit.
4. **Correct referrer.** `page_referrer` = the previous page inside the SPA; the landing hit keeps `document.referrer` (GA default) so traffic sources stay right.

Covered: initial load, direct URL, refresh (each a new document → one hit), internal links, back/forward (`popstate` → route state change → one hit), unknown URLs (404 page → one hit with the 404 title). The site has no client- or server-side redirects. Query strings are only meaningful on the landing URL (UTM, `ga_debug`); internal navigation uses clean paths, so query-only changes never happen inside the app.

**Required GA setting (prevents double counting):** Admin → Data streams → korvenzatech.com → Enhanced measurement ⚙ → Page views → *Show advanced settings* → **untick "Page changes based on browser history events"**. The "Page loads" option does not matter: the config sends `send_page_view: false`, so the tag never sends its own page_view.

## Events

| Event | Fires when | Parameters |
|---|---|---|
| `page_view` | each real navigation (see above) | page_location, page_title, page_referrer |
| `service_view` | page view of `/services/<id>` | service_name, service_id |
| `portfolio_view` | page view of `/work/<id>` (case studies) | project_name, project_id |
| `cta_click` | links to `/start-project` and primary buttons (`.kz-btn-primary`, not form submits) | button_text, link_url, cta_type (`start_project`/`primary`), link_location |
| `contact_click` | links to `/contact` | link_text, link_url, link_location |
| `email_click` | `mailto:` links | contact_method, link_location (**no address**) |
| `whatsapp_click` | `wa.me` / WhatsApp links | contact_method, link_url `https://wa.me/`, link_location (**no number**) |
| `phone_click` | `tel:` links — **none exist on the site today**, so this will not fire until one is added | contact_method, link_location |
| `form_start` | first focus in the project/contact form (once per form) | form_type (`project_brief` / `contact`), form_id |
| `form_submit` | server confirmed the submission | form_type, form_id, inquiry_type |
| `generate_lead` | same moment as form_submit | form_type, lead_source, inquiry_type |
| `scroll` | GA4 Enhanced Measurement (90 % depth) | automatic |
| `click` | GA4 Enhanced Measurement outbound clicks (`outbound: true`) — this *is* the outbound-click event; no second custom event is sent | automatic |

All custom events also carry page_location and page_title. `link_location` = header / nav / footer / section id (e.g. `hero`) / dialog. Every parameter passes `clean()`: values that look like an email address or phone number are dropped; form contents are never read. Add `data-analytics-ignore` to an element to exclude it.

**Enhanced Measurement toggles:** keep *Scrolls* and *Outbound clicks* ON; turn **Form interactions OFF** (its automatic form_start/form_submit would duplicate ours and fires on failed submissions); Site search, Video, File downloads: optional (the site has none of these today).

## Key events (conversions) — set in GA, not in code

Admin → Data display → Events (after the events have arrived once, up to 24 h) → toggle **Mark as key event** for:
- `generate_lead` (project brief / contact form submitted)
- `whatsapp_click`
- `email_click`
- `phone_click` (once a phone link exists)

Not key events: page views, `cta_click`, `contact_click` (they are steps, not leads). Optionally create an audience/exploration funnel `cta_click → form_start → generate_lead`.

## Consent & privacy

- Consent Mode v2: `ad_storage`, `ad_user_data`, `ad_personalization` always **denied** (no advertising).
- `analytics_storage` **denied by default in the EEA, UK and Switzerland** (region list in `index.html`) until "Accept analytics"; **granted by default elsewhere**, with Decline available at any time (banner + footer "Cookie preferences").
- With analytics denied, Google receives cookieless pings (Consent Mode "advanced"). Some EU regulators expect *no* request before consent; if you want that, switch to "basic" mode (load gtag.js only after Accept) — a small change in `index.html`.
- Privacy policy and cookie policy were updated to describe GA4 (dated 30 Oct 2026). This is not a legal opinion — have them reviewed.
- Recommended GA settings: Admin → Data collection → **Google signals OFF**; Data retention → **14 months** (the privacy policy says "up to 14 months"); Data settings → turn off "ads personalization" for all regions.

## Campaign links (UTM)

The landing URL is never rewritten, so `utm_*` reach GA on the first page_view.

- LinkedIn: `https://korvenzatech.com/?utm_source=linkedin&utm_medium=social&utm_campaign=brand_2026&utm_content=company_post`
- Facebook: `https://korvenzatech.com/?utm_source=facebook&utm_medium=social&utm_campaign=brand_2026&utm_content=page_post`
- Instagram (bio link): `https://korvenzatech.com/?utm_source=instagram&utm_medium=social&utm_campaign=brand_2026&utm_content=bio_link`
- Team T-shirt (QR code printed on the shirt): `https://korvenzatech.com/?utm_source=tshirt&utm_medium=qr_code&utm_campaign=team_tshirt_2026&utm_content=back_print`

Use lowercase consistently. `utm_medium=social` maps to GA's *Organic Social* channel; `qr_code` has no default channel (shows as *Unassigned*, still filterable by source `tshirt`) — add a custom channel group "Offline / QR" if you want it grouped. Paid ads: use `utm_medium=paid_social` / `cpc`. `utm_term` is for paid keywords.

## Verify

1. **Tag Assistant** (tagassistant.google.com) → add `https://korvenzatech.com` → navigate around: one `page_view` per page, correct page_title.
2. **DebugView**: open `https://korvenzatech.com/?ga_debug=1` (debug flag stays on for that tab; `?ga_debug=0` turns it off) → GA Admin → DebugView shows events live.
3. **Realtime**: Reports → Realtime → "Views by page title" and "Event count by event name".
4. **DevTools → Network**, filter `collect?`: requests to `region1.google-analytics.com/g/collect` with `en=page_view`, `dl=<page_location>`, `dt=<title>`; check there is one per navigation. In the Console: `dataLayer` lists every gtag call.
