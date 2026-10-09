import React, { useState } from 'react';
import { Lightbulb, Wrench, Bot, ArrowRight, Check } from 'lucide-react';
import { SectionHeader } from './ui';

interface HowWeHelpProps {
  onStartProject: () => void;
}

const scenarios = [
  {
    title: '“I have an idea”',
    subtitle: 'For entrepreneurs, founders and innovators with an app or software concept.',
    icon: Lightbulb,
    badge: 'From concept to product',
    description: 'You do not need technical knowledge or wireframes. You explain what problem your app solves, and our team transforms your vision into a structured product roadmap, clickable user designs, and a published mobile or web app.',
    steps: [
      'Free 30-minute discovery call to discuss your vision',
      'Interactive Figma prototype to preview before coding',
      'Cross-platform mobile (iOS/Android) or web engineering',
      'Store publishing, domain setup and a launch-ready release',
    ],
    quote: 'We turn raw concepts into functional, market-ready software products.',
  },
  {
    title: '“My business needs better software”',
    subtitle: 'For established companies needing internal tools, custom portals or database upgrades.',
    icon: Wrench,
    badge: 'Streamline operations',
    description: 'We study your daily business workflows, spot manual bottlenecks, and engineer custom management portals, CRM tools or automated booking systems that reduce repetitive manual work for your team.',
    steps: [
      'Operational process audit and bottleneck identification',
      'Custom web portal or role-based management software',
      'Integration with your existing databases and accounting tools',
      'Employee onboarding and ongoing technical support',
    ],
    quote: 'Tailor-made software built around your exact business workflow.',
  },
  {
    title: '“I want to add AI”',
    subtitle: 'For companies seeking practical AI automation, customer assistants or smart data analysis.',
    icon: Bot,
    badge: 'Practical AI value',
    description: 'We identify where artificial intelligence can create real value — such as always-available customer responses, automated document reading or analytics — rather than adding AI just for hype.',
    steps: [
      'AI feasibility evaluation and value assessment',
      'Secure language-model or RAG setup using your private data',
      'Smart customer service or internal decision assistants',
      'Ongoing accuracy monitoring and safety controls',
    ],
    quote: 'Practical, secure AI solutions designed around measurable business value.',
  },
];

export const HowWeHelp: React.FC<HowWeHelpProps> = ({ onStartProject }) => {
  const [selected, setSelected] = useState(0);
  const current = scenarios[selected];
  const Icon = current.icon;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (selected + (e.key === 'ArrowRight' ? 1 : scenarios.length - 1)) % scenarios.length;
    setSelected(next);
    document.getElementById(`scenario-tab-${next}`)?.focus();
  };

  return (
    <section id="how-we-help" className="kz-section relative z-10" aria-labelledby="how-title">
      <div className="kz-container">
        <SectionHeader
          align="center"
          eyebrow="Problem-solving approach"
          title={<span id="how-title">You bring the challenge. We build the solution.</span>}
          lead="Wherever you are in your technology journey, KorvenzaTech meets you with clarity, technical capability and business focus."
        />

        <div role="tablist" aria-label="Where are you starting from?" className="kz-reveal mt-14 grid gap-3 md:grid-cols-3" onKeyDown={onKey}>
          {scenarios.map((s, i) => {
            const SIcon = s.icon;
            const active = i === selected;
            return (
              <button
                key={s.title}
                id={`scenario-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls="scenario-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => setSelected(i)}
                className={`group relative overflow-hidden rounded-[var(--kz-radius-lg)] border p-6 text-left transition-all duration-500 ${active ? 'border-emerald-500/50 bg-[var(--kz-surface)] shadow-[var(--kz-glow)]' : 'border-[var(--kz-border)] bg-[var(--kz-surface-2)] hover:border-[var(--kz-border-strong)]'}`}
              >
                <span className={`absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-emerald-400 to-emerald-700 transition-transform duration-700 ${active ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${active ? 'bg-emerald-700 text-white kz-on-accent' : 'bg-[var(--kz-surface-3)] text-[var(--kz-muted)]'}`}><SIcon className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="kz-meta !text-[10px]">{s.badge}</span>
                </div>
                <h3 className="kz-h3 mt-5">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-[var(--kz-muted)]">{s.subtitle}</p>
              </button>
            );
          })}
        </div>

        <div id="scenario-panel" role="tabpanel" aria-labelledby={`scenario-tab-${selected}`} className="kz-reveal mt-4 overflow-hidden rounded-[var(--kz-radius-xl)] border border-[var(--kz-border)] bg-[var(--kz-surface)]">
          <div key={selected} className="animate-in grid gap-0 lg:grid-cols-12">
            <div className="p-8 sm:p-10 lg:col-span-7">
              <span className="kz-eyebrow"><Icon className="h-3.5 w-3.5" aria-hidden="true" />{current.badge}</span>
              <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-[var(--kz-text)] sm:text-3xl">{current.title}</h3>
              <p className="mt-4 text-[15px] leading-7 text-[var(--kz-text-2)]">{current.description}</p>
              <p className="kz-meta mt-8 !text-[10px]">How KorvenzaTech delivers</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {current.steps.map((step) => (
                  <li key={step} className="kz-feature-row"><span className="kz-check"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span><span>{step}</span></li>
                ))}
              </ul>
              <button type="button" onClick={onStartProject} className="kz-btn kz-btn-primary mt-8">Tell us what you need <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></button>
            </div>
            <div className="kz-cinematic relative flex items-center overflow-hidden bg-[#0A1612] p-8 sm:p-10 lg:col-span-5">
              <div className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_70%_20%,rgba(25,199,132,.22),transparent_70%)]" aria-hidden="true" />
              <figure className="relative">
                <blockquote className="text-xl font-semibold leading-relaxed text-white sm:text-2xl">“{current.quote}”</blockquote>
                <figcaption className="kz-meta mt-6">— KorvenzaTech client philosophy</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
