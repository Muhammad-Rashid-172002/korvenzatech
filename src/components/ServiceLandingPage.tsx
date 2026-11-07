import React from 'react';
import { ArrowRight, ArrowUpRight, Check, Clock, KeyRound, Layers3, Lock, Plus, ShieldCheck, Trash2, UserCheck } from 'lucide-react';
import { ServiceCapability, ServiceItem } from '../types';
import { CASE_STUDIES, SERVICES_DATA } from '../data/companyData';
import { Link } from '../lib/router';
import { Eyebrow, SectionHeader } from './ui';
import { ServiceShowcase } from './showcase/ServiceShowcase';
import { AiDemos } from './showcase/AiDemos';
import { ProjectCard } from './home/HomeSections';
import { AIFeatureSection } from './AIFeatureSection';
import { APIFeatureSection } from './APIFeatureSection';

const AI_PRIVACY = [
  { Icon: KeyRound, title: 'Keys stay on the server', text: 'AI provider keys live in a secure server-side layer — never in the app or the browser.' },
  { Icon: Lock, title: 'Minimal data sent', text: 'Only the data a task needs is sent to the model; sensitive fields can be masked first.' },
  { Icon: UserCheck, title: 'Access control', text: 'Knowledge assistants answer only from documents the signed-in user is allowed to see.' },
  { Icon: ShieldCheck, title: 'No training on your data', text: 'We use provider settings that exclude your data from model training where the provider offers it.' },
  { Icon: Clock, title: 'Logs & review', text: 'Usage and answers can be logged and reviewed; important actions wait for human approval.' },
  { Icon: Trash2, title: 'Retention you choose', text: 'Conversation and document retention are configured to your policy and documented.' },
];

