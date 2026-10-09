/**
 * Build-time prerender entry (vite build --ssr). Not shipped to browsers.
 * Renders each route to static HTML so search engines and no-JS visitors get
 * the real page content; the client then hydrates the same markup.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App, { isKnownRoute } from './App';
import { ROUTES, buildStructuredData, canonicalFor, getRouteMeta } from './data/seo';

export { ROUTES, buildStructuredData, canonicalFor, getRouteMeta, isKnownRoute };

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>,
  );
}
