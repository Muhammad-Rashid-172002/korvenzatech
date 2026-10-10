/**
 * Build-time prerender entry (vite build --ssr). Not shipped to browsers.
 * Renders each route to static HTML so search engines and no-JS visitors get
 * the real page content; the client then hydrates the same markup.
 */
import { StrictMode } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import App, { isKnownRoute } from './App';
import { ROUTES, buildStructuredData, canonicalFor, getRouteMeta } from './data/seo';

export { ROUTES, buildStructuredData, canonicalFor, getRouteMeta, isKnownRoute };

/** Static prerender: unlike renderToString it waits for lazy page chunks, so articles and
 *  legal pages ship their full text in the HTML. */
export async function render(path: string) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>,
  );
  const chunks: Buffer[] = [];
  for await (const c of prelude) chunks.push(typeof c === 'string' ? Buffer.from(c) : c);
  return Buffer.concat(chunks).toString('utf8');
}
