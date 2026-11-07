import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ExternalLink, Info, Layers3, Sparkles } from 'lucide-react';
import { CaseStudy } from '../types';
import { CASE_STUDIES, SERVICES_DATA } from '../data/companyData';
import { Link } from '../lib/router';
import { Eyebrow } from './ui';
import { projectImage } from '../data/media';

const KIND_LABEL = {
  concept: { short: 'Concept visuals', long: 'Illustrative concept designs based on the product’s documented features — not screenshots of the shipped app. Sample data only.' },
  recreation: { short: 'Interface recreations', long: 'Interface recreations redrawn from the real app’s layouts, with neutral sample data — not raw screenshots.' },
};

export function CaseStudyLandingPage({ study, onStartProject }: {
  study: CaseStudy;
  onBack: () => void;
  onStartProject: () => void;
}) {
  const img = projectImage(study.id, study.imageSrc);
  const idx = CASE_STUDIES.findIndex((c) => c.id === study.id);
  const prev = CASE_STUDIES[(idx - 1 + CASE_STUDIES.length) % CASE_STUDIES.length];
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];
  const services = study.relatedServices.map((id) => SERVICES_DATA.find((s) => s.id === id)).filter(Boolean) as typeof SERVICES_DATA;
  const v = study.visuals;
  const kind = KIND_LABEL[v.kind];

  return (
    <>
      <section className="kz-page-hero kz-cinematic relative overflow-hidden border-b border-white/[0.06] pt-32 pb-20 sm:pt-40 sm:pb-24" style={{ '--cs-brand': v.brand } as React.CSSProperties}>
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="kz-cs-glow pointer-events-none absolute inset-0" aria-hidden="true" />
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
                <span className="kz-muted-pill">{study.status}</span>
              </div>
              <h1 className="kz-h1 kz-hero-enter mt-6 text-white" style={{ '--i': 1 } as React.CSSProperties}>{study.name}</h1>
              <p className="kz-hero-enter mt-4 text-xl font-semibold leading-snug text-[#6EDDB0] sm:text-2xl" style={{ '--i': 2 } as React.CSSProperties}>{study.headline}</p>
              <p className="kz-lead kz-hero-enter mt-6 max-w-2xl" style={{ '--i': 2 } as React.CSSProperties}>{study.summary}</p>
              {study.formerName && <p className="kz-hero-enter mt-3 text-[13px] text-[#8EA098]" style={{ '--i': 2 } as React.CSSProperties}>Formerly known as {study.formerName}.</p>}
              <dl className="kz-hero-enter mt-8 grid grid-cols-3 gap-3" style={{ '--i': 3 } as React.CSSProperties}>
                {study.metrics.map((metric) => (
                  <div key={metric.label} className="kz-stat-card">
                    <dt className="text-[10px] uppercase tracking-[.12em] text-[#8EA098]">{metric.label}</dt>
                    <dd className="mt-1 text-lg font-extrabold text-white sm:text-xl">{metric.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="kz-hero-enter mt-8 flex flex-col gap-3 sm:flex-row" style={{ '--i': 4 } as React.CSSProperties}>
                {study.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="kz-btn kz-btn-primary">{l.label} <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
                ))}
                <button type="button" onClick={onStartProject} className={`kz-btn ${study.links.length ? 'kz-btn-secondary' : 'kz-btn-primary'}`}>Discuss a similar project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></button>
              </div>
            </div>
            <figure className="kz-hero-enter relative overflow-hidden rounded-[var(--kz-radius-xl)] border border-white/10 shadow-[var(--kz-shadow-lg)]" style={{ '--i': 2 } as React.CSSProperties}>
              <img src={img.src} srcSet={img.srcSet} sizes="(min-width: 1024px) 640px, 92vw" alt={`${study.name} — ${kind.short.toLowerCase()}`} width={1536} height={1024} fetchPriority="high" decoding="async" className="aspect-[3/2] w-full object-cover" />
              <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-[#C3D1CA] backdrop-blur-xl">
                <span>{study.platform}</span><span className="text-[#6EDDB0]">{kind.short}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="kz-section" aria-labelledby="cs-overview">
        <div className="kz-container">
          <h2 id="cs-overview" className="sr-only">Project overview</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="kz-card kz-reveal p-8 sm:p-10">
              <h3 className="kz-meta">The business problem</h3>
              <p className="mt-5 text-[16px] leading-8 text-[var(--kz-text-2)]">{study.problem}</p>
            </article>
            <article className="kz-card kz-reveal p-8 sm:p-10" style={{ '--d': 1 } as React.CSSProperties}>
              <h3 className="kz-meta !text-[var(--kz-accent-text)]">The solution</h3>
              <p className="mt-5 text-[16px] leading-8 text-[var(--kz-text-2)]">{study.solution}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="kz-section kz-section-alt" aria-labelledby="cs-gallery">
        <div className="kz-container">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="kz-reveal">
              <Eyebrow>{kind.short}</Eyebrow>
              <h2 id="cs-gallery" className="kz-h2 mt-5">Inside {study.name}</h2>
            </div>
            <p className="kz-reveal flex max-w-md items-start gap-2 text-[13px] leading-6 text-[var(--kz-muted)]"><Info className="mt-1 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />{kind.long}</p>
          </div>
          {v.dashboards && (
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {v.dashboards.map((d, i) => (
                <figure key={d} className="kz-reveal kz-cs-dash" style={{ '--d': i } as React.CSSProperties}>
                  <img src={`/media/work/${v.screens}/${d}.webp`} srcSet={`/media/work/${v.screens}/${d}-960.webp 960w, /media/work/${v.screens}/${d}.webp 1600w`} sizes="(min-width: 1024px) 600px, 92vw" alt={`${study.name} web admin dashboard — ${i === 0 ? 'complaints overview' : 'complaint detail and assignment'} (concept design, sample data)`} width={1600} height={1000} loading="lazy" decoding="async" />
                  <figcaption>{i === 0 ? 'Web admin dashboard: complaints overview' : 'Complaint detail, activity and assignment'}</figcaption>
                </figure>
              ))}
            </div>
          )}
          <ul className="kz-cs-screens mt-10" aria-label={`${study.name} app screens`}>
            {Array.from({ length: v.count }, (_, i) => (
              <li key={i} className="kz-reveal" style={{ '--d': i % 4 } as React.CSSProperties}>
                <figure>
                  <div className="kz-cs-phone"><img src={`/media/work/${v.screens}/screen-${i + 1}.webp`} srcSet={`/media/work/${v.screens}/screen-${i + 1}-540.webp 540w, /media/work/${v.screens}/screen-${i + 1}.webp 1170w`} sizes="(min-width: 1024px) 260px, 60vw" alt={`${study.name} — ${v.captions[i]} (${kind.short.toLowerCase().replace(/s$/, '')})`} width={1170} height={2532} loading="lazy" decoding="async" /></div>
                  <figcaption>{v.captions[i]}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="kz-section" aria-labelledby="cs-features">
        <div className="kz-container">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <article className="kz-card kz-reveal p-8 sm:p-10">
              <h2 id="cs-features" className="flex items-center gap-2 kz-meta !text-[var(--kz-accent-text)]"><Sparkles className="h-4 w-4" aria-hidden="true" /> Key features</h2>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {study.features.map((item) => <li key={item} className="kz-feature-row"><span className="kz-check"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /></span><span>{item}</span></li>)}
              </ul>
            </article>
            <article className="kz-card kz-reveal p-8 sm:p-10" style={{ '--d': 1 } as React.CSSProperties}>
              <h2 className="flex items-center gap-2 kz-meta !text-[var(--kz-accent-text)]"><Layers3 className="h-4 w-4" aria-hidden="true" /> Technology stack</h2>
              <div className="mt-6 flex flex-wrap gap-2">{study.coreTech.map((tech) => <span key={tech} className="kz-tech-pill">{tech}</span>)}</div>
              <dl className="mt-7 grid gap-4 border-t border-[var(--kz-border)] pt-6 text-[14px]">
                <div className="flex justify-between gap-4"><dt className="text-[var(--kz-muted)]">Status</dt><dd className="text-right font-semibold text-[var(--kz-text)]">{study.status}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--kz-muted)]">Platform</dt><dd className="text-right font-semibold text-[var(--kz-text)]">{study.platform}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--kz-muted)]">Industry</dt><dd className="text-right font-semibold text-[var(--kz-text)]">{study.industry}</dd></div>
                {study.links.map((l) => (
                  <div key={l.href} className="flex justify-between gap-4"><dt className="text-[var(--kz-muted)]">Link</dt><dd><a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[var(--kz-accent-text)] hover:underline">{l.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a></dd></div>
                ))}
              </dl>
            </article>
          </div>

          <article className="kz-card kz-reveal mt-5 p-8 sm:p-10">
            <h2 className="kz-meta !text-[var(--kz-accent-text)]">What was delivered</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">{study.outcome.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-7 text-[var(--kz-text-2)]"><CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />{item}</li>)}</ul>
            {study.disclaimer && <p className="mt-7 flex gap-2 rounded-2xl border border-[var(--kz-border)] bg-[var(--kz-surface-2)] p-4 text-[13px] leading-6 text-[var(--kz-muted)]"><Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />{study.disclaimer}</p>}
          </article>
        </div>
      </section>

      {services.length > 0 && (
        <section className="kz-section kz-section-alt" aria-labelledby="cs-services">
          <div className="kz-container">
            <h2 id="cs-services" className="kz-h2 kz-reveal">Related services</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {services.map((s) => (
                <Link key={s.id} to={`/services/${s.id}`} className="kz-card kz-card-hover kz-reveal group p-6">
                  <span className="kz-meta block">{s.tier === 'primary' ? 'Primary service' : s.category}</span>
                  <span className="mt-3 block text-lg font-bold text-[var(--kz-text)] group-hover:text-[var(--kz-accent-text)]">{s.title}</span>
                  <span className="mt-2 block text-[13.5px] leading-6 text-[var(--kz-muted)] line-clamp-2">{s.shortDesc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <nav className="kz-section !py-12" aria-label="More projects">
        <div className="kz-container grid gap-4 sm:grid-cols-2">
          <Link to={`/work/${prev.id}`} className="kz-card kz-card-hover group flex items-center gap-4 p-6">
            <ArrowLeft className="h-5 w-5 shrink-0 text-[var(--kz-muted)] transition-transform group-hover:-translate-x-1 group-hover:text-[var(--kz-accent-text)]" aria-hidden="true" />
            <span><span className="kz-meta block">Previous project</span><span className="mt-1 block text-lg font-bold text-[var(--kz-text)]">{prev.name}</span></span>
          </Link>
          <Link to={`/work/${next.id}`} className="kz-card kz-card-hover group flex items-center justify-end gap-4 p-6 text-right">
            <span><span className="kz-meta block">Next project</span><span className="mt-1 block text-lg font-bold text-[var(--kz-text)]">{next.name}</span></span>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--kz-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--kz-accent-text)]" aria-hidden="true" />
          </Link>
        </div>
      </nav>

      <section className="kz-cinematic relative overflow-hidden bg-[#07110E] py-[var(--kz-section)]">
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(45%_70%_at_50%_100%,rgba(25,199,132,.2),transparent_70%)]" aria-hidden="true" />
        <div className="kz-container relative text-center">
          <Eyebrow className="kz-reveal mx-auto">Build your next product</Eyebrow>
          <h2 className="kz-h2 kz-reveal mx-auto mt-5 max-w-3xl text-white">Have a project like {study.name} in mind?</h2>
          <p className="kz-lead kz-reveal mx-auto mt-5 max-w-2xl">Tell us the business goal. We’ll recommend the right product, architecture and delivery path without unnecessary complexity.</p>
          <button type="button" onClick={onStartProject} className="kz-btn kz-btn-primary kz-reveal mt-9">Start a Project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></button>
        </div>
      </section>
    </>
  );
}
