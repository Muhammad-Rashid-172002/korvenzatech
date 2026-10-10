import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { ArrowRight, Mail, MapPin, MessageCircle, MessageSquare, Video } from 'lucide-react';
import { SiteNavbar } from './components/SiteNavbar';
import { PageHero } from './components/PageHero';
import { Hero } from './components/Hero';
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
import { KorvenzaAIChat } from './components/KorvenzaAIChat';
import { ServiceLandingPage } from './components/ServiceLandingPage';
import { CaseStudyLandingPage } from './components/CaseStudyLandingPage';
import { SolutionBlueprints } from './components/SolutionBlueprints';
import { SeoManager } from './components/SeoManager';
import { ARTICLES } from './data/articles';
import { LEGAL } from './data/legal';
import { ClosingCTA, HomeProjects, HomeServices, NotFound } from './components/home/HomeSections';
import { SERVICES_DATA, CASE_STUDIES } from './data/companyData';
import { RouterProvider } from './lib/router';
import { useRevealObserver } from './lib/motion';
import { SectionHeader } from './components/ui';
import { ExperienceGate } from './components/three/ExperienceGate';
import { scrollToElement, scrollToTop } from './lib/scrollStore';

// Long-form pages load as their own chunks (their text would otherwise weigh on every page).
const ArticlePage = lazy(() => import('./components/content/ArticlePage'));
const LegalPage = lazy(() => import('./components/content/LegalPage'));
const PageFallback = () => <div className="min-h-[100svh]" aria-hidden="true" />;

const STATIC_ROUTES = ['/', '/services', '/work', '/industries', '/about', '/insights', '/careers', '/contact', '/start-project', ...LEGAL.map((d) => `/${d.slug}`)];

export const normalizePath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';

export function isKnownRoute(path: string) {
  return STATIC_ROUTES.includes(path)
    || SERVICES_DATA.some((s) => `/services/${s.id}` === path)
    || CASE_STUDIES.some((s) => `/work/${s.id}` === path)
    || ARTICLES.some((a) => `/insights/${a.slug}` === path);
}

