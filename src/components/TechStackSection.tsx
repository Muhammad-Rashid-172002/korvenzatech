import React, { useState } from 'react';
import { TECH_STACK } from '../data/companyData';
import { SectionHeader } from './ui';

export const TechStackSection: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const categories = ['All', ...TECH_STACK.map((c) => c.category)];
  const filtered = selectedCat === 'All' ? TECH_STACK : TECH_STACK.filter((c) => c.category === selectedCat);

  return (
    <section className="kz-section relative z-10" aria-labelledby="stack-title">
      <div className="kz-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeader
            className="lg:col-span-7"
            eyebrow="Engineering capabilities"
            title={<span id="stack-title">Modern technology, chosen with purpose.</span>}
            lead="Clients buy outcomes, speed and reliability — not programming languages. We select tools for long-term maintainability, security and scale."
          />
          <div className="kz-reveal flex flex-wrap gap-2 lg:col-span-5 lg:justify-end" role="group" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={selectedCat === cat}
                onClick={() => setSelectedCat(cat)}
                className={`min-h-[38px] rounded-full border px-4 text-[12.5px] font-semibold transition-all duration-300 ${selectedCat === cat ? 'border-emerald-600 bg-emerald-700 text-white kz-on-accent' : 'border-[var(--kz-border)] bg-[var(--kz-surface)] text-[var(--kz-muted)] hover:text-[var(--kz-text)]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cat, idx) => (
            <article key={cat.category} className="kz-card kz-reveal p-7" style={{ '--d': idx % 3 } as React.CSSProperties}>
              <div className="flex items-baseline justify-between gap-4 border-b border-[var(--kz-border)] pb-4">
                <h3 className="kz-h3">{cat.category}</h3>
                <span className="font-mono text-[11px] text-[var(--kz-muted)]">{String(cat.items.length).padStart(2, '0')}</span>
              </div>
              <p className="mt-4 text-[13.5px] leading-6 text-[var(--kz-muted)]">{cat.description}</p>
              <ul className="mt-5 space-y-3">
                {cat.items.map((item) => (
                  <li key={item.name} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                    <span>
                      <span className="block text-[14px] font-semibold text-[var(--kz-text)]">{item.name}</span>
                      <span className="block text-[12.5px] leading-5 text-[var(--kz-muted)]">{item.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
