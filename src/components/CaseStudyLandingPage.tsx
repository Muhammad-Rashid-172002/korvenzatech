import React from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { CaseStudy } from '../types';
import { CASE_STUDIES } from '../data/companyData';
import { Link } from '../lib/router';
import { Eyebrow } from './ui';
import { projectImage } from '../data/media';

export function CaseStudyLandingPage({ study, onStartProject }: {
  study: CaseStudy;
  onBack: () => void;
  onStartProject: () => void;
}) {
  const img = projectImage(study.id, study.imageSrc);
  const others = CASE_STUDIES.filter((c) => c.id !== study.id);
  return (
    <>
      <section className="kz-page-hero kz-cinematic relative overflow-hidden border-b border-white/[0.06] pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="kz-container relative">
          <nav aria-label="Breadcrumb" className="kz-hero-enter">
            <ol className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold text-[#8EA098]">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/work" className="hover:text-white">Work</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#A6EBCD]">{study.name}</li>
            </ol>
          </nav>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div>
              <div className="kz-hero-enter flex flex-wrap gap-2">
                <Eyebrow>{study.category}</Eyebrow>
                <span className="kz-muted-pill">{study.industry}</span>
              </div>
              <h1 className="kz-h1 kz-hero-enter mt-6 text-white" style={{ '--i': 1 } as React.CSSProperties}>{study.name}</h1>
              <p className="kz-hero-enter mt-4 text-lg font-semibold text-[#6EDDB0]" style={{ '--i': 2 } as React.CSSProperties}>{study.tagline}</p>
              <p className="kz-lead kz-hero-enter mt-6 max-w-2xl" style={{ '--i': 2 } as React.CSSProperties}>{study.summary}</p>
              <dl className="kz-hero-enter mt-8 grid grid-cols-3 gap-3" style={{ '--i': 3 } as React.CSSProperties}>
                {study.metrics.map((metric) => (
                  <div key={metric.label} className="kz-stat-card">
                    <dt className="text-[10px] uppercase tracking-[.12em] text-[#8EA098]">{metric.label}</dt>
                    <dd className="mt-1 text-xl font-extrabold text-white sm:text-2xl">{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className="kz-hero-enter relative overflow-hidden rounded-[var(--kz-radius-xl)] border border-white/10 shadow-[var(--kz-shadow-lg)]" style={{ '--i': 2 } as React.CSSProperties}>
              <img src={img.src} srcSet={img.srcSet} sizes="(min-width: 1024px) 640px, 92vw" alt={`${study.name} — ${study.tagline}`} width={1536} height={1024} fetchPriority="high" decoding="async" className="aspect-[3/2] w-full object-cover" />
              <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-xs text-[#C3D1CA] backdrop-blur-xl">
                <span>{study.platform}</span><span className="text-[#6EDDB0]">Delivered product</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="kz-section">
        <div className="kz-container">
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="kz-card kz-reveal p-8 sm:p-10">
              <h2 className="kz-meta">The challenge</h2>
              <p className="mt-5 text-[16px] leading-8 text-[var(--kz-text-2)]">{study.problem}</p>
            </article>
            <article className="kz-card kz-reveal p-8 sm:p-10" style={{ '--d': 1 } as React.CSSProperties}>
              <h2 className="kz-meta !text-[var(--kz-accent-text)]">Engineering response</h2>
              <p className="mt-5 text-[16px] leading-8 text-[var(--kz-text-2)]">{study.solution}</p>
            </article>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <article className="kz-card kz-reveal p-8 sm:p-10">
              <h2 className="flex items-center gap-2 kz-meta !text-[var(--kz-accent-text)]"><Sparkles className="h-4 w-4" aria-hidden="true" /> Core capabilities</h2>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {study.features.map((item) => <li key={item} className="kz-feature-row"><span className="kz-check"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /></span><span>{item}</span></li>)}
              </ul>
            </article>
            <article className="kz-card kz-reveal p-8 sm:p-10" style={{ '--d': 1 } as React.CSSProperties}>
              <h2 className="flex items-center gap-2 kz-meta !text-[var(--kz-accent-text)]"><Layers3 className="h-4 w-4" aria-hidden="true" /> Core technology</h2>
              <div className="mt-6 flex flex-wrap gap-2">{study.coreTech.map((tech) => <span key={tech} className="kz-tech-pill">{tech}</span>)}</div>
              <p className="mt-7 border-t border-[var(--kz-border)] pt-6 text-[13px] leading-6 text-[var(--kz-muted)]"><ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-400" aria-hidden="true" />Architecture and implementation details are summarized without exposing client-sensitive information.</p>
            </article>
          </div>

          <article className="kz-card kz-reveal mt-5 p-8 sm:p-10">
            <h2 className="kz-meta !text-[var(--kz-accent-text)]">Delivered outcomes</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">{study.outcome.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-7 text-[var(--kz-text-2)]"><CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />{item}</li>)}</ul>
          </article>

          {others.length > 0 && (
            <div className="mt-16">
              <h2 className="kz-meta">More work</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {others.map((c) => (
                  <Link key={c.id} to={`/work/${c.id}`} className="kz-card kz-card-hover kz-reveal group flex items-center justify-between gap-6 p-7">
                    <span><span className="block text-xl font-bold text-[var(--kz-text)]">{c.name}</span><span className="mt-1 block text-sm text-[var(--kz-muted)]">{c.tagline}</span></span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--kz-muted)] group-hover:text-[var(--kz-accent-text)]" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="kz-cinematic relative overflow-hidden bg-[#07110E] py-[var(--kz-section)]">
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(45%_70%_at_50%_100%,rgba(25,199,132,.2),transparent_70%)]" aria-hidden="true" />
        <div className="kz-container relative text-center">
          <Eyebrow className="kz-reveal mx-auto">Build your next product</Eyebrow>
          <h2 className="kz-h2 kz-reveal mx-auto mt-5 max-w-3xl text-white">Need a platform with similar engineering depth?</h2>
          <p className="kz-lead kz-reveal mx-auto mt-5 max-w-2xl">Tell us the business goal. We’ll recommend the right product, architecture and delivery path without unnecessary complexity.</p>
          <button type="button" onClick={onStartProject} className="kz-btn kz-btn-primary kz-reveal mt-9">Discuss your project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></button>
        </div>
      </section>
    </>
  );
}
