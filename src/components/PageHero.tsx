import React from 'react';
import { ArrowRight } from 'lucide-react';
export const PageHero: React.FC<{eyebrow:string; title:React.ReactNode; description:string; primary?:string; onPrimary?:()=>void; secondary?:string; onSecondary?:()=>void}> = ({eyebrow,title,description,primary,onPrimary,secondary,onSecondary}) => <section className="relative pt-36 pb-20 overflow-hidden border-b border-white/7">
  <div className="absolute inset-0 bg-grid-pattern opacity-40"/><div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[520px] bg-[radial-gradient(circle,rgba(14,165,233,.17),transparent_62%)]"/>
  <div className="relative max-w-5xl mx-auto px-4 text-center">
    <div className="inline-flex px-3 py-1 rounded-full border border-violet-400/20 bg-violet-400/8 text-violet-300 text-[10px] uppercase tracking-[.2em] font-bold">{eyebrow}</div>
    <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-.045em] text-white leading-[1.02]">{title}</h1>
    <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-8">{description}</p>
    {(primary||secondary)&&<div className="mt-9 flex flex-wrap justify-center gap-3">{primary&&<button onClick={onPrimary} className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-sm font-bold shadow-xl shadow-blue-500/20 flex items-center gap-2">{primary}<ArrowRight className="w-4 h-4"/></button>}{secondary&&<button onClick={onSecondary} className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-200 hover:bg-white/8">{secondary}</button>}</div>}
  </div>
</section>;