function App({ initialPath }: { initialPath?: string }) {
  const [path, setPath] = useState(() => normalizePath(initialPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/')));
  // Theme is applied to <html> by an inline script before paint; markup never depends on it,
  // so server and client render identically.
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem('korvenza-theme', theme); } catch { /* storage unavailable */ }
  }, [theme]);

  const scrollToHash = (hash: string, smooth = true) => {
    if (!hash) return false;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) { scrollToElement(el, smooth); return true; }
    return false;
  };
  const scrollTop = () => scrollToTop(true);

  const navigate = useCallback((to: string) => {
    const [rawPath, hashPart] = to.split('#');
    const nextPath = normalizePath(rawPath || path);
    const hash = hashPart ? `#${hashPart}` : '';
    if (nextPath === path) {
      if (hash) { window.history.pushState({}, '', nextPath + hash); scrollToHash(hash); }
      else scrollToTop(false);
      return;
    }
    window.history.pushState({}, '', nextPath + hash);
    setPath(nextPath);
    scrollTop();
    if (hash) requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(hash)));
  }, [path]);

  useEffect(() => {
    const pop = () => { setPath(normalizePath(window.location.pathname)); if (!scrollToHash(window.location.hash, false)) scrollTop(); };
    window.addEventListener('popstate', pop);
    if (window.location.hash) requestAnimationFrame(() => scrollToHash(window.location.hash, false));
    return () => window.removeEventListener('popstate', pop);
  }, []);

  useRevealObserver(path);

  const scroll = (id: string) => { const el = document.getElementById(id); if (el) scrollToElement(el, true); };
  const startProject = () => navigate('/start-project');
  const openWork = () => navigate('/work');
  const navigateService = (service: { id: string }) => navigate(`/services/${service.id}`);

  let content: React.ReactNode;
  const serviceRoute = path.startsWith('/services/') ? SERVICES_DATA.find((s) => `/services/${s.id}` === path) : undefined;
  const studyRoute = path.startsWith('/work/') ? CASE_STUDIES.find((s) => `/work/${s.id}` === path) : undefined;
  const articleRoute = path.startsWith('/insights/') ? ARTICLES.find((a) => `/insights/${a.slug}` === path) : undefined;
  const legalRoute = LEGAL.find((d) => `/${d.slug}` === path);

  if (serviceRoute) content = <ServiceLandingPage service={serviceRoute} onStartProject={startProject} onNavigateServices={() => navigate('/services')} />;
  else if (studyRoute) content = <CaseStudyLandingPage study={studyRoute} onBack={() => navigate('/work')} onStartProject={startProject} />;
  else if (articleRoute) content = <Suspense fallback={<PageFallback />}><ArticlePage article={articleRoute} /></Suspense>;
  else if (legalRoute) content = <Suspense fallback={<PageFallback />}><LegalPage doc={legalRoute} /></Suspense>;
  else if (path === '/services') content = <>
    <PageHero eyebrow="Capabilities" title={<>Technology services built to <span className="gradient-text-cyan">solve real business problems.</span></>} description="From AI systems and APIs to mobile apps, websites, custom software and cloud delivery — choose one service or let us design the complete solution." primary="Discuss your project" onPrimary={startProject} secondary="See our work" onSecondary={openWork} />
    <ServicesOverview onNavigateService={(id) => navigate(`/services/${id}`)} onStartProject={startProject} />
    <AIFeatureSection /><APIFeatureSection /><InteractiveSolutionBuilder onStartProject={startProject} />
  </>;
  else if (path === '/work') content = <>
    <PageHero eyebrow="Selected Work" title={<>Real products, clear architecture, <span className="gradient-text-cyan">credible outcomes.</span></>} description="Explore selected products across education technology and on-demand marketplaces, then review solution blueprints for AI, SaaS, APIs, cloud, design and growth." primary="Start a similar project" onPrimary={startProject} secondary="Explore services" onSecondary={() => navigate('/services')} />
    <FeaturedWork onNavigateCaseStudy={(id) => navigate(`/work/${id}`)} onStartProject={startProject} />
    <SolutionBlueprints onStartProject={startProject} />
  </>;
  else if (path === '/industries') content = <>
    <PageHero eyebrow="Industry Solutions" title={<>Technology shaped around <span className="gradient-text-cyan">how your business works.</span></>} description="Different industries need different workflows, security, customer experiences and integrations. We translate those differences into software that feels made for your operation." primary="Discuss your industry" onPrimary={startProject} />
    <IndustriesSection onStartProject={startProject} /><TechStackSection />
  </>;
  else if (path === '/about') content = <>
    <PageHero eyebrow="About KorvenzaTech" title={<>Complex technology. <span className="gradient-text-cyan">Clear business value.</span></>} description="KorvenzaTech is built around a simple idea: clients should not need to understand technical complexity to benefit from excellent software engineering." primary="Work with us" onPrimary={startProject} secondary="Explore our process" onSecondary={() => scroll('process')} />
    <AboutSection /><LeadershipTestimonialsSection /><WhyKorvenzaTech /><ProcessTimeline onStartProject={startProject} /><FAQSection />
  </>;
  else if (path === '/insights') content = <>
    <PageHero eyebrow="Knowledge Hub" title={<>Practical thinking for <span className="gradient-text-cyan">modern digital products.</span></>} description="Clear, useful articles on AI, app development, software architecture, APIs, cloud systems and digital product strategy." />
    <InsightsSection /><FAQSection />
  </>;
  else if (path === '/careers') content = <>
    <PageHero eyebrow="Careers" title={<>Build technology that <span className="gradient-text-cyan">people actually use.</span></>} description="We value curiosity, ownership, clear communication and engineers who care about the product — not only the code." primary="Send your profile" onPrimary={() => navigate('/contact')} />
    <section className="kz-section">
      <div className="kz-container">
        <SectionHeader eyebrow="Disciplines" title="Where great people fit in." lead="Open roles are published here only when they are active. Strong portfolios and thoughtful applications are always welcome." />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {['Engineering', 'Design & Product', 'Growth & Operations'].map((x, i) => (
            <div key={x} className="premium-card kz-reveal p-8" style={{ '--d': i } as React.CSSProperties}>
              <div className="kz-meta !text-[var(--kz-accent-text)]">0{i + 1}</div>
              <h3 className="kz-h3 mt-5">{x}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--kz-muted)]">We welcome strong portfolios and thoughtful applications. Open roles are published here only when active.</p>
              <div className="mt-6 text-xs text-[var(--kz-muted)]">No fabricated vacancies • Remote-friendly collaboration</div>
            </div>
          ))}
        </div>
        <div className="kz-reveal mt-10 flex flex-col items-start justify-between gap-6 rounded-[var(--kz-radius-xl)] border border-emerald-500/20 bg-[var(--kz-surface)] p-8 md:flex-row md:items-center sm:p-10">
          <div><h3 className="text-2xl font-bold text-[var(--kz-text)]">Don’t see your role?</h3><p className="mt-2 text-[var(--kz-muted)]">Send your portfolio, GitHub and area of expertise for future opportunities.</p></div>
          <button type="button" onClick={() => navigate('/contact')} className="kz-btn kz-btn-primary">Introduce yourself <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  </>;
  else if (path === '/contact') content = <>
    <PageHero eyebrow="Contact" title={<>Choose the fastest way to <span className="gradient-text-cyan">reach the right team.</span></>} description="Project enquiry, partnership, general question or preferred WhatsApp/video-call follow-up — your submission is routed to the appropriate KorvenzaTech inbox." primary="Start a project" onPrimary={startProject} />
    <section className="kz-section !pb-0">
      <div className="kz-container grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { href: 'mailto:info@korvenzatech.com', icon: Mail, title: 'General enquiries', text: 'info@korvenzatech.com' },
          { href: 'mailto:sales@korvenzatech.com', icon: MessageSquare, title: 'Project & sales', text: 'sales@korvenzatech.com' },
          { href: 'https://wa.me/923701691701', icon: MessageCircle, title: 'WhatsApp', text: '+92 370 1691701', external: true },
        ].map(({ href, icon: Icon, title, text, external }, i) => (
          <a key={title} href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className="premium-card kz-reveal block p-6" style={{ '--d': i } as React.CSSProperties}>
            <span className="kz-icon-orb !h-10 !w-10"><Icon className="h-5 w-5" aria-hidden="true" /></span>
            <h2 className="mt-5 text-lg font-bold text-[var(--kz-text)]">{title}</h2>
            <p className="mt-1.5 break-words text-sm text-[var(--kz-muted)]">{text}</p>
          </a>
        ))}
        <button type="button" onClick={startProject} className="premium-card kz-reveal p-6 text-left" style={{ '--d': 3 } as React.CSSProperties}>
          <span className="kz-icon-orb !h-10 !w-10"><Video className="h-5 w-5" aria-hidden="true" /></span>
          <h2 className="mt-5 text-lg font-bold text-[var(--kz-text)]">Video call</h2>
          <p className="mt-1.5 text-sm text-[var(--kz-muted)]">Select “Video Call” in the brief and we’ll coordinate a time.</p>
        </button>
        <div className="premium-card kz-reveal p-6" style={{ '--d': 4 } as React.CSSProperties}>
          <span className="kz-icon-orb !h-10 !w-10"><MapPin className="h-5 w-5" aria-hidden="true" /></span>
          <h2 className="mt-5 text-lg font-bold text-[var(--kz-text)]">Global delivery</h2>
          <p className="mt-1.5 text-sm text-[var(--kz-muted)]">Pakistan • Serving clients worldwide</p>
        </div>
      </div>
    </section>
    <StartProjectSection defaultInquiryType="General Inquiry" />
  </>;
  else if (path === '/start-project') content = <>
    <PageHero eyebrow="Project Brief" title={<>Your idea doesn’t need to be technical. <span className="gradient-text-cyan">Just tell us the goal.</span></>} description="Share what you want to build, improve or automate. We’ll route the brief to the right team and recommend the most practical next step." />
    <StartProjectSection />
  </>;
  else if (path === '/') content = <>
    <Hero onStartProject={startProject} onExploreWork={openWork} onOpenSolutionWizard={() => navigate('/services')} />
    <HomeServices />
    <HomeProjects />
    <HowWeHelp onStartProject={startProject} />
    <TechStackSection />
    <ProcessTimeline onStartProject={startProject} />
    <LeadershipTestimonialsSection />
    <FAQSection />
    <ClosingCTA />
  </>;
  else content = <NotFound />;

  return (
    <RouterProvider value={{ path, navigate }}>
      <div className="app-shell min-h-screen">
        <a href="#main" className="kz-skip-link">Skip to content</a>
        <SeoManager path={path} />
        <SiteNavbar path={path} navigate={navigate} onSelectService={navigateService} theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
        <main id="main" tabIndex={-1} className="outline-none">{content}</main>
        <Footer onNavigateSection={() => {}} onOpenCareers={() => navigate('/careers')} onOpenContact={() => navigate('/contact')} onSelectService={navigateService} />
        <KorvenzaAIChat />
        <ExperienceGate path={path} />
      </div>
    </RouterProvider>
  );
}

export default App;
