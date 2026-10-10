import React, { useState } from 'react';
import { CASE_STUDIES, INDUSTRIES_DATA } from '../data/companyData';
import { Link } from '../lib/router';
import { IndustryItem } from '../types';
import { 
  Activity, GraduationCap, Dumbbell, DollarSign, ShoppingBag, Building, Truck, Briefcase, 
  CheckCircle, ArrowRight, Sparkles 
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Activity, GraduationCap, Dumbbell, DollarSign, ShoppingBag, Building, Truck, Briefcase
};

interface IndustriesSectionProps {
  onStartProject: () => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ onStartProject }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryItem>(INDUSTRIES_DATA[0]);

  return (
    <section id="industries" className="kz-section kz-section-alt relative z-10 border-t border-[var(--kz-border)]">
      <div className="kz-container">
        
        {/* Where we've delivered: only industries backed by shipped work, each linked to its case study. */}
        <div className="kz-reveal mx-auto mb-14 max-w-3xl space-y-5 text-center">
          <div className="kz-eyebrow mx-auto"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /><span>Where we've delivered</span></div>
          <h2 className="kz-h2">Shipped products, not slideware</h2>
          <p className="kz-lead">Two industries where we have designed, built and shipped our own products. Open each case study for the architecture and the decisions behind it.</p>
        </div>
        <div className="mb-20 grid gap-5 md:grid-cols-2">
          {[
            { id: 'ielts-ai-master', industry: 'Education & EdTech', Icon: GraduationCap },
            { id: 'skilllink', industry: 'Marketplaces & On-demand services', Icon: Briefcase },
          ].map(({ id, industry, Icon }, i) => {
            const study = CASE_STUDIES.find((c) => c.id === id);
            if (!study) return null;
            return (
              <Link key={id} to={`/work/${id}`} className="kz-card kz-card-hover kz-reveal group block p-7" style={{ '--d': i } as React.CSSProperties}>
                <span className="kz-icon-orb !h-10 !w-10"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <div className="kz-meta mt-5 !text-[var(--kz-accent-text)]">{industry}</div>
                <h3 className="mt-2 text-xl font-bold text-[var(--kz-text)]">{study.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--kz-muted)]">{study.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--kz-accent-text)]">Read the case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            );
          })}
        </div>

        {/* What we can build: capability by industry (not a claim of past clients there). */}
        <div className="kz-reveal mx-auto mb-10 max-w-3xl space-y-4 text-center">
          <h2 className="kz-h3">What we can build for your industry</h2>
          <p className="text-[15px] leading-7 text-[var(--kz-muted)]">The same engineering applies across sectors. Pick yours to see the kind of system we would design for it.</p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {INDUSTRIES_DATA.map((ind) => {
            const IconComp = ICON_MAP[ind.iconName] || Briefcase;
            const isSel = selectedIndustry.id === ind.id;

            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind)}
                className={`p-3.5 rounded-2xl text-center border transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                  isSel
                    ? 'bg-emerald-700 text-white kz-on-accent border-emerald-400 shadow-lg shadow-emerald-600/30 scale-105'
                    : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <IconComp className={`w-5 h-5 ${isSel ? 'text-white' : 'text-emerald-400'}`} />
                <span className="text-[11px] font-semibold leading-tight">{ind.name.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Detail Box */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-emerald-500/30 bg-gradient-to-br from-[var(--kz-bg)] to-[var(--kz-bg-alt)] space-y-6 text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">
                {selectedIndustry.name}
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400">Solution blueprint</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <p className="text-base font-semibold text-slate-200">
                {selectedIndustry.tagline}
              </p>

              <div className="p-4 rounded-xl bg-[var(--kz-surface-2)]/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Common challenge in this sector:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedIndustry.problemSolved}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  What we can build:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedIndustry.exampleSolutions.map((sol, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/10 text-xs text-slate-200 flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{sol}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-center space-y-4">
              <h3 className="text-sm font-bold text-white">
                Building a product in {selectedIndustry.name}?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tell us how your operation works today — we'll suggest a practical architecture and the first version worth building.
              </p>
              <button
                onClick={onStartProject}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-700 text-white kz-on-accent font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Discuss {selectedIndustry.name} Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
