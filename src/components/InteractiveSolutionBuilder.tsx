import React, { useState } from 'react';
import { Smartphone, Globe, Bot, Code, Cpu, HelpCircle, ArrowRight, Check, Sparkles } from 'lucide-react';

interface SolutionBuilderProps {
  onStartProject: () => void;
}

export const InteractiveSolutionBuilder: React.FC<SolutionBuilderProps> = ({ onStartProject }) => {
  const [selectedOption, setSelectedOption] = useState<string>('app');

  const options = [
    { id: 'app', label: 'I Need a Mobile App', icon: Smartphone },
    { id: 'web', label: 'I Need a Website', icon: Globe },
    { id: 'ai', label: 'I Need AI Features', icon: Bot },
    { id: 'software', label: 'I Need Custom Software', icon: Code },
    { id: 'automation', label: 'I Need Business Automation', icon: Cpu },
    { id: 'notsure', label: 'I’m Not Sure Yet', icon: HelpCircle }
  ];

  const recommendations: Record<string, { title: string; desc: string; capabilities: string[]; nextStep: string }> = {
    app: {
      title: 'Cross-Platform Mobile App (iOS & Android)',
      desc: 'A fast, responsive mobile app built with Flutter or Native technology so your clients can access your services on any smartphone.',
      capabilities: [
        'iOS App Store & Google Play Store publishing',
        'Push notifications & user accounts',
        'In-app payment & subscription checkout',
        'Offline data sync & biometrics'
      ],
      nextStep: 'Share your app concept with our mobile architects for an estimated timeline.'
    },
    web: {
      title: 'High-Converting Web Application or Portal',
      desc: 'A modern, ultra-fast website or customer portal built with Next.js and React that presents your business with enterprise authority.',
      capabilities: [
        'Blazing fast Google Core Web Vitals performance',
        'SEO optimization & schema metadata',
        'Lead collection forms & appointment booking',
        'Easy content management CMS'
      ],
      nextStep: 'Request a free web design preview and speed audit.'
    },
    ai: {
      title: 'Practical AI Assistant or RAG Knowledge Base',
      desc: 'An intelligent AI model integrated directly into your app or website to answer client questions 24/7 or summarize complex documents.',
      capabilities: [
        'Custom language-model and intelligent API integrations',
        'Private vector database RAG setup',
        'Automated document & receipt processing',
        'Zero data retention privacy setup'
      ],
      nextStep: 'Test an AI prototype tailored to your company documentation.'
    },
    software: {
      title: 'Tailor-Made Enterprise Management Platform',
      desc: 'A custom software platform designed specifically around your internal operational workflows, CRM needs, or marketplace rules.',
      capabilities: [
        'Role-based permission matrix & admin dashboards',
        'ERP / CRM business operational tools',
        'Database migration & legacy tool integration',
        'Automated audit logs & security permissions'
      ],
      nextStep: 'Book an operational workflow audit with our lead systems engineers.'
    },
    automation: {
      title: 'Connected API & Workflow Automation Pipeline',
      desc: 'Automatic data synchronization between your accounting software, web store, mobile apps, and central databases.',
      capabilities: [
        'High-performance REST API gateway',
        'Stripe & payment gateway webhooks',
        'Automated email & SMS dispatch triggers',
        'Error handling & rate-limited gateway shield'
      ],
      nextStep: 'List the software tools you currently use to map an automation plan.'
    },
    notsure: {
      title: 'Free 30-Minute Technology Strategy Session',
      desc: 'You do not need technical knowledge. Explain your business goals in plain English, and our team will recommend the simplest, most cost-effective solution.',
      capabilities: [
        'Plain-English business challenge evaluation',
        'Recommended technology roadmap & budget estimate',
        'Comparison of web vs mobile vs custom software options',
        'No obligation technical advice'
      ],
      nextStep: 'Schedule a free discovery call with a KorvenzaTech technology director.'
    }
  };

  const currentRec = recommendations[selectedOption] || recommendations.notsure;

  return (
    <section className="py-24 bg-[#08090B] relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Project Guidance</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            What Can We Build for You?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal">
            Select what you're trying to accomplish below to receive an instant recommended technology path.
          </p>
        </div>

        {/* Option Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {options.map((opt) => {
            const IconComponent = opt.icon;
            const isSel = selectedOption === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                className={`p-4 rounded-2xl text-center border transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                  isSel
                    ? 'bg-indigo-500 text-white border-indigo-400 shadow-xl shadow-indigo-500/25 scale-105'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:border-slate-600 hover:text-white'
                }`}
              >
                <IconComponent className={`w-6 h-6 ${isSel ? 'text-white' : 'text-indigo-400'}`} />
                <span className="text-xs font-semibold leading-tight">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Recommendation Card */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-slate-800 bg-[#17181F] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Recommended Solution Path:
            </span>
            <span className="text-xs text-slate-400 font-mono">Tailored for Business Impact</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-2xl font-extrabold text-white">
                {currentRec.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {currentRec.desc}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Key Capabilities Included:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentRec.capabilities.map((cap, cIdx) => (
                    <div key={cIdx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 space-y-4 text-center">
              <span className="text-xs font-mono text-indigo-400 uppercase font-bold">Suggested Next Step</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentRec.nextStep}
              </p>
              <button
                onClick={onStartProject}
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <span>Talk to an Expert</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
