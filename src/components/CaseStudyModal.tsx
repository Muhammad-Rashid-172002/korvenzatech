import React from 'react';
import { CaseStudy } from '../types';
import { X, CheckCircle2, Sparkles, ArrowRight, Layers } from 'lucide-react';

interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
  onStartProject: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  study,
  onClose,
  onStartProject,
}) => {
  if (!study) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#080b12] border border-blue-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-8 text-left relative shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-600/20 text-violet-300 border border-blue-500/30 text-xs font-mono font-semibold">
              {study.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-medium">
              {study.industry}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {study.name}
          </h2>

          <p className="text-base font-semibold text-violet-400">
            {study.tagline}
          </p>
        </div>

        {/* Banner Image */}
        <div className="rounded-2xl overflow-hidden border border-white/10 max-h-72">
          <img
            src={study.imageSrc}
            alt={study.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Metrics Bar */}
        <div className="p-6 rounded-2xl bg-blue-950/40 border border-blue-500/20 grid grid-cols-3 gap-4 text-center">
          {study.metrics.map((m, idx) => (
            <div key={idx}>
              <div className="text-xl sm:text-3xl font-extrabold text-white gradient-text-cyan">
                {m.value}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Challenge vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">
              The Client Challenge:
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {study.problem}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              KorvenzaTech Architecture & Engineering:
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {study.solution}
            </p>
          </div>
        </div>

        {/* Features & Key Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider">
              Core Platform Capabilities:
            </h4>
            <ul className="space-y-2">
              {study.features.map((feat, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider">
              Verified Business Outcomes:
            </h4>
            <ul className="space-y-2">
              {study.outcome.map((out, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-300 shrink-0 mt-0.5" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech Stack Bar */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
            Technologies Used:
          </span>
          <div className="flex flex-wrap gap-2">
            {study.coreTech.map((tech, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              onClose();
              onStartProject();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <span>Build a Similar Solution</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
          >
            Close Case Study
          </button>
        </div>

      </div>
    </div>
  );
};
