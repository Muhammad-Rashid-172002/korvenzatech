import React from 'react';
import { CASE_STUDIES } from '../data/companyData';
import { CaseStudy } from '../types';
import { ArrowRight, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

interface FeaturedWorkProps {
  onSelectCaseStudy: (study: CaseStudy) => void;
  onStartProject: () => void;
}

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ onSelectCaseStudy, onStartProject }) => {
  return (
    <section id="work" className="py-24 bg-[#08090B] relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Engineering Outcomes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Featured Products & Case Studies
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Real software systems engineered by KorvenzaTech — delivering AI intelligence, cross-platform performance, and high business reliability.
          </p>
        </div>

        {/* Case Studies List */}
        <div className="space-y-12">
          {CASE_STUDIES.map((study, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={study.id}
                className="rounded-3xl glass-panel border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 p-8 sm:p-10 relative overflow-hidden group"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Text Details Column */}
                  <div className={`lg:col-span-7 space-y-6 text-left ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                    
                    {/* Category & Industry */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold">
                        {study.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                        Platform: {study.platform}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {study.name}
                      </h3>
                      <p className="text-sm font-semibold text-indigo-400 mt-1">
                        {study.tagline}
                      </p>
                    </div>

                    {/* Problem & Solution Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                          The Challenge:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {study.problem}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                          KorvenzaTech Solution:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {study.solution}
                        </p>
                      </div>
                    </div>

                    {/* Important Metrics Bar */}
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 grid grid-cols-3 gap-2 text-center">
                      {study.metrics.map((m, mIdx) => (
                        <div key={mIdx}>
                          <div className="text-base sm:text-xl font-extrabold text-indigo-400">
                            {m.value}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="space-y-2">
                      <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
                        Core Tech Stack:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {study.coreTech.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 flex items-center gap-4">
                      <button
                        onClick={() => onSelectCaseStudy(study)}
                        className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/25 flex items-center gap-2"
                      >
                        <span>View Full Case Study</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Image / Graphic Visual Column */}
                  <div className={`lg:col-span-5 relative ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-300">
                      <img
                        src={study.imageSrc}
                        alt={study.name}
                        className="w-full h-64 sm:h-80 lg:h-96 object-cover object-center filter brightness-90 contrast-105 group-hover:brightness-100 transition-all"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#080b12]/90 backdrop-blur-md border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                        <span className="font-semibold text-white">{study.name} Overview</span>
                        <span className="text-[10px] font-mono text-violet-400">Verified Case Outcome</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={onStartProject}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <span>Have a Similar Project? Request Discovery Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
