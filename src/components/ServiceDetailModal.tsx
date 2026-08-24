import React from 'react';
import { ServiceItem } from '../types';
import { X, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onStartProject: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onStartProject,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#080b12] border border-blue-500/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-left relative shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-violet-300 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{service.category} Service Specifications</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white">
            {service.title}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {service.shortDesc}
          </p>
        </div>

        {/* Business Value Highlight Box */}
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/20 space-y-1">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-wider block">
            Business Value:
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">
            {service.businessValue}
          </p>
        </div>

        {/* Technical Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs text-slate-400">
            Technical Architecture:
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-3 rounded-xl border border-white/5">
            {service.technicalDescription}
          </p>
        </div>

        {/* Features & Deliverables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider">
              Core Service Features:
            </h4>
            <ul className="space-y-2">
              {service.features.map((feat, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider">
              What KorvenzaTech Delivers:
            </h4>
            <ul className="space-y-2">
              {service.deliverables.map((del, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQs if present */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
              <span>Service FAQ</span>
            </h4>
            {service.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1 text-xs">
                <div className="font-bold text-white">{faq.q}</div>
                <div className="text-slate-300 leading-relaxed">{faq.a}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              onClose();
              onStartProject();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <span>Request {service.title} Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
          >
            Close Specs
          </button>
        </div>

      </div>
    </div>
  );
};
