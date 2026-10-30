/**
 * GA4 tracking unit tests (node:test, no extra dependencies): `npm test`.
 * A minimal window/document stub records every gtag() call.
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

type Call = unknown[];
const calls: Call[] = [];
const store = new Map<string, string>();
const loc = { origin: 'https://korvenzatech.com', pathname: '/', search: '', hash: '' };
const doc = { title: 'Home', querySelector: (_: string) => null as null | { textContent: string } };

Object.assign(globalThis, {
  window: { location: loc, gtag: (...a: unknown[]) => calls.push(a), addEventListener() {} },
  document: doc,
  sessionStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v), removeItem: (k: string) => store.delete(k) },
  localStorage: { getItem: (k: string) => store.get('ls:' + k) ?? null, setItem: (k: string, v: string) => store.set('ls:' + k, v) },
});

const A = await import('../src/lib/analytics.ts');

const go = (pathname: string, search = '', hash = '', title = 'Page') => { loc.pathname = pathname; loc.search = search; loc.hash = hash; doc.title = title; };
const events = (name?: string) => calls.filter((c) => c[0] === 'event' && (!name || c[1] === name)) as [string, string, Record<string, unknown>][];

beforeEach(() => { calls.length = 0; A._resetPageViewState(); go('/'); });

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
