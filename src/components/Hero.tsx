import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { HeroStage } from './hero3d/HeroStage';
import { Link } from '../lib/router';

interface HeroProps {
  onStartProject: () => void;
  onExploreWork: () => void;
  onOpenSolutionWizard: () => void;
}

const capabilities = ['Custom Software', 'SaaS', 'Mobile Apps', 'AI Solutions', 'Web Platforms', 'APIs & Cloud'];

const principles = [
  ['Business-first', 'Clear scope before code'],
  ['Built to scale', 'Architecture that can grow'],
  ['Transparent', 'Visible milestones & updates'],
];

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section id="hero" className="kz-hero kz-cinematic relative overflow-hidden" aria-labelledby="hero-title">
      <div className="kz-fine-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="kz-hero-vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      {/* Rectangle the shared WebGL canvas renders the hero scene into (extends below the hero so dissolve particles can flow into the next section). */}
      <div data-kz-view="hero" className="kz-view-track kz-view-track--hero" aria-hidden="true" />

      <div className="kz-container relative z-10 grid min-h-[min(100svh,980px)] items-center gap-6 pt-28 pb-14 sm:pt-32 lg:grid-cols-12 lg:gap-4 lg:pt-28 lg:pb-20">
        <div className="lg:col-span-6 xl:col-span-6">
          <div className="kz-hero-enter" style={{ '--i': 0 } as React.CSSProperties}>
            <span className="kz-hero-chip"><b>KorvenzaTech</b> Software engineering &amp; AI products</span>
          </div>

          <h1 id="hero-title" className="kz-display mt-7 max-w-[15ch] text-white">
            Engineering ideas into <span className="kz-gradient-word">exceptional</span> digital products.
          </h1>

          <p className="kz-lead kz-hero-enter mt-7 max-w-xl" style={{ '--i': 2 } as React.CSSProperties}>
            We design and engineer intelligent software, mobile applications and scalable platforms — custom software, SaaS, AI, web, APIs and cloud — for startups and growing businesses that want technology to move them forward.
          </p>

          <div className="kz-hero-enter mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ '--i': 3 } as React.CSSProperties}>
            <Link to="/start-project" className="kz-btn kz-btn-primary">
              Start a project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/work" className="kz-btn kz-btn-secondary">View our work</Link>
            <Link to="/services" className="kz-text-link inline-flex items-center sm:ml-1">Not sure yet? Explore services →</Link>
          </div>

          <ul className="kz-hero-enter mt-10 grid max-w-xl gap-2.5 sm:grid-cols-3" style={{ '--i': 4 } as React.CSSProperties} aria-label="How we work">
            {principles.map(([title, copy]) => (
              <li key={title} className="kz-proof-item">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <div>
                  <div className="text-[13px] font-bold text-white">{title}</div>
                  <div className="mt-0.5 text-[11.5px] leading-4 text-[#8EA098]">{copy}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="kz-hero-enter mt-8 flex max-w-xl flex-wrap gap-2 border-t border-white/[0.07] pt-6" style={{ '--i': 5 } as React.CSSProperties}>
            {capabilities.map((item) => <span key={item} className="kz-capability-pill">{item}</span>)}
          </div>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-6">
          <div className="kz-hero-enter relative mx-auto w-full max-w-[380px] sm:max-w-[520px] lg:max-w-none lg:-mr-8 xl:-mr-16" style={{ '--i': 2 } as React.CSSProperties}>
            <HeroStage />
            <div className="kz-hero-caption left-2 top-[12%]"><i aria-hidden="true" />Design · Build · Scale</div>
            <div className="kz-hero-caption bottom-[14%] right-4"><i aria-hidden="true" />Connected systems</div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center lg:flex" aria-hidden="true">
        <div className="kz-scroll-cue"><span /></div>
      </div>
    </section>
  );
};
