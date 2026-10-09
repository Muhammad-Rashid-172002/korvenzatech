import React from 'react';
import { Target, Cpu, TrendingUp, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';
import { SectionHeader } from './ui';

const pillars = [
  { title: 'Business-first thinking', desc: 'We focus on solving the actual business problem, not simply writing lines of code. Technical choices serve your goals.', icon: Target },
  { title: 'Modern technology with purpose', desc: 'We select frameworks based on your long-term needs, maintainability and budget — never passing trends.', icon: Cpu },
  { title: 'Scalable engineering', desc: 'Architectures are planned from day one with growth in traffic and data in mind, so the product can evolve without a rewrite.', icon: TrendingUp },
  { title: 'Clear, jargon-free communication', desc: 'You always know what is being built, why it matters and when it will be delivered, with regular progress reviews.', icon: MessageSquare },
  { title: 'Uncompromising quality', desc: 'User design, frontend performance, backend security and QA testing are treated as one unified product discipline.', icon: ShieldCheck },
  { title: 'Long-term partnership', desc: 'Maintenance, updates and scaling can continue after launch, based on the support agreement for your project.', icon: HeartHandshake },
];

const strengths = [
  { label: 'Live products delivered', detail: 'Mobile & web apps' },
  { label: 'AI-powered solutions', detail: 'Private RAG & reasoning engines' },
  { label: 'Cross-platform expertise', detail: 'Flutter & React / Next.js' },
  { label: 'Global-ready engineering', detail: 'Secure cloud infrastructure' },
];

export const WhyKorvenzaTech: React.FC = () => (
  <section className="kz-section relative z-10" aria-labelledby="why-title">
    <div className="kz-container">
      <SectionHeader
        eyebrow="The KorvenzaTech advantage"
        title={<span id="why-title">Built differently. Engineered for results.</span>}
        lead="We bridge business strategy and software engineering to create products that perform reliably from launch day forward."
      />
      <div className="mt-14 grid overflow-hidden rounded-[var(--kz-radius-xl)] border border-[var(--kz-border)] bg-[var(--kz-border)] gap-px md:grid-cols-2 lg:grid-cols-3">
        {pillars.map(({ title, desc, icon: Icon }, i) => (
          <div key={title} className="kz-reveal group bg-[var(--kz-surface)] p-8 transition-colors duration-500 hover:bg-[var(--kz-surface-2)]" style={{ '--d': i % 3 } as React.CSSProperties}>
            <span className="kz-icon-orb !h-11 !w-11 transition-transform duration-500 group-hover:-translate-y-1"><Icon className="h-5 w-5" aria-hidden="true" /></span>
            <h3 className="kz-h3 mt-6">{title}</h3>
            <p className="mt-3 text-[14px] leading-7 text-[var(--kz-muted)]">{desc}</p>
          </div>
        ))}
      </div>
      <dl className="kz-reveal mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--kz-radius-lg)] border border-[var(--kz-border)] bg-[var(--kz-border)] md:grid-cols-4">
        {strengths.map((s) => (
          <div key={s.label} className="bg-[var(--kz-surface-2)] p-6">
            <dt className="text-[15px] font-bold text-[var(--kz-accent-text)]">{s.label}</dt>
            <dd className="mt-1 font-mono text-[11px] text-[var(--kz-muted)]">{s.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);
