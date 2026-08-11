import React, { useState } from 'react';
import { PROCESS_STEPS } from '../data/companyData';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface ProcessTimelineProps {
  onStartProject: () => void;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ onStartProject }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  return (
    <section id="process" className="py-24 bg-[#06080d] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured Delivery Methodology</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            From Idea to Launch — Without the Confusion
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Our transparent 7-step engineering process ensures you always know what is being built, why it matters, and when it will be delivered.
          </p>
        </div>

        {/* Process Horizontal Stepper Bar */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex items-center min-w-max justify-between px-4">
            {PROCESS_STEPS.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;

              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStepIndex(idx)}
                  className="flex flex-col items-center group cursor-pointer px-3"
                >
                  {/* Step Circle Node */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 border ${
                    isActive
                      ? 'bg-blue-600 text-white border-violet-400 shadow-lg shadow-blue-600/40 scale-110'
                      : isPast
                      ? 'bg-violet-950/60 text-violet-300 border-violet-500/30'
                      : 'bg-white/5 text-slate-400 border-white/5 group-hover:border-white/20'
                  }`}>
                    {isPast ? <Check className="w-5 h-5 text-violet-400" /> : step.number}
                  </div>

                  <span className={`text-xs font-semibold mt-2 transition-colors ${
                    isActive ? 'text-violet-400 font-bold' : 'text-slate-400 group-hover:text-white'
                  }`}>
                    {step.title.split('&')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress Connecting Line */}
          <div className="relative w-full h-1 bg-slate-800 rounded-full mt-4 max-w-5xl mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-violet-400 transition-all duration-500"
              style={{ width: `${((activeStepIndex + 1) / PROCESS_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Active Step Details Panel */}
        {PROCESS_STEPS[activeStepIndex] && (
          <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl glass-panel border border-blue-500/30 bg-gradient-to-br from-[#080b12] via-[#0a0f1d] to-[#04060a] space-y-6 text-left relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-extrabold text-violet-400">
                  Step {PROCESS_STEPS[activeStepIndex].number}
                </span>
                <span className="text-xl font-bold text-white">
                  {PROCESS_STEPS[activeStepIndex].title}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Phase {activeStepIndex + 1} of 7
              </span>
            </div>

            <p className="text-base text-slate-300 leading-relaxed font-normal">
              {PROCESS_STEPS[activeStepIndex].description}
            </p>

            {/* Key Deliverable Box */}
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-violet-400 tracking-wider">
                  Phase Milestone Deliverable:
                </span>
                <p className="text-sm font-semibold text-white">
                  {PROCESS_STEPS[activeStepIndex].deliverable}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {activeStepIndex < PROCESS_STEPS.length - 1 ? (
                  <button
                    onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <span>Next Phase</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onStartProject}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                  >
                    <span>Ready to Launch? Start Brief</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
