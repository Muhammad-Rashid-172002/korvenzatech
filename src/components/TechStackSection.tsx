import React, { useState } from 'react';
import { TECH_STACK } from '../data/companyData';
import { Sparkles, Code, CheckCircle2 } from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', 'Mobile Applications', 'Frontend & Web', 'Backend & APIs', 'AI & Intelligence', 'Cloud & Infrastructure'];

  const filtered = selectedCat === 'All'
    ? TECH_STACK
    : TECH_STACK.filter(c => c.category === selectedCat);

  return (
    <section className="py-24 bg-[#080b12] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineering Stack</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Modern Technology. Chosen With Purpose.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Clients buy measurable business outcomes, speed, and reliability — not programming languages. We select tools engineered for long-term scalability and security.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((catObj, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl glass-panel border border-white/10 hover:border-blue-500/30 text-left space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white">{catObj.category}</h3>
                <Code className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-xs text-slate-400">{catObj.description}</p>

              <div className="space-y-3 pt-2">
                {catObj.items.map((item, iIdx) => (
                  <div key={iIdx} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                        <span>{item.name}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-5">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
