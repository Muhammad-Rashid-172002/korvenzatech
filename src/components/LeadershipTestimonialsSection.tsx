import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Linkedin, Quote, Star } from 'lucide-react';
import { Eyebrow, SectionHeader } from './ui';
import { useTilt } from '../lib/motion';

import { LEADERS, VISIBLE_TESTIMONIALS, type Leader } from '../data/people';

function Portrait({ leader, featured = false, index }: { leader: Leader; featured?: boolean; index: number }) {
  const tiltRef = useTilt<HTMLDivElement>(featured ? 4 : 5, 7);
  const sizes = featured ? '(min-width: 1024px) 460px, (min-width: 640px) 60vw, 92vw' : '(min-width: 1024px) 340px, (min-width: 640px) 45vw, 92vw';
  return (
    <article className="kz-leader kz-reveal group" style={{ '--d': index } as React.CSSProperties} aria-labelledby={`leader-${index}`}>
      <div ref={tiltRef} className="kz-portrait">
        <div className="kz-portrait-tilt">
          <div className="kz-portrait-back" aria-hidden="true" />
          <div className="kz-portrait-frame kz-portrait-reveal">
            <img
              src={leader.image}
              srcSet={leader.srcSet}
              sizes={sizes}
              alt={`Portrait of ${leader.name}, ${leader.role} at KorvenzaTech`}
              loading="lazy"
              decoding="async"
              width={featured ? 960 : 480}
              height={featured ? 1200 : 600}
            />
          </div>
          <div className="kz-portrait-rim" aria-hidden="true" />
          <div className="kz-portrait-meta">
            <span className="kz-portrait-role">{leader.role}</span>
            <h3 id={`leader-${index}`} className={`mt-3 font-extrabold tracking-tight text-white ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{leader.name}</h3>
            {leader.linkedin && (
              <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" className="kz-portrait-link mt-3 inline-grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-black/30 text-[#C3D1CA] hover:text-white" aria-label={`${leader.name} on LinkedIn`}>
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
      <p className={`mt-6 max-w-md leading-7 text-[#C3D1CA] ${featured ? 'text-[15px]' : 'text-[14px]'}`}>{leader.description}</p>
    </article>
  );
}

/** Scroll the testimonial row by about one card. */
function useRowScroll() {
  const row = useRef<HTMLDivElement>(null);
  const by = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('figure');
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' });
  };
  return { row, by };
}

function TestimonialsRow() {
  const { row, by } = useRowScroll();
  return (
    <>
      <div className="mt-8 flex justify-end gap-2">
        <button type="button" onClick={() => by(-1)} className="kz-row-btn" aria-label="Previous testimonials" aria-controls="testimonials-row"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => by(1)} className="kz-row-btn" aria-label="Next testimonials" aria-controls="testimonials-row"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
      </div>
      {/* Draggable row (mouse drag with inertia via lib/interactions.ts); native swipe / scroll / keyboard everywhere. */}
      <div ref={row} id="testimonials-row" className="kz-drag-row mt-5" data-kz-drag-scroll="" tabIndex={0} role="region" aria-label="Client testimonials">
        {VISIBLE_TESTIMONIALS.map((item, index) => (
          <figure key={`${item.name}-${index}`} data-kz-tilt="6" className="kz-testimonial-card kz-tilt kz-reveal relative overflow-hidden p-7 sm:p-9" style={{ '--d': index % 2 } as React.CSSProperties}>
            <Quote className="absolute -right-2 -top-3 h-24 w-24 text-emerald-500/[.06]" aria-hidden="true" />
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="text-sm font-bold text-[var(--kz-text)]">{item.projectType}</div>
                {item.projectDetail && <div className="kz-meta mt-1.5 !text-[10px]">{item.projectDetail}</div>}
              </div>
              {/* Stars only when the client actually rated us on the source platform. */}
              {item.rating ? (
                <div className="flex gap-0.5" role="img" aria-label={`Rated ${item.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < item.rating! ? 'fill-amber-400 text-amber-400' : 'text-amber-400/40'}`} aria-hidden="true" />)}
                </div>
              ) : null}
            </div>
            <blockquote className="mt-6 text-[15px] leading-7 text-[var(--kz-text-2)]">“{item.quote}”</blockquote>
            <figcaption className="mt-7 flex items-center gap-3 border-t border-[var(--kz-border)] pt-5">
              {item.photo
                ? <img src={item.photo} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                : <span className="grid h-10 w-10 place-items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm font-extrabold text-[var(--kz-accent-text)]" aria-hidden="true">{item.name.charAt(0)}</span>}
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[var(--kz-text)]">{item.name}</span>
                <span className="block text-xs text-[var(--kz-muted)]">{[item.role, item.company, item.country].filter(Boolean).join(' · ')}</span>
              </span>
              {item.verifyUrl && (
                <a href={item.verifyUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[var(--kz-accent-text)] hover:underline">
                  {item.verifyLabel ?? 'Verify'} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

export const LeadershipTestimonialsSection: React.FC = () => (
  <>
    <section id="leadership" className="kz-leaders kz-cinematic relative overflow-hidden py-[var(--kz-section)]" aria-labelledby="leadership-title">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(50%_40%_at_20%_10%,rgba(25,199,132,.12),transparent_70%),radial-gradient(40%_40%_at_90%_60%,rgba(8,127,91,.16),transparent_70%)]" aria-hidden="true" />
      {/* Slow drifting fog (CSS only; animates while on screen, static for reduced motion). */}
      <div className="kz-fog" data-kz-live="" aria-hidden="true"><i /><i /></div>
      <div className="kz-container relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="kz-reveal lg:col-span-7">
            <Eyebrow>Leadership</Eyebrow>
            <h2 id="leadership-title" className="kz-h2 mt-5 max-w-[16ch] text-white">Built by people who care about what they create.</h2>
          </div>
          <p className="kz-reveal kz-lead lg:col-span-5" style={{ '--d': 1 } as React.CSSProperties}>
            KorvenzaTech is led by engineers and operators who stay close to the work — connecting product decisions, engineering quality and clear communication on every project.
          </p>
        </div>

        <div className="mt-16 grid gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5" data-kz-parallax="3">
            <Portrait leader={LEADERS[0]} featured index={0} />
          </div>
          <div className="grid gap-12 sm:grid-cols-2 sm:gap-8 lg:col-span-7 lg:pt-24" data-kz-parallax="-4">
            <Portrait leader={LEADERS[1]} index={1} />
            <Portrait leader={LEADERS[2]} index={2} />
          </div>
        </div>
      </div>
    </section>

    <section className="kz-section kz-section-alt overflow-x-clip" aria-labelledby="testimonials-title">
      <div className="kz-container">
        <SectionHeader
          align="center"
          eyebrow="Client feedback"
          title={<span id="testimonials-title">Confidence is earned in the delivery.</span>}
          lead="In our clients' own words. Every name shown here is a real client."
        />
        {VISIBLE_TESTIMONIALS.length > 0 && <TestimonialsRow />}
      </div>
    </section>
  </>
);
