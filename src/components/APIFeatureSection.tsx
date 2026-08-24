import React, { useState } from 'react';
import { Network, Smartphone, Bot, Database, CreditCard, LayoutDashboard, ArrowDown, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export const APIFeatureSection: React.FC = () => {
  const [activeTarget, setActiveTarget] = useState<'ai' | 'db' | 'pay' | 'dash'>('ai');

  const targets = [
    {
      id: 'ai' as const,
      name: 'AI Services',
      desc: 'Private AI / RAG query proxying & response caching',
      icon: Bot,
      color: 'text-violet-400'
    },
    {
      id: 'db' as const,
      name: 'Database Cluster',
      desc: 'PostgreSQL & Firestore real-time record sync',
      icon: Database,
      color: 'text-blue-400'
    },
    {
      id: 'pay' as const,
      name: 'Payment Gateways',
      desc: 'Stripe, PayPal, and regional payment webhooks',
      icon: CreditCard,
      color: 'text-emerald-400'
    },
    {
      id: 'dash' as const,
      name: 'Admin Dashboard',
      desc: 'Real-time telemetry, analytics, and user permissions',
      icon: LayoutDashboard,
      color: 'text-purple-400'
    }
  ];

  return (
    <section className="py-24 bg-[#06080d] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <Network className="w-3.5 h-3.5" />
            <span>Connected Systems Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Connect Everything Your Business Uses
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Your website, mobile app, payment provider, AI tools, and internal systems often need to work together smoothly. We build secure API connections that make that possible.
          </p>
        </div>

        {/* Interactive Architecture Diagram */}
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-blue-500/30 max-w-4xl mx-auto text-center space-y-8 relative overflow-hidden bg-gradient-to-b from-[#080b12] to-[#04060a]">
          
          {/* Top Layer: Client Interfaces */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30 text-xs font-bold text-white flex items-center gap-2.5 shadow-lg">
              <Smartphone className="w-5 h-5 text-violet-400" />
              <span>Mobile Apps (iOS & Android)</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30 text-xs font-bold text-white flex items-center gap-2.5 shadow-lg">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <span>Web Applications & Portals</span>
            </div>
          </div>

          {/* Animated Down Arrow */}
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-violet-400 animate-bounce">
              <ArrowDown className="w-5 h-5" />
            </div>
          </div>

          {/* Central API Gateway */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 text-white font-extrabold text-base shadow-2xl shadow-blue-600/40 max-w-md mx-auto flex items-center justify-center gap-3">
            <Lock className="w-5 h-5 text-violet-200" />
            <span>Korvenza Security API Gateway</span>
            <ShieldCheck className="w-5 h-5 text-violet-200" />
          </div>

          {/* Connector Lines */}
          <div className="hidden sm:flex justify-center items-center gap-12 text-slate-600 text-xs font-mono">
            <span>↙</span>
            <span>↓</span>
            <span>↓</span>
            <span>↘</span>
          </div>

          {/* Bottom Destination Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {targets.map((t) => {
              const IconComp = t.icon;
              const isSel = activeTarget === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTarget(t.id)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-200 ${
                    isSel
                      ? 'bg-blue-950/60 border-violet-400 shadow-xl shadow-violet-400/10 scale-105'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconComp className={`w-5 h-5 ${t.color}`} />
                    <span className="text-xs font-bold text-white">{t.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Live Description Footer */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-300 font-mono text-center">
            Active Hub Focus: <span className="text-violet-400 font-bold">{targets.find(t => t.id === activeTarget)?.name}</span> — {targets.find(t => t.id === activeTarget)?.desc}
          </div>

        </div>

      </div>
    </section>
  );
};
