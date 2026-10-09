import React from 'react';
import { Compass, Award, MessageCircle, ShieldCheck, RefreshCw, Handshake } from 'lucide-react';
import { Eyebrow } from './ui';

const values = [
  { title: 'Innovation with purpose', desc: 'We implement AI and modern frameworks where they solve actual problems, not for tech hype.', icon: Compass },
  { title: 'Quality without compromise', desc: 'Design elegance, code performance and data security are maintained as non-negotiable standards.', icon: Award },
  { title: 'Clarity in communication', desc: 'We translate complex engineering decisions into clear, jargon-free business value.', icon: MessageCircle },
  { title: 'Responsibility & security', desc: 'We take ownership of reliability, data privacy and intellectual property protection.', icon: ShieldCheck },
  { title: 'Continuous improvement', desc: 'We continually refine software based on user feedback and technological advancements.', icon: RefreshCw },
  { title: 'Client partnership', desc: 'We act as long-term technology stewards for your business growth.', icon: Handshake },
];

export const AboutSection: React.FC = () => (
  <section id="about" className="kz-section relative z-10" aria-labelledby="philosophy-title">
    <div className="kz-container">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="kz-reveal lg:col-span-5">
          <Eyebrow>Core philosophy</Eyebrow>
          <h2 id="philosophy-title" className="kz-h2 mt-5">Technology should make business simpler, not more complicated.</h2>
        </div>
        <div className="kz-reveal space-y-5 text-[17px] leading-8 text-[var(--kz-text-2)] lg:col-span-7 lg:pt-14" style={{ '--d': 1 } as React.CSSProperties}>
          <p>KorvenzaTech was created around a simple belief: <strong className="font-semibold text-[var(--kz-text)]">businesses should not need to understand complex technology to benefit from it.</strong></p>
          <p>Our job is to understand your business challenge, explain the solution clearly in plain English, and build technology that delivers real, measurable value.</p>
          <p>We combine product thinking, software engineering, UI/UX design, AI systems and digital strategy to create solutions that modern organizations can confidently use and grow.</p>
        </div>
      </div>

      <div className="mt-20">
        <div className="kz-reveal flex items-end justify-between gap-6 border-b border-[var(--kz-border)] pb-6">
          <h3 className="text-2xl font-bold tracking-tight text-[var(--kz-text)]">Our core company values</h3>
          <p className="hidden text-sm text-[var(--kz-muted)] sm:block">The principles guiding every engineering and design decision</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {values.map(({ title, desc, icon: Icon }, i) => (
            <div key={title} className="kz-card kz-reveal p-7" style={{ '--d': i % 3 } as React.CSSProperties}>
              <span className="kz-icon-orb !h-10 !w-10"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <h4 className="kz-h3 mt-5 !text-[17px]">{title}</h4>
              <p className="mt-2 text-[14px] leading-6 text-[var(--kz-muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
