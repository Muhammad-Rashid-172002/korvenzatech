import React from 'react';
import { ArrowRight, ArrowUpRight, Bot, Cloud, Code, Globe, Layers, Layout, Network, Smartphone, TrendingUp } from 'lucide-react';
import { CASE_STUDIES, SERVICES_DATA } from '../../data/companyData';
import { Link } from '../../lib/router';
import { Eyebrow, SectionHeader } from '../ui';
import { projectImage } from '../../data/media';

const ICONS: Record<string, React.FC<{ className?: string }>> = { Bot, Network, Smartphone, Globe, Code, Layers, Cloud, Layout, TrendingUp };

/** Core services — each card links to its real, indexable service page. */
export function HomeServices() {
  const [lead, ...rest] = SERVICES_DATA;
  const LeadIcon = ICONS[lead.iconName] || Code;
  return (
    <section className="kz-section" aria-labelledby="services-title">
      <div className="kz-container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow="Core capabilities"
            title={<span id="services-title">One technology partner, from idea to launch.</span>}
            lead="Dedicated service pages explain the business value, architecture, deliverables and common use cases — without burying you in technical jargon."
          />
          <Link to="/services" className="kz-link kz-reveal shrink-0">View all services <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to={`/services/${lead.id}`} className="kz-card kz-card-hover kz-reveal group relative flex min-h-[320px] flex-col justify-between overflow-hidden p-8 md:col-span-2 lg:row-span-2">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100" aria-hidden="true" />
            <div>
              <div className="flex items-center justify-between">
                <span className="kz-icon-orb"><LeadIcon className="h-5 w-5" /></span>
                <span className="kz-meta">01 / {lead.category}</span>
              </div>
              <h3 className="mt-10 max-w-md text-3xl font-extrabold tracking-tight text-[var(--kz-text)] sm:text-4xl">{lead.title}</h3>
              <p className="mt-4 max-w-md text-[15px] leading-7 text-[var(--kz-muted)]">{lead.shortDesc}</p>
            </div>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {lead.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] leading-5 text-[var(--kz-text-2)]"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />{f}</li>
              ))}
            </ul>
            <span className="kz-link mt-8">Explore {lead.title} <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
          </Link>

          {rest.slice(0, 6).map((s, i) => {
            const Icon = ICONS[s.iconName] || Code;
            return (
              <Link key={s.id} to={`/services/${s.id}`} className="kz-card kz-card-hover kz-reveal group flex flex-col p-6" style={{ '--d': (i % 2) + 1 } as React.CSSProperties}>
                <div className="flex items-center justify-between">
                  <span className="kz-icon-orb !h-10 !w-10 !rounded-xl"><Icon className="h-[18px] w-[18px]" /></span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--kz-muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--kz-accent-text)]" aria-hidden="true" />
                </div>
                <h3 className="kz-h3 mt-6">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-[var(--kz-muted)] line-clamp-3">{s.shortDesc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Real delivered products, given room to breathe. Content comes from verified case-study data. */
export function HomeProjects() {
  return (
    <section className="kz-section kz-section-alt" aria-labelledby="projects-title">
      <div className="kz-container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow="Selected products"
            title={<span id="projects-title">Proof, not inflated promises.</span>}
            lead="Real products with transparent scope: what the problem was, what we built and the technology behind it."
          />
          <Link to="/work" className="kz-link kz-reveal shrink-0">All work <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {CASE_STUDIES.map((c, i) => {
            const img = projectImage(c.id, c.imageSrc);
            return (
              <article key={c.id} className="kz-project kz-reveal group" style={{ '--d': i } as React.CSSProperties}>
                <Link to={`/work/${c.id}`} className="block" aria-label={`${c.name} case study`}>
                  <div className="kz-project-media kz-reveal-img">
                    <img src={img.src} srcSet={img.srcSet} sizes="(min-width: 1024px) 600px, 92vw" alt={`${c.name} — ${c.tagline}`} loading="lazy" decoding="async" width={1536} height={1024} />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />{c.platform}
                    </span>
                  </div>
                </Link>
                <div className="p-7 sm:p-9">
                  <div className="kz-meta">{c.category}</div>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--kz-text)] sm:text-3xl">
                    <Link to={`/work/${c.id}`} className="hover:text-[var(--kz-accent-text)]">{c.name}</Link>
                  </h3>
                  <p className="mt-2 text-[15px] font-medium text-[var(--kz-text-2)]">{c.tagline}</p>
                  <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <dt className="kz-meta !text-[10px]">The problem</dt>
                      <dd className="mt-2 text-[13.5px] leading-6 text-[var(--kz-muted)] line-clamp-4">{c.problem}</dd>
                    </div>
                    <div>
                      <dt className="kz-meta !text-[10px]">What we built</dt>
                      <dd className="mt-2 text-[13.5px] leading-6 text-[var(--kz-muted)] line-clamp-4">{c.summary}</dd>
                    </div>
                  </dl>
                  <div className="mt-6 flex flex-wrap gap-1.5" aria-label="Technology">
                    {c.coreTech.map((t) => <span key={t} className="kz-tech-pill">{t}</span>)}
                  </div>
                  <Link to={`/work/${c.id}`} className="kz-link mt-7">Read the case study <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ClosingCTA() {
  return (
    <section className="kz-cinematic relative overflow-hidden bg-[#07110E] py-[var(--kz-section)]" aria-labelledby="cta-title">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(45%_70%_at_50%_100%,rgba(25,199,132,.22),transparent_70%)]" aria-hidden="true" />
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="kz-container relative text-center">
        <Eyebrow className="kz-reveal mx-auto">Ready when you are</Eyebrow>
        <h2 id="cta-title" className="kz-h1 kz-reveal mx-auto mt-6 max-w-4xl text-white">Have something ambitious in mind?</h2>
        <p className="kz-lead kz-reveal mx-auto mt-6 max-w-2xl" style={{ '--d': 1 } as React.CSSProperties}>
          You explain the business goal. We’ll help turn it into a clear product, roadmap and technical plan.
        </p>
        <div className="kz-reveal mt-10 flex flex-col justify-center gap-3 sm:flex-row" style={{ '--d': 2 } as React.CSSProperties}>
          <Link to="/start-project" className="kz-btn kz-btn-primary">Start a project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></Link>
          <Link to="/contact" className="kz-btn kz-btn-secondary">Talk to the team</Link>
        </div>
      </div>
    </section>
  );
}

export function NotFound() {
  return (
    <section className="kz-page-hero kz-cinematic relative flex min-h-[80vh] items-center overflow-hidden pt-32 pb-20">
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="kz-container relative text-center">
        <Eyebrow className="mx-auto">404</Eyebrow>
        <h1 className="kz-h1 mx-auto mt-6 max-w-3xl text-white">This page doesn’t exist.</h1>
        <p className="kz-lead mx-auto mt-6 max-w-xl">The link may be outdated or mistyped. These pages will get you back on track.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="kz-btn kz-btn-primary">Back to home</Link>
          <Link to="/services" className="kz-btn kz-btn-secondary">Services</Link>
          <Link to="/contact" className="kz-btn kz-btn-secondary">Contact</Link>
        </div>
      </div>
    </section>
  );
}
