import React from 'react';
import { HERO_LOGO } from './heroConfig';

/**
 * The original KorvenzaTech K (background removed only — never redrawn) presented as a lit,
 * floating object: halo, glowing platform with its reflection, two orbit rings split into
 * back/front halves so they pass behind and in front of the mark, and a specular sheen that is
 * masked by the logo's own alpha. All motion is transform/opacity (see hero.css).
 */
export const HeroLogo: React.FC = () => (
  <div className="kzh-logo">
    <div className="kzh-logo-halo" aria-hidden="true" />
    <div className="kzh-platform" aria-hidden="true">
      <span className="kzh-platform-disc" />
      <span className="kzh-platform-ring kzh-platform-ring--1" />
      <span className="kzh-platform-ring kzh-platform-ring--2" />
    </div>
    <div className="kzh-orbit kzh-orbit--back" aria-hidden="true"><span className="kzh-orbit-ring kzh-orbit-ring--a" /><span className="kzh-orbit-ring kzh-orbit-ring--b" /></div>

    <div className="kzh-logo-float">
      <div className="kzh-logo-tilt">
        <div className="kzh-logo-spin">
          <img
            className="kzh-logo-img"
            src={HERO_LOGO.src}
            srcSet={HERO_LOGO.srcSet}
            sizes={HERO_LOGO.sizes}
            width={HERO_LOGO.width}
            height={HERO_LOGO.height}
            alt="KorvenzaTech logo"
            fetchPriority="high"
            draggable={false}
          />
          <span className="kzh-logo-sheen" aria-hidden="true" />
        </div>
      </div>
    </div>

    <img className="kzh-logo-reflection" src="/media/brand/k-original-480.webp" width={HERO_LOGO.width} height={HERO_LOGO.height} alt="" aria-hidden="true" decoding="async" loading="lazy" />
    <div className="kzh-orbit kzh-orbit--front" aria-hidden="true"><span className="kzh-orbit-ring kzh-orbit-ring--a" /><span className="kzh-orbit-ring kzh-orbit-ring--b" /></div>
  </div>
);
