import React from 'react';
import { ArrowRight, Bot, Cloud, Code2, Layers3, Palette, TrendingUp } from 'lucide-react';

const blueprints = [
  { icon: Bot, title: 'AI Operations Suite', tag: 'Reference Architecture', text: 'Private knowledge assistant, workflow automation, document intelligence and human-in-the-loop controls for internal business teams.', stack: ['RAG', 'LLM orchestration', 'Access controls'] },
  { icon: Code2, title: 'API & Integration Hub', tag: 'Reference Architecture', text: 'Secure API gateway for mobile, web, payments, CRM, notifications and third-party systems with observability and versioning.', stack: ['REST / GraphQL', 'Webhooks', 'OAuth'] },
  { icon: Layers3, title: 'Multi-Tenant SaaS Platform', tag: 'Product Blueprint', text: 'Subscription-ready B2B SaaS foundation with team workspaces, role permissions, analytics, billing and super-admin operations.', stack: ['Multi-tenant data', 'Billing', 'Admin'] },
  { icon: Cloud, title: 'Cloud Modernization Platform', tag: 'Infrastructure Blueprint', text: 'Cloud migration and modernization pattern focused on reliable deployment, managed databases, backups, scaling and cost visibility.', stack: ['Cloud Run / ECS', 'CI/CD', 'Managed DB'] },
  { icon: Palette, title: 'Enterprise Design System', tag: 'Design Blueprint', text: 'A reusable UI/UX system for SaaS, dashboards and mobile products with accessibility, responsive tokens and developer handoff.', stack: ['Figma', 'Design tokens', 'WCAG'] },
  { icon: TrendingUp, title: 'Digital Growth Command Center', tag: 'Growth Blueprint', text: 'SEO, analytics and conversion instrumentation designed as part of the product architecture rather than an afterthought.', stack: ['Technical SEO', 'Analytics', 'CRO'] },
];

export function SolutionBlueprints({ onStartProject }: { onStartProject: () => void }) {
  return <section className="border-t border-white/[0.06] bg-[#0B0C10] py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="kz-eyebrow w-fit">Solution blueprints</div>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Enterprise-grade patterns we can tailor to your business.</h2>
        <p className="mt-5 text-base leading-8 text-slate-400">These are capability blueprints, not fabricated client case studies. They show the level of architecture and product scope KorvenzaTech can design around your requirements.</p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {blueprints.map(({ icon: Icon, title, tag, text, stack }) => <article key={title} className="premium-card group p-7">
          <div className="flex items-start justify-between gap-4"><div className="kz-icon-orb"><Icon className="h-5 w-5" /></div><span className="kz-muted-pill">{tag}</span></div>
          <h3 className="mt-7 text-xl font-bold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
          <div className="mt-6 flex flex-wrap gap-2">{stack.map((item) => <span key={item} className="kz-tech-pill">{item}</span>)}</div>
          <button onClick={onStartProject} className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-emerald-200">Discuss this architecture <ArrowRight className="h-4 w-4" /></button>
        </article>)}
      </div>
    </div>
  </section>;
}
