/**
 * Smooth scroll + scroll-driven motion (lazy chunk, loaded after first paint).
 * Lenis → ScrollTrigger → scrollStore/sectionProgress → read in useFrame.
 * Never loaded when prefers-reduced-motion is set.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { pinRanges, scrollStore, sectionProgress } from './scrollStore';
import { PROCESS, SCROLL } from '../components/three/config';
import { EASE, DUR } from './motion';
import { bindInteractions } from './interactions';
import { initCursor } from '../components/fx/Cursor';
import { initScrollProgress } from '../components/fx/ScrollProgress';
import { bindCountUp } from '../components/fx/CountUp';
export { playCurtain } from '../components/fx/RouteCurtain';

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenis: Lenis | null = null;
let routeCtx: gsap.Context | null = null;
let routeMM: gsap.MatchMedia | null = null;
let routeInteractions: (() => void) | null = null;
let destroyCursor: (() => void) | null = null;
let progressBar: ReturnType<typeof initScrollProgress> | null = null;

export function initSmoothScroll() {
  if (lenis) return;
  lenis = new Lenis({ lerp: SCROLL.lerp, wheelMultiplier: SCROLL.wheelMultiplier, smoothWheel: true, syncTouch: false });
  scrollStore.lenis = lenis;
  document.documentElement.classList.add('kz-lenis');
  progressBar = initScrollProgress();
  destroyCursor = initCursor();

  lenis.on('scroll', (l: Lenis) => {
    scrollStore.y = l.scroll;
    scrollStore.velocity = l.velocity;
    scrollStore.progress = l.progress;
    progressBar?.update(l.progress);
    ScrollTrigger.update();
  });
  // One clock: GSAP's ticker drives Lenis, so ScrollTrigger and Lenis never drift.
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** (Re)create the scroll-driven timelines for whatever route is on screen. */
let routeGen = 0;
/** Run each setup step in its own task so no single long task blocks input (better TBT/INP). */
const nextTask = () => new Promise<void>((r) => setTimeout(r, 0));

export async function setupRoute() {
  const gen = ++routeGen;
  routeCtx?.revert();
  routeMM?.revert();
  routeInteractions?.();
  routeInteractions = null;
  routeCtx = gsap.context(() => {});
  const mm = (routeMM = gsap.matchMedia());
  const steps: (() => void)[] = [
    () => {
      const unbindInteractions = bindInteractions(document);
      const unbindCount = bindCountUp(document);
      routeInteractions = () => { unbindInteractions(); unbindCount(); };
    },
    () => setupProcess(mm),
    () => setupParallax(mm),
    () => routeCtx?.add(() => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      sectionProgress.hero = 0;
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => { sectionProgress.hero = self.progress; },
      });
      splitHeadline(hero.querySelector<HTMLElement>('#hero-title'));
    }),
    () => ScrollTrigger.refresh(),
  ];
  for (const step of steps) {
    await nextTask();
    if (gen !== routeGen) return; // a newer route took over
    step();
  }
}

/**
 * Process "Journey": on large screens with the 3D layer (tier 1/2) the phase
 * stage pins for PROCESS.pinLengthVh while scroll walks through the phases.
 * Progress drives the 3D camera (sectionProgress.process), the list fill
 * (--kz-fill-live) and the active phase (a `kz:step` event the React
 * component listens to). Phones/tablets and reduced motion never pin.
 */
function setupProcess(mm: gsap.MatchMedia) {
  const section = document.getElementById('process');
  const stage = section?.querySelector<HTMLElement>('[data-kz-pin]');
  if (!section || !stage) return;
  const steps = Number(stage.dataset.steps) || 1;
  mm.add(`(min-width: ${PROCESS.pinMinWidth}px) and (min-height: ${PROCESS.pinMinHeight}px)`, () => {
    if (document.documentElement.dataset.kzTier === '0') return;
    section.dataset.pinned = 'true';
    let last = -1;
    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'center center',
      end: () => `+=${Math.round((window.innerHeight * PROCESS.pinLengthVh) / 100)}`,
      pin: true,
      anticipatePin: 1,
      onRefresh: (self) => { pinRanges.process = { start: self.start, end: self.end }; },
      onUpdate: (self) => {
        const p = self.progress;
        sectionProgress.process = p;
        section.style.setProperty('--kz-fill-live', p.toFixed(4));
        const i = Math.min(steps - 1, Math.floor(p * steps));
        if (i !== last) { last = i; section.dispatchEvent(new CustomEvent('kz:step', { detail: i })); }
      },
    });
    pinRanges.process = { start: st.start, end: st.end };
    return () => {
      delete section.dataset.pinned;
      delete pinRanges.process;
      sectionProgress.process = 0;
      section.style.removeProperty('--kz-fill-live');
    };
  });
}

/**
 * Gentle scroll parallax: [data-kz-parallax="<yPercent>"] drifts from +n% to
 * -n% of its height while it crosses the viewport (≥768px only).
 */
function setupParallax(mm: gsap.MatchMedia) {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-kz-parallax]'));
  if (!els.length) return;
  mm.add('(min-width: 768px)', () => {
    els.forEach((el) => {
      const n = Number(el.dataset.kzParallax) || 0;
      gsap.fromTo(el, { yPercent: n }, { yPercent: -n, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });
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
  routeMM?.revert();
  routeInteractions?.();
  routeInteractions = null;
  destroyCursor?.(); destroyCursor = null;
  progressBar?.destroy(); progressBar = null;
  lenis?.destroy();
  lenis = null;
  scrollStore.lenis = null;
  document.documentElement.classList.remove('kz-lenis');
}
