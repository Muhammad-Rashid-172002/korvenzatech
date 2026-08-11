import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/companyData';
import { ServiceItem } from '../types';
import { 
  Bot, Network, Smartphone, Globe, Code, Layers, Cloud, Layout, TrendingUp, 
  ArrowRight, CheckCircle2, Sparkles, ChevronRight 
} from 'lucide-react';

interface ServicesOverviewProps {
  onSelectService: (service: ServiceItem) => void;
  onStartProject: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Bot, Network, Smartphone, Globe, Code, Layers, Cloud, Layout, TrendingUp
};

export const ServicesOverview: React.FC<ServicesOverviewProps> = ({ onSelectService, onStartProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'AI & Automation', 'Software', 'Applications', 'Infrastructure', 'Growth'];

  const filteredServices = activeCategory === 'All'
    ? SERVICES_DATA
    : SERVICES_DATA.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-24 bg-[#08090B] relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>End-to-End Capabilities</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need to Build and Scale Digitally
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Whether you need your first mobile app, smarter AI business automation, a custom enterprise platform, or an entire digital ecosystem, our engineering team guides you from strategy to launch.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const IconComponent = ICON_MAP[service.iconName] || Code;

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="group cursor-pointer rounded-2xl glass-panel p-7 glass-panel-hover flex flex-col justify-between relative overflow-hidden border border-white/10 hover:border-emerald-400/30"
              >
                {/* Subtle Glow Accent Line on Top Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-5">
                  {/* Icon & Category Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/15 flex items-center justify-center text-emerald-300 group-hover:bg-emerald-500/15 group-hover:text-emerald-200 group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5">
                      {service.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                    {service.title}
                  </h3>

                  {/* Plain-English Business Value */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <span className="text-[10px] font-semibold tracking-wider text-emerald-300 uppercase block">
                      Business Value:
                    </span>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {service.businessValue}
                    </p>
                  </div>

                  {/* Feature Highlights */}
                  <ul className="space-y-2 pt-1">
                    {service.features.slice(0, 3).map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Card Footer Action */}
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
                  <span>Explore Capabilities & Specs</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-emerald-950/20 via-[#0b1112] to-[#080b0d] border border-emerald-400/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h4 className="text-xl font-bold text-white">
              Need a custom package or technical advice on your architecture?
            </h4>
            <p className="text-sm text-slate-300">
              Our engineering managers analyze your business goals and propose a tailored technical roadmap.
            </p>
          </div>
          <button
            onClick={onStartProject}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <span>Request Technical Proposal</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
