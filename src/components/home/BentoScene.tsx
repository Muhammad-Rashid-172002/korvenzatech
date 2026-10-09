import React from 'react';

/**
 * "Living Bento" micro-scenes: tiny decorative SVG diagrams, one per service
 * card. Pure SVG + CSS keyframes (see .kz-bento-scene in index.css): they only
 * animate while on screen (lib/interactions.ts toggles .is-live) and stay
 * static for reduced motion / no-JS. aria-hidden — the card text says it all.
 */
const scenes: Record<string, React.ReactNode> = {
  // Packets travelling between two endpoints.
  'api-development': (
    <>
      <path className="kz-bs-line" d="M14 22 C46 4, 74 40, 106 22 S152 8, 166 22" />
      <circle className="kz-bs-node" cx="14" cy="22" r="5" />
      <circle className="kz-bs-node" cx="166" cy="22" r="5" />
      <circle className="kz-bs-packet" r="2.6" style={{ offsetPath: "path('M14 22 C46 4, 74 40, 106 22 S152 8, 166 22')" } as React.CSSProperties} />
      <circle className="kz-bs-packet kz-bs-d2" r="2.6" style={{ offsetPath: "path('M166 22 S152 8, 106 22 C74 40, 46 4, 14 22')" } as React.CSSProperties} />
    </>
  ),
  // A phone whose screen cards scroll up.
  'mobile-app-development': (
    <>
      <rect className="kz-bs-frame" x="76" y="2" width="28" height="40" rx="6" />
      <clipPath id="kz-bs-phone"><rect x="79" y="6" width="22" height="32" rx="3" /></clipPath>
      <g clipPath="url(#kz-bs-phone)">
        <g className="kz-bs-scroll">
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} className={i % 3 === 0 ? 'kz-bs-fill' : 'kz-bs-soft'} x="81" y={8 + i * 9} width="18" height="6" rx="2" />)}
        </g>
      </g>
      <rect className="kz-bs-soft kz-bs-float" x="40" y="12" width="26" height="8" rx="4" />
      <rect className="kz-bs-soft kz-bs-float kz-bs-d2" x="114" y="24" width="26" height="8" rx="4" />
    </>
  ),
  // A browser window assembling its layout.
  'web-development': (
    <>
      <rect className="kz-bs-frame" x="40" y="3" width="100" height="38" rx="5" />
      <path className="kz-bs-line" d="M40 11h100" />
      <circle className="kz-bs-fill" cx="46" cy="7" r="1.4" /><circle className="kz-bs-soft" cx="51" cy="7" r="1.4" /><circle className="kz-bs-soft" cx="56" cy="7" r="1.4" />
      <rect className="kz-bs-fill kz-bs-build" x="46" y="15" width="40" height="8" rx="2" />
      <rect className="kz-bs-soft kz-bs-build kz-bs-d1" x="46" y="26" width="58" height="4" rx="2" />
      <rect className="kz-bs-soft kz-bs-build kz-bs-d2" x="46" y="33" width="44" height="4" rx="2" />
      <rect className="kz-bs-soft kz-bs-build kz-bs-d3" x="110" y="15" width="24" height="22" rx="3" />
    </>
  ),
  // Lines of code being typed, with a blinking caret.
  'custom-software': (
    <>
      <path className="kz-bs-chev" d="M44 14 l-8 8 8 8 M136 14 l8 8-8 8" />
      <rect className="kz-bs-fill kz-bs-type" x="54" y="10" width="48" height="4" rx="2" />
      <rect className="kz-bs-soft kz-bs-type kz-bs-d1" x="62" y="20" width="64" height="4" rx="2" />
      <rect className="kz-bs-soft kz-bs-type kz-bs-d2" x="62" y="30" width="36" height="4" rx="2" />
      <rect className="kz-bs-fill kz-bs-caret" x="101" y="29" width="2" height="6" rx="1" />
    </>
  ),
  // Stacked platform layers breathing apart.
  'saas-development': (
    <>
      {[0, 1, 2].map((i) => (
        <path key={i} className={`kz-bs-layer kz-bs-l${i} ${i === 0 ? 'kz-bs-fillstroke' : ''}`} d="M90 8 l32 10 -32 10 -32 -10z" />
      ))}
    </>
  ),
  // Cloud with data syncing up and down.
  'cloud-solutions': (
    <>
      <path className="kz-bs-frame" d="M70 30 a10 10 0 0 1 2-19.8 a14 14 0 0 1 26.5-2.5 a11 11 0 0 1 11.5 22.3z" />
      <path className="kz-bs-line" d="M60 40 v-6 M90 42 v-8 M120 40 v-6" />
      <circle className="kz-bs-packet kz-bs-up" cx="60" cy="40" r="2" />
      <circle className="kz-bs-packet kz-bs-down kz-bs-d1" cx="90" cy="34" r="2" />
      <circle className="kz-bs-packet kz-bs-up kz-bs-d2" cx="120" cy="40" r="2" />
    </>
  ),
};

export function BentoScene({ id }: { id: string }) {
  const scene = scenes[id];
  if (!scene) return null;
  return (
    <svg className="kz-bento-scene" viewBox="0 0 180 44" aria-hidden="true" focusable="false">
      {scene}
    </svg>
  );
}
