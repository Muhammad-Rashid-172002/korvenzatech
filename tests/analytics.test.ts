/**
 * GA4 tracking unit tests (node:test, no extra dependencies): `npm test`.
 * A minimal window/document stub records every gtag() call.
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

type Call = unknown[];
const calls: Call[] = [];
const store = new Map<string, string>();
const loc = {
  origin: 'https://korvenzatech.com', hostname: 'korvenzatech.com', pathname: '/', search: '', hash: '',
  get href() { return this.origin + this.pathname + this.search + this.hash; },
};
// Cookie jar that honours name + domain + expiry like a browser (enough for deletion tests).
const jar = new Map<string, string>(); // key = name|domain
const cookieWrites: string[] = [];
const doc = {
  title: 'Home', referrer: '',
  querySelector: (_: string) => null as null | { textContent: string },
  get cookie() { return [...jar.entries()].map(([k, v]) => `${k.split('|')[0]}=${v}`).join('; '); },
  set cookie(str: string) {
    cookieWrites.push(str);
    const [nv, ...attrs] = str.split(';').map((x) => x.trim());
    const [name, value] = nv.split('=');
    const domain = attrs.find((a) => a.startsWith('domain='))?.slice(7) ?? '';
    const expired = attrs.some((a) => a === 'max-age=0' || a.startsWith('expires=Thu, 01 Jan 1970'));
    const key = `${name}|${domain}`;
    if (expired) jar.delete(key); else jar.set(key, value);
  },
};

Object.assign(globalThis, {
  window: { location: loc, gtag: (...a: unknown[]) => calls.push(a), addEventListener() {} },
  document: doc,
  sessionStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v), removeItem: (k: string) => store.delete(k) },
  localStorage: { getItem: (k: string) => store.get('ls:' + k) ?? null, setItem: (k: string, v: string) => store.set('ls:' + k, v) },
});

const A = await import('../src/lib/analytics.ts');

const go = (pathname: string, search = '', hash = '', title = 'Page') => { loc.pathname = pathname; loc.search = search; loc.hash = hash; doc.title = title; };
const events = (name?: string) => calls.filter((c) => c[0] === 'event' && (!name || c[1] === name)) as [string, string, Record<string, unknown>][];

beforeEach(() => { calls.length = 0; A._resetPageViewState(); go('/'); doc.referrer = ''; });

test('initial load sends exactly one page_view with location and title', () => {
  go('/', '', '', 'KorvenzaTech | Home');
  assert.equal(A.trackPageView(), true);
  assert.equal(A.trackPageView(), false); // re-render / StrictMode double effect
  const pv = events('page_view');
  assert.equal(pv.length, 1);
  assert.equal(pv[0][2].page_location, 'https://korvenzatech.com/');
  assert.equal(pv[0][2].page_title, 'KorvenzaTech | Home');
  assert.equal(pv[0][2].page_referrer, undefined); // GA uses document.referrer for the landing hit
});

test('internal navigation, back and forward each send one page_view with SPA referrer', () => {
  go('/'); A.trackPageView();
  go('/services', '', '', 'Services'); A.trackPageView();
  go('/about', '', '', 'About'); A.trackPageView();
  go('/services', '', '', 'Services'); A.trackPageView(); // back
  go('/about', '', '', 'About'); A.trackPageView(); // forward
  const pv = events('page_view');
  assert.deepEqual(pv.map((e) => e[2].page_location), [
    'https://korvenzatech.com/', 'https://korvenzatech.com/services', 'https://korvenzatech.com/about',
    'https://korvenzatech.com/services', 'https://korvenzatech.com/about',
  ]);
  assert.equal(pv[1][2].page_referrer, 'https://korvenzatech.com/');
  assert.equal(pv[4][2].page_referrer, 'https://korvenzatech.com/services');
});

test('hash-only changes and trailing slashes are not new page views', () => {
  go('/about'); A.trackPageView();
  go('/about', '', '#faq'); assert.equal(A.trackPageView(), false);
  go('/about/'); assert.equal(A.trackPageView(), false);
  assert.equal(events('page_view').length, 1);
});

test('UTM parameters stay in page_location on the landing page view', () => {
  go('/', '?utm_source=linkedin&utm_medium=social&utm_campaign=launch');
  A.trackPageView();
  assert.equal(events('page_view')[0][2].page_location, 'https://korvenzatech.com/?utm_source=linkedin&utm_medium=social&utm_campaign=launch');
});

test('service and portfolio detail pages add service_view / portfolio_view (known ids only)', () => {
  go('/services/ai-solutions'); A.trackPageView();
  go('/work/skilllink'); A.trackPageView();
  go('/services/not-a-service'); A.trackPageView(); // 404 → page_view only
  assert.equal(events('service_view').length, 1);
  assert.equal(events('service_view')[0][2].service_name, 'AI Solutions');
  assert.equal(events('service_view')[0][2].service_id, 'ai-solutions');
  assert.equal(events('portfolio_view')[0][2].project_id, 'skilllink');
  assert.equal(events('page_view').length, 3);
});

test('long landing URLs are not truncated below the GA4 page_location limit', () => {
  const q = '?utm_source=linkedin&utm_medium=social&utm_campaign=korvenza_launch&utm_content=hero_video&utm_term=ai_studio';
  go('/', q); A.trackPageView();
  assert.equal(events('page_view')[0][2].page_location, 'https://korvenzatech.com/' + q);
});

test('clean() never lets an email address or phone number through', () => {
  const out = A.clean({ a: 'info@korvenzatech.com', b: '+92 370 1691701', c: 'Start a project', d: undefined });
  assert.deepEqual(out, { c: 'Start a project' });
});

// --- click classification with tiny element stubs
type El = { tagName: string; attrs: Record<string, string>; text: string; classes: string[]; parent?: El; type?: string };
function el(tagName: string, attrs: Record<string, string> = {}, text = '', classes: string[] = [], parent?: El): any {
  const e: any = { tagName, attrs, textContent: text, parent, type: attrs.type ?? (tagName === 'BUTTON' ? 'submit' : undefined) };
  e.getAttribute = (n: string) => (n in attrs ? attrs[n] : null);
  e.classList = { contains: (c: string) => classes.includes(c) };
  e.closest = (sel: string) => {
    const parts = sel.split(',').map((s) => s.trim());
    for (let n = e; n; n = n.parent) {
      for (const p of parts) {
        const m = p.match(/^([a-z]+)?(?:\[([a-z-]+)(?:="([^"]*)")?\])?$/i);
        if (!m) continue;
        const [, tag, attr, val] = m;
        if (tag && n.tagName.toLowerCase() !== tag.toLowerCase()) continue;
        if (attr && !(attr in n.attrs)) continue;
        if (val !== undefined && n.attrs[attr] !== val) continue;
        return n;
      }
    }
    return null;
  };
  return e;
}

test('contact links are classified by channel without the address or number', () => {
  const footer = el('FOOTER');
  const mail = A.classifyClick(el('A', { href: 'mailto:sales@korvenzatech.com' }, 'sales@korvenzatech.com', [], footer));
  assert.equal(mail?.name, 'email_click');
  assert.equal(JSON.stringify(mail).includes('@'), false);
  const wa = A.classifyClick(el('A', { href: 'https://wa.me/923701691701' }, '+92 370 1691701', [], footer));
  assert.equal(wa?.name, 'whatsapp_click');
  assert.equal(JSON.stringify(wa).includes('923701691701'), false);
  assert.equal(A.classifyClick(el('A', { href: 'tel:+923701691701' }))?.name, 'phone_click');
  assert.equal(mail?.params.link_location, 'footer');
});

test('CTA and contact navigation clicks', () => {
  assert.equal(A.classifyClick(el('A', { href: '/contact' }, 'Contact'))?.name, 'contact_click');
  const cta = A.classifyClick(el('A', { href: '/start-project' }, 'Start a project'));
  assert.equal(cta?.name, 'cta_click');
  assert.equal(cta?.params.cta_type, 'start_project');
  assert.equal(A.classifyClick(el('BUTTON', { type: 'button' }, 'Discuss your project', ['kz-btn-primary']))?.name, 'cta_click');
  // form submit buttons are covered by form_submit, ordinary links by nothing
  assert.equal(A.classifyClick(el('BUTTON', { type: 'submit' }, 'Send brief', ['kz-btn-primary'])), null);
  assert.equal(A.classifyClick(el('A', { href: '/services' }, 'Services')), null);
  assert.equal(A.classifyClick(el('A', { href: 'https://github.com/x' }, 'GitHub')), null); // GA Enhanced Measurement handles outbound
  const ignored = el('DIV', { 'data-analytics-ignore': '' });
  assert.equal(A.classifyClick(el('BUTTON', { type: 'button' }, 'Accept', ['kz-btn-primary'], ignored)), null);
});

test('no gtag (blocked tag) is a silent no-op', () => {
  const g = (globalThis as any).window.gtag;
  (globalThis as any).window.gtag = undefined;
  assert.doesNotThrow(() => { go('/x'); A.trackPageView(); A.trackEvent('cta_click'); });
  (globalThis as any).window.gtag = g;
});

test('consent choice is stored and sent as a Consent Mode update', () => {
  A.setConsent('denied');
  assert.equal(A.storedConsent(), 'denied');
  assert.deepEqual(calls.at(-1), ['consent', 'update', { analytics_storage: 'denied' }]);
});

test('debug mode (?ga_debug=1) marks events for DebugView', () => {
  go('/', '?ga_debug=1'); A.trackPageView();
  assert.equal(events('page_view')[0][2].debug_mode, true);
  go('/', '?ga_debug=0'); A.trackEvent('cta_click');
  assert.equal(events('cta_click')[0][2].debug_mode, undefined);
});

/* ================================================================== privacy fixes */

