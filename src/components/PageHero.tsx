import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from './ui';

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  primary?: string;
  onPrimary?: () => void;
  secondary?: string;
  onSecondary?: () => void;
};

/** Inner-page hero: the same cinematic language as the homepage, without the 3D cost. */
export const PageHero: React.FC<Props> = ({ eyebrow, title, description, primary, onPrimary, secondary, onSecondary }) => (
  <section className="kz-page-hero kz-cinematic relative overflow-hidden border-b border-white/[0.06] pt-36 pb-20 sm:pt-44 sm:pb-28">
    <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
    <div className="pointer-events-none absolute left-1/2 top-24 h-px w-[min(900px,90%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" aria-hidden="true" />
    <div className="kz-container relative text-center">
      <Eyebrow className="kz-hero-enter mx-auto">{eyebrow}</Eyebrow>
      <h1 className="kz-h1 kz-hero-enter mx-auto mt-7 max-w-5xl text-white" style={{ '--i': 1 } as React.CSSProperties}>{title}</h1>
      <p className="kz-lead kz-hero-enter mx-auto mt-7 max-w-3xl" style={{ '--i': 2 } as React.CSSProperties}>{description}</p>
      {(primary || secondary) && (
        <div className="kz-hero-enter mt-10 flex flex-col justify-center gap-3 sm:flex-row" style={{ '--i': 3 } as React.CSSProperties}>
          {primary && <button type="button" onClick={onPrimary} className="kz-btn kz-btn-primary">{primary}<ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></button>}
          {secondary && <button type="button" onClick={onSecondary} className="kz-btn kz-btn-secondary">{secondary}</button>}
        </div>
      )}
    </div>
  </section>
);
