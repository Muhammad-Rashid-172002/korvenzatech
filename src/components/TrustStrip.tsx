import React from 'react';

const TECH_BADGES = [
  { name: 'Flutter', category: 'Mobile' },
  { name: 'React & Next.js', category: 'Web' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Firebase', category: 'Cloud DB' },
  { name: 'Cloud Infrastructure', category: 'Infrastructure' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Python', category: 'AI Engine' },
  { name: 'Multimodal AI', category: 'LLM Systems' },
  { name: 'Custom APIs', category: 'Integration' },
  { name: 'PostgreSQL', category: 'Database' }
];

export const TrustStrip: React.FC = () => {
  return (
    <section className="py-8 bg-[#04060a] border-y border-white/5 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Built for ambitious businesses, startups, and modern enterprise teams
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2">
            {TECH_BADGES.map((badge, idx) => (
              <div
                key={idx}
                className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.05] transition-all text-xs font-mono font-medium flex items-center gap-2 group grayscale hover:grayscale-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-violet-400 transition-colors" />
                <span>{badge.name}</span>
                <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">({badge.category})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
