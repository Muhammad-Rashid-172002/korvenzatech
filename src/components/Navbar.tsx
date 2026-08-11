import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { SERVICES_DATA } from '../data/companyData';
import { ServiceItem } from '../types';

interface NavbarProps {
  onOpenProjectBrief: () => void;
  onOpenContact: () => void;
  onOpenCareers: () => void;
  onSelectService: (service: ServiceItem) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProjectBrief,
  onOpenContact,
  onOpenCareers,
  onSelectService,
  onNavigateSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setIsMegaOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090B]/90 backdrop-blur-xl border-b border-slate-800 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
            <img src="/korvenza-logo.png" alt="KorvenzaTech logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.35)]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
              Korvenza<span className="text-indigo-400 font-extrabold">Tech</span>
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono font-medium -mt-1">
              Global Tech
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-full px-5 py-1.5 shadow-inner">
          <button
            onClick={() => handleNavClick('hero')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-slate-700/50"
          >
            Home
          </button>

          {/* Services with MegaMenu dropdown trigger */}
          <div
            className="relative"
            onMouseEnter={() => setIsMegaOpen(true)}
          >
            <button
              onClick={() => handleNavClick('services')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-slate-700/50 flex items-center gap-1"
            >
              <span>Services</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaOpen ? 'rotate-180 text-indigo-400' : ''}`} />
            </button>

            {isMegaOpen && (
              <MegaMenu
                services={SERVICES_DATA}
                onSelectService={onSelectService}
                onClose={() => setIsMegaOpen(false)}
              />
            )}
          </div>

          <button
            onClick={() => handleNavClick('how-we-help')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-slate-700/50"
          >
            Solutions
          </button>

          <button
            onClick={() => handleNavClick('work')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-slate-700/50"
          >
            Work
          </button>

          <button
            onClick={() => handleNavClick('industries')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-slate-700/50"
          >
            Industries
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-slate-700/50"
          >
            About
          </button>

          <button
            onClick={() => handleNavClick('insights')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-slate-700/50"
          >
            Insights
          </button>

          <button
            onClick={onOpenCareers}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-slate-700/50"
          >
            Careers
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenContact}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            Contact
          </button>

          <button
            onClick={onOpenProjectBrief}
            className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-xs transition-all duration-300 focus:outline-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500 rounded-xl group-hover:opacity-100 transition-opacity" />
            <span className="relative block px-4 py-2 bg-[#08090B] hover:bg-transparent rounded-[11px] text-white transition-all duration-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:animate-spin" />
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#080b12] border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-left py-2 hover:text-violet-400 border-b border-white/5"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="text-left py-2 hover:text-violet-400 border-b border-white/5"
            >
              Services & Capabilities
            </button>
            <button
              onClick={() => handleNavClick('how-we-help')}
              className="text-left py-2 hover:text-violet-400 border-b border-white/5"
            >
              Solutions for Your Business
            </button>
            <button
              onClick={() => handleNavClick('work')}
              className="text-left py-2 hover:text-violet-400 border-b border-white/5"
            >
              Featured Case Studies
            </button>
            <button
              onClick={() => handleNavClick('industries')}
              className="text-left py-2 hover:text-violet-400 border-b border-white/5"
            >
              Industries Served
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2 hover:text-violet-400 border-b border-white/5"
            >
              About KorvenzaTech
            </button>
            <button
              onClick={() => handleNavClick('insights')}
              className="text-left py-2 hover:text-violet-400 border-b border-white/5"
            >
              Articles & Insights
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCareers();
              }}
              className="text-left py-2 hover:text-violet-400 border-b border-white/5"
            >
              Careers & Opportunities
            </button>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-300 border border-white/10 rounded-xl hover:bg-white/5"
            >
              Contact Us
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenProjectBrief();
              }}
              className="w-full py-3 text-center text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Your Project</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
