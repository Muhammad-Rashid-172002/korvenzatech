import React from 'react';
import { Bot, Network, Smartphone, Globe, Code, Layers, Cloud, Layout, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import { ServiceItem } from '../types';

interface MegaMenuProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
  onClose: () => void;
}

const CATEGORIES = [
  {
    name: 'AI & Automation',
    icon: Bot,
    items: [
      { id: 'ai-solutions', label: 'AI Solutions & Agents', desc: 'Automate tasks & deliver smart customer experiences' }
    ]
  },
  {
    name: 'Software & APIs',
    icon: Code,
    items: [
      { id: 'custom-software', label: 'Custom Software', desc: 'Tailor-made portals built for your exact operations' },
      { id: 'api-development', label: 'Custom APIs', desc: 'Connect apps, payment gateways, and databases' },
      { id: 'saas-development', label: 'SaaS Platforms', desc: 'Subscription products built for recurring scale' }
    ]
  },
  {
    name: 'Applications & Design',
    icon: Smartphone,
    items: [
      { id: 'mobile-app-development', label: 'Mobile Apps', desc: 'iOS & Android apps built with Flutter and Native' },
      { id: 'ui-ux-design', label: 'UI/UX Design', desc: 'Intuitive interface design and clickable prototypes' }
    ]
  },
  {
    name: 'Infrastructure & Growth',
    icon: Cloud,
    items: [
      { id: 'cloud-solutions', label: 'Cloud Solutions', desc: 'Google Cloud, AWS, & serverless setups' },
      { id: 'web-development', label: 'Websites & Portals', desc: 'Modern high-converting web applications' },
      { id: 'digital-marketing', label: 'Digital Growth', desc: 'Technical SEO and conversion optimization' }
    ]
  }
];

export const MegaMenu: React.FC<MegaMenuProps> = ({ services, onSelectService, onClose }) => {
  return (
    <div 
      className="absolute top-full left-0 w-full bg-[#080b12]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-8 px-6 transition-all duration-300 z-50 animate-in fade-in slide-in-from-top-2"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {CATEGORIES.map((cat, idx) => {
          const IconComp = cat.icon;
          return (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs tracking-wider uppercase pb-2 border-b border-white/5">
                <IconComp className="w-4 h-4 text-violet-400" />
                <span>{cat.name}</span>
              </div>
              <div className="space-y-3">
                {cat.items.map((item) => {
                  const serviceObj = services.find((s) => s.id === item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (serviceObj) onSelectService(serviceObj);
                        onClose();
                      }}
                      className="w-full text-left group p-2.5 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    >
                      <div className="flex items-center justify-between text-sm font-medium text-slate-200 group-hover:text-blue-400">
                        <span>{item.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-violet-400" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-normal">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Need help choosing? Talk directly with our senior technology architects.</span>
        </div>
        <span className="text-blue-400 font-medium hover:underline cursor-pointer" onClick={onClose}>
          Explore All Capabilities &rarr;
        </span>
      </div>
    </div>
  );
};
