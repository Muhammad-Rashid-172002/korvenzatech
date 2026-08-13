import React, { useState } from 'react';
import { Bot, ArrowRight, Check, Sparkles, Database, FileText, Cpu, ShieldAlert, Zap } from 'lucide-react';

export const AIFeatureSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: '1. User Request / Data Input',
      desc: 'Customer submits a voice message, photo, question, or document.',
      icon: FileText
    },
    {
      num: 2,
      title: '2. Korvenza AI Pipeline',
      desc: 'Private reasoning engine analyzes input, verifies rules, and searches private data.',
      icon: Cpu
    },
    {
      num: 3,
      title: '3. Business Integration',
      desc: 'Connects to company CRM, payment system, database, or notification gateway.',
      icon: Database
    },
    {
      num: 4,
      title: '4. Measurable Business Result',
      desc: 'Delivers instant response, automated action, or calculated diagnostic score.',
      icon: Zap
    }
  ];

  const aiExamples = [
    'Customer Support AI Assistants',
    'Document Analysis & Receipt Extraction',
    'AI Recommendation Engines',
    'Image & Food Recognition Models',
    'Automated Workflow Triggers',
    'Custom intelligent APIs',
    'Education & Exam Assessment',
    'AI Executive Dashboards'
  ];

  return (
    <section className="py-24 bg-[#080b12] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5" />
            <span>Practical Artificial Intelligence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            AI That Actually Solves Business Problems
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            We don’t add AI simply because it’s popular. We identify where intelligence, automation, and private data can create measurable value, save staff hours, and delight users.
          </p>
        </div>

        {/* Grid: Left Examples + Right Interactive Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: AI Use Case Badges */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h3 className="text-2xl font-bold text-white">
              Proven AI Capabilities We Engineer:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {aiExamples.map((ex, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-200 flex items-center gap-3 hover:border-blue-500/30 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-violet-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">{ex}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-violet-400 shrink-0" />
              <span><strong>Privacy First:</strong> All AI models process data securely without exposing proprietary company files to public model training.</span>
            </div>
          </div>

          {/* Right: Interactive AI Pipeline Visual */}
          <div className="lg:col-span-7 p-8 rounded-3xl glass-panel border border-blue-500/30 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Interactive AI Execution Flow</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Click steps to test flow</span>
            </div>

            {/* Pipeline Step Controllers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {steps.map((st) => (
                <button
                  key={st.num}
                  onClick={() => setActiveStep(st.num)}
                  className={`p-3 rounded-xl text-left border text-xs transition-all ${
                    activeStep === st.num
                      ? 'bg-blue-600 text-white border-violet-400 shadow-md'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold">Step {st.num}</div>
                  <div className="text-[10px] opacity-80 line-clamp-1">{st.title.split('.')[1]}</div>
                </button>
              ))}
            </div>

            {/* Active Flow Display Box */}
            <div className="p-6 rounded-2xl bg-[#04060a] border border-blue-500/20 text-left space-y-4 relative">
              <div className="flex items-center gap-3 text-violet-400 font-bold text-sm">
                <span className="w-8 h-8 rounded-xl bg-blue-600/30 flex items-center justify-center">
                  {activeStep}
                </span>
                <span>{steps[activeStep - 1].title}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {steps[activeStep - 1].desc}
              </p>

              {/* Animated Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-violet-400 transition-all duration-500"
                  style={{ width: `${(activeStep / 4) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Latency: &lt; 0.8s</span>
                <span>Status: Secure Private AI Pipeline</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
