import React, { useEffect, useState } from 'react';
import { ArrowRight, Mail, MapPin, MessageCircle, MessageSquare, Sparkles, Video } from 'lucide-react';
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
import { LeadershipTestimonialsSection } from './components/LeadershipTestimonialsSection';
import { InsightsSection } from './components/InsightsSection';
import { FAQSection } from './components/FAQSection';
import { StartProjectSection } from './components/StartProjectSection';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';
import { KorvenzaAIChat } from './components/KorvenzaAIChat';
import { ServiceLandingPage } from './components/ServiceLandingPage';
import { CaseStudyLandingPage } from './components/CaseStudyLandingPage';
import { SolutionBlueprints } from './components/SolutionBlueprints';
import { SeoManager } from './components/SeoManager';
import { SERVICES_DATA, CASE_STUDIES } from './data/companyData';

function App() {
  const [path, setPath] = useState(window.location.pathname || '/');
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
  const navigateService = (service: { id: string }) => navigate(`/services/${service.id}`);
  const navigateStudy = (study: { id: string }) => navigate(`/work/${study.id}`);

  let content: React.ReactNode;
  const serviceRoute = path.startsWith('/services/') ? SERVICES_DATA.find(s => `/services/${s.id}` === path) : undefined;
  const studyRoute = path.startsWith('/work/') ? CASE_STUDIES.find(s => `/work/${s.id}` === path) : undefined;

  if (serviceRoute) content = <ServiceLandingPage service={serviceRoute} onStartProject={startProject} onNavigateServices={() => navigate('/services')} />;
  else if (studyRoute) content = <CaseStudyLandingPage study={studyRoute} onBack={() => navigate('/work')} onStartProject={startProject} />;
  else if (path === '/services') content = <>
    <PageHero eyebrow="Capabilities" title={<>Technology services built to <span className="gradient-text-cyan">solve real business problems.</span></>} description="From AI systems and APIs to mobile apps, websites, custom software and cloud delivery — choose one service or let us design the complete solution." primary="Discuss Your Project" onPrimary={startProject} secondary="See Our Work" onSecondary={openWork}/>
    <ServicesOverview onNavigateService={(id)=>navigate(`/services/${id}`)} onStartProject={startProject}/>
    <AIFeatureSection/><APIFeatureSection/><InteractiveSolutionBuilder onStartProject={startProject}/>
  </>;
  else if (path === '/work') content = <>
    <PageHero eyebrow="Selected Work" title={<>Real products, clear architecture, <span className="gradient-text-cyan">credible outcomes.</span></>} description="Explore selected products across education technology and on-demand marketplaces, then review enterprise solution blueprints for AI, SaaS, APIs, cloud, design and growth." primary="Start a Similar Project" onPrimary={startProject} secondary="Explore Services" onSecondary={()=>navigate('/services')}/>
    <FeaturedWork onNavigateCaseStudy={(id)=>navigate(`/work/${id}`)} onStartProject={startProject}/>
    <SolutionBlueprints onStartProject={startProject}/>
  </>;
  else if (path === '/industries') content = <>
    <PageHero eyebrow="Industry Solutions" title={<>Technology shaped around <span className="gradient-text-cyan">how your business works.</span></>} description="Different industries need different workflows, security, customer experiences and integrations. We translate those differences into software that feels made for your operation." primary="Discuss Your Industry" onPrimary={startProject}/>
    <IndustriesSection onStartProject={startProject}/><TechStackSection/>
  </>;
  else if (path === '/about') content = <>
    <PageHero eyebrow="About KorvenzaTech" title={<>Complex technology. <span className="gradient-text-cyan">Clear business value.</span></>} description="KorvenzaTech is built around a simple idea: clients should not need to understand technical complexity to benefit from excellent software engineering." primary="Work With Us" onPrimary={startProject} secondary="Explore Our Process" onSecondary={()=>scroll('process')}/>
    <AboutSection/><LeadershipTestimonialsSection/><WhyKorvenzaTech/><div id="process"><ProcessTimeline onStartProject={startProject}/></div><FAQSection/>
  </>;
  else if (path === '/insights') content = <>
    <PageHero eyebrow="Knowledge Hub" title={<>Practical thinking for <span className="gradient-text-cyan">modern digital products.</span></>} description="Clear, useful articles on AI, app development, software architecture, APIs, cloud systems and digital product strategy."/>
    <InsightsSection/><FAQSection/>
  </>;
  else if (path === '/careers') content = <>
    <PageHero eyebrow="Careers" title={<>Build technology that <span className="gradient-text-cyan">people actually use.</span></>} description="We value curiosity, ownership, clear communication and engineers who care about the product — not only the code." primary="Send Your Profile" onPrimary={()=>navigate('/contact')}/>
    <section className="py-24 bg-[#0B0C10]"><div className="max-w-6xl mx-auto px-4">
      <div className="grid lg:grid-cols-3 gap-5">{['Engineering','Design & Product','Growth & Operations'].map((x,i)=><div key={x} className="premium-card p-7"><div className="text-emerald-300 text-xs font-mono">0{i+1}</div><h3 className="text-xl font-bold mt-4">{x}</h3><p className="text-slate-400 text-sm mt-3 leading-6">We welcome strong portfolios and thoughtful applications. Open roles are published here only when active.</p><div className="mt-6 text-xs text-slate-500">No fabricated vacancies • Remote-friendly collaboration</div></div>)}</div>
      <div className="mt-10 p-8 rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950/30 to-slate-900/70 flex flex-col md:flex-row justify-between gap-6 items-center"><div><h3 className="text-2xl font-bold">Don’t see your role?</h3><p className="text-slate-400 mt-2">Send your portfolio, GitHub and area of expertise for future opportunities.</p></div><button onClick={()=>navigate('/contact')} className="px-5 py-3 rounded-xl bg-emerald-600 text-sm font-bold">Introduce Yourself</button></div>
    </div></section>
  </>;
  else if (path === '/contact') content = <>
    <PageHero eyebrow="Contact" title={<>Choose the fastest way to <span className="gradient-text-cyan">reach the right team.</span></>} description="Project enquiry, partnership, general question or preferred WhatsApp/video-call follow-up — your submission is routed to the appropriate KorvenzaTech inbox." primary="Start a Project" onPrimary={startProject}/>
    <section className="py-20 bg-[#0B0C10]"><div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-5 gap-5">
      <a href="mailto:info@korvenzatech.com" className="premium-card p-6"><Mail className="w-5 h-5 text-emerald-300"/><h3 className="font-bold text-lg mt-5">General enquiries</h3><p className="text-slate-400 text-sm mt-2">info@korvenzatech.com</p></a>
      <a href="mailto:sales@korvenzatech.com" className="premium-card p-6"><MessageSquare className="w-5 h-5 text-emerald-300"/><h3 className="font-bold text-lg mt-5">Project & sales</h3><p className="text-slate-400 text-sm mt-2">sales@korvenzatech.com</p></a>
      <a href="https://wa.me/923701691701" target="_blank" rel="noreferrer" className="premium-card p-6"><MessageCircle className="w-5 h-5 text-emerald-300"/><h3 className="font-bold text-lg mt-5">WhatsApp</h3><p className="text-slate-400 text-sm mt-2">+92 370 1691701</p></a>
      <button onClick={startProject} className="premium-card p-6 text-left"><Video className="w-5 h-5 text-emerald-300"/><h3 className="font-bold text-lg mt-5">Video call</h3><p className="text-slate-400 text-sm mt-2">Select “Video Call” in the brief and we’ll coordinate a time.</p></button>
      <div className="premium-card p-6"><MapPin className="w-5 h-5 text-emerald-300"/><h3 className="font-bold text-lg mt-5">Global delivery</h3><p className="text-slate-400 text-sm mt-2">Pakistan • Serving clients worldwide</p></div>
    </div></section><StartProjectSection defaultInquiryType="General Inquiry"/>
  </>;
  else if (path === '/start-project') content = <>
    <PageHero eyebrow="Project Brief" title={<>Your idea doesn’t need to be technical. <span className="gradient-text-cyan">Just tell us the goal.</span></>} description="Share what you want to build, improve or automate. We’ll route the brief to the right team and recommend the most practical next step."/>
    <StartProjectSection/>
  </>;
  else content = <>
    <Hero onStartProject={startProject} onExploreWork={openWork} onOpenSolutionWizard={()=>navigate('/services')}/>
    <TrustStrip/>
    <section className="py-24 bg-[#0B0C10] border-t border-white/7"><div className="max-w-7xl mx-auto px-4">
      <div className="max-w-3xl"><div className="text-emerald-300 text-xs uppercase tracking-[.2em] font-bold">Core capabilities</div><h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">One technology partner, from idea to launch.</h2><p className="mt-5 text-slate-400 text-lg leading-8">Dedicated service pages explain the business value, architecture, deliverables and common use cases without burying you in technical jargon.</p></div>
      <div className="grid md:grid-cols-3 gap-5 mt-12">{SERVICES_DATA.slice(0,6).map(s=><a key={s.id} href={`/services/${s.id}`} onClick={(e)=>{e.preventDefault();navigate(`/services/${s.id}`)}} className="premium-card p-6 text-left group"><div className="text-[10px] uppercase tracking-wider text-emerald-300">{s.category}</div><h3 className="text-xl font-bold mt-4 group-hover:text-emerald-300 transition-colors">{s.title}</h3><p className="text-sm text-slate-400 mt-3 leading-6">{s.shortDesc}</p><div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-300">Explore service <ArrowRight className="w-4 h-4"/></div></a>)}</div>
      <button onClick={()=>navigate('/services')} className="mt-8 text-sm font-bold text-emerald-300 flex items-center gap-2">View all services <ArrowRight className="w-4 h-4"/></button>
    </div></section>
    <HowWeHelp onStartProject={startProject}/>
    <section className="py-24 bg-[#0a1322]"><div className="max-w-7xl mx-auto px-4"><div className="flex items-end justify-between gap-6 mb-10"><div><div className="text-emerald-300 text-xs uppercase tracking-[.2em] font-bold">Selected products</div><h2 className="text-3xl sm:text-5xl font-extrabold mt-4">Proof, not inflated promises.</h2></div><button onClick={openWork} className="hidden sm:flex text-sm font-bold text-emerald-300 items-center gap-2">All work <ArrowRight className="w-4 h-4"/></button></div>
      <div className="grid md:grid-cols-2 gap-5">{CASE_STUDIES.map(c=><button key={c.id} onClick={()=>navigateStudy(c)} className="premium-card overflow-hidden text-left group"><img src={c.imageSrc} alt={`${c.name} project`} className="w-full h-56 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"/><div className="p-6"><div className="text-[10px] text-emerald-300 uppercase tracking-wider">{c.category}</div><h3 className="text-xl font-bold mt-3">{c.name}</h3><p className="text-sm text-slate-400 mt-2 line-clamp-2">{c.tagline}</p><div className="mt-5 text-xs font-bold text-emerald-300">View case study →</div></div></button>)}</div>
    </div></section>
    <WhyKorvenzaTech/>
    <LeadershipTestimonialsSection/>
    <section className="py-24 bg-[#0B0C10]"><div className="max-w-5xl mx-auto px-4 text-center"><div className="inline-flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider font-bold"><Sparkles className="w-4 h-4"/> Ready when you are</div><h2 className="text-4xl sm:text-6xl font-extrabold mt-5 tracking-tight">Have something ambitious in mind?</h2><p className="text-slate-400 text-lg mt-5 max-w-2xl mx-auto">You explain the business goal. We’ll help turn it into a clear product, roadmap and technical plan.</p><button onClick={startProject} className="mt-8 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-sm font-bold">Start a Project →</button></div></section>
  </>;

  return <div className="app-shell min-h-screen bg-[#08090B] text-[#f8fafc] selection:bg-emerald-400/30">
    <SeoManager path={path}/>
    <SiteNavbar path={path} navigate={navigate} onSelectService={navigateService} theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}/>
    <main>{content}</main>
    <Footer onNavigateSection={(id)=>{ if(id==='insights') navigate('/insights'); else if(id==='work') navigate('/work'); else if(id==='about') navigate('/about'); else if(id==='faq') navigate('/about'); else navigate('/'); }} onOpenCareers={()=>navigate('/careers')} onOpenContact={()=>navigate('/contact')} onOpenLegal={setLegal} onSelectService={navigateService}/>
    <LegalModal type={legal} onClose={()=>setLegal(null)}/>
    <KorvenzaAIChat/>
  </div>;
}
export default App;
