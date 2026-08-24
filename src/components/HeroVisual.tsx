import React, { useState } from 'react';
import { Bot, Smartphone, Cloud, Network, Database, Cpu, Lock, ShieldCheck, Sparkles } from 'lucide-react';

export const HeroVisual: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10; // max 5px
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setMousePos({ x, y });
  };

  return (
    <div 
      className="relative w-full aspect-square max-w-[540px] mx-auto flex items-center justify-center p-4 cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-violet-500/10 to-transparent rounded-full filter blur-3xl animate-pulse-glow" />

      {/* Decorative Rotating Orbital Rings */}
      <div className="absolute w-[80%] h-[80%] rounded-full border border-blue-500/15 animate-[spin_40s_linear_infinite]" />
      <div className="absolute w-[95%] h-[95%] rounded-full border border-violet-400/10 border-dashed animate-[spin_60s_linear_infinite_reverse]" />

      {/* Connecting SVG Network Wireframes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-500/30 stroke-[1.5]" viewBox="0 0 400 400">
        <line x1="200" y1="200" x2="90" y2="90" strokeDasharray="4 4" className="animate-pulse" />
        <line x1="200" y1="200" x2="310" y2="90" strokeDasharray="4 4" />
        <line x1="200" y1="200" x2="320" y2="280" strokeDasharray="4 4" className="animate-pulse" />
        <line x1="200" y1="200" x2="80" y2="280" strokeDasharray="4 4" />
        <line x1="200" y1="200" x2="200" y2="60" />
        <line x1="200" y1="200" x2="200" y2="340" />
      </svg>

      {/* Central Floating KorvenzaTech Brand Node */}
      <div 
        className="relative z-20 w-32 h-32 rounded-3xl bg-[#080b12] border border-violet-500/40 p-1 shadow-2xl shadow-blue-500/30 flex items-center justify-center transition-transform duration-300 ease-out animate-float-slow"
        style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
      >
        <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-blue-900/60 via-[#0d1527] to-[#080b12] flex flex-col items-center justify-center p-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-md" />
          <img src="/korvenza-logo.png" alt="KorvenzaTech" className="w-20 h-20 object-contain relative z-10 drop-shadow-[0_0_14px_rgba(34,211,238,0.45)]" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-white mt-1 relative z-10 uppercase">
            KORVENZA
          </span>
        </div>
      </div>

      {/* Orbit Node 1: AI Engine */}
      <div 
        className="absolute top-[12%] left-[12%] z-20 p-3 rounded-2xl glass-panel border-blue-500/30 flex items-center gap-2.5 shadow-lg group hover:scale-105 transition-all"
        style={{ transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)` }}
      >
        <div className="w-8 h-8 rounded-xl bg-blue-600/30 flex items-center justify-center text-violet-400">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-1">
            <span>AI Systems</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
          </div>
          <div className="text-[10px] text-slate-400">Private AI / RAG</div>
        </div>
      </div>

      {/* Orbit Node 2: Mobile Ecosystem */}
      <div 
        className="absolute top-[12%] right-[10%] z-20 p-3 rounded-2xl glass-panel border-blue-500/30 flex items-center gap-2.5 shadow-lg group hover:scale-105 transition-all"
        style={{ transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px, 0)` }}
      >
        <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-blue-400">
          <Smartphone className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-white">Mobile Apps</div>
          <div className="text-[10px] text-slate-400">iOS & Android</div>
        </div>
      </div>

      {/* Orbit Node 3: Cloud & API Gateway */}
      <div 
        className="absolute bottom-[14%] right-[8%] z-20 p-3 rounded-2xl glass-panel border-violet-500/30 flex items-center gap-2.5 shadow-lg group hover:scale-105 transition-all"
        style={{ transform: `translate3d(${mousePos.x * -0.7}px, ${mousePos.y * 0.7}px, 0)` }}
      >
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-violet-400">
          <Network className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-white">Custom APIs</div>
          <div className="text-[10px] text-slate-400">REST & Microservices</div>
        </div>
      </div>

      {/* Orbit Node 4: Cloud Infrastructure */}
      <div 
        className="absolute bottom-[14%] left-[10%] z-20 p-3 rounded-2xl glass-panel border-blue-500/30 flex items-center gap-2.5 shadow-lg group hover:scale-105 transition-all"
        style={{ transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * -0.6}px, 0)` }}
      >
        <div className="w-8 h-8 rounded-xl bg-violet-600/20 flex items-center justify-center text-blue-300">
          <Cloud className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-white">Cloud Systems</div>
          <div className="text-[10px] text-slate-400">Google Cloud & AWS</div>
        </div>
      </div>

      {/* Top Center Node: Enterprise Security */}
      <div className="absolute top-[2%] left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-[10px] text-slate-300 flex items-center gap-1.5 font-mono shadow-md">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Enterprise Grade Security</span>
      </div>

      {/* Bottom Center Node: Live Uptime */}
      <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-[10px] text-slate-300 flex items-center gap-1.5 font-mono shadow-md">
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
        <span>Scalable Digital Ecosystem</span>
      </div>
    </div>
  );
};
