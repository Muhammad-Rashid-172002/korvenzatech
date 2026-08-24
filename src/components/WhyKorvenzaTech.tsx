import React from 'react';
import { Target, Cpu, TrendingUp, MessageSquare, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const WhyKorvenzaTech: React.FC = () => {
  const pillars = [
    {
      title: 'Business-First Thinking',
      desc: 'We focus on solving the actual business problem, not simply writing lines of code. Technical choices serve ROI.',
      icon: Target
    },
    {
      title: 'Modern Technology with Purpose',
      desc: 'We select frameworks based on your long-term needs, maintainability, and budget — never passing trends.',
      icon: Cpu
    },
    {
      title: 'Scalable Engineering',
      desc: 'Our software architectures are designed from day one to handle spikes in traffic and data growth effortlessly.',
      icon: TrendingUp
    },
    {
      title: 'Clear Jargon-Free Communication',
      desc: 'You always know what is being built, why it matters, and when it will be delivered with bi-weekly live demos.',
      icon: MessageSquare
    },
    {
      title: 'Uncompromising Quality',
      desc: 'User design, frontend performance, backend security, and QA testing are treated as one unified product discipline.',
      icon: ShieldCheck
    },
    {
      title: 'Long-Term Partnership',
      desc: 'We continue maintaining, updating, and scaling your technology long after initial store or web deployment.',
      icon: HeartHandshake
    }
  ];

  const trustMetrics = [
    { label: 'Live Products Delivered', detail: 'Mobile & Web Apps' },
    { label: 'AI-Powered Solutions', detail: 'Private RAG & reasoning engines' },
    { label: 'Cross-Platform Expertise', detail: 'Flutter & React / Next.js' },
    { label: 'Global-Ready Engineering', detail: 'Secure Cloud Infrastructure' }
  ];

  return (
    <section className="py-24 bg-[#08090B] relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The KorvenzaTech Advantage</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Built Differently. Engineered for Results.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            We bridge the gap between business strategy and high-level software engineering, creating products that perform reliably from launch day forward.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {pillars.map((pil, idx) => {
            const IconComp = pil.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 glass-panel-hover text-left space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{pil.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {pil.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Qualitative Trust Metrics Strip */}
        <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {trustMetrics.map((tm, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-sm sm:text-base font-extrabold text-indigo-400">
                {tm.label}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {tm.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
