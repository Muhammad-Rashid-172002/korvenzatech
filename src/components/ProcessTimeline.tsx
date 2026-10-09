import React, { useEffect, useRef, useState } from 'react';
import { PROCESS_STEPS } from '../data/companyData';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from './ui';
import { pinRanges, scrollToY } from '../lib/scrollStore';

interface ProcessTimelineProps {
  onStartProject: () => void;
}

/**
 * "The Journey". All phases are always in the HTML (stacked tab panels, only
 * the active one visible). On large screens with the 3D layer, lib/scroll.ts
 * pins the stage and scroll walks the phases (a glowing path renders behind
 * it); everywhere else this is a plain, fully accessible tab list.
 */
export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ onStartProject }) => {
  const [active, setActive] = useState(0);
  const total = PROCESS_STEPS.length;
  const sectionRef = useRef<HTMLElement>(null);

  // While pinned, scroll position owns the active phase.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onStep = (e: Event) => setActive((e as CustomEvent<number>).detail);
    el.addEventListener('kz:step', onStep);
    return () => el.removeEventListener('kz:step', onStep);
  }, []);

  /** Select a phase: when pinned, glide to that phase's scroll position; otherwise switch the tab. */
  const go = (i: number) => {
    const range = pinRanges.process;
    if (sectionRef.current?.dataset.pinned === 'true' && range) {
      scrollToY(range.start + ((i + 0.5) / total) * (range.end - range.start));
    }
    setActive(i);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : total - 1)) % total;
    go(next);
    document.getElementById(`step-tab-${next}`)?.focus();
  };

  return (
    <section ref={sectionRef} id="process" className="kz-section kz-section-alt kz-process relative" aria-labelledby="process-title">
      <div className="kz-container">
        <SectionHeader
          eyebrow="How KorvenzaTech works"
          title={<span id="process-title">From idea to launch — without the confusion.</span>}
          lead={`A transparent ${total}-step engineering process, so you always know what is being built, why it matters and what comes next.`}
        />

        <div data-kz-pin="" data-steps={total} className="kz-process-stage relative mt-14">
          {/* Rectangle the shared WebGL canvas renders the journey path into (large screens only). */}
          <div data-kz-view="process" className="kz-view-track kz-view-track--process" aria-hidden="true" />

          <div className="relative grid gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="kz-reveal relative lg:col-span-5" onKeyDown={onKey}>
              <span className="absolute bottom-6 left-[27px] top-6 w-px bg-[var(--kz-border-strong)]" aria-hidden="true" />
              <span
                className="kz-process-fill absolute bottom-6 left-[26.5px] top-6 w-[2px] rounded-full"
                style={{ '--kz-fill': total > 1 ? active / (total - 1) : 1 } as React.CSSProperties}
                aria-hidden="true"
              />
              <ol role="tablist" aria-orientation="vertical" aria-label="Delivery phases" className="relative space-y-1">
                {PROCESS_STEPS.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <li key={s.number} role="presentation">
                      <button
                        id={`step-tab-${i}`}
                        role="tab"
                        type="button"
                        aria-selected={isActive}
                        aria-controls={`step-panel-${i}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => go(i)}
                        className={`flex w-full items-center gap-4 rounded-2xl px-2 py-2.5 text-left transition-colors ${isActive ? 'bg-[var(--kz-surface)]' : 'hover:bg-[var(--kz-surface)]/60'}`}
                      >
                        <span className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border font-mono text-[12px] font-bold transition-all duration-500 ${isActive ? 'border-emerald-400 bg-emerald-700 text-white kz-on-accent shadow-[0_8px_24px_-8px_rgba(25,199,132,.7)]' : i < active ? 'border-emerald-500/40 bg-[var(--kz-surface)] text-[var(--kz-accent-text)]' : 'border-[var(--kz-border-strong)] bg-[var(--kz-surface)] text-[var(--kz-muted)]'}`}>{s.number}</span>
                        <span className={`text-[15px] font-semibold transition-colors ${isActive ? 'text-[var(--kz-text)]' : 'text-[var(--kz-muted)]'}`}>{s.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="kz-reveal grid lg:col-span-7">
              {PROCESS_STEPS.map((step, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={step.number}
                    id={`step-panel-${i}`}
                    role="tabpanel"
                    aria-labelledby={`step-tab-${i}`}
                    inert={!isActive}
                    data-active={isActive}
                    className="kz-process-panel flex h-full flex-col rounded-[var(--kz-radius-xl)] border border-[var(--kz-border)] p-8 sm:p-10 [grid-area:1/1]"
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-[var(--kz-border)] pb-6">
                      <span className="font-mono text-4xl font-extrabold tracking-tight text-[var(--kz-accent-text)]" aria-hidden="true">{step.number}</span>
                      <span className="kz-meta">Phase {i + 1} of {total}</span>
                    </div>
                    <h3 className="mt-7 text-2xl font-extrabold tracking-tight text-[var(--kz-text)] sm:text-3xl">{step.title}</h3>
                    <p className="mt-4 text-[15px] leading-7 text-[var(--kz-text-2)]">{step.description}</p>
                    <div className="mt-auto pt-8">
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[.06] p-5">
                        <p className="kz-meta !text-[10px] !text-[var(--kz-accent-text)]">Milestone deliverable</p>
                        <p className="mt-2 text-[15px] font-semibold text-[var(--kz-text)]">{step.deliverable}</p>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        {i < total - 1 ? (
                          <button type="button" onClick={() => go(i + 1)} className="kz-btn kz-btn-secondary">Next phase <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                        ) : (
                          <button type="button" onClick={onStartProject} className="kz-btn kz-btn-primary">Ready to start? Send a brief <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
