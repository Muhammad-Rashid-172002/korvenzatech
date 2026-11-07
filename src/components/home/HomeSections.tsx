import React from 'react';
import { Activity, ArrowRight, ArrowUpRight, Bot, Briefcase, Building, Cloud, Code, Dumbbell, Globe, GraduationCap, Layers, Layout, Network, ShoppingBag, Smartphone, TrendingUp, Truck, Users } from 'lucide-react';
import { CASE_STUDIES, PRIMARY_SERVICES, SUPPORTING_SERVICES } from '../../data/companyData';
import { ServiceShowcase } from '../showcase/ServiceShowcase';
import { Link, useRouter } from '../../lib/router';
import { Eyebrow, SectionHeader } from '../ui';
import { projectImage } from '../../data/media';
import { BrandMark } from '../BrandMark';

const ICONS: Record<string, React.FC<{ className?: string }>> = { Bot, Network, Smartphone, Globe, Code, Layers, Cloud, Layout, TrendingUp };

const ICON_COMPONENTS = ICONS;

const SHOWCASE_LABEL: Record<string, string> = {
  'mobile-app-development': 'Animated 3D showcase: four phones showing CareDesk, IELTS AI Master, FitMind AI and SkillNova app screens',
  'ai-solutions': 'Animated 3D showcase: AI support assistant, workflow automation and document intelligence panels over a neural network',
};

