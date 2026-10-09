import React, { useState } from 'react';
import { INDUSTRIES_DATA } from '../data/companyData';
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
        
        {/* Section Header */}
        <div className="kz-reveal text-center max-w-3xl mx-auto space-y-5 mb-14">
          <div className="kz-eyebrow mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Domain Experience</span>
          </div>

          <h2 className="kz-h2">
            Technology Tailored for Different Industries
          </h2>

          <p className="kz-lead">
            Every sector has unique regulatory, operational, and user expectations. We design software engineered specifically for your domain.
          </p>
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
            <span className="text-xs font-mono text-emerald-400">Industry Solution Blueprint</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <p className="text-base font-semibold text-slate-200">
                {selectedIndustry.tagline}
              </p>

              <div className="p-4 rounded-xl bg-[var(--kz-surface-2)]/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Core Industry Challenge We Solve:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedIndustry.problemSolved}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Typical Solutions We Deliver:
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
                Our architects can share relevant industry benchmarks and technical frameworks.
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
