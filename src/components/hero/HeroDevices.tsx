import React from 'react';

/** Glass phone shell: bezel, island, screen and a moving specular reflection. 210 × 430 design size. */
export const PhoneFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`kzh-phone ${className}`}>
    <div className="kzh-phone-screen">
      <span className="kzh-phone-island" />
      {children}
    </div>
    <span className="kzh-phone-glare" />
  </div>
);

/** "FitMind AI" — an illustrative concept screen (no real product, all values are demo data). */
export const FitMindScreen: React.FC = () => (
  <div className="kzh-app kzh-fit">
    <div className="kzh-app-bar">
      <span className="kzh-app-name"><i className="kzh-dot" />FitMind AI</span>
      <span className="kzh-tag">Concept</span>
    </div>
    <p className="kzh-app-kicker">Today · demo</p>
    <div className="kzh-fit-ring">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" className="kzh-fit-track" />
        <circle cx="60" cy="60" r="50" className="kzh-fit-arc" pathLength={100} />
        <circle cx="60" cy="60" r="38" className="kzh-fit-track kzh-fit-track--in" />
        <circle cx="60" cy="60" r="38" className="kzh-fit-arc kzh-fit-arc--in" pathLength={100} />
      </svg>
      <div><b>72%</b><span>daily goal</span></div>
    </div>
    <div className="kzh-fit-stats">
      <div><span>Steps</span><b>8,412</b></div>
      <div><span>kcal</span><b>540</b></div>
      <div><span>BPM</span><b>76</b></div>
    </div>
    <div className="kzh-fit-coach">
      <span className="kzh-fit-coach-ico">AI</span>
      <p>Recovery looks good — try a 25-min tempo run.</p>
    </div>
    <div className="kzh-fit-bars">
      {[38, 62, 48, 80, 56, 92, 70].map((h, i) => <i key={i} style={{ '--h': `${h}%`, '--n': i } as React.CSSProperties} />)}
    </div>
  </div>
);

/** Navigation / live-location screen — stylised map, animated route, ETA sheet (demo data). */
export const NavScreen: React.FC = () => (
  <div className="kzh-app kzh-nav">
    <svg className="kzh-nav-map" viewBox="0 0 210 300" preserveAspectRatio="xMidYMid slice">
      <rect width="210" height="300" fill="#0A1A15" />
      <g className="kzh-nav-blocks">
        <rect x="12" y="20" width="56" height="44" rx="6" /><rect x="84" y="14" width="48" height="60" rx="6" /><rect x="148" y="26" width="50" height="40" rx="6" />
        <rect x="16" y="92" width="40" height="70" rx="6" /><rect x="74" y="98" width="62" height="40" rx="6" /><rect x="154" y="86" width="44" height="66" rx="6" />
        <rect x="10" y="184" width="58" height="46" rx="6" /><rect x="88" y="160" width="46" height="70" rx="6" /><rect x="150" y="176" width="48" height="52" rx="6" />
        <rect x="20" y="250" width="70" height="40" rx="6" /><rect x="110" y="250" width="86" height="40" rx="6" />
      </g>
      <path className="kzh-nav-park" d="M74 146 h62 v8 h-62z" />
      <g className="kzh-nav-roads">
        <path d="M0 80 H210 M0 172 H210 M0 240 H210 M70 0 V300 M142 0 V300" />
      </g>
      <path className="kzh-nav-route-bg" d="M40 268 V240 H142 V172 H70" />
      <path className="kzh-nav-route" pathLength={100} d="M40 268 V240 H142 V172 H70" />
      <circle className="kzh-nav-from" cx="40" cy="268" r="5" />
      <g className="kzh-nav-pin" transform="translate(70 172)">
        <circle r="13" className="kzh-nav-pulse" />
        <circle r="6" />
      </g>
    </svg>
    <div className="kzh-app-bar kzh-nav-top">
      <span className="kzh-app-name"><i className="kzh-dot" />Live tracking</span>
      <span className="kzh-tag">Demo</span>
    </div>
    <div className="kzh-nav-sheet">
      <div className="kzh-nav-eta"><b>8 min</b><span>2.4 km · arriving 10:42</span></div>
      <div className="kzh-nav-who"><i />Provider on the way<span className="kzh-nav-live">Live</span></div>
    </div>
  </div>
);
