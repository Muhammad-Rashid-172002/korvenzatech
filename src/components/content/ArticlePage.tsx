import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import type { Article } from '../../data/articles';
import { ARTICLES, formatDate, readMinutes } from '../../data/articles';
import { Link } from '../../lib/router';
import { Prose } from './Prose';
import { ARTICLE_BODIES } from '../../data/articleBodies';

/** Reading-progress bar: transform-only, updated from scroll (no React state). */
function ReadingProgress({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = target.current, b = bar.current;
      if (!el || !b) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.2) / Math.max(1, total)));
      b.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [target]);
  return <div className="kz-read-progress" aria-hidden="true"><div ref={bar} /></div>;
}

export default function ArticlePage({ article }: { article: Article }) {
  const body = useRef<HTMLElement>(null);
  const related = ARTICLES.filter((a) => a.slug !== article.slug);
  return (
    <>
      <ReadingProgress target={body} />
      <section className="kz-page-hero kz-cinematic relative overflow-hidden border-b border-white/[0.06] pt-36 pb-14 sm:pt-40 sm:pb-16">
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="kz-container relative max-w-4xl">
          <nav aria-label="Breadcrumb" className="kz-hero-enter text-[13px] text-[#A6BDB2]">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link to="/" className="hover:text-white">Home</Link></li><li aria-hidden="true">/</li>
              <li><Link to="/insights" className="hover:text-white">Insights</Link></li><li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#C3D1CA]">{article.category}</li>
            </ol>
          </nav>
          <h1 className="kz-h1 kz-hero-enter mt-6 text-white" style={{ '--i': 1 } as React.CSSProperties}>{article.title}</h1>
          <p className="kz-lead kz-hero-enter mt-6 max-w-3xl" style={{ '--i': 2 } as React.CSSProperties}>{article.description}</p>
          <div className="kz-hero-enter mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#A6BDB2]" style={{ '--i': 3 } as React.CSSProperties}>
            <span>By <strong className="font-semibold text-white">{article.author.name}</strong>, {article.author.role}</span>
            <time dateTime={article.published}>{formatDate(article.published)}</time>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{readMinutes(article)} min read</span>
          </div>
        </div>
      </section>

      <section className="kz-section !pt-14">
        <div className="kz-container max-w-3xl">
          <article ref={body}><Prose body={ARTICLE_BODIES[article.slug]} /></article>

          <aside className="kz-reveal mt-16 rounded-[var(--kz-radius-xl)] border border-emerald-500/20 bg-[var(--kz-surface)] p-8 sm:p-10" aria-label="Work with KorvenzaTech">
            <h2 className="text-2xl font-bold text-[var(--kz-text)]">Planning something similar?</h2>
            <p className="mt-3 text-[var(--kz-muted)]">Tell us the goal in plain words. We'll reply with a clear, practical next step — no obligation.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/start-project" className="kz-btn kz-btn-primary !w-auto">Start a project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></Link>
              <Link to="/insights" className="kz-btn kz-btn-secondary !w-auto"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All insights</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="kz-section kz-section-alt border-t border-[var(--kz-border)]" aria-labelledby="related-title">
        <div className="kz-container">
          <h2 id="related-title" className="kz-h3">Related articles</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {related.map((a) => (
              <Link key={a.slug} to={`/insights/${a.slug}`} className="kz-card kz-card-hover group block p-7">
                <span className="kz-tech-pill !text-[var(--kz-accent-text)]">{a.category}</span>
                <h3 className="mt-4 text-lg font-bold text-[var(--kz-text)]">{a.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--kz-muted)]">{a.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--kz-accent-text)]">Read full article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
