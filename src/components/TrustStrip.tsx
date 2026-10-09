import React from 'react';

// Technologies from the actual delivery stack (see case studies and tech stack data).
const TECH_BADGES = [
  { name: 'Flutter', category: 'Mobile' },
  { name: 'React & Next.js', category: 'Web' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Firebase', category: 'Cloud DB' },
  { name: 'Cloud Infrastructure', category: 'Infrastructure' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Python', category: 'AI Engine' },
  { name: 'Multimodal AI', category: 'LLM Systems' },
  { name: 'Custom APIs', category: 'Integration' },
  { name: 'PostgreSQL', category: 'Database' },
];

export const TrustStrip: React.FC = () => (
  <section className="relative border-b border-[var(--kz-border)] bg-[var(--kz-bg)] py-10" aria-label="Technologies we build with">
    <div className="kz-container flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
      <p className="kz-meta shrink-0 text-center lg:max-w-[15rem] lg:text-left">Built with a modern, proven stack</p>
      <ul className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        {TECH_BADGES.map((badge) => (
          <li key={badge.name} className="group inline-flex items-center gap-2 rounded-full border border-[var(--kz-border)] bg-[var(--kz-surface)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--kz-text-2)] transition-colors hover:border-emerald-500/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 transition-colors group-hover:bg-emerald-400" aria-hidden="true" />
            {badge.name}
            <span className="hidden text-[11px] font-medium text-[var(--kz-muted)] sm:inline">{badge.category}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
