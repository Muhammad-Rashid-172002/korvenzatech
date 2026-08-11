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
    <section id="industries" className="py-24 bg-[#06080d] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Domain Experience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Technology Tailored for Different Industries
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
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
                    ? 'bg-blue-600 text-white border-violet-400 shadow-lg shadow-blue-600/30 scale-105'
                    : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <IconComp className={`w-5 h-5 ${isSel ? 'text-white' : 'text-violet-400'}`} />
                <span className="text-[11px] font-semibold leading-tight">{ind.name.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Detail Box */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-blue-500/30 bg-gradient-to-br from-[#080b12] to-[#04060a] space-y-6 text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">
                {selectedIndustry.name}
              </span>
            </div>
            <span className="text-xs font-mono text-violet-400">Industry Solution Blueprint</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <p className="text-base font-semibold text-slate-200">
                {selectedIndustry.tagline}
              </p>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block">
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
                    <div key={idx} className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/10 text-xs text-slate-200 flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{sol}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-center space-y-4">
              <h4 className="text-sm font-bold text-white">
                Building a product in {selectedIndustry.name}?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our architects can share relevant industry benchmarks and technical frameworks.
              </p>
              <button
                onClick={onStartProject}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
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
