import React from 'react';
import './showcase.css';

export type ShowcaseKind = 'mobile' | 'ai';

const PHONES = [
  { dir: 'caredesk', label: 'CareDesk' },
  { dir: 'ielts', label: 'IELTS AI Master' },
  { dir: 'fitmind', label: 'FitMind AI' },
  { dir: 'skilllink', label: 'SkillNova' },
];
const PANELS = ['chat', 'flow', 'doc'] as const;

/** Static network for the AI fallback (deterministic, viewBox 600×375). */
const NODES = Array.from({ length: 26 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 91.7 + n * 13.3) * 43758.5453) % 1 + 1) % 1;
  return [Math.round(20 + r(1) * 560), Math.round(20 + r(2) * 335)] as const;
});
const LINKS = NODES.flatMap((a, i) => NODES.map((b, j) => [i, j, (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2] as const)
  .filter(([, j, d]) => j > i && d < 120 ** 2).slice(0, 2).map(([x, y]) => [x, y] as const));

/**
 * Media area of a primary-service card (and of the primary service page hero).
 * With the WebGL layer (tier 1/2) the shared canvas renders the cinematic scene into the
 * `data-kz-view` track (scenes MobileShowcase / AiShowcase) and this DOM composition fades out
 * on the first 3D frame. Without WebGL (tier 0: no GPU, Save-Data, reduced motion) the DOM
 * composition — CSS 3D phones / glass panels over a static network — is the final visual.
 */
export function ServiceShowcase({ kind, label, className = '' }: { kind: ShowcaseKind; label: string; className?: string }) {
  return (
    <div className={`kz-showcase kz-showcase--${kind} ${className}`} data-ready="false" role="img" aria-label={label}>
      <div data-kz-view={`showcase-${kind}`} className="kz-view-track kz-showcase-track" aria-hidden="true" />
      <div className="kz-showcase-fallback" aria-hidden="true">
        {kind === 'mobile' ? (
          <div className="kz-sc-phones">
            {PHONES.map((p, i) => (
              <div key={p.dir} className={`kz-sc-phone kz-sc-phone--${i}`}>
                <img src={`/media/work/${p.dir}/screen-1-540.webp`} alt="" width={540} height={1169} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <svg className="kz-sc-net" viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice">
              {LINKS.map(([a, b]) => <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />)}
              {NODES.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 3.2 : 2} className={i % 5 === 0 ? 'kz-sc-pulse' : undefined} />)}
            </svg>
            <div className="kz-sc-panels">
              {PANELS.map((n, i) => (
                <img key={n} className={`kz-sc-panel kz-sc-panel--${i}`} src={`/media/ai/panel-${n}.webp`} alt="" width={1024} height={654} loading="lazy" decoding="async" />
              ))}
            </div>
          </>
        )}
      </div>
      <span className="kz-showcase-note">{kind === 'mobile' ? 'App screens: recreations & concept designs' : 'Illustrative demo interfaces'}</span>
    </div>
  );
}
