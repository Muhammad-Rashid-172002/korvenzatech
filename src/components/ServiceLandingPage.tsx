import React from 'react';
import { ArrowRight, ArrowUpRight, Check, Layers3, ShieldCheck, Plus } from 'lucide-react';
import { ServiceItem } from '../types';
import { CASE_STUDIES, SERVICES_DATA } from '../data/companyData';
import { Link } from '../lib/router';
import { Eyebrow, SectionHeader } from './ui';

// Which delivered products are genuinely relevant to each service (based on their documented stack).
const RELATED_WORK: Record<string, string[]> = {
  'ai-solutions': ['ielts-ai-master'],
  'mobile-app-development': ['ielts-ai-master', 'skilllink'],
  'cloud-solutions': ['skilllink', 'ielts-ai-master'],
  'ui-ux-design': ['skilllink', 'ielts-ai-master'],
  'custom-software': ['skilllink'],
};

export function ServiceLandingPage({ service, onStartProject }: {
  service: ServiceItem;
  onStartProject: () => void;
  onNavigateServices: () => void;
}) {
  const related = SERVICES_DATA.filter((s) => s.id !== service.id).slice(0, 3);
  const work = (RELATED_WORK[service.id] || []).map((id) => CASE_STUDIES.find((c) => c.id === id)).filter(Boolean) as typeof CASE_STUDIES;

  return <>
    <section className="kz-page-hero kz-cinematic relative overflow-hidden border-b border-white/[0.06] pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="kz-container relative">
        <nav aria-label="Breadcrumb" className="kz-hero-enter">
          <ol className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold text-[#8EA098]">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#A6EBCD]">{service.title}</li>
          </ol>
        </nav>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <Eyebrow className="kz-hero-enter">{service.category}</Eyebrow>
            <h1 className="kz-h1 kz-hero-enter mt-6 max-w-4xl text-white" style={{ '--i': 1 } as React.CSSProperties}>{service.title} <span className="gradient-text-cyan">for businesses that need results, not complexity.</span></h1>
            <p className="kz-lead kz-hero-enter mt-7 max-w-3xl" style={{ '--i': 2 } as React.CSSProperties}>{service.shortDesc} {service.businessValue}</p>
            <div className="kz-hero-enter mt-9 flex flex-col gap-3 sm:flex-row" style={{ '--i': 3 } as React.CSSProperties}>
              <button type="button" onClick={onStartProject} className="kz-btn kz-btn-primary">Discuss your project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></button>
              <Link to="/work" className="kz-btn kz-btn-secondary">View our work</Link>
            </div>
          </div>
          <div className="premium-card kz-hero-enter p-7 sm:p-8" style={{ '--i': 3 } as React.CSSProperties}>
            <div className="kz-meta !text-[#A6EBCD]">Who this is for</div>
            <p className="mt-4 text-[15px] leading-7 text-[#C3D1CA]">{service.whoNeedsIt}</p>
            <div className="mt-6 flex items-center gap-2 border-t border-white/[0.07] pt-5 text-[12.5px] text-[#8EA098]"><ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" /> Clear scope • Secure implementation • Maintainable engineering</div>
          </div>
        </div>
      </div>
    </section>

    <section className="kz-section">
      <div className="kz-container">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="kz-card kz-reveal p-8 lg:col-span-2">
            <h2 className="flex items-center gap-2 kz-meta !text-[var(--kz-accent-text)]"><Layers3 className="h-4 w-4" aria-hidden="true" /> What we can build</h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">{service.features.map((feature) => <li key={feature} className="kz-feature-row"><span className="kz-check"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span><span>{feature}</span></li>)}</ul>
          </div>
          <div className="kz-card kz-reveal p-8" style={{ '--d': 1 } as React.CSSProperties}>
            <h2 className="kz-meta !text-[var(--kz-accent-text)]">Technical direction</h2>
            <p className="mt-5 text-[15px] leading-7 text-[var(--kz-text-2)]">{service.technicalDescription}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="kz-card kz-reveal p-8">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--kz-text)]">Typical deliverables</h2>
            <ul className="mt-6 space-y-3">{service.deliverables.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-6 text-[var(--kz-text-2)]"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" /> {item}</li>)}</ul>
          </div>
          <div className="kz-card kz-reveal p-8" style={{ '--d': 1 } as React.CSSProperties}>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--kz-text)]">Where it creates value</h2>
            <ul className="mt-6 space-y-3">{service.useCases.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-6 text-[var(--kz-text-2)]"><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" /> {item}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>

    {work.length > 0 && (
      <section className="kz-section kz-section-alt" aria-labelledby="related-work">
        <div className="kz-container">
          <SectionHeader eyebrow="Related work" title={<span id="related-work">Products we’ve delivered with this capability</span>} />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {work.map((c) => (
              <Link key={c.id} to={`/work/${c.id}`} className="kz-card kz-card-hover kz-reveal group flex items-center justify-between gap-6 p-7">
                <span>
                  <span className="kz-meta block">{c.category}</span>
                  <span className="mt-2 block text-xl font-bold text-[var(--kz-text)]">{c.name}</span>
                  <span className="mt-1 block text-sm text-[var(--kz-muted)]">{c.tagline}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--kz-muted)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--kz-accent-text)]" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    )}

    {service.faqs.length > 0 && (
      <section className="kz-section" aria-labelledby="service-faq">
        <div className="kz-container max-w-4xl">
          <SectionHeader align="center" eyebrow="Common questions" title={<span id="service-faq">Clear answers before you start.</span>} />
          <div className="mt-10 space-y-3">
            {service.faqs.map((faq) => (
              <details key={faq.q} className="kz-card kz-reveal group p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <h3 className="text-[16px] font-semibold text-[var(--kz-text)]">{faq.q}</h3>
                  <Plus className="h-5 w-5 shrink-0 text-[var(--kz-accent-text)] transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="mt-4 text-[15px] leading-7 text-[var(--kz-text-2)]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    )}

    <section className="kz-section kz-section-alt" aria-labelledby="explore-services">
      <div className="kz-container">
        <SectionHeader eyebrow="Explore more" title={<span id="explore-services">Related services</span>} />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {related.map((s) => (
            <Link key={s.id} to={`/services/${s.id}`} className="kz-card kz-card-hover kz-reveal group p-6">
              <span className="kz-meta block">{s.category}</span>
              <span className="mt-3 block text-lg font-bold text-[var(--kz-text)] group-hover:text-[var(--kz-accent-text)]">{s.title}</span>
              <span className="mt-2 block text-[13.5px] leading-6 text-[var(--kz-muted)] line-clamp-2">{s.shortDesc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="kz-cinematic relative overflow-hidden bg-[#07110E] py-[var(--kz-section)]">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(45%_70%_at_50%_100%,rgba(25,199,132,.2),transparent_70%)]" aria-hidden="true" />
      <div className="kz-container relative text-center">
        <h2 className="kz-h2 kz-reveal mx-auto max-w-3xl text-white">Ready to discuss your {service.title} project?</h2>
        <p className="kz-lead kz-reveal mx-auto mt-5 max-w-2xl">Tell us the business goal in your own words. We’ll help translate it into a practical product and technical plan.</p>
        <button type="button" onClick={onStartProject} className="kz-btn kz-btn-primary kz-reveal mt-9">Start a project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></button>
      </div>
    </section>
  </>;
}
