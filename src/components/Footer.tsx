import React from 'react';
import { Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { ServiceItem } from '../types';
import { SERVICES_DATA } from '../data/companyData';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenCareers: () => void;
  onOpenContact: () => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'cookies') => void;
  onSelectService: (service: ServiceItem) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenCareers,
  onOpenContact,
  onOpenLegal,
  onSelectService,
}) => {
  return (
    <footer className="bg-[#0B1120] border-t border-slate-800 text-slate-400 text-xs relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Footer Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-500 p-[1px]">
                <div className="w-full h-full bg-[#17181F] rounded-[7px] flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4v16" />
                    <path d="M18 4L8 12l10 8" />
                  </svg>
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Korvenza<span className="text-indigo-400">Tech</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Technology Built Around Your Business. We design, build, automate, and scale digital products for modern companies worldwide.
            </p>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Global Digital Operations</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enterprise Grade Security</span>
              </span>
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-3 text-left">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateSection('about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('work')} className="hover:text-white transition-colors">
                  Featured Work
                </button>
              </li>
              <li>
                <button onClick={onOpenCareers} className="hover:text-white transition-colors">
                  Careers & Roles
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3 text-left">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">
              Services
            </h4>
            <ul className="space-y-2">
              {SERVICES_DATA.slice(0, 5).map((srv) => (
                <li key={srv.id}>
                  <button onClick={() => onSelectService(srv)} className="hover:text-white transition-colors">
                    {srv.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Resources & Legal */}
          <div className="space-y-3 text-left">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">
              Resources & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateSection('insights')} className="hover:text-white transition-colors">
                  Insights & Articles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('faq')} className="hover:text-white transition-colors">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('cookies')} className="hover:text-white transition-colors">
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Row */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-mono text-[11px]">
          <div>
            © {new Date().getFullYear()} KorvenzaTech. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-indigo-400 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">X (Twitter)</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">YouTube</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
