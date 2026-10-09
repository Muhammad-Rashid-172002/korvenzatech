import React from 'react';

export const HERO_POSTER_SRCSET = '/media/hero/sculpture-640.webp 640w, /media/hero/sculpture-1100.webp 1100w';
export const HERO_POSTER_SIZES = '(min-width: 1024px) 620px, (min-width: 640px) 520px, 380px';

/**
 * The hero "stage": a server-rendered poster frame of the 3D composition.
 * It is what every visitor sees first (and what reduced-motion, GPU-less and
 * no-WebGL visitors keep). The live scene (components/three/scenes/Hero.tsx)
 * renders into the same box from the shared canvas and sets data-ready="true"
 * on its first frame, which cross-fades this poster out.
 */
export function HeroStage() {
  return (
    <div className="kz-hero-stage" data-ready="false">
      <div className="kz-hero-floor pointer-events-none absolute inset-x-0 bottom-0 h-1/2" aria-hidden="true" />
      <div className="kz-hero-fallback" aria-hidden="true">
        <img
          className="kz-hero-poster"
          src="/media/hero/sculpture-640.webp"
          srcSet={HERO_POSTER_SRCSET}
          sizes={HERO_POSTER_SIZES}
          alt=""
          width={1100}
          height={1100}
          decoding="async"
        />
      </div>
    </div>
  );
}
