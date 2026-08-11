import React from 'react';
import { ArrowRight, Sparkles, Layers, Shield, ChevronRight } from 'lucide-react';
import { HeroVisual } from './HeroVisual';

interface HeroProps {
  onStartProject: () => void;
  onExploreWork: () => void;
  onOpenSolutionWizard: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartProject,
  onExploreWork,
  onOpenSolutionWizard,
}) => {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-radial-gradient">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Top Positioning Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Technology Built Around Your Business</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              We Build{' '}
              <span className="gradient-text-cyan">
                Technology
              </span>{' '}
              That Moves Businesses Forward.
            </h1>

            {/* Supporting Description */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              From <strong className="text-white font-semibold">AI systems</strong> and <strong className="text-white font-semibold">custom software</strong> to <strong className="text-white font-semibold">mobile apps</strong>, websites, APIs, cloud infrastructure and digital growth — KorvenzaTech turns ambitious ideas into reliable, scalable technology.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary CTA */}
              <button
                onClick={onStartProject}
                className="group px-7 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={onExploreWork}
                className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>Explore Our Work</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Solution Wizard CTA */}
              <button
                onClick={onOpenSolutionWizard}
                className="px-5 py-4 text-xs font-medium text-indigo-400 hover:text-indigo-300 underline decoration-indigo-400/40 underline-offset-4 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Not sure what you need? Use Interactive Solution Builder &rarr;</span>
              </button>
            </div>

            {/* Credibility Line */}
            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">Core Capabilities:</span>
              <div className="flex flex-wrap items-center gap-2 text-slate-300">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60">AI Solutions</span>
                <span className="text-slate-600">•</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60">Custom Software</span>
                <span className="text-slate-600">•</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60">Mobile Apps</span>
                <span className="text-slate-600">•</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60">APIs & Cloud</span>
                <span className="text-slate-600">•</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60">Digital Growth</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Column */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroVisual />
          </div>

        </div>
      </div>
    </section>
  );
};
