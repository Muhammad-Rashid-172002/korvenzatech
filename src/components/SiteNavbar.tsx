import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, Moon, Sparkles, Sun, X } from 'lucide-react';
import { SERVICES_DATA } from '../data/companyData';
import { ServiceItem } from '../types';

type Props = {
  path: string;
  navigate: (path: string) => void;
  onSelectService: (service: ServiceItem) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

const nav = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/work', 'Work'],
  ['/industries', 'Industries'],
  ['/about', 'About'],
  ['/insights', 'Insights'],
  ['/careers', 'Careers'],
];

export const SiteNavbar: React.FC<Props> = ({ path, navigate, onSelectService, theme, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 18);
    fn(); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn);
  }, []);
  const go = (to: string) => { setMobile(false); setServicesOpen(false); navigate(to); };

  return <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#08090B]/88 backdrop-blur-2xl border-b border-white/8 shadow-2xl shadow-black/20' : 'bg-transparent'}`}>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">
      <button onClick={() => go('/')} className="group flex items-center gap-3 text-left">
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 via-indigo-500 to-blue-700 p-[1px] shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full rounded-[11px] bg-[#111218] grid place-items-center overflow-hidden">
            <img src="/korvenza-logo.png" alt="" className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>
        <div>
          <div className="text-[17px] font-extrabold tracking-tight text-white">Korvenza<span className="text-violet-400">Tech</span></div>
          <div className="text-[9px] uppercase tracking-[.28em] text-slate-500">Build • Automate • Scale</div>
        </div>
      </button>

      <nav className="hidden lg:flex items-center rounded-full border border-white/8 bg-white/[.035] p-1.5 backdrop-blur-xl">
        {nav.map(([to,label]) => <div key={to} className="relative" onMouseEnter={() => label==='Services' && setServicesOpen(true)} onMouseLeave={() => label==='Services' && setServicesOpen(false)}>
          <button onClick={() => go(to)} className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all flex items-center gap-1 ${path===to ? 'bg-white/8 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>{label}{label==='Services' && <ChevronDown className="w-3 h-3"/>}</button>
          {label==='Services' && servicesOpen && <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[620px]">
            <div className="rounded-2xl border border-white/10 bg-[#0B0C10]/95 backdrop-blur-2xl p-4 shadow-2xl grid grid-cols-2 gap-2">
              {SERVICES_DATA.slice(0,8).map(s => <button key={s.id} onClick={() => { onSelectService(s); setServicesOpen(false); }} className="text-left p-3 rounded-xl hover:bg-white/6 border border-transparent hover:border-white/8 transition-all">
                <div className="text-sm font-semibold text-white">{s.title}</div><div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{s.shortDesc}</div>
              </button>)}
              <button onClick={() => go('/services')} className="col-span-2 mt-1 p-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-violet-500/10 border border-violet-400/15 text-violet-300 text-xs font-semibold">View all services →</button>
            </div>
          </div>}
        </div>)}
      </nav>

      <div className="hidden lg:flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          className="theme-toggle"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className={`theme-toggle-option ${theme === 'light' ? 'active' : ''}`}><Sun className="w-3.5 h-3.5" /></span>
          <span className={`theme-toggle-option ${theme === 'dark' ? 'active' : ''}`}><Moon className="w-3.5 h-3.5" /></span>
        </button>
        <button onClick={() => go('/contact')} className="text-xs font-semibold text-slate-400 hover:text-white">Contact</button>
        <button onClick={() => go('/start-project')} className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-violet-500/25 transition-all"><Sparkles className="w-3.5 h-3.5"/> Start a Project <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"/></button>
      </div>
      <div className="lg:hidden flex items-center gap-2">
        <button onClick={onToggleTheme} className="mobile-theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
        </button>
        <button onClick={() => setMobile(!mobile)} className="p-2 rounded-lg text-slate-300 bg-white/5">{mobile?<X/>:<Menu/>}</button>
      </div>
    </div>
    {mobile && <div className="lg:hidden mx-4 mb-4 rounded-2xl border border-white/10 bg-[#0B0C10]/98 p-4 shadow-2xl">
      <div className="grid gap-1">{nav.map(([to,label]) => <button key={to} onClick={() => go(to)} className="text-left px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-white/5">{label}</button>)}</div>
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/8"><button onClick={()=>go('/contact')} className="py-3 rounded-xl border border-white/10 text-sm">Contact</button><button onClick={()=>go('/start-project')} className="py-3 rounded-xl bg-blue-600 text-sm font-bold">Start Project</button></div>
    </div>}
  </header>
};
