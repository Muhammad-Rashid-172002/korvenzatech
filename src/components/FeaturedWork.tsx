import React from 'react';
import { CASE_STUDIES } from '../data/companyData';
import { SectionHeader } from './ui';
import { ProjectCard } from './home/HomeSections';

interface FeaturedWorkProps {
  onNavigateCaseStudy: (studyId: string) => void;
  onStartProject: () => void;
}

const GROUPS = [
  { id: 'ai-projects', eyebrow: 'AI-powered products', title: 'Live AI apps on Google Play', ids: ['fitmind-ai', 'ielts-ai-master'] },
  { id: 'business-systems', eyebrow: 'Marketplaces & business systems', title: 'Multi-role apps with admin control', ids: ['skillnova', 'caredesk'] },
];

/** Portfolio overview: the four real projects, grouped (the AI group is the target of “Explore AI Projects”). */
export const FeaturedWork: React.FC<FeaturedWorkProps> = () => (
  <>
    {GROUPS.map((g, gi) => (
      <section key={g.id} id={g.id} className={`kz-section ${gi % 2 ? 'kz-section-alt' : ''} scroll-mt-24`} aria-labelledby={`${g.id}-title`}>
        <div className="kz-container">
          <SectionHeader eyebrow={g.eyebrow} title={<span id={`${g.id}-title`}>{g.title}</span>} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {g.ids.map((id, i) => {
              const c = CASE_STUDIES.find((x) => x.id === id);
              return c ? <ProjectCard key={c.id} c={c} i={i} /> : null;
            })}
          </div>
        </div>
      </section>
    ))}
    <section className="kz-section !pt-0" aria-label="About these visuals">
      <div className="kz-container">
        <p className="kz-reveal mx-auto max-w-3xl rounded-2xl border border-[var(--kz-border)] bg-[var(--kz-surface)] p-5 text-center text-[13px] leading-6 text-[var(--kz-muted)]">
          About the visuals: IELTS AI Master and SkillNova screens are interface recreations based on the real apps. FitMind AI and CareDesk visuals are illustrative concept designs based on each product’s documented features — not screenshots of the shipped apps. All data shown is sample data.
        </p>
      </div>
    </section>
  </>
);
