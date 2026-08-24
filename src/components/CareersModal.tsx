import React, { useState } from 'react';
import { OPEN_ROLES } from '../data/companyData';
import { OpenRole } from '../types';
import { X, Briefcase, MapPin, CheckCircle, Send, Sparkles } from 'lucide-react';

interface CareersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareersModal: React.FC<CareersModalProps> = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<OpenRole | null>(OPEN_ROLES[0]);
  const [applicant, setApplicant] = useState({ name: '', email: '', experience: '', link: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#080b12] border border-blue-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-8 text-left relative shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Our Global Engineering Team</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Build Technology That Matters.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            KorvenzaTech is always looking for brilliant senior engineers, AI researchers, and product designers who love solving hard technology problems.
          </p>
        </div>

        {/* Roles List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OPEN_ROLES.map((role) => {
            const isSel = selectedRole?.id === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`p-5 rounded-2xl text-left border transition-all ${
                  isSel
                    ? 'bg-blue-600 text-white border-violet-400 shadow-lg shadow-blue-600/30'
                    : 'bg-white/5 text-slate-300 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="text-xs font-mono opacity-80 mb-1">{role.department} • {role.type}</div>
                <div className="text-sm font-bold">{role.title}</div>
                <div className="text-[11px] opacity-75 mt-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{role.location}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Role Details & Application */}
        {selectedRole && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">{selectedRole.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedRole.description}</p>
              
              <div className="pt-2">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider block mb-2">Key Requirements:</span>
                <ul className="space-y-1">
                  {selectedRole.requirements.map((req, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Application Form */}
            <div className="pt-4 border-t border-white/10">
              {isSubmitted ? (
                <div className="text-center py-6 text-violet-400 font-semibold text-sm">
                  Application received! Our recruitment team will review your profile.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Apply for this position:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={applicant.name}
                      onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                      className="px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={applicant.email}
                      onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                      className="px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="LinkedIn / GitHub / Portfolio URL"
                    value={applicant.link}
                    onChange={(e) => setApplicant({ ...applicant, link: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
