import React, { useEffect, useState } from 'react';
import { ArrowRight, Mail, MapPin, MessageSquare, Sparkles } from 'lucide-react';
import { SiteNavbar } from './components/SiteNavbar';
import { PageHero } from './components/PageHero';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { ServicesOverview } from './components/ServicesOverview';
import { HowWeHelp } from './components/HowWeHelp';
import { FeaturedWork } from './components/FeaturedWork';
import { AIFeatureSection } from './components/AIFeatureSection';
import { APIFeatureSection } from './components/APIFeatureSection';
import { InteractiveSolutionBuilder } from './components/InteractiveSolutionBuilder';
import { ProcessTimeline } from './components/ProcessTimeline';
import { WhyKorvenzaTech } from './components/WhyKorvenzaTech';
import { IndustriesSection } from './components/IndustriesSection';
import { TechStackSection } from './components/TechStackSection';
import { AboutSection } from './components/AboutSection';
import { ClientExperienceSection } from './components/ClientExperienceSection';
import { InsightsSection } from './components/InsightsSection';
import { FAQSection } from './components/FAQSection';
import { StartProjectSection } from './components/StartProjectSection';
import { Footer } from './components/Footer';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { CaseStudyModal } from './components/CaseStudyModal';
import { LegalModal } from './components/LegalModal';
import { KorvenzaAIChat } from './components/KorvenzaAIChat';
import { SERVICES_DATA, CASE_STUDIES } from './data/companyData';
import { ServiceItem, CaseStudy } from './types';

