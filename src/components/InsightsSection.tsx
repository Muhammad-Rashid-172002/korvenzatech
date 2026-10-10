import React from 'react';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { ARTICLES, formatDate, readMinutes } from '../data/articles';
import { Link } from '../lib/router';

/** Insights index: every card is a real link to its full article page. */
export const InsightsSection: React.FC = () => (
  <section id="insights" className="kz-section kz-section-alt relative z-10 border-t border-[var(--kz-border)]">
    <div className="kz-container">
      <div className="kz-reveal mx-auto mb-14 max-w-3xl space-y-5 text-center">
        <div className="kz-eyebrow mx-auto"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" /><span>KorvenzaTech Knowledge Hub</span></div>
        <h2 className="kz-h2">Articles &amp; technology insights</h2>
        <p className="kz-lead">Practical guidance on AI, mobile app strategy and software architecture — written from the projects we build.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ARTICLES.map((a, i) => (
          <Link key={a.slug} to={`/insights/${a.slug}`} className="kz-card kz-card-hover kz-reveal group flex flex-col justify-between p-7" style={{ '--d': i } as React.CSSProperties}>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[var(--kz-muted)]">
                <span className="kz-tech-pill !text-[var(--kz-accent-text)]">{a.category}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden="true" />{readMinutes(a)} min read</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--kz-text)] transition-colors group-hover:text-[var(--kz-accent-text)]">{a.title}</h3>
              <p className="line-clamp-3 text-[13px] leading-relaxed text-[var(--kz-muted)]">{a.description}</p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[var(--kz-border)] pt-6 text-xs font-semibold text-[var(--kz-accent-text)]">
              <span>Read full article</span>
              <span className="inline-flex items-center gap-2 font-normal text-[var(--kz-muted)]"><time dateTime={a.published}>{formatDate(a.published)}</time><ArrowRight className="h-4 w-4 text-[var(--kz-accent-text)] transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
