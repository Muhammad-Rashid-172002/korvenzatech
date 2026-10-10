/**
 * Post-build guard: fails (exit 1) if any prerendered route is missing what every
 * page must ship with. Run: `npx tsx scripts/verify-build.ts` (part of `npm run build`).
 *
 * Per route (dist/** /index.html):
 *  - shared footer with all 9 service links and real links to /privacy, /terms, /cookies
 *  - new K logo (inline BrandMark SVG) and no legacy logo files
 *  - <title>, meta description, canonical (except noindex pages)
 *  - non-empty <main> (>= 120 words of server-rendered text)
 *  - no "Read full article" that is not a link with an href
 *  - no plain-text legal items (Privacy policy / Terms of service / Cookie preferences)
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const SERVICES = ['ai-solutions', 'api-development', 'mobile-app-development', 'web-development', 'custom-software', 'saas-development', 'cloud-solutions', 'ui-ux-design', 'digital-marketing'];
const LEGACY = [/korvenza-logo\.png/, /\/favicon\.png/, /media\/brand\/logo-64\.webp/, /media\/brand\/logo-128\.png/];

function routes(dir: string, out: string[] = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'assets' && e.name !== 'media') routes(p, out);
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}
const text = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

const failures: string[] = [];
const files = routes(dist);
for (const file of files) {
  const route = '/' + path.relative(dist, path.dirname(file)).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const fail = (m: string) => failures.push(`${route}: ${m}`);
  const noindex = /<meta name="robots" content="noindex/.test(html);

  // footer
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
  if (!/kz-footer/.test(footer)) fail('shared footer missing');
  for (const s of SERVICES) if (!footer.includes(`href="/services/${s}"`)) fail(`footer missing service link /services/${s}`);
  for (const l of ['privacy', 'terms', 'cookies']) if (!footer.includes(`href="/${l}"`)) fail(`footer missing link /${l}`);

  // logo
  if (!/viewBox="480 350 1200 1400"/.test(html)) fail('inline K logo (BrandMark) missing');
  for (const re of LEGACY) if (re.test(html)) fail(`legacy logo reference ${re}`);

  // head
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail('title missing/short');
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) fail('meta description missing/short');
  if (!noindex && !/<link rel="canonical" href="https:\/\/[^"]+"/.test(html)) fail('canonical missing');

  // main content
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '';
  if (words(text(main)) < 120) fail(`main content too thin (${words(text(main))} words)`);

  // links that must be real links
  const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
  const linkedText = (needle: RegExp) => anchors.filter(([, attrs, inner]) => needle.test(text(inner)) && /\shref="[^"#][^"]*"/.test(attrs)).length;
  const total = (needle: RegExp) => (text(html).match(new RegExp(needle.source, 'g')) ?? []).length;
  const readFull = /Read full article/;
  if (total(readFull) > linkedText(readFull)) fail('"Read full article" without a link');
  for (const legal of [/Privacy policy/, /Terms of service/, /Cookie preferences/]) {
    const inFooter = (text(footer).match(new RegExp(legal.source, 'g')) ?? []).length;
    const linked = [...footer.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter(([, a, i]) => legal.test(text(i)) && /\shref="\/[^"]+"/.test(a)).length;
    if (inFooter > linked) fail(`footer "${legal.source}" is not a link`);
  }
}

if (failures.length) {
  console.error(`[verify-build] ${failures.length} problem(s) in ${files.length} routes:\n  ` + failures.join('\n  '));
  process.exit(1);
}
console.log(`[verify-build] ${files.length} routes OK`);
