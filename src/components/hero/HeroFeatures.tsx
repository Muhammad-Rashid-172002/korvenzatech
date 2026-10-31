import React from 'react';
import { Cpu, Infinity as InfinityIcon, ShieldCheck, Zap, type LucideIcon } from 'lucide-react';

const FEATURES: readonly [LucideIcon, string, string][] = [
  [Cpu, 'Cutting-Edge Technology', 'AI, cloud & modern frameworks'],
  [Zap, 'Lightning Fast Performance', 'Built for speed on every device'],
  [ShieldCheck, 'Enterprise-Grade Security', 'Security-first engineering'],
  [InfinityIcon, 'Endless Possibilities', 'From first MVP to scale'],
];

export const HeroFeatures: React.FC = () => (
  <ul className="kzh-features" aria-label="What we bring">
    {FEATURES.map(([Icon, title, copy]) => (
      <li key={title}>
        <span className="kzh-feature-ico"><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <span><b>{title}</b><span>{copy}</span></span>
      </li>
    ))}
  </ul>
);
