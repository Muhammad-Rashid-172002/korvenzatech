import { useEffect } from 'react';
import { buildStructuredData, canonicalFor, getRouteMeta } from '../data/seo';

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(property ? 'property' : 'name', name);
    document.head.appendChild(node);
  }
  node.content = content;
}

/**
 * Keeps <head> correct during client-side navigation. The initial HTML for every
 * route is prerendered with identical values at build time (same data source),
 * so the first load never depends on this running.
 */
export function SeoManager({ path }: { path: string }) {
  useEffect(() => {
    const meta = getRouteMeta(path);
    const canonicalUrl = canonicalFor(path);

    document.title = meta.title;
    setMeta('description', meta.description);
    setMeta('robots', meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    const kw = document.head.querySelector('meta[name="keywords"]');
    kw?.remove(); // meta keywords is ignored by search engines; never emitted
    setMeta('og:type', meta.ogType, true);
    setMeta('og:site_name', 'KorvenzaTech', true);
    setMeta('og:title', meta.title, true);
    setMeta('og:description', meta.description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', meta.image, true);
    setMeta('og:image:width', String(meta.imageWidth), true);
    setMeta('og:image:height', String(meta.imageHeight), true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', meta.image);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;

    // Exactly one JSON-LD graph per page (replaces the prerendered one on navigation).
    document.querySelectorAll('script[type="application/ld+json"]').forEach((n) => n.remove());
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = 'kz-schema';
    schema.text = JSON.stringify(buildStructuredData(path));
    document.head.appendChild(schema);
  }, [path]);
  return null;
}
