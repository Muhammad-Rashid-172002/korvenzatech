git status
import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { CaseStudy } from '../types';

export function CaseStudyLandingPage({ study, onBack, onStartProject }: {
  study: CaseStudy;
  onBack: () => void;
  onStartProject: () => void;
}) {
  return (
    <main className="bg-[#0B0C10]">
      <section className="relative overflow-hidden border-b border-white/[0.06] pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 kz-aurora opacity-80" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200">
            <ArrowLeft className="h-4 w-4" /> Back to work
          </button>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="kz-eyebrow">{study.category}</span>
                <span className="kz-muted-pill">{study.industry}</span>
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{study.name}</h1>
              <p className="mt-4 text-base font-semibold text-emerald-300 sm:text-lg">{study.tagline}</p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">{study.summary}</p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {study.metrics.map((metric) => (
                  <div key={metric.label} className="kz-stat-card">
                    <div className="text-xl font-extrabold text-white sm:text-2xl">{metric.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[.12em] text-slate-500">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0b1118] shadow-2xl shadow-black/30">
              <img src={study.imageSrc} alt={`${study.name} case study`} className="aspect-[4/3] h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07100f]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-xs text-slate-200 backdrop-blur-xl">
                <span>{study.platform}</span><span className="text-emerald-300">Selected product work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="premium-card p-7 sm:p-9">
              <div className="text-xs font-bold uppercase tracking-[.16em] text-rose-300">The challenge</div>
              <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">{study.problem}</p>
            </article>
            <article className="premium-card p-7 sm:p-9">
              <div className="text-xs font-bold uppercase tracking-[.16em] text-emerald-300">Engineering response</div>
              <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">{study.solution}</p>
            </article>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <article className="premium-card p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-emerald-300"><Sparkles className="h-4 w-4" /> Core capabilities</div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {study.features.map((item) => <div key={item} className="kz-feature-row"><span className="kz-check"><CheckCircle2 className="h-3.5 w-3.5" /></span><span>{item}</span></div>)}
              </div>
            </article>
            <article className="premium-card p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-emerald-300"><Layers3 className="h-4 w-4" /> Core technology</div>
              <div className="mt-6 flex flex-wrap gap-2">{study.coreTech.map((tech) => <span key={tech} className="kz-tech-pill">{tech}</span>)}</div>
              <div className="mt-7 border-t border-white/[0.06] pt-6 text-xs text-slate-500"><ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-300" />Architecture and implementation details are summarized without exposing client-sensitive information.</div>
            </article>
          </div>

          <article className="premium-card mt-6 p-7 sm:p-9">
            <div className="text-xs font-bold uppercase tracking-[.16em] text-emerald-300">Delivered outcomes</div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">{study.outcome.map((item) => <div key={item} className="flex gap-3 text-sm leading-7 text-slate-300"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />{item}</div>)}</div>
          </article>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[#08090B] py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="kz-eyebrow mx-auto w-fit">Build your next product</div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Need a platform with similar engineering depth?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-slate-400">Tell us the business goal. We’ll recommend the right product, architecture and delivery path without unnecessary complexity.</p>
          <button onClick={onStartProject} className="kz-primary-btn mt-8">Discuss your project <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </main>
  );
}
