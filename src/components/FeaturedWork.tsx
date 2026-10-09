import React from 'react';
import { CASE_STUDIES } from '../data/companyData';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from '../lib/router';
import { SectionHeader } from './ui';
import { projectImage } from '../data/media';

interface FeaturedWorkProps {
  onNavigateCaseStudy: (studyId: string) => void;
  onStartProject: () => void;
}

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ onStartProject }) => (
  <section id="work" className="kz-section relative z-10" aria-labelledby="work-title">
    <div className="kz-container">
      <SectionHeader
        eyebrow="Delivered products"
        title={<span id="work-title">Featured products & case studies</span>}
        lead="Selected products with transparent architecture, platform scope and delivered outcomes. No fabricated metrics — just what was actually built."
      />

      <div className="mt-16 space-y-24 sm:space-y-32">
        {CASE_STUDIES.map((study, idx) => {
          const img = projectImage(study.id, study.imageSrc);
          const flip = idx % 2 === 1;
          return (
            <article key={study.id} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14" aria-labelledby={`study-${study.id}`}>
              <div className={`kz-reveal lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
                <Link to={`/work/${study.id}`} className="kz-project group block" aria-label={`Open the ${study.name} case study`}>
                  <div className="kz-project-media kz-reveal-img">
                    <img src={img.src} srcSet={img.srcSet} sizes="(min-width: 1024px) 720px, 92vw" alt={`${study.name} — ${study.tagline}`} loading="lazy" decoding="async" width={1536} height={1024} />
                  </div>
                </Link>
              </div>

              <div className={`kz-reveal lg:col-span-5 ${flip ? 'lg:order-1' : ''}`} style={{ '--d': 1 } as React.CSSProperties}>
                <div className="flex flex-wrap gap-2">
                  <span className="kz-eyebrow">{study.category}</span>
                  <span className="kz-muted-pill">{study.platform}</span>
                </div>
                <h3 id={`study-${study.id}`} className="mt-6 text-3xl font-extrabold tracking-tight text-[var(--kz-text)] sm:text-4xl">{study.name}</h3>
                <p className="mt-3 text-[16px] font-medium text-[var(--kz-accent-text)]">{study.tagline}</p>

                <dl className="mt-7 space-y-5">
                  <div>
                    <dt className="kz-meta !text-[10px]">The challenge</dt>
                    <dd className="mt-2 text-[14px] leading-7 text-[var(--kz-text-2)]">{study.problem}</dd>
                  </div>
                  <div>
                    <dt className="kz-meta !text-[10px]">What we built</dt>
                    <dd className="mt-2 text-[14px] leading-7 text-[var(--kz-text-2)]">{study.solution}</dd>
                  </div>
                </dl>

                <dl className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--kz-border)] bg-[var(--kz-border)]">
                  {study.metrics.map((m) => (
                    <div key={m.label} className="bg-[var(--kz-surface)] p-4 text-center">
                      <dt className="text-[10.5px] font-semibold uppercase tracking-[.12em] text-[var(--kz-muted)]">{m.label}</dt>
                      <dd className="mt-1 text-lg font-extrabold text-[var(--kz-text)]">{m.value}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-6 space-y-2">
                  {study.outcome.slice(0, 3).map((o) => (
                    <li key={o} className="flex gap-2.5 text-[13.5px] leading-6 text-[var(--kz-text-2)]"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />{o}</li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-1.5" aria-label="Core technology">
                  {study.coreTech.map((t) => <span key={t} className="kz-tech-pill">{t}</span>)}
                </div>

                <Link to={`/work/${study.id}`} className="kz-btn kz-btn-secondary mt-8">View full case study <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="kz-reveal mt-24 flex flex-col items-start justify-between gap-6 rounded-[var(--kz-radius-xl)] border border-[var(--kz-border)] bg-[var(--kz-surface)] p-8 sm:flex-row sm:items-center sm:p-10">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-[var(--kz-text)]">Have a similar project?</h3>
          <p className="mt-2 text-[var(--kz-muted)]">Tell us the goal and we’ll recommend a practical product and technical plan.</p>
        </div>
        <button type="button" onClick={onStartProject} className="kz-btn kz-btn-primary">Request a discovery call <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></button>
      </div>
    </div>
  </section>
);
