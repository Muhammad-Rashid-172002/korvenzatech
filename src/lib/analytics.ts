/**
 * Google Analytics 4 — the app-side half of the integration.
 *
 * The Google tag itself is loaded once in index.html (async) with `send_page_view: false`
 * and Consent Mode defaults. This module never loads or re-initialises the tag; it only
 * calls the `gtag()` function that snippet defines, so if the tag is blocked (ad blocker,
 * CSP, no network) every call here is a safe no-op.
 *
 * Page views: sent manually, exactly once per real navigation (see trackPageView). GA4's
 * Enhanced Measurement "Page changes based on browser history events" must be OFF in the
 * GA admin, otherwise history navigations would be counted twice — see ANALYTICS.md.
 *
 * Privacy: no personal data is ever sent. URLs are rebuilt by `sanitizeUrl()` (allow-listed
 * query parameters only: utm_*, gclid, gbraid, wbraid, ga_debug — no hash, no PII-looking
 * values or paths) and that sanitized URL is pinned with `gtag('set')`, so the tag never
 * falls back to the raw browser URL — including its automatic scroll / outbound-click events.
 * Contact links are reported by channel only (never the address/number), form events carry
 * only the form type, and `clean()` drops any other value that looks like an email or phone.
 */

import { CASE_STUDIES, SERVICES_DATA } from '../data/companyData';

export const GA_MEASUREMENT_ID = 'G-QB25ZM8KNL';

type Gtag = (...args: unknown[]) => void;
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
    __kzAnalytics?: boolean;
  }
}

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/** Normalised path (no trailing slash), matching the router's normalizePath. */
export const normalizePath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE_RE = /\+?\d[\d\s().-]{6,}\d/;
const URL_KEYS = new Set(['page_location', 'page_referrer', 'link_url']);

/** Query parameters that may reach GA4 (campaign attribution, Google Ads click IDs, DebugView). */
export const ALLOWED_QUERY_PARAM = /^(utm_[a-z0-9_]+|gclid|gbraid|wbraid|ga_debug)$/;

/** Decode repeatedly (handles double-encoded values like %2540) without throwing. */
function decodeDeep(v: string) {
  let out = v;
  for (let i = 0; i < 3; i++) {
    try { const d = decodeURIComponent(out.replace(/\+/g, ' ')); if (d === out) break; out = d; } catch { break; }
  }
  return out;
}
const looksPersonal = (v: string) => { const d = decodeDeep(v); return EMAIL_RE.test(d) || PHONE_RE.test(d); };

/**
 * Rebuild a URL for GA4: origin + normalised path + allow-listed query parameters only.
 * Drops: the #hash, every other parameter (names, emails, tokens, form fields…), allow-listed
 * parameters whose value looks like an email/phone, and any path that contains one
 * (replaced by "/redacted"). Returns '' for unparsable input.
 */
