import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { LegalDoc } from '../../data/legal';
import { LEGAL } from '../../data/legal';
import { formatDate } from '../../data/articles';
import { Link } from '../../lib/router';
import { Prose, proseHeadings } from './Prose';
import { LEGAL_BODIES } from '../../data/legalBodies';

/** /privacy, /terms, /cookies — readable document page with an on-page contents list. */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const body = LEGAL_BODIES[doc.slug];
  const toc = proseHeadings(body);
  return (
    <>
      <section className="kz-page-hero kz-cinematic relative overflow-hidden border-b border-white/[0.06] pt-36 pb-14 sm:pt-40 sm:pb-16">
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="kz-container relative max-w-4xl">
          <span className="kz-eyebrow kz-hero-enter"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />Legal</span>
          <h1 className="kz-h1 kz-hero-enter mt-6 text-white" style={{ '--i': 1 } as React.CSSProperties}>{doc.title}</h1>
          <p className="kz-hero-enter mt-5 font-mono text-[12px] uppercase tracking-[0.14em] text-[#A6BDB2]" style={{ '--i': 2 } as React.CSSProperties}>
            Last updated <time dateTime={doc.updated}>{formatDate(doc.updated)}</time>
          </p>
        </div>
      </section>
      <section className="kz-section !pt-14">
        <div className="kz-container grid max-w-6xl gap-12 lg:grid-cols-[220px_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28">
              <div className="kz-meta">On this page</div>
              <ul className="mt-4 space-y-2 text-[13px]">
                {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} className="text-[var(--kz-muted)] hover:text-[var(--kz-text)]">{h.text}</a></li>)}
              </ul>
              <div className="kz-meta mt-8">Other policies</div>
              <ul className="mt-4 space-y-2 text-[13px]">
                {LEGAL.filter((d) => d.slug !== doc.slug).map((d) => <li key={d.slug}><Link to={`/${d.slug}`} className="text-[var(--kz-muted)] hover:text-[var(--kz-text)]">{d.title}</Link></li>)}
              </ul>
            </div>
          </nav>
          <article className="max-w-3xl">
            <Prose body={body} />
          </article>
        </div>
      </section>
    </>
  );
}
