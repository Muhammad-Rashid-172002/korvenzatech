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
    <section className="kz-section  relative z-10 border-t border-[var(--kz-border)]">
      <div className="kz-container">
        
        {/* Section Header */}
        <div className="kz-reveal text-center max-w-3xl mx-auto space-y-5 mb-14">
          <div className="kz-eyebrow mx-auto">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>The Client Journey</span>
          </div>

          <h2 className="kz-h2">
            What Working With KorvenzaTech Feels Like
          </h2>

          <p className="kz-lead">
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
                className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/30 text-left space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
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
