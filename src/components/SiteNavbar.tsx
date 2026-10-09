import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { SERVICES_DATA } from '../data/companyData';
import { ServiceItem } from '../types';
import { Link } from '../lib/router';

type Props = {
  path: string;
  navigate: (path: string) => void;
  onSelectService: (service: ServiceItem) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

const nav: [string, string][] = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/work', 'Work'],
  ['/industries', 'Industries'],
  ['/about', 'About'],
  ['/insights', 'Insights'],
  ['/careers', 'Careers'],
];

const isActive = (path: string, to: string) => (to === '/' ? path === '/' : path === to || path.startsWith(`${to}/`));

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const SiteNavbar: React.FC<Props> = ({ path, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const hoverAt = useRef(0);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close menus on route change and on Escape.
  useEffect(() => { setMobile(false); setServicesOpen(false); }, [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMobile(false); setServicesOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Sliding active-page indicator.
  useIsoLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const measure = () => {
      const active = rail.querySelector<HTMLElement>('[data-active="true"]');
      if (!active) { setIndicator(null); return; }
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [path]);

  // On top of a hero the bar is transparent and uses dark (cinematic) tokens.
  const onHero = !scrolled && !mobile;

  return (
    <header className={`kz-nav ${scrolled || mobile ? 'is-scrolled' : ''} ${onHero ? 'kz-cinematic' : ''}`} style={onHero ? { background: 'transparent' } : undefined}>
      <div className="kz-container flex h-[72px] items-center justify-between gap-4 xl:h-[76px]">
        <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="KorvenzaTech home">
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-[var(--kz-border-strong)] bg-[#0A1612] shadow-[0_8px_24px_-12px_rgba(25,199,132,.6)]">
            <img src="/media/brand/logo-64.webp" width={32} height={32} alt="" className="h-8 w-8 object-contain transition-transform duration-500 group-hover:scale-110" />
          </span>
          <span className="leading-none">
            <span className="block text-[17px] font-extrabold tracking-tight text-[var(--kz-text)]">Korvenza<span className="text-emerald-400">Tech</span></span>
            <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[.28em] text-[var(--kz-muted)] min-[360px]:block">Build • Automate • Scale</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <div ref={railRef} className="kz-nav-rail">
            {indicator && <span className="kz-nav-indicator" style={{ left: indicator.left, width: indicator.width }} aria-hidden="true" />}
            {nav.map(([to, label]) => {
              const active = isActive(path, to);
              if (label !== 'Services') {
                return <Link key={to} to={to} data-active={active} className="kz-nav-link relative z-[1]" aria-current={active ? 'page' : undefined}>{label}</Link>;
              }
              return (
                <div key={to} className="relative z-[1]" onMouseEnter={() => { hoverAt.current = Date.now(); setServicesOpen(true); }} onMouseLeave={() => setServicesOpen(false)}>
                  <div className="flex items-center" data-active={active}>
                    <Link to={to} className="kz-nav-link pr-1" aria-current={active ? 'page' : undefined}>{label}</Link>
                    <button
                      type="button"
                      className="grid h-8 w-6 place-items-center rounded-full text-[var(--kz-muted)] hover:text-[var(--kz-text)]"
                      aria-expanded={servicesOpen}
                      aria-controls="services-menu"
                      aria-label="Show services"
                      onClick={() => setServicesOpen((v) => (Date.now() - hoverAt.current < 500 ? true : !v))}
                    >
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                  </div>
                  {servicesOpen && (
                    <div id="services-menu" className="kz-mega absolute left-1/2 top-full w-[640px] pt-3" style={{ transform: 'translateX(-50%)' }}>
                      <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-[var(--kz-border)] bg-[var(--kz-surface)] p-3 shadow-[var(--kz-shadow-lg)]">
                        {SERVICES_DATA.slice(0, 8).map((s) => (
                          <Link key={s.id} to={`/services/${s.id}`} className="group/item rounded-xl p-3 transition-colors hover:bg-[var(--kz-surface-2)]">
                            <span className="block text-sm font-semibold text-[var(--kz-text)] group-hover/item:text-[var(--kz-accent-text)]">{s.title}</span>
                            <span className="mt-1 block text-[12px] leading-5 text-[var(--kz-muted)] line-clamp-1">{s.shortDesc}</span>
                          </Link>
                        ))}
                        <Link to="/services" className="col-span-2 mt-1 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/[.07] px-4 py-3 text-[13px] font-semibold text-[var(--kz-accent-text)]">
                          View all services <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <button type="button" onClick={onToggleTheme} className="theme-toggle" aria-label="Toggle light and dark theme">
            <span className="theme-toggle-option" data-mode="light"><Sun className="h-3.5 w-3.5" aria-hidden="true" /></span>
            <span className="theme-toggle-option" data-mode="dark"><Moon className="h-3.5 w-3.5" aria-hidden="true" /></span>
          </button>
          <Link to="/contact" className="kz-nav-link">Contact</Link>
          <Link to="/start-project" data-kz-magnetic="" data-kz-ripple="" className="kz-btn kz-btn-primary !min-h-[42px] !px-4 !text-[13px]">
            Start a project <ArrowRight className="kz-btn-arrow h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <button type="button" onClick={onToggleTheme} className="mobile-theme-toggle" aria-label="Toggle light and dark theme">
            <Sun className="kz-theme-icon-dark h-4 w-4" aria-hidden="true" />
            <Moon className="kz-theme-icon-light h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setMobile((v) => !v)}
            className="mobile-theme-toggle"
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            aria-label={mobile ? 'Close menu' : 'Open menu'}
          >
            {mobile ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobile && (
        <nav id="mobile-menu" data-lenis-prevent aria-label="Mobile" className="kz-mobile-menu mx-4 mb-4 max-h-[calc(100dvh-90px)] overflow-y-auto rounded-2xl border border-[var(--kz-border)] bg-[var(--kz-surface)] p-3 shadow-[var(--kz-shadow-lg)] xl:hidden">
          <div className="grid gap-0.5">
            {nav.map(([to, label]) => {
              const active = isActive(path, to);
              return (
                <Link key={to} to={to} className={`flex min-h-[48px] items-center justify-between rounded-xl px-4 text-[15px] font-semibold ${active ? 'bg-[var(--kz-surface-2)] text-[var(--kz-text)]' : 'text-[var(--kz-text-2)]'}`}>
                  {label}{active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />}
                </Link>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--kz-border)] pt-3">
            <Link to="/contact" className="kz-btn kz-btn-secondary">Contact</Link>
            <Link to="/start-project" className="kz-btn kz-btn-primary">Start project</Link>
          </div>
        </nav>
      )}
    </header>
  );
};