const HOSTILE = [
  '?email=jane.doe@example.com&name=Jane+Doe',
  '?e=jane%40example.com', // encoded @
  '?e=jane%2540example.com', // double-encoded @
  '?phone=%2B92%20300%201234567&token=eyJhbGciOiJIUzI1NiJ9.secret&session_id=abc123&fullName=Jane%20Doe',
  '?utm_source=linkedin&utm_campaign=jane@example.com&utm_term=%2B923001234567', // PII inside allowed params
  '?ideaDescription=build%20me%20an%20app%20call%20me%200300-1234567&utm_medium=social',
  '?UTM_SOURCE=Facebook&Gclid=abc&redirect=https%3A%2F%2Fevil.example%2F%3Femail%3Djane%40example.com',
];
const PII = /jane|doe|example\.com|%40|1234567|eyJ|secret|abc123|ideaDescription|build me|evil/i;

test('sanitizeUrl keeps only allow-listed parameters and drops PII-looking values', () => {
  const s = A.sanitizeUrl;
  assert.equal(s('https://korvenzatech.com/?utm_source=linkedin&utm_medium=social&utm_campaign=brand_2026&utm_content=post&utm_term=ai&gclid=Cj0&gbraid=g1&wbraid=w1&ga_debug=1#faq'),
    'https://korvenzatech.com/?utm_source=linkedin&utm_medium=social&utm_campaign=brand_2026&utm_content=post&utm_term=ai&gclid=Cj0&gbraid=g1&wbraid=w1&ga_debug=1');
  assert.equal(s('https://korvenzatech.com/contact?email=jane.doe@example.com&name=Jane'), 'https://korvenzatech.com/contact');
  assert.equal(s('https://korvenzatech.com/about/?utm_source=x&foo=bar#team'), 'https://korvenzatech.com/about?utm_source=x');
  assert.equal(s('https://korvenzatech.com/?UTM_SOURCE=Facebook&Gclid=abc'), 'https://korvenzatech.com/?utm_source=Facebook&gclid=abc');
  assert.equal(s('https://korvenzatech.com/?utm_campaign=jane%40example.com&utm_source=ok'), 'https://korvenzatech.com/?utm_source=ok');
  assert.equal(s('https://korvenzatech.com/jane.doe@example.com'), 'https://korvenzatech.com/redacted');
  assert.equal(s('https://korvenzatech.com/u/%2B923001234567'), 'https://korvenzatech.com/redacted');
  assert.equal(s('javascript:alert(1)'), '');
  assert.equal(s('not a url'), '');
  for (const q of HOSTILE) assert.doesNotMatch(s('https://korvenzatech.com/contact' + q), PII, q);
});

