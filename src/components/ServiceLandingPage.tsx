import React from 'react';
import { ArrowRight, Check, CircleHelp, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { ServiceItem } from '../types';

export function ServiceLandingPage({ service, onStartProject, onNavigateServices }: {
  service: ServiceItem;
  onStartProject: () => void;
  onNavigateServices: () => void;
}) {
  return <>
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#0B0C10] pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 kz-aurora opacity-80" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <a href="/services" onClick={(e) => { e.preventDefault(); onNavigateServices(); }} className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-violet-200">Services <span>→</span> {service.title}</a>
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[0.07] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.18em] text-violet-300"><Sparkles className="h-3.5 w-3.5" /> {service.category}</div>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-[-.04em] text-white sm:text-6xl lg:text-7xl">{service.title} <span className="gradient-text-cyan">for businesses that need results, not complexity.</span></h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">{service.shortDesc} {service.businessValue}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button onClick={onStartProject} className="kz-primary-btn">Discuss Your Project <ArrowRight className="h-4 w-4" /></button>
              <a href="/work" className="kz-secondary-btn">View Our Work</a>
            </div>
          </div>
          <div className="premium-card p-6 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[.16em] text-violet-300">Who this is for</div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{service.whoNeedsIt}</p>
            <div className="mt-6 flex items-center gap-2 border-t border-white/[0.06] pt-5 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-violet-300" /> Clear scope • Secure implementation • Maintainable engineering</div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#0B0C10] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="premium-card p-7 lg:col-span-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-violet-300"><Layers3 className="h-4 w-4" /> What we can build</div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">{service.features.map((feature) => <div key={feature} className="kz-feature-row"><span className="kz-check"><Check className="h-3.5 w-3.5" /></span><span>{feature}</span></div>)}</div>
          </div>
          <div className="premium-card p-7">
            <div className="text-xs font-bold uppercase tracking-[.16em] text-violet-300">Technical direction</div>
            <p className="mt-5 text-sm leading-7 text-slate-400">{service.technicalDescription}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="premium-card p-7">
            <h2 className="text-2xl font-bold tracking-tight text-white">Typical deliverables</h2>
            <div className="mt-6 space-y-3">{service.deliverables.map((item) => <div key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><Check className="mt-1 h-4 w-4 shrink-0 text-violet-300" /> {item}</div>)}</div>
          </div>
          <div className="premium-card p-7">
            <h2 className="text-2xl font-bold tracking-tight text-white">Where it creates value</h2>
            <div className="mt-6 space-y-3">{service.useCases.map((item) => <div key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-violet-300" /> {item}</div>)}</div>
          </div>
        </div>
      </div>
    </section>

    {service.faqs.length > 0 && <section className="border-t border-white/[0.06] bg-[#090A0E] py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center"><div className="text-xs font-bold uppercase tracking-[.18em] text-violet-300">Common questions</div><h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Clear answers before you start.</h2></div>
        <div className="mt-10 space-y-4">{service.faqs.map((faq) => <div key={faq.q} className="premium-card p-6"><div className="flex gap-3"><CircleHelp className="mt-1 h-5 w-5 shrink-0 text-violet-300" /><div><h3 className="font-semibold text-white">{faq.q}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{faq.a}</p></div></div></div>)}</div>
      </div>
    </section>}

    <section className="bg-[#0B0C10] py-20"><div className="mx-auto max-w-5xl px-4 text-center"><h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Ready to discuss your {service.title.toLowerCase()} project?</h2><p className="mx-auto mt-5 max-w-2xl text-slate-400">Tell us the business goal in your own words. We’ll help translate it into a practical product and technical plan.</p><button onClick={onStartProject} className="kz-primary-btn mt-8">Start a Project <ArrowRight className="h-4 w-4" /></button></div></section>
  </>;
}
