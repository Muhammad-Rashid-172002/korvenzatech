/**
 * Smooth scroll + scroll-driven motion (lazy chunk, loaded after first paint).
 * Lenis → ScrollTrigger → scrollStore/sectionProgress → read in useFrame.
 * Never loaded when prefers-reduced-motion is set.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { scrollStore, sectionProgress } from './scrollStore';
import { SCROLL } from '../components/three/config';
import { EASE, DUR } from './motion';

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenis: Lenis | null = null;
let routeCtx: gsap.Context | null = null;

export function initSmoothScroll() {
  if (lenis) return;
  lenis = new Lenis({ lerp: SCROLL.lerp, wheelMultiplier: SCROLL.wheelMultiplier, smoothWheel: true, syncTouch: false });
  scrollStore.lenis = lenis;
  document.documentElement.classList.add('kz-lenis');

  lenis.on('scroll', (l: Lenis) => {
    scrollStore.y = l.scroll;
    scrollStore.velocity = l.velocity;
    scrollStore.progress = l.progress;
    ScrollTrigger.update();
  });
  // One clock: GSAP's ticker drives Lenis, so ScrollTrigger and Lenis never drift.
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** (Re)create the scroll-driven timelines for whatever route is on screen. */
export function setupRoute() {
  routeCtx?.revert();
  routeCtx = gsap.context(() => {
    const hero = document.getElementById('hero');
    if (hero) {
      sectionProgress.hero = 0;
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => { sectionProgress.hero = self.progress; },
      });
      splitHeadline(hero.querySelector<HTMLElement>('#hero-title'));
    }
  });
  ScrollTrigger.refresh();
}

/**
 * Hero headline: visible and static at first paint (it is the LCP element).
 * After paint we split it into lines → words and run a movement-only wave
 * (no opacity, no mask), so LCP is never delayed and nothing flashes.
 */
function splitHeadline(h1: HTMLElement | null) {
  if (!h1 || h1.dataset.split === 'done') return;
  h1.dataset.split = 'done';
  const split = SplitText.create(h1, {
    type: 'lines,words',
    linesClass: 'kz-line',
    wordsClass: 'kz-word',
    ignore: '.kz-gradient-word',
    aria: 'auto',
  });
  const targets = Array.from(h1.querySelectorAll<HTMLElement>('.kz-word, .kz-gradient-word'));
  gsap.set(targets, { display: 'inline-block', willChange: 'transform' });
  gsap.to(targets, {
    keyframes: [
      { y: '-0.12em', duration: DUR.base, ease: EASE.out },
      { y: 0, duration: DUR.slow, ease: EASE.settle },
    ],
    stagger: 0.04,
    delay: 0.15,
    onComplete: () => gsap.set(targets, { clearProps: 'willChange' }),
  });
  return split;
}

export function destroySmoothScroll() {
  routeCtx?.revert();
  lenis?.destroy();
  lenis = null;
  scrollStore.lenis = null;
  document.documentElement.classList.remove('kz-lenis');
}