test('page_view for a hostile URL sends a sanitized page_location and pins it with gtag("set")', () => {
  go('/contact', '?email=jane.doe@example.com&name=Jane&utm_source=linkedin', '', 'Contact');
  A.trackPageView();
  const setIdx = calls.findIndex((c) => c[0] === 'set');
  const pvIdx = calls.findIndex((c) => c[0] === 'event' && c[1] === 'page_view');
  assert.ok(setIdx >= 0 && setIdx < pvIdx, 'gtag set must come before the page_view');
  assert.deepEqual(calls[setIdx][1], { page_location: 'https://korvenzatech.com/contact?utm_source=linkedin', page_title: 'Contact' });
  assert.equal(events('page_view')[0][2].page_location, 'https://korvenzatech.com/contact?utm_source=linkedin');
});

test('junk or PII parameters cannot create extra page views', () => {
  go('/contact', '?email=a@b.co'); A.trackPageView();
  go('/contact', '?token=xyz'); assert.equal(A.trackPageView(), false);
  go('/contact'); assert.equal(A.trackPageView(), false);
  assert.equal(events('page_view').length, 1);
});

test('every event always carries a sanitized page_location (GA can never fall back to the raw URL)', () => {
  go('/start-project', '?email=jane@example.com&name=Jane');
  A.trackEvent('cta_click', { button_text: 'Start a project' });
  A.trackEvent('generate_lead', { page_location: 'https://korvenzatech.com/contact?email=jane@example.com' });
  for (const [, , p] of events()) assert.match(String(p.page_location), /^https:\/\/korvenzatech\.com\/(start-project|contact)$/);
});