function App() {
  const [path, setPath] = useState(window.location.pathname || '/');
  const [service, setService] = useState<ServiceItem|null>(null);
  const [study, setStudy] = useState<CaseStudy|null>(null);
  const [legal, setLegal] = useState<'privacy'|'terms'|'cookies'|null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('korvenza-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('korvenza-theme', theme);
  }, [theme]);

  const navigate = (to:string) => {
    if (to === path) { window.scrollTo({top:0, behavior:'smooth'}); return; }
    window.history.pushState({}, '', to); setPath(to); window.scrollTo({top:0, behavior:'auto'});
  };
  useEffect(() => { const pop=()=>{setPath(window.location.pathname);window.scrollTo(0,0)}; window.addEventListener('popstate',pop); return()=>window.removeEventListener('popstate',pop); },[]);

  const scroll = (id:string) => document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const startProject = () => navigate('/start-project');
  const openWork = () => navigate('/work');

  let content: React.ReactNode;

  if (path === '/services') content = <>
    <PageHero eyebrow="Capabilities" title={<>Technology services built to <span className="gradient-text-cyan">solve real business problems.</span></>} description="From AI systems and APIs to mobile apps, websites, custom software and cloud delivery — choose one service or let us design the complete solution." primary="Discuss Your Project" onPrimary={startProject} secondary="See Our Work" onSecondary={openWork}/>
    <ServicesOverview onSelectService={setService} onStartProject={startProject}/>
    <AIFeatureSection/><APIFeatureSection/><InteractiveSolutionBuilder onStartProject={startProject}/>
  </>;
  else if (path === '/work') content = <>
    <PageHero eyebrow="Selected Work" title={<>Products that prove the <span className="gradient-text-cyan">engineering.</span></>} description="Explore real mobile products and digital platforms built around AI, marketplaces, education and fitness. We show the problem, architecture and what the product actually does — without inflated claims." primary="Start a Similar Project" onPrimary={startProject} secondary="Explore Services" onSecondary={()=>navigate('/services')}/>
    <FeaturedWork onSelectCaseStudy={setStudy} onStartProject={startProject}/>
  </>;
  else if (path === '/industries') content = <>
    <PageHero eyebrow="Industry Solutions" title={<>Technology shaped around <span className="gradient-text-cyan">how your business works.</span></>} description="Different industries need different workflows, security, customer experiences and integrations. We translate those differences into software that feels made for your operation." primary="Discuss Your Industry" onPrimary={startProject}/>
    <IndustriesSection onStartProject={startProject}/><TechStackSection/>
  </>;
  else if (path === '/about') content = <>
    <PageHero eyebrow="About KorvenzaTech" title={<>Complex technology. <span className="gradient-text-cyan">Clear business value.</span></>} description="KorvenzaTech is built around a simple idea: clients should not need to understand technical complexity to benefit from excellent software engineering." primary="Work With Us" onPrimary={startProject} secondary="Explore Our Process" onSecondary={()=>scroll('process')}/>
    <AboutSection/><WhyKorvenzaTech/><div id="process"><ProcessTimeline onStartProject={startProject}/></div><ClientExperienceSection/><FAQSection/>
  </>;
  else if (path === '/insights') content = <>
    <PageHero eyebrow="Knowledge Hub" title={<>Practical thinking for <span className="gradient-text-cyan">modern digital products.</span></>} description="Clear, useful articles on AI, app development, software architecture, APIs, cloud systems and digital product strategy."/>
    <InsightsSection/><FAQSection/>
  </>;
  else if (path === '/careers') content = <>
    <PageHero eyebrow="Careers" title={<>Build technology that <span className="gradient-text-cyan">people actually use.</span></>} description="We value curiosity, ownership, clear communication and engineers who care about the product — not only the code." primary="Send Your Profile" onPrimary={()=>navigate('/contact')}/>
    <section className="py-24 bg-[#0B0C10]"><div className="max-w-6xl mx-auto px-4">
      <div className="grid lg:grid-cols-3 gap-5">{['Engineering','Design & Product','Growth & Operations'].map((x,i)=><div key={x} className="premium-card p-7"><div className="text-violet-300 text-xs font-mono">0{i+1}</div><h3 className="text-xl font-bold mt-4">{x}</h3><p className="text-slate-400 text-sm mt-3 leading-6">We welcome strong portfolios and thoughtful applications. Open roles are published here only when active.</p><div className="mt-6 text-xs text-slate-500">No fabricated vacancies • Remote-friendly collaboration</div></div>)}</div>
      <div className="mt-10 p-8 rounded-3xl border border-violet-400/15 bg-gradient-to-br from-blue-950/50 to-slate-900/70 flex flex-col md:flex-row justify-between gap-6 items-center"><div><h3 className="text-2xl font-bold">Don’t see your role?</h3><p className="text-slate-400 mt-2">Send your portfolio, GitHub and area of expertise for future opportunities.</p></div><button onClick={()=>navigate('/contact')} className="px-5 py-3 rounded-xl bg-blue-600 text-sm font-bold">Introduce Yourself</button></div>
    </div></section>
  </>;
  else if (path === '/contact') content = <>
    <PageHero eyebrow="Contact" title={<>Tell us what you need. <span className="gradient-text-cyan">We’ll make the technical part clear.</span></>} description="Have a question, partnership idea, support request or project brief? Send the details in plain English — technical knowledge is optional." primary="Start a Project" onPrimary={startProject}/>
    <section className="py-20 bg-[#0B0C10]"><div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-5">
      {[['General enquiries','info@korvenzatech.com',Mail],['Project & sales','sales@korvenzatech.com',MessageSquare],['Location','Pakistan • Serving clients globally',MapPin]].map(([a,b,I]:any)=><div key={a} className="premium-card p-7"><I className="w-5 h-5 text-violet-300"/><h3 className="font-bold text-lg mt-5">{a}</h3><p className="text-slate-400 text-sm mt-2">{b}</p></div>)}
    </div></section><StartProjectSection/>
  </>;
  else if (path === '/start-project') content = <>
    <PageHero eyebrow="Project Brief" title={<>Your idea doesn’t need to be technical. <span className="gradient-text-cyan">Just tell us the goal.</span></>} description="Share what you want to build, improve or automate. We’ll use that information to understand the scope and recommend the most practical next step."/>
    <StartProjectSection/>
  </>;
  else content = <>
    <Hero onStartProject={startProject} onExploreWork={openWork} onOpenSolutionWizard={()=>navigate('/services')}/>
    <TrustStrip/>
    <section className="py-24 bg-[#0B0C10] border-t border-white/7"><div className="max-w-7xl mx-auto px-4">
      <div className="max-w-3xl"><div className="text-violet-300 text-xs uppercase tracking-[.2em] font-bold">Core capabilities</div><h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">One technology partner, from idea to launch.</h2><p className="mt-5 text-slate-400 text-lg leading-8">We keep the homepage focused. Explore dedicated pages when you want the technical detail.</p></div>
      <div className="grid md:grid-cols-3 gap-5 mt-12">{SERVICES_DATA.slice(0,6).map(s=><button key={s.id} onClick={()=>setService(s)} className="premium-card p-6 text-left group"><div className="text-[10px] uppercase tracking-wider text-violet-300">{s.category}</div><h3 className="text-xl font-bold mt-4 group-hover:text-violet-300 transition-colors">{s.title}</h3><p className="text-sm text-slate-400 mt-3 leading-6">{s.shortDesc}</p><div className="mt-6 flex items-center gap-2 text-xs font-bold text-indigo-400">Explore service <ArrowRight className="w-4 h-4"/></div></button>)}</div>
      <button onClick={()=>navigate('/services')} className="mt-8 text-sm font-bold text-violet-300 flex items-center gap-2">View all services <ArrowRight className="w-4 h-4"/></button>
    </div></section>
    <HowWeHelp onStartProject={startProject}/>
    <section className="py-24 bg-[#0a1322]"><div className="max-w-7xl mx-auto px-4"><div className="flex items-end justify-between gap-6 mb-10"><div><div className="text-violet-300 text-xs uppercase tracking-[.2em] font-bold">Live products</div><h2 className="text-3xl sm:text-5xl font-extrabold mt-4">Proof, not promises.</h2></div><button onClick={openWork} className="hidden sm:flex text-sm font-bold text-violet-300 items-center gap-2">All case studies <ArrowRight className="w-4 h-4"/></button></div>
      <div className="grid md:grid-cols-3 gap-5">{CASE_STUDIES.map(c=><button key={c.id} onClick={()=>setStudy(c)} className="premium-card overflow-hidden text-left group"><img src={c.imageSrc} className="w-full h-48 object-cover opacity-75 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"/><div className="p-6"><div className="text-[10px] text-violet-300 uppercase tracking-wider">{c.category}</div><h3 className="text-xl font-bold mt-3">{c.name}</h3><p className="text-sm text-slate-400 mt-2 line-clamp-2">{c.tagline}</p><div className="mt-5 text-xs font-bold text-indigo-400">View case study →</div></div></button>)}</div>
    </div></section>
    <WhyKorvenzaTech/>
    <section className="py-24 bg-[#0B0C10]"><div className="max-w-5xl mx-auto px-4 text-center"><div className="inline-flex items-center gap-2 text-violet-300 text-xs uppercase tracking-wider font-bold"><Sparkles className="w-4 h-4"/> Ready when you are</div><h2 className="text-4xl sm:text-6xl font-extrabold mt-5 tracking-tight">Have something ambitious in mind?</h2><p className="text-slate-400 text-lg mt-5 max-w-2xl mx-auto">You explain the business goal. We’ll help turn it into a clear product, roadmap and technical plan.</p><button onClick={startProject} className="mt-8 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-sm font-bold">Start a Project →</button></div></section>
  </>;

  return <div className="app-shell min-h-screen bg-[#08090B] text-[#f8fafc] selection:bg-violet-400/30">
    <SiteNavbar path={path} navigate={navigate} onSelectService={setService} theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}/>
    <main>{content}</main>
    <Footer onNavigateSection={(id)=>{ if(id==='insights') navigate('/insights'); else if(id==='work') navigate('/work'); else if(id==='about') navigate('/about'); else if(id==='faq') navigate('/about'); else navigate('/'); }} onOpenCareers={()=>navigate('/careers')} onOpenContact={()=>navigate('/contact')} onOpenLegal={setLegal} onSelectService={setService}/>
    <ServiceDetailModal service={service} onClose={()=>setService(null)} onStartProject={()=>{setService(null);startProject();}}/>
    <CaseStudyModal study={study} onClose={()=>setStudy(null)} onStartProject={()=>{setStudy(null);startProject();}}/>
    <LegalModal type={legal} onClose={()=>setLegal(null)}/>
    <KorvenzaAIChat/>
  </div>;
}
export default App;
