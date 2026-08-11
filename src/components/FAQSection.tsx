import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/companyData';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredFaqs = FAQ_ITEMS.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="py-24 bg-[#080b12] relative z-10 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Clear Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Everything you need to know about working with KorvenzaTech — answered simply and honestly.
          </p>

          {/* Quick Search */}
          <div className="max-w-md mx-auto pt-4">
            <input
              type="text"
              placeholder="Search questions (e.g., NDA, cost, AI, mobile)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl glass-panel border border-white/10 transition-all overflow-hidden text-left"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-white/[0.02]"
                >
                  <span className="text-base font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-violet-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-slate-300 leading-relaxed font-normal border-t border-white/5 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching questions found. Feel free to contact our team directly.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
