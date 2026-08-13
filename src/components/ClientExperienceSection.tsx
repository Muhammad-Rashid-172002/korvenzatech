import React from 'react';
import { Map, Video, MessageSquare, Flag, ShieldCheck, Rocket, Wrench, CheckCircle } from 'lucide-react';

export const ClientExperienceSection: React.FC = () => {
  const touchpoints = [
    { title: 'Transparent Roadmap', desc: 'Detailed milestone schedule with explicit deliverable dates before project kickoff.', icon: Map },
    { title: 'Bi-Weekly Live Demos', desc: 'Interact with working staging builds every two weeks to test features live.', icon: Video },
    { title: 'Dedicated Communication', desc: 'Direct access to your assigned engineering strategy lead via Slack, WhatsApp, or Email.', icon: MessageSquare },
    { title: 'Milestone-Based Billing', desc: 'Clear fixed pricing structure tied to verified deliverable milestones.', icon: Flag },
    { title: 'Security & Code Audits', desc: 'Thorough QA testing, vulnerability scans, and load performance verification.', icon: ShieldCheck },
    { title: 'Turnkey Launch Management', desc: 'Complete App Store, Google Play, and cloud server deployment handled for you.', icon: Rocket },
    { title: 'Post-Launch Maintenance', desc: 'SLA uptime monitoring, security updates, and ongoing feature enhancements.', icon: Wrench }
  ];

  return (
    <section className="py-24 bg-[#080b12] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>The Client Journey</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            What Working With KorvenzaTech Feels Like
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            We eliminate stress, confusion, and technical black boxes with transparent communication and predictable milestones.
          </p>
        </div>

        {/* Touchpoints Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {touchpoints.map((tp, idx) => {
            const IconComp = tp.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-blue-500/30 text-left space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-violet-400">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{tp.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {tp.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