export function sanitizeUrl(href: string, base?: string): string {
  let u: URL;
  try { u = new URL(href, base); } catch { return ''; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
  const path = looksPersonal(u.pathname) ? '/redacted' : normalizePath(u.pathname);
  const kept = new URLSearchParams();
  u.searchParams.forEach((value, key) => {
    const k = key.toLowerCase();
    if (ALLOWED_QUERY_PARAM.test(k) && value.length <= 200 && !looksPersonal(value)) kept.append(k, value);
  });
  const q = kept.toString();
  return u.origin + path + (q ? `?${q}` : '');
}

/**
 * Final guard for every event parameter: URL parameters are sanitized (never dropped, so
 * GA can't substitute the raw URL), other values that look like an email/phone are dropped.
 */
export function clean(params: Params): Params {
  const out: Params = {};
  for (const [k, raw] of Object.entries(params)) {
    if (raw === undefined || raw === '') continue;
    let v = raw;
    if (typeof v === 'string' && URL_KEYS.has(k)) {
      v = /^[a-z]+:\/\//i.test(v) ? sanitizeUrl(v) : v.split(/[?#]/)[0]; // relative link_url: path only
      if (!v) continue;
    } else if (typeof v === 'string' && looksPersonal(v)) continue;
    // GA4 limits: page_location 1000, page_referrer 420, other values 100 characters.
    const max = k === 'page_location' ? 1000 : k === 'page_referrer' ? 420 : 100;
    out[k] = typeof v === 'string' ? v.slice(0, max) : v;
  }
  return out;
}

/** DebugView: add ?ga_debug=1 to any URL once (remembered for the tab), ?ga_debug=0 to stop. */
function debugMode(): boolean {
  if (!isBrowser()) return false;
  try {
    const q = new URLSearchParams(window.location.search).get('ga_debug');
    if (q === '1') sessionStorage.setItem('kz-ga-debug', '1');
    if (q === '0') sessionStorage.removeItem('kz-ga-debug');
    return sessionStorage.getItem('kz-ga-debug') === '1';
  } catch { return false; }
}

function send(name: string, params: Params) {
  if (!isBrowser() || typeof window.gtag !== 'function') return;
  // never let GA infer the raw browser URL: an event always carries a sanitized page_location
  const p = clean({ page_location: pageLocation(), ...params });
  if (debugMode()) p.debug_mode = true;
  window.gtag('event', name, p);
}

/** Custom event with the current page attached. */
export function trackEvent(name: string, params: Params = {}) {
  if (!isBrowser()) return;
  send(name, { page_location: pageLocation(), page_title: document.title, ...params });
}

/** page_location: the current URL sanitized (allow-listed campaign parameters only, no #hash). */
export function pageLocation() {
  return sanitizeUrl(window.location.href) || window.location.origin + '/';
}

/** Landing-page referrer, sanitized (external referrers keep origin + path + allow-listed params). */
function initialReferrer() {
  return document.referrer ? sanitizeUrl(document.referrer) : '';
}

/* ---------------------------------------------------------------- page views */

let lastKey: string | null = null;
let lastLocation: string | null = null;

/**
 * Send one page_view for the current URL. Called after every route render (App effect),
 * after <head> has been updated, so page_title is the new page's title.
 * Dedupe key = path + query: React re-renders, StrictMode double effects, and hash-only
 * changes (same page, e.g. /about → /about#faq) never produce a second page_view.
 * page_referrer = the previous page inside the SPA (GA uses document.referrer on the first hit).
 */
export function trackPageView() {
  if (!isBrowser()) return false;
  const location = pageLocation();
  const key = location; // sanitized: junk/PII parameters can't create extra page views either
  if (key === lastKey) return false;
  const referrer = lastLocation ?? initialReferrer();
  const params: Params = { page_location: location, page_title: document.title };
  if (referrer) params.page_referrer = referrer;
  lastKey = key;
  lastLocation = location;
  // Pin the sanitized values for everything the tag sends on this page — including GA4's
  // automatic Enhanced Measurement events (scroll, outbound click, user_engagement).
  if (typeof window.gtag === 'function') window.gtag('set', clean({ page_location: location, page_referrer: referrer || undefined, page_title: document.title }));
  send('page_view', params);
  // Content views for the two detail page types that exist on the site.
  const [, section, id] = normalizePath(window.location.pathname).split('/');
  const service = section === 'services' && id ? SERVICES_DATA.find((s) => s.id === id) : undefined;
  const study = section === 'work' && id ? CASE_STUDIES.find((c) => c.id === id) : undefined;
  if (service) send('service_view', { page_location: location, page_title: document.title, service_name: service.title, service_id: service.id });
  if (study) send('portfolio_view', { page_location: location, page_title: document.title, project_name: study.name, project_id: study.id });
  return true;
}

/** Test hook. */
export function _resetPageViewState() { lastKey = null; lastLocation = null; }

/* ---------------------------------------------------------------- clicks */

/** Where on the page an element sits (header, footer, a section id, the AI widget…). */
function regionOf(el: Element): string {
  const r = el.closest('[data-analytics-region],header,nav,footer,section[id],[role="dialog"]');
  if (!r) return 'page';
  return r.getAttribute('data-analytics-region') || (r.tagName === 'SECTION' ? r.id : r.getAttribute('role') === 'dialog' ? 'dialog' : r.tagName.toLowerCase());
}
const label = (el: Element) => (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();

/**
 * Classify a click. Exported for tests. Returns the event that should be sent, or null.
 * - mailto: → email_click · tel: → phone_click · wa.me / WhatsApp → whatsapp_click
 *   (channel only — the address or number is never sent)
 * - links to /contact → contact_click
 * - links to /start-project and primary buttons (.kz-btn-primary) → cta_click
 * Other external links are left to GA4 Enhanced Measurement's built-in outbound `click`.
 */
export function classifyClick(target: Element | null): { name: string; params: Params } | null {
  const el = target?.closest('a,button');
  if (!el || el.closest('[data-analytics-ignore]')) return null;
  const region = regionOf(el);
  const href = el.tagName === 'A' ? el.getAttribute('href') || '' : '';
  if (href.startsWith('mailto:')) return { name: 'email_click', params: { contact_method: 'email', link_location: region } };
  if (href.startsWith('tel:')) return { name: 'phone_click', params: { contact_method: 'phone', link_location: region } };
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com|(www\.)?whatsapp\.com)\b/i.test(href)) {
    return { name: 'whatsapp_click', params: { contact_method: 'whatsapp', link_location: region, link_url: 'https://wa.me/' } };
  }
  let path: string | null = null;
  if (href.startsWith('/')) path = normalizePath(href.split(/[?#]/)[0]);
  else if (/^https?:\/\/(www\.)?korvenzatech\.com/i.test(href)) path = normalizePath(new URL(href).pathname);
  if (path === '/contact') return { name: 'contact_click', params: { link_text: label(el), link_url: '/contact', link_location: region } };
  const primary = el.classList.contains('kz-btn-primary');
  const submit = el.tagName === 'BUTTON' && (el as HTMLButtonElement).type === 'submit';
  if (path === '/start-project' || (primary && !submit)) {
    return { name: 'cta_click', params: { button_text: label(el), link_url: path ?? (href || undefined), cta_type: path === '/start-project' ? 'start_project' : 'primary', link_location: region } };
  }
  return null;
}

function onClick(e: MouseEvent) {
  const hit = classifyClick(e.target as Element | null);
  if (hit) trackEvent(hit.name, hit.params);
}

/** Install the single delegated click listener (idempotent; safe under StrictMode/HMR). */
export function installAnalytics() {
  if (!isBrowser() || window.__kzAnalytics) return;
  window.__kzAnalytics = true;
  // a Decline made in another tab (or before a GA cookie was rewritten) still wins on this page
  if (storedConsent() === 'denied') deleteGaCookies();
  // capture: runs before the router's Link handler prevents default / navigates
  document.addEventListener('click', onClick, { capture: true, passive: true });
}

/* ---------------------------------------------------------------- consent */

export type ConsentChoice = 'granted' | 'denied';
const CONSENT_KEY = 'kz-consent';

export function storedConsent(): ConsentChoice | null {
  try { const v = localStorage.getItem(CONSENT_KEY); return v === 'granted' || v === 'denied' ? v : null; } catch { return null; }
}

/** Google Analytics' own cookies: `_ga` and `_ga_<container id>` (nothing else is touched). */
export const GA_COOKIE = /^_ga(_[A-Za-z0-9]+)?$/;

/**
 * Delete GA cookies on every domain/path variant GA may have used: host-only and each parent
 * domain of the current hostname (GA's cookie_domain "auto" picks the highest settable one,
 * e.g. ".korvenzatech.com"), path "/". Returns the names it removed.
 */
export function deleteGaCookies(): string[] {
  if (!isBrowser()) return [];
  const names = document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => GA_COOKIE.test(n));
  if (!names.length) return [];
  const host = window.location.hostname;
  const parts = host.split('.');
  const domains: (string | null)[] = [null];
  if (!/^[\d.]+$/.test(host) && parts.length > 1) for (let i = 0; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/';
  for (const name of new Set(names)) for (const d of domains) document.cookie = `${name}=; ${expired}${d ? `; domain=${d}` : ''}`;
  return [...new Set(names)];
}

/**
 * Apply and remember the visitor's analytics choice (advertising storage always stays denied).
 * Declining (or withdrawing an earlier Accept) first tells the tag to stop using storage, then
 * deletes the GA cookies already on the device.
 */
export function setConsent(choice: ConsentChoice) {
  try { localStorage.setItem(CONSENT_KEY, choice); } catch { /* storage unavailable */ }
  if (isBrowser() && typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: choice });
  if (choice === 'denied') deleteGaCookies();
}
