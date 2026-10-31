import React from 'react';

/** Deterministic particle field (same markup on server and client → no hydration mismatch). */
const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    left: `${(4 + r(1) * 92).toFixed(1)}%`,
    top: `${(18 + r(2) * 70).toFixed(1)}%`,
    size: 1.5 + Math.round(r(3) * 25) / 10,
    dur: `${(9 + r(4) * 9).toFixed(1)}s`,
    delay: `${(-r(5) * 14).toFixed(1)}s`,
  };
});

/** Layered light behind the hero: aurora, light beams, perspective floor grid, particles. */
export const HeroBackdrop: React.FC = () => (
  <div className="kzh-backdrop" aria-hidden="true">
    <div className="kzh-aurora kzh-aurora--a" />
    <div className="kzh-aurora kzh-aurora--b" />
    <div className="kzh-beams">
      <span style={{ '--r': '-16deg', '--b': '0s' } as React.CSSProperties} />
      <span style={{ '--r': '0deg', '--b': '-3s' } as React.CSSProperties} />
      <span style={{ '--r': '15deg', '--b': '-6s' } as React.CSSProperties} />
    </div>
    <div className="kzh-floor"><div className="kzh-floor-grid" /></div>
    <div className="kzh-particles">
      {PARTICLES.map((p, i) => (
        <i key={i} style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDuration: p.dur, animationDelay: p.delay }} />
      ))}
    </div>
  </div>
);

/** Energy trails from the platform out to the devices (desktop stage only). Drawn in stage space (1200 × 560). */
export const HeroTrails: React.FC = () => (
  <svg className="kzh-trails" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="kzh-trail-l" x1="1" x2="0" y1="0" y2="0">
        <stop offset="0" stopColor="#19C784" stopOpacity=".7" />
        <stop offset="1" stopColor="#19C784" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="kzh-trail-r" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#19C784" stopOpacity=".7" />
        <stop offset="1" stopColor="#19C784" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path className="kzh-trail-base" d="M520 470 C 430 500, 360 470, 300 400" stroke="url(#kzh-trail-l)" />
    <path className="kzh-trail-base" d="M680 470 C 770 500, 840 470, 900 390" stroke="url(#kzh-trail-r)" />
    <path className="kzh-trail-base" d="M500 440 C 400 420, 330 330, 330 250" stroke="url(#kzh-trail-l)" />
    <path className="kzh-trail-base" d="M700 440 C 800 420, 870 320, 870 240" stroke="url(#kzh-trail-r)" />
    <path className="kzh-trail-pulse" pathLength={100} d="M520 470 C 430 500, 360 470, 300 400" />
    <path className="kzh-trail-pulse kzh-trail-pulse--late" pathLength={100} d="M680 470 C 770 500, 840 470, 900 390" />
    <path className="kzh-trail-pulse kzh-trail-pulse--slow" pathLength={100} d="M500 440 C 400 420, 330 330, 330 250" />
    <path className="kzh-trail-pulse kzh-trail-pulse--slow kzh-trail-pulse--late" pathLength={100} d="M700 440 C 800 420, 870 320, 870 240" />
  </svg>
);
