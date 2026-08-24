import React, { useState } from 'react';
import { Lightbulb, Wrench, Bot, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface HowWeHelpProps {
  onStartProject: () => void;
}

export const HowWeHelp: React.FC<HowWeHelpProps> = ({ onStartProject }) => {
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const scenarios = [
    {
      id: 0,
      title: '“I Have an Idea”',
      subtitle: 'For entrepreneurs, founders, and innovators with a app or software concept.',
      icon: Lightbulb,
      badge: 'From Concept to Product',
      description: 'You do not need technical knowledge or wireframes. You explain what problem your app solves, and our team transforms your vision into a structured product roadmap, clickable user designs, and a published mobile or web app.',
      steps: [
        'Free 30-minute discovery call to discuss your vision',
        'Interactive Figma prototype to preview before coding',
        'Cross-platform mobile (iOS/Android) or web engineering',
        'Store publishing, domain setup, and investor-ready launch'
      ],
      quote: '“We turn raw concepts into functional, revenue-generating software products.”'
    },
    {
      id: 1,
      title: '“My Business Needs Better Software”',
      subtitle: 'For established companies needing internal tools, custom portals, or database upgrades.',
      icon: Wrench,
      badge: 'Streamline Operations',
      description: 'We study your daily business workflows, spot manual bottlenecks, and engineer custom management portals, CRM tools, or automated booking systems that save hundreds of staff hours every month.',
      steps: [
        'Operational process audit and bottleneck identification',
        'Custom web portal or role-based management software',
        'Integration with your existing databases and accounting tools',
        'Employee onboarding and ongoing technical support'
      ],
      quote: '“Tailor-made software built around your exact business workflow.”'
    },
    {
      id: 2,
      title: '“I Want to Add AI”',
      subtitle: 'For companies seeking genuine AI automation, customer assistants, or smart data analysis.',
      icon: Bot,
      badge: 'Practical AI ROI',
      description: 'We identify where artificial intelligence will actually create measurable value — such as 24/7 intelligent customer response, automated document reading, or predictive analytics — rather than adding AI just for hype.',
      steps: [
        'AI feasibility evaluation & ROI estimation',
        'Secure language-model or RAG setup using your private data',
        'Smart customer service or internal decision assistants',
        'Continuous accuracy monitoring and performance safety'
      ],
      quote: '“Practical, secure AI solutions that deliver immediate business results.”'
    }
  ];

  const current = scenarios[selectedScenario];
  const IconComp = current.icon;

  return (
    <section id="how-we-help" className="py-24 bg-[#080b12] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Problem-Solving Approach</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            You Bring the Challenge. We Build the Solution.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            No matter where you are in your technology journey, KorvenzaTech meets you with clarity, technical capability, and business focus.
          </p>
        </div>

        {/* Scenario Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {scenarios.map((scen, idx) => {
            const IconComponent = scen.icon;
            const isSelected = selectedScenario === idx;
            return (
              <button
                key={scen.id}
                onClick={() => setSelectedScenario(idx)}
                className={`text-left p-6 rounded-2xl transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500/50 shadow-xl shadow-blue-500/10 scale-[1.02]'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">
                      {scen.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{scen.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{scen.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span>{isSelected ? 'Currently Viewing' : 'Select Scenario'}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-violet-400' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Deep Dive Card */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-blue-500/30 relative overflow-hidden bg-gradient-to-br from-[#0b101d] via-[#080b12] to-[#04060a]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                <IconComp className="w-4 h-4 text-violet-400" />
                <span>{current.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {current.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {current.description}
              </p>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                  How KorvenzaTech Delivers:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {current.steps.map((step, sIdx) => (
                    <div key={sIdx} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-200 flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={onStartProject}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <span>Tell Us What You Need</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Quote / Highlight Block */}
            <div className="lg:col-span-5 p-8 rounded-2xl bg-gradient-to-b from-blue-900/20 to-slate-900/60 border border-blue-500/20 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-violet-300 mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-white italic leading-relaxed">
                {current.quote}
              </p>
              <div className="pt-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
                — KorvenzaTech Client Philosophy
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