/** The two primary services, each with its cinematic 3D showcase. Used on the homepage and /services. */
export function PrimaryServices({ headingId = 'primary-services-title', eyebrow = 'Primary services', title = 'Mobile apps and AI — what we do best.', lead = 'Two focused services backed by products we have actually built and published.' }: { headingId?: string; eyebrow?: string; title?: string; lead?: string }) {
  return (
    <section className="kz-section" aria-labelledby={headingId}>
      <div className="kz-container">
        <SectionHeader eyebrow={eyebrow} title={<span id={headingId}>{title}</span>} lead={lead} />
        <div className="kz-primary-grid mt-14">
          {PRIMARY_SERVICES.map((s, i) => (
            <article key={s.id} className="kz-primary-card kz-reveal" style={{ '--d': i } as React.CSSProperties} aria-labelledby={`ps-${s.id}`}>
              <ServiceShowcase kind={s.id === 'ai-solutions' ? 'ai' : 'mobile'} label={SHOWCASE_LABEL[s.id]} />
              <div className="kz-primary-card-body">
                <span className="kz-primary-badge"><i aria-hidden="true" />0{i + 1} · {s.category}</span>
                <h3 id={`ps-${s.id}`} className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight text-[var(--kz-text)] sm:text-[32px]">{s.title}</h3>
                <p className="mt-3 text-[15.5px] leading-7 text-[var(--kz-text-2)]">{s.description}</p>
                <ul className="kz-cap-chips mt-6" aria-label={`${s.title} capabilities`}>
                  {s.features.map((f) => <li key={f} className="kz-cap-chip">{f}</li>)}
                </ul>
                <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
                  <Link to={`/start-project?service=${s.id}`} className="kz-btn kz-btn-primary" data-kz-ripple="">{s.cta.primary} <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></Link>
                  <Link to={`/services/${s.id}`} className="kz-link sm:ml-2">Explore {s.shortTitle ?? s.title} <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The seven supporting services in one consistent grid. */
export function SupportingServices({ alt = true }: { alt?: boolean }) {
  return (
    <section className={`kz-section ${alt ? 'kz-section-alt' : ''}`} aria-labelledby="support-title">
      <div className="kz-container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader eyebrow="Supporting capabilities" title={<span id="support-title">Everything around the product, handled by the same team.</span>} lead="Custom software, SaaS, websites, APIs, cloud, design and technical growth — available on their own or as part of a mobile or AI project." />
          <Link to="/services" className="kz-link kz-reveal shrink-0">All services <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <ul className="kz-support-grid mt-12">
          {SUPPORTING_SERVICES.map((s, i) => {
            const Icon = ICON_COMPONENTS[s.iconName] || Code;
            return (
              <li key={s.id} className={i === SUPPORTING_SERVICES.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <Link to={`/services/${s.id}`} className="kz-card kz-card-hover kz-reveal kz-support-card group" style={{ '--d': i % 4 } as React.CSSProperties}>
                  <span className="flex items-center justify-between">
                    <span className="kz-icon-orb !h-10 !w-10 !rounded-xl"><Icon className="h-[18px] w-[18px]" /></span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--kz-muted)] transition-colors group-hover:text-[var(--kz-accent-text)]" aria-hidden="true" />
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.shortDesc}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Portfolio card: cover image + (with WebGL) floating phones showing the product's screens. */
export function ProjectCard({ c, i, headingLevel = 'h3' }: { c: (typeof CASE_STUDIES)[number]; i: number; headingLevel?: 'h2' | 'h3' }) {
  const img = projectImage(c.id, c.imageSrc);
  const H = headingLevel;
  return (
    <article className="kz-project kz-reveal group" style={{ '--d': i % 2 } as React.CSSProperties}>
      <Link to={`/work/${c.id}`} className="block" data-kz-cursor="view" aria-label={`${c.name} case study`}>
        <div className="kz-project-media kz-reveal-img" data-ready="false">
          {/* Rectangle the shared WebGL canvas renders this product's phones into (cover image stays until the first 3D frame). */}
          <div data-kz-view={`product-${c.id}`} className="kz-view-track kz-view-track--product" aria-hidden="true" />
          <img src={img.src} srcSet={img.srcSet} sizes="(min-width: 1024px) 600px, 92vw" alt={`${c.name} — ${c.visuals.kind === 'concept' ? 'concept visuals' : 'app interface recreations'}`} loading="lazy" decoding="async" width={1536} height={1024} />
          <span className="kz-project-pill absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />{c.status}
          </span>
          <span className="kz-project-pill absolute right-4 top-4 rounded-full px-3 py-1.5 text-[10.5px] font-semibold opacity-90">{c.visuals.kind === 'concept' ? 'Concept visuals' : 'Interface recreation'}</span>
        </div>
      </Link>
      <div className="kz-project-body p-7 sm:p-9">
        <div className="kz-meta">{c.category}</div>
        <H className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--kz-text)] sm:text-3xl">
          <Link to={`/work/${c.id}`} className="hover:text-[var(--kz-accent-text)]">{c.name}</Link>
        </H>
        <p className="mt-3 text-[15px] leading-7 text-[var(--kz-text-2)]">{c.summary}</p>
        <div className="mt-6 flex flex-wrap gap-1.5" aria-label="Technology">
          {c.coreTech.map((t) => <span key={t} className="kz-tech-pill">{t}</span>)}
        </div>
        <Link to={`/work/${c.id}`} className="kz-link mt-7">View case study <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    </article>
  );
}

/** All four portfolio projects. */
export function HomeProjects() {
  return (
    <section className="kz-section kz-section-alt" aria-labelledby="projects-title">
      <div className="kz-container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow="Featured projects"
            title={<span id="projects-title">Digital products built to solve real problems.</span>}
            lead="Two live AI apps on Google Play, a service marketplace and a hospital complaint system — with the problem, the solution and the technology behind each."
          />
          <Link to="/work" className="kz-link kz-reveal shrink-0">All projects <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {CASE_STUDIES.map((c, i) => <ProjectCard key={c.id} c={c} i={i} />)}
        </div>
      </div>
    </section>
  );
}

const HOME_INDUSTRIES = [
  { name: 'Healthcare', text: 'Staff workflow and complaint management systems.', Icon: Activity, work: 'caredesk' },
  { name: 'Education', text: 'AI learning and exam-preparation apps.', Icon: GraduationCap, work: 'ielts-ai-master' },
  { name: 'Health & Wellness', text: 'AI nutrition, scanning and fitness tracking.', Icon: Dumbbell, work: 'fitmind-ai' },
  { name: 'On-Demand Services', text: 'Customer and provider marketplace apps.', Icon: Briefcase, work: 'skillnova' },
  { name: 'Real Estate', text: 'Listings, enquiries and agent apps with maps.', Icon: Building },
  { name: 'E-commerce', text: 'Shopping apps, catalogues and order tracking.', Icon: ShoppingBag },
  { name: 'Logistics', text: 'Dispatch and driver apps with live location.', Icon: Truck },
  { name: 'Professional Services', text: 'Client portals, CRMs and automation.', Icon: Users },
];

/** Compact industries grid; industries with a built product link to it. */
export function HomeIndustries() {
  return (
    <section className="kz-section" aria-labelledby="industries-title">
      <div className="kz-container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader eyebrow="Industries we serve" title={<span id="industries-title">Software shaped around how your industry works.</span>} />
          <Link to="/industries" className="kz-link kz-reveal shrink-0">Industry solutions <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--kz-radius-xl)] border border-[var(--kz-border)] bg-[var(--kz-border)] sm:grid-cols-2 lg:grid-cols-4">
          {HOME_INDUSTRIES.map(({ name, text, Icon, work }, i) => {
            const study = work ? CASE_STUDIES.find((c) => c.id === work) : undefined;
            return (
              <li key={name} className="kz-reveal flex flex-col bg-[var(--kz-surface)] p-6" style={{ '--d': i % 4 } as React.CSSProperties}>
                <span className="kz-icon-orb !h-10 !w-10 !rounded-xl"><Icon className="h-[18px] w-[18px]" /></span>
                <h3 className="mt-5 text-[16px] font-bold text-[var(--kz-text)]">{name}</h3>
                <p className="mt-1.5 text-[13.5px] leading-6 text-[var(--kz-muted)]">{text}</p>
                {study && <Link to={`/work/${study.id}`} className="mt-4 text-[12.5px] font-semibold text-[var(--kz-accent-text)] hover:underline">See {study.name} →</Link>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Burst duration (ms) — keep in sync with CTA.burstMs in components/three/config.ts. */
const CTA_BURST_MS = 520;

export function ClosingCTA({ title = 'Have a Project in Mind?', lead = 'Let’s turn your idea into a working digital product. You explain the business goal — we’ll help shape the product, roadmap and technical plan.' }: { title?: string; lead?: string }) {
  const { navigate } = useRouter();
  // With the 3D layer ready, the primary CTA bursts the particle K first, then navigates.
  const burstThenGo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (document.documentElement.dataset.kzCta !== 'ready') return;
    e.preventDefault();
    window.dispatchEvent(new Event('kz:cta-burst'));
    window.setTimeout(() => navigate('/start-project'), CTA_BURST_MS);
  };
  return (
    <section className="kz-cinematic relative overflow-hidden bg-[#07110E] py-[var(--kz-section)]" aria-labelledby="cta-title">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(45%_70%_at_50%_100%,rgba(25,199,132,.22),transparent_70%)]" aria-hidden="true" />
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      {/* Rectangle the shared WebGL canvas renders the particle K into. */}
      <div data-kz-view="cta" className="kz-view-track kz-view-track--cta" aria-hidden="true" />
      <div className="kz-container relative text-center">
        <Eyebrow className="kz-reveal mx-auto">Ready when you are</Eyebrow>
        <h2 id="cta-title" className="kz-h1 kz-reveal mx-auto mt-6 max-w-4xl text-white">{title}</h2>
        <p className="kz-lead kz-reveal mx-auto mt-6 max-w-2xl" style={{ '--d': 1 } as React.CSSProperties}>
          {lead}
        </p>
        <div className="kz-reveal mt-10 flex flex-col justify-center gap-3 sm:flex-row" data-kz-magnetic-zone="" style={{ '--d': 2 } as React.CSSProperties}>
          <Link to="/start-project" onClick={burstThenGo} data-kz-magnetic="" data-kz-ripple="" className="kz-btn kz-btn-primary">Start a project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></Link>
          <Link to="/contact" data-kz-magnetic="" data-kz-ripple="" className="kz-btn kz-btn-secondary">Talk to the team</Link>
        </div>
      </div>
    </section>
  );
}

/** Helpful exits from a dead link. */
const LOST_LINKS = [
  { to: '/services', title: 'Services', text: 'Mobile apps, AI and seven more' },
  { to: '/work', title: 'Our work', text: 'Four real projects' },
  { to: '/insights', title: 'Insights', text: 'Practical articles' },
  { to: '/contact', title: 'Contact', text: 'Talk to the team' },
];

export function NotFound() {
  return (
    <section className="kz-page-hero kz-cinematic relative flex min-h-[90vh] items-center overflow-hidden pt-32 pb-20">
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="kz-container relative text-center">
        {/* Floating glass K: the logo with a refraction-style light sweep (CSS only, still under reduced motion). */}
        <div className="kz-glass-k mx-auto mb-10" aria-hidden="true">
          <div className="kz-glass-k-float">
            <BrandMark size={150} className="kz-glass-k-glow" />
            <BrandMark size={150} className="kz-glass-k-body" />
            <span className="kz-glass-k-sheen" />
          </div>
          <span className="kz-glass-k-shadow" />
        </div>
        <Eyebrow className="mx-auto">404</Eyebrow>
        <h1 className="kz-h1 mx-auto mt-6 max-w-3xl text-white">This page doesn’t exist.</h1>
        <p className="kz-lead mx-auto mt-6 max-w-xl">The link may be outdated or mistyped. These pages will get you back on track.</p>
        <div className="mt-10 flex justify-center">
          <Link to="/" className="kz-btn kz-btn-primary !w-auto">Back to home</Link>
        </div>
        <ul className="mx-auto mt-12 grid max-w-4xl gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
          {LOST_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="kz-card kz-card-hover group block p-5">
                <span className="flex items-center justify-between text-[15px] font-bold text-white">{l.title}<ArrowUpRight className="h-4 w-4 text-[#8EA098] transition-colors group-hover:text-emerald-300" aria-hidden="true" /></span>
                <span className="mt-1 block text-[13px] text-[#8EA098]">{l.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
