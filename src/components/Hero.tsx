import React from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { HeroVisual } from './HeroVisual';

interface HeroProps {
  onStartProject: () => void;
  onExploreWork: () => void;
  onOpenSolutionWizard: () => void;
}

const capabilities = ['Custom Software', 'SaaS', 'Mobile Apps', 'AI Solutions', 'Web Platforms', 'APIs & Cloud'];

export const Hero: React.FC<HeroProps> = ({ onStartProject, onExploreWork, onOpenSolutionWizard }) => {
  return (
    <section id="hero" className="kz-hero relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="kz-hero-orb kz-hero-orb-a" />
      <div className="kz-hero-orb kz-hero-orb-b" />
      <div className="absolute inset-0 kz-fine-grid pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3.5 py-1.5 text-[11px] font-bold tracking-[.08em] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              SOFTWARE DEVELOPMENT COMPANY • GLOBAL DELIVERY
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-[68px]">
              We build smart, scalable software that helps businesses <span className="kz-gradient-word">move faster.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              KorvenzaTech designs and develops modern software, SaaS platforms, mobile applications, AI-enabled systems, websites and secure APIs for startups and growing companies. We turn complex technology into clear business outcomes.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button onClick={onStartProject} className="kz-primary-cta group">
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={onExploreWork} className="kz-secondary-cta group">
                View Our Work
                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button onClick={onOpenSolutionWizard} className="kz-text-link">
                Not sure what you need? Get guidance →
              </button>
            </div>

            <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ['Business-first', 'Clear scope before code'],
                ['Built to scale', 'Architecture that can grow'],
                ['Transparent', 'Visible milestones & updates'],
              ].map(([title, copy]) => (
                <div key={title} className="kz-proof-item">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <div>
                    <div className="text-xs font-bold text-slate-100">{title}</div>
                    <div className="mt-1 text-[10px] leading-4 text-slate-500">{copy}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex max-w-3xl flex-wrap gap-2 border-t border-white/[0.07] pt-6">
              {capabilities.map((item) => (
                <span key={item} className="kz-capability-pill">{item}</span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="kz-hero-visual-wrap">
              <div className="kz-visual-label top-5 left-5">PRODUCT ENGINEERING</div>
              <div className="kz-visual-label right-5 bottom-5">DESIGN • BUILD • SCALE</div>
              <HeroVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
