import React from 'react';
import { Sparkles, Compass, Award, MessageCircle, ShieldCheck, RefreshCw, Handshake } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const values = [
    { title: 'Innovation with Purpose', desc: 'We implement AI and modern frameworks where they solve actual problems, not for tech hype.', icon: Compass },
    { title: 'Quality Without Compromise', desc: 'Design elegance, code performance, and data security are maintained as non-negotiable standards.', icon: Award },
    { title: 'Clarity in Communication', desc: 'We translate complex engineering decisions into clear, jargon-free business value.', icon: MessageCircle },
    { title: 'Responsibility & Security', desc: 'We take ownership of uptime, data privacy, and intellectual property protection.', icon: ShieldCheck },
    { title: 'Continuous Improvement', desc: 'We continually refine software based on user feedback and technological advancements.', icon: RefreshCw },
    { title: 'Client Partnership', desc: 'We act as long-term technology stewards for your business growth.', icon: Handshake }
  ];

  return (
    <section id="about" className="py-24 bg-[#06080d] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Philosophy Block */}
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-blue-500/30 bg-gradient-to-br from-[#080b12] via-[#0d1424] to-[#04060a] space-y-8 text-left mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-violet-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KorvenzaTech Core Philosophy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Technology Should Make Business Simpler, Not More Complicated.
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-4xl">
            <p>
              KorvenzaTech was created around a simple belief: <strong className="text-white font-semibold">businesses should not need to understand complex technology to benefit from it.</strong>
            </p>
            <p>
              Our job is to understand your business challenge, explain the solution clearly in plain English, and build technology that delivers real, measurable value.
            </p>
            <p>
              We combine product thinking, software engineering, UI/UX design, AI systems, and digital strategy to create digital solutions that modern organizations can confidently use and grow.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white">Our Core Company Values</h3>
            <p className="text-xs text-slate-400 mt-1">The principles guiding every engineering and design decision</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const IconComp = v.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all text-left space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-violet-400 flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">{v.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
