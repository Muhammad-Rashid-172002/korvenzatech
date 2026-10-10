/**
 * Build-time prerender + SEO output.
 *
 * Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx`.
 * For every indexable route it writes dist/<route>/index.html containing:
 *   - the fully rendered page markup (hydrated by the client bundle),
 *   - route-specific title, description, canonical, robots, Open Graph and Twitter tags,
 *   - exactly one JSON-LD @graph (Organization, WebSite, WebPage, BreadcrumbList, ...).
 * It also writes dist/404.html (noindex) and dist/sitemap.xml from the same route list.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const ssrDir = path.resolve('dist-ssr');
const baseFile = path.join(dist, 'index.html');
if (!fs.existsSync(baseFile)) {
  console.error('[seo] dist/index.html not found — run the client build first.');
  process.exit(1);
}
const ssrEntry = ['entry-server.js', 'entry-server.mjs'].map((f) => path.join(ssrDir, f)).find((f) => fs.existsSync(f));
if (!ssrEntry) {
  console.error('[seo] dist-ssr/entry-server.js not found — run `vite build --ssr src/entry-server.tsx --outDir dist-ssr` first.');
  process.exit(1);
}

const { render, ROUTES, getRouteMeta, buildStructuredData, canonicalFor } = await import(pathToFileURL(ssrEntry).href);
const template = fs.readFileSync(baseFile, 'utf8');
// Build stamp: every page and /build.json carry the commit + build time, so "which build is this
// route serving?" is answerable from view-source (stale caches show an older stamp).
import { execSync } from 'node:child_process';
const commit = (process.env.VERCEL_GIT_COMMIT_SHA || (() => { try { return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return 'unknown'; } })()).slice(0, 7);
const builtAt = new Date().toISOString();
const STAMP = `${commit} ${builtAt}`;

const esc = (s = '') => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

function setTag(html, re, replacement) {
  if (!re.test(html)) throw new Error(`[seo] template is missing a tag matching ${re}`);
  return html.replace(re, replacement);
}

function buildPage(route) {
  const meta = getRouteMeta(route);
  const canonical = canonicalFor(route);
  const robots = meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(meta.description)}" />`);
  html = setTag(html, /<meta name="robots" content="[^"]*"\s*\/?>/, `<meta name="robots" content="${robots}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, meta.noindex ? '' : `<link rel="canonical" href="${canonical}" />`);
  html = setTag(html, /<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${meta.ogType}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(meta.title)}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(meta.description)}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`);
  html = setTag(html, /<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${meta.image}" />`);
  html = setTag(html, /<meta property="og:image:width" content="[^"]*"\s*\/?>/, `<meta property="og:image:width" content="${meta.imageWidth}" />`);
  html = setTag(html, /<meta property="og:image:height" content="[^"]*"\s*\/?>/, `<meta property="og:image:height" content="${meta.imageHeight}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${esc(meta.title)}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${esc(meta.description)}" />`);
  html = setTag(html, /<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${meta.image}" />`);
  const extraHead = [
    // Desktop only: there the hero poster is above the fold; on phones it sits below the headline.
    route === '/' ? '<link rel="preload" as="image" href="/media/hero/sculpture-640.webp" imagesrcset="/media/hero/sculpture-640.webp 640w, /media/hero/sculpture-1100.webp 1100w" imagesizes="620px" media="(min-width: 1024px)" fetchpriority="high" />' : '',
    `<script type="application/ld+json" id="kz-schema">${jsonLd(buildStructuredData(route))}</script>`,
  ].join('');
  html = html.replace('</head>', `${extraHead}<meta name="kz-build" content="${STAMP}" /></head>`);

  const appHtml = render(route);
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${appHtml}</div>`);
  return html;
}

const routes = [...ROUTES];
for (const route of routes) {
  const html = buildPage(route);
  if (route === '/') { fs.writeFileSync(baseFile, html); continue; }
  const dir = path.join(dist, ...route.split('/').filter(Boolean));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// Branded 404 (served by Vercel for unknown paths with a 404 status).
fs.writeFileSync(path.join(dist, '404.html'), buildPage('/__not-found__'));

// Sitemap from the same route list — only canonical, indexable URLs.
const lastmod = new Date().toISOString().slice(0, 10);
const urls = routes
  .map((r) => getRouteMeta(r))
  .filter((m) => !m.noindex)
  .map((m) => `  <url><loc>${canonicalFor(m.path)}</loc><lastmod>${lastmod}</lastmod><changefreq>${m.changefreq}</changefreq><priority>${m.priority.toFixed(1)}</priority></url>`)
  .join('\n');
fs.writeFileSync(path.join(dist, 'build.json'), JSON.stringify({ commit, builtAt }) + '\n');
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

// The SSR bundle is a build tool only; never deploy it.
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`[seo] prerendered ${routes.length} routes + 404.html, wrote sitemap.xml`);
