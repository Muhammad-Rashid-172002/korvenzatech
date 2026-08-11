import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'cookies' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap = {
    privacy: {
      title: 'KorvenzaTech Privacy Policy',
      date: 'Effective Date: August 2026',
      body: `KorvenzaTech values your privacy. This policy outlines how we collect, store, and safeguard client data:

1. Data Collection: We collect contact information provided in project inquiry forms solely to communicate regarding software development services.
2. AI & Confidentiality: Proprietary code, documents, and business ideas submitted to KorvenzaTech are protected under strict confidentiality and zero-data-retention security protocols.
3. Third-Party Sharing: We never sell, rent, or trade client information to advertising platforms or third parties.
4. Security: All client communications use encrypted HTTPS channels.`
    },
    terms: {
      title: 'Terms of Service',
      date: 'Effective Date: August 2026',
      body: `By accessing KorvenzaTech's website or engaging our software development services, you agree to the following terms:

1. Intellectual Property: Clients retain 100% ownership of all custom software, mobile codebases, designs, and proprietary workflows created upon completion of milestone payments.
2. Deliverables: All deliverables undergo rigorous Quality Assurance (QA) testing before store or cloud deployment.
3. NDAs: Mutual Non-Disclosure Agreements are enforced across all prospective and active project discussions.`
    },
    cookies: {
      title: 'Cookie Policy & Preferences',
      date: 'Effective Date: August 2026',
      body: `KorvenzaTech uses essential session cookies solely to maintain website performance, store user navigation state, and secure form submissions. We do not employ invasive tracking cookies.`
    }
  };

  const activeContent = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#080b12] border border-blue-500/30 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-left relative shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-violet-400 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal Document</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {activeContent.title}
          </h2>

          <div className="text-xs text-slate-400 font-mono">
            {activeContent.date}
          </div>
        </div>

        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4 pt-4 border-t border-white/10">
          {activeContent.body}
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