export function ServiceLandingPage({ service, onStartProject }: {
  service: ServiceItem;
  onStartProject: () => void;
  onNavigateServices: () => void;
}) {
  const primary = service.tier === 'primary';
  const isAi = service.id === 'ai-solutions';
  const related = SERVICES_DATA.filter((s) => s.id !== service.id && (primary ? s.tier === 'primary' || s.id === 'ui-ux-design' || s.id === 'cloud-solutions' : s.tier === 'primary' || s.category === service.category)).slice(0, 3);
  const work = service.relatedWork.map((id) => CASE_STUDIES.find((c) => c.id === id)).filter(Boolean) as typeof CASE_STUDIES;
  const studyName = (id: string) => CASE_STUDIES.find((c) => c.id === id)?.name ?? id;
  const caps: ServiceCapability[] = service.capabilities ?? service.features.map((name) => ({ name }));
  const anyProof = caps.some((c) => c.proof?.length);
  const startTo = `/start-project?service=${service.id}`;

  return <>
    <section className="kz-page-hero kz-cinematic relative overflow-hidden border-b border-white/[0.06] pt-32 pb-20 sm:pt-40 sm:pb-24">
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
        <div className={`mt-10 grid gap-12 lg:items-center ${primary ? 'lg:grid-cols-[1fr_1.1fr]' : 'lg:grid-cols-[1.2fr_.8fr]'}`}>
          <div>
            <Eyebrow className="kz-hero-enter">{primary ? `Primary service · ${service.title}` : service.title}</Eyebrow>
            <h1 className={`kz-h1 kz-hero-enter mt-6 max-w-4xl text-white ${primary ? "kz-h1-compact" : ""}`} style={{ "--i": 1 } as React.CSSProperties}>{service.headline}</h1>
            <p className="kz-lead kz-hero-enter mt-7 max-w-3xl" style={{ '--i': 2 } as React.CSSProperties}>{service.description}</p>
            <div className="kz-hero-enter mt-9 flex flex-col gap-3 sm:flex-row" style={{ '--i': 3 } as React.CSSProperties}>
              <Link to={startTo} className="kz-btn kz-btn-primary" data-kz-ripple="">{service.cta.primary} <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></Link>
              <Link to={service.cta.secondaryTo} className="kz-btn kz-btn-secondary">{service.cta.secondary}</Link>
            </div>
          </div>
          {primary ? (
            <div className="kz-hero-enter kz-svc-hero-visual" style={{ '--i': 2 } as React.CSSProperties}>
              <ServiceShowcase kind={isAi ? 'ai' : 'mobile'} label={isAi ? 'Animated 3D showcase of AI assistant, workflow automation and document intelligence interfaces' : 'Animated 3D showcase of four mobile app interfaces'} />
            </div>
          ) : (
            <div className="premium-card kz-hero-enter p-7 sm:p-8" style={{ '--i': 3 } as React.CSSProperties}>
              <div className="kz-meta !text-[#A6EBCD]">Who this is for</div>
              <p className="mt-4 text-[15px] leading-7 text-[#C3D1CA]">{service.whoNeedsIt}</p>
              <div className="mt-6 flex items-center gap-2 border-t border-white/[0.07] pt-5 text-[12.5px] text-[#8EA098]"><ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" /> Clear scope • Secure implementation • Maintainable engineering</div>
            </div>
          )}
        </div>
      </div>
    </section>

    {service.problems && (
      <section className="kz-section" aria-labelledby="svc-problems">
        <div className="kz-container">
          <SectionHeader eyebrow="Business problems we solve" title={<span id="svc-problems">Start with the problem, not the technology.</span>} lead={service.businessValue} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {service.problems.map((p, i) => (
              <article key={p.problem} className="kz-card kz-reveal p-7" style={{ '--d': i % 2 } as React.CSSProperties}>
                <h3 className="text-[16.5px] font-bold leading-snug text-[var(--kz-text)]">{p.problem}</h3>
                <p className="mt-3 flex gap-2.5 text-[14.5px] leading-7 text-[var(--kz-text-2)]"><ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />{p.solution}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    )}

    {isAi && (
      <section className="kz-section kz-section-alt" aria-labelledby="svc-demos">
        <div className="kz-container">
          <SectionHeader eyebrow="See it in action" title={<span id="svc-demos">Four AI patterns, demonstrated.</span>} lead="Chatbot, knowledge assistant, workflow automation and document processing — shown as short scripted examples so you can see how each one works." />
          <div className="mt-12"><AiDemos /></div>
        </div>
      </section>
    )}

    <section className={`kz-section ${isAi ? '' : primary ? 'kz-section-alt' : ''}`} aria-labelledby="svc-caps">
      <div className="kz-container">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div className="kz-reveal">
            <Eyebrow>Core capabilities</Eyebrow>
            <h2 id="svc-caps" className="kz-h2 mt-5">What we can build</h2>
            <p className="mt-5 text-[15px] leading-7 text-[var(--kz-text-2)]">{service.technicalDescription}</p>
            {anyProof && <p className="mt-5 text-[13px] leading-6 text-[var(--kz-muted)]">Capabilities marked with a project name are used in products we have built. The rest are available as custom development and are scoped with you in the proposal.</p>}
          </div>
          <ul className="kz-cap-list">
            {caps.map((c, i) => (
              <li key={c.name} className="kz-cap-item kz-reveal" style={{ '--d': i % 2 } as React.CSSProperties}>
                <b>{c.name}</b>
                {anyProof && (
                  <span className="kz-cap-proof">
                    {c.proof?.length ? c.proof.map((id) => <Link key={id} to={`/work/${id}`}>{studyName(id)}</Link>) : <span>Available as custom development</span>}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {service.industries && (
      <section className="kz-section" aria-labelledby="svc-industries">
        <div className="kz-container">
          <SectionHeader eyebrow="Industry use cases" title={<span id="svc-industries">Apps for the way your industry works.</span>} />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--kz-radius-xl)] border border-[var(--kz-border)] bg-[var(--kz-border)] sm:grid-cols-2 lg:grid-cols-3">
            {service.industries.map((ind, i) => (
              <li key={ind.name} className="kz-reveal bg-[var(--kz-surface)] p-7" style={{ '--d': i % 3 } as React.CSSProperties}>
                <h3 className="text-[16px] font-bold text-[var(--kz-text)]">{ind.name}</h3>
                <p className="mt-2 text-[14px] leading-6 text-[var(--kz-muted)]">{ind.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )}

    {isAi && <AIFeatureSection />}
    {service.id === 'api-development' && <APIFeatureSection />}

    {work.length > 0 && (
      <section className="kz-section kz-section-alt" aria-labelledby="related-work">
        <div className="kz-container">
          <SectionHeader eyebrow="Real projects" title={<span id="related-work">{isAi ? 'AI products we have built' : 'Projects that use this capability'}</span>} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">{work.map((c, i) => <ProjectCard key={c.id} c={c} i={i} />)}</div>
        </div>
      </section>
    )}

    {service.process && (
      <section className="kz-section" aria-labelledby="svc-process">
        <div className="kz-container">
          <SectionHeader eyebrow="How we work" title={<span id="svc-process">{isAi ? 'From use case to working AI.' : 'From idea to the app stores.'}</span>} />
          <ol className="kz-steps-row mt-12">
            {service.process.map((p) => <li key={p.title} className="kz-reveal"><b>{p.title}</b><p>{p.text}</p></li>)}
          </ol>
        </div>
      </section>
    )}

    <section className={`kz-section ${service.process ? 'kz-section-alt' : ''}`} aria-labelledby="svc-deliver">
      <div className="kz-container">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="kz-card kz-reveal p-8">
            <h2 id="svc-deliver" className="text-2xl font-bold tracking-tight text-[var(--kz-text)]">Project deliverables</h2>
            <ul className="mt-6 space-y-3">{service.deliverables.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-6 text-[var(--kz-text-2)]"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" /> {item}</li>)}</ul>
          </div>
          <div className="kz-card kz-reveal p-8" style={{ '--d': 1 } as React.CSSProperties}>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--kz-text)]">Where it creates value</h2>
            <ul className="mt-6 space-y-3">{service.useCases.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-6 text-[var(--kz-text-2)]"><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" /> {item}</li>)}</ul>
          </div>
          <div className="kz-card kz-reveal p-8" style={{ '--d': 2 } as React.CSSProperties}>
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[var(--kz-text)]"><Layers3 className="h-5 w-5 text-emerald-400" aria-hidden="true" />Technology stack</h2>
            <div className="mt-6 flex flex-wrap gap-2">{service.tech.map((t) => <span key={t} className="kz-tech-pill">{t}</span>)}</div>
          </div>
        </div>

        {service.timeline && (
          <div className="kz-reveal mt-5 rounded-[var(--kz-radius-xl)] border border-[var(--kz-border)] bg-[var(--kz-surface)] p-8">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--kz-text)]">Typical timelines</h2>
            <p className="mt-2 text-[13.5px] text-[var(--kz-muted)]">Indicative ranges for planning; your proposal gives a timeline based on the actual scope.</p>
            <dl className="mt-6 grid gap-4 md:grid-cols-3">
              {service.timeline.map((t) => (
                <div key={t.phase} className="rounded-2xl border border-[var(--kz-border)] bg-[var(--kz-surface-2)] p-5">
                  <dt className="text-[13px] font-semibold text-[var(--kz-muted)]">{t.phase}</dt>
                  <dd><span className="mt-1 block text-2xl font-extrabold text-[var(--kz-text)]">{t.duration}</span><span className="mt-2 block text-[13.5px] leading-6 text-[var(--kz-text-2)]">{t.text}</span></dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>

    {isAi && (
      <section className="kz-section" aria-labelledby="svc-privacy">
        <div className="kz-container">
          <SectionHeader eyebrow="Privacy & security" title={<span id="svc-privacy">Your data stays under your control.</span>} lead="How we design AI features so they are safe to put in front of customers and staff. Specific controls are agreed per project and documented." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AI_PRIVACY.map(({ Icon, title, text }, i) => (
              <li key={title} className="kz-card kz-reveal p-6" style={{ '--d': i % 3 } as React.CSSProperties}>
                <span className="kz-icon-orb !h-10 !w-10 !rounded-xl"><Icon className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                <h3 className="mt-5 text-[16px] font-bold text-[var(--kz-text)]">{title}</h3>
                <p className="mt-2 text-[14px] leading-6 text-[var(--kz-muted)]">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )}

    {service.faqs.length > 0 && (
      <section className="kz-section kz-section-alt" aria-labelledby="service-faq">
        <div className="kz-container max-w-4xl">
          <SectionHeader align="center" eyebrow="Frequently asked questions" title={<span id="service-faq">Clear answers before you start.</span>} />
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

    <section className="kz-section" aria-labelledby="explore-services">
      <div className="kz-container">
        <SectionHeader eyebrow="Explore more" title={<span id="explore-services">Related services</span>} />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {related.map((s) => (
            <Link key={s.id} to={`/services/${s.id}`} className="kz-card kz-card-hover kz-reveal group p-6">
              <span className="kz-meta block">{s.tier === 'primary' ? 'Primary service' : s.category}</span>
              <span className="mt-3 flex items-center justify-between gap-3 text-lg font-bold text-[var(--kz-text)] group-hover:text-[var(--kz-accent-text)]">{s.title}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
              <span className="mt-2 block text-[13.5px] leading-6 text-[var(--kz-muted)] line-clamp-2">{s.shortDesc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="kz-cinematic relative overflow-hidden bg-[#07110E] py-[var(--kz-section)]">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(45%_70%_at_50%_100%,rgba(25,199,132,.2),transparent_70%)]" aria-hidden="true" />
      <div className="kz-container relative text-center">
        <h2 className="kz-h2 kz-reveal mx-auto max-w-3xl text-white">{isAi ? 'Ready to put AI to work in your business?' : primary ? 'Ready to build your app?' : `Ready to discuss your ${service.title.toLowerCase()} project?`}</h2>
        <p className="kz-lead kz-reveal mx-auto mt-5 max-w-2xl">Tell us the business goal in your own words. We’ll reply with a practical recommendation, a scope and a timeline.</p>
        <div className="kz-reveal mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={startTo} className="kz-btn kz-btn-primary">{service.cta.primary} <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></Link>
          <Link to="/contact" className="kz-btn kz-btn-secondary">Contact the team</Link>
        </div>
      </div>
    </section>
  </>;
}
