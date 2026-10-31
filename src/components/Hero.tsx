import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../lib/router';
import { HeroBackdrop, HeroTrails } from './hero/HeroBackdrop';
import { HeroLogo } from './hero/HeroLogo';
import { FitMindScreen, NavScreen, PhoneFrame } from './hero/HeroDevices';
import { AgentCard, AnalyticsCard } from './hero/HeroCards';
import { HeroFeatures } from './hero/HeroFeatures';
import { useHeroMotion } from './hero/useHeroMotion';
import './hero/hero.css';

interface HeroProps {
  onStartProject: () => void;
  onExploreWork: () => void;
  onOpenSolutionWizard: () => void;
}

/** Per-layer motion: --d pointer depth, --s scroll-parallax depth, --e entrance order. */
const layer = (d: number, s: number, e: number) => ({ '--d': d, '--s': s, '--i': e } as React.CSSProperties);

/**
 * Homepage hero — DOM/CSS composition (no WebGL): the original K logo on a lit platform at the
 * centre, product mockups and demo cards around it, backdrop light and particles behind.
 * Motion: CSS keyframes + three CSS variables written by useHeroMotion (pointer depth, scroll
 * parallax). Desktop/tablet use a fixed 1200 px stage scaled with `zoom`; phones get their own
 * stacked layout (hero.css).
 */
export const Hero: React.FC<HeroProps> = () => {
  const ref = useRef<HTMLElement>(null);
  useHeroMotion(ref);

  return (
    <section ref={ref} id="hero" className="kz-hero kz-cinematic kzh relative overflow-hidden" aria-labelledby="hero-title">
      <HeroBackdrop />
      <div className="kz-hero-vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="kz-hero-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="kz-container kzh-inner relative z-10">
        <div className="kzh-copy kzh-layer" style={layer(0.2, -0.35, 0)}>
          <div className="kz-hero-enter" style={{ '--i': 0 } as React.CSSProperties}>
            <span className="kzh-badge"><i aria-hidden="true" />Design <b aria-hidden="true">•</b> Build <b aria-hidden="true">•</b> Scale</span>
          </div>
          <h1 id="hero-title" className="kzh-title text-white">
            Building intelligent <span className="kz-gradient-word">digital</span> experiences.
          </h1>
          <p className="kzh-sub kz-hero-enter" style={{ '--i': 2 } as React.CSSProperties}>
            {['AI-Powered Solutions', 'Mobile Apps', 'Web Platforms', 'Business Automation'].map((item, i) => (
              <React.Fragment key={item}><span>{item}{i < 3 && <i aria-hidden="true">·</i>}</span> </React.Fragment>
            ))}
          </p>
          <div className="kzh-ctas kz-hero-enter" style={{ '--i': 3 } as React.CSSProperties}>
            <Link to="/start-project" data-kz-magnetic="" data-kz-ripple="" className="kz-btn kz-btn-primary">
              Start a project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/work" className="kz-btn kz-btn-secondary">View our work</Link>
            <Link to="/services" className="kz-text-link inline-flex items-center sm:ml-1">Not sure yet? Explore services →</Link>
          </div>
        </div>

        <div className="kzh-stage-wrap">
          <div className="kzh-stage">
            <HeroTrails />

            <div className="kzh-slot kzh-slot--logo">
              <div className="kzh-enter kzh-enter--logo" style={{ '--i': 1 } as React.CSSProperties}>
                <div className="kzh-layer" style={layer(0.5, 0.15, 1)}><HeroLogo /></div>
              </div>
            </div>

            <div className="kzh-slot kzh-slot--phone-l" aria-hidden="true">
              <div className="kzh-enter kzh-enter--left" style={{ '--i': 3 } as React.CSSProperties}>
                <div className="kzh-layer" style={layer(1, 0.55, 3)}>
                  <div className="kzh-float kzh-float--a"><div className="kzh-hover kzh-tilt-l"><PhoneFrame><FitMindScreen /></PhoneFrame></div></div>
                </div>
              </div>
            </div>

            <div className="kzh-slot kzh-slot--dash" aria-hidden="true">
              <div className="kzh-enter kzh-enter--left" style={{ '--i': 5 } as React.CSSProperties}>
                <div className="kzh-layer" style={layer(1.5, 0.9, 5)}>
                  <div className="kzh-float kzh-float--c"><div className="kzh-hover"><AnalyticsCard /></div></div>
                </div>
              </div>
            </div>

            <div className="kzh-slot kzh-slot--phone-r" aria-hidden="true">
              <div className="kzh-enter kzh-enter--right" style={{ '--i': 4 } as React.CSSProperties}>
                <div className="kzh-layer" style={layer(1, 0.45, 4)}>
                  <div className="kzh-float kzh-float--b"><div className="kzh-hover kzh-tilt-r"><PhoneFrame><NavScreen /></PhoneFrame></div></div>
                </div>
              </div>
            </div>

            <div className="kzh-slot kzh-slot--agent">
              <div className="kzh-enter kzh-enter--right" style={{ '--i': 6 } as React.CSSProperties}>
                <div className="kzh-layer" style={layer(1.4, 0.8, 6)}>
                  <div className="kzh-float kzh-float--d"><div className="kzh-hover"><AgentCard /></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="kz-hero-enter" style={{ '--i': 7 } as React.CSSProperties}>
          <HeroFeatures />
        </div>
      </div>
    </section>
  );
};