test('landing referrer is sanitized', () => {
  doc.referrer = 'https://partner.example.org/out?user=jane@example.com&ref=abc';
  go('/'); A.trackPageView();
  assert.equal(events('page_view')[0][2].page_referrer, 'https://partner.example.org/out');
});

test('no gtag call of any kind leaks PII across hostile URLs, events and clicks', () => {
  for (const q of HOSTILE) {
    A._resetPageViewState();
    go('/contact', q, '#jane@example.com', 'Contact');
    A.trackPageView();
    A.trackEvent('form_start', { form_type: 'contact', button_text: 'jane.doe@example.com', link_url: 'https://korvenzatech.com/x?email=jane@example.com' });
    const hit = A.classifyClick(el('A', { href: 'mailto:jane.doe@example.com?subject=Hi%20Jane' }, 'jane.doe@example.com'));
    if (hit) A.trackEvent(hit.name, hit.params);
  }
  const all = JSON.stringify(calls);
  assert.doesNotMatch(all, PII);
});

test('inline sanitizer in index.html matches sanitizeUrl (first-load config)', async () => {
  const fs = await import('node:fs');
  const vm = await import('node:vm');
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const fnSrc = html.match(/function kzSafeUrl\(h\) \{[\s\S]*?\n      \}/)?.[0];
  assert.ok(fnSrc, 'kzSafeUrl not found in index.html');
  const ctx = vm.createContext({ URL, URLSearchParams, decodeURIComponent });
  vm.runInContext(fnSrc, ctx);
  const cases = ['https://korvenzatech.com/?utm_source=linkedin&x=1#h', 'https://korvenzatech.com/about/', 'https://korvenzatech.com/jane@example.com',
    ...HOSTILE.map((q) => 'https://korvenzatech.com/contact' + q), 'javascript:alert(1)'];
  for (const c of cases) assert.equal(vm.runInContext(`kzSafeUrl(${JSON.stringify(c)})`, ctx), A.sanitizeUrl(c), c);
  assert.match(html, /kzCfg = \{ send_page_view: false, page_location: kzSafeUrl\(location\.href\)/);
});

test('declining deletes only GA cookies, on every domain variant', () => {
  jar.clear(); cookieWrites.length = 0;
  loc.hostname = 'www.korvenzatech.com';
  jar.set('_ga|.korvenzatech.com', 'GA1.1.123.456');
  jar.set('_ga_QB25ZM8KNL|.korvenzatech.com', 'GS1.1.1');
  jar.set('_ga|', 'GA1.1.999'); // host-only copy
  jar.set('korvenza_session|', 'keep'); jar.set('_gax|', 'keep'); jar.set('my_ga|', 'keep');
  A.setConsent('denied');
  const names = [...jar.keys()].map((k) => k.split('|')[0]).sort();
  assert.deepEqual(names, ['_gax', 'korvenza_session', 'my_ga']);
  assert.ok(cookieWrites.some((w) => w.includes('domain=.korvenzatech.com')));
  assert.ok(cookieWrites.some((w) => w.includes('domain=.www.korvenzatech.com')));
  assert.ok(cookieWrites.every((w) => /^_ga(_[A-Za-z0-9]+)?=;/.test(w)));
  assert.deepEqual(calls.at(-1), ['consent', 'update', { analytics_storage: 'denied' }]);
  loc.hostname = 'korvenzatech.com';
});

test('accepting never deletes cookies; accept → decline → accept round trip', () => {
  jar.clear(); jar.set('_ga|.korvenzatech.com', 'GA1');
  A.setConsent('granted');
  assert.equal(jar.size, 1);
  assert.equal(A.storedConsent(), 'granted');
  A.setConsent('denied');
  assert.equal(jar.size, 0);
  assert.equal(A.storedConsent(), 'denied');
  jar.set('_ga|.korvenzatech.com', 'GA2'); // GA would set a new one after re-accepting
  A.setConsent('granted');
  assert.equal(jar.size, 1);
  assert.deepEqual(calls.filter((c) => c[0] === 'consent').map((c) => (c[2] as { analytics_storage: string }).analytics_storage).slice(-3), ['granted', 'denied', 'granted']);
});
