import React from 'react';
import { ArrowRight, Globe, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import { ServiceItem } from '../types';
import { SERVICES_DATA } from '../data/companyData';
import { Link } from '../lib/router';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenCareers: () => void;
  onOpenContact: () => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'cookies') => void;
  onSelectService: (service: ServiceItem) => void;
}

const linkCls = 'inline-block py-1 text-[13.5px] text-[#8EA098] hover:text-white';

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="kz-footer kz-cinematic relative z-10 text-[#8EA098]">
      <div className="kz-container pt-20 pb-10">
        <div className="grid gap-12 border-b border-white/[0.07] pb-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="KorvenzaTech home">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#0A1612]">
                <img src="/media/brand/logo-64.webp" width={34} height={34} alt="" className="h-[34px] w-[34px] object-contain" loading="lazy" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">Korvenza<span className="text-emerald-400">Tech</span></span>
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-7">
              Technology built around your business. We design, build, automate and scale digital products for modern companies worldwide.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
              <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />Pakistan • Global delivery</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />Security-conscious engineering</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h2 className="kz-meta !text-[#C3D1CA]">Company</h2>
              <ul className="mt-4 space-y-1.5">
                <li><Link to="/about" className={linkCls}>About us</Link></li>
                <li><Link to="/work" className={linkCls}>Featured work</Link></li>
                <li><Link to="/industries" className={linkCls}>Industries</Link></li>
                <li><Link to="/careers" className={linkCls}>Careers</Link></li>
                <li><Link to="/contact" className={linkCls}>Contact</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="kz-meta !text-[#C3D1CA]">Services</h2>
              <ul className="mt-4 space-y-1.5">
                {SERVICES_DATA.slice(0, 6).map((srv) => (
                  <li key={srv.id}><Link to={`/services/${srv.id}`} className={linkCls}>{srv.title}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="kz-meta !text-[#C3D1CA]">Resources</h2>
              <ul className="mt-4 space-y-1.5">
                <li><Link to="/insights" className={linkCls}>Insights</Link></li>
                <li><Link to="/about#faq" className={linkCls}>FAQs</Link></li>
                <li><button type="button" onClick={() => onOpenLegal('privacy')} className={linkCls}>Privacy policy</button></li>
                <li><button type="button" onClick={() => onOpenLegal('terms')} className={linkCls}>Terms of service</button></li>
                <li><button type="button" onClick={() => onOpenLegal('cookies')} className={linkCls}>Cookie preferences</button></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="kz-meta !text-[#C3D1CA]">Get in touch</h2>
            <ul className="mt-4 space-y-1 text-[13.5px]">
              <li><a href="mailto:info@korvenzatech.com" className="inline-flex min-h-[32px] items-center gap-2 hover:text-white"><Mail className="h-4 w-4 text-emerald-400" aria-hidden="true" />info@korvenzatech.com</a></li>
              <li><a href="mailto:sales@korvenzatech.com" className="inline-flex min-h-[32px] items-center gap-2 hover:text-white"><Mail className="h-4 w-4 text-emerald-400" aria-hidden="true" />sales@korvenzatech.com</a></li>
              <li><a href="https://wa.me/923701691701" target="_blank" rel="noreferrer" className="inline-flex min-h-[32px] items-center gap-2 hover:text-white"><MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />+92 370 1691701</a></li>
            </ul>
            <Link to="/start-project" className="kz-btn kz-btn-primary mt-7 !w-auto">Start a project <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[12px] sm:flex-row">
          <p>© {new Date().getFullYear()} KorvenzaTech. All rights reserved.</p>
          <a href="https://korvenzatech.com" className="inline-block py-1 font-mono hover:text-white">korvenzatech.com</a>
        </div>
      </div>
    </footer>
  );
};
