import React, { useId, useState } from 'react';
import { FAQ_ITEMS } from '../data/companyData';
import { Plus, Search } from 'lucide-react';
import { SectionHeader } from './ui';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const uid = useId();

  const q = searchTerm.toLowerCase();
  const filteredFaqs = FAQ_ITEMS.filter((item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q));

  return (
    <section id="faq" className="kz-section kz-section-alt relative z-10" aria-labelledby="faq-title">
      <div className="kz-container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              eyebrow="Clear answers"
              title={<span id="faq-title">Frequently asked questions</span>}
              lead="Everything you need to know about working with KorvenzaTech — answered simply and honestly."
            />
            <div className="kz-reveal relative mt-8 max-w-sm">
              <label htmlFor={`${uid}-search`} className="sr-only">Search questions</label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--kz-muted)]" aria-hidden="true" />
              <input
                id={`${uid}-search`}
                type="search"
                placeholder="Search: NDA, cost, AI, mobile…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="kz-field !pl-11"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="divide-y divide-[var(--kz-border)] border-y border-[var(--kz-border)]">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              const btnId = `${uid}-q-${idx}`;
              const panelId = `${uid}-a-${idx}`;
              return (
                <li key={faq.question}>
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-[16px] font-semibold leading-snug text-[var(--kz-text)] transition-colors group-hover:text-[var(--kz-accent-text)] sm:text-[17px]">{faq.question}</span>
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${isOpen ? 'rotate-45 border-emerald-500 bg-emerald-700 text-white kz-on-accent' : 'border-[var(--kz-border-strong)] text-[var(--kz-muted)]'}`}>
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden" aria-hidden={!isOpen}>
                      <p className={`max-w-2xl pb-7 pr-12 text-[15px] leading-7 text-[var(--kz-text-2)] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{faq.answer}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {filteredFaqs.length === 0 && (
            <p className="py-10 text-center text-sm text-[var(--kz-muted)]">No matching questions found. Feel free to contact our team directly.</p>
          )}
        </div>
      </div>
    </section>
  );
};
