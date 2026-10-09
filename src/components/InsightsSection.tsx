import React, { useEffect, useRef, useState } from 'react';
import { INSIGHTS_ARTICLES } from '../data/companyData';
import { InsightArticle } from '../types';
import { BookOpen, Clock, ArrowRight, X, Sparkles } from 'lucide-react';

export const InsightsSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selectedArticle) return;
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedArticle(null); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); prev?.focus(); };
  }, [selectedArticle]);

  return (
    <section id="insights" className="kz-section kz-section-alt relative z-10 border-t border-[var(--kz-border)]">
      <div className="kz-container">
        
        {/* Section Header */}
        <div className="kz-reveal text-center max-w-3xl mx-auto space-y-5 mb-14">
          <div className="kz-eyebrow mx-auto">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KorvenzaTech Knowledge Hub</span>
          </div>

          <h2 className="kz-h2">
            Articles & Technology Insights
          </h2>

          <p className="kz-lead">
            Practical analyses on artificial intelligence, mobile app architecture, cloud security, and digital business strategy.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INSIGHTS_ARTICLES.map((art) => (
            <button
              type="button"
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              aria-haspopup="dialog"
              className="kz-card kz-card-hover kz-reveal group p-7 flex flex-col justify-between text-left"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="kz-tech-pill !text-[var(--kz-accent-text)]">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                <span>Read full article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>

        {/* Article Reader Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setSelectedArticle(null); }}>
            <div data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="article-title" ref={dialogRef} tabIndex={-1} className="outline-none bg-[var(--kz-bg)] border border-emerald-500/30 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-left relative shadow-2xl">
              
              <button
                type="button"
                aria-label="Close article"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-emerald-400 font-mono">
                  <span>{selectedArticle.category}</span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                </div>

                <h3 id="article-title" className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedArticle.title}
                </h3>

                <div className="text-xs text-slate-400 font-medium">
                  By {selectedArticle.author.name} ({selectedArticle.author.role})
                </div>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4 pt-4 border-t border-white/10">
                {selectedArticle.content}
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-700 text-white kz-on-accent font-semibold text-xs"
                >
                  Close Article
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
