/**
 * PRODUCT — two floating phones per case-study card, showing real-layout
 * screen recreations of the product. Hover: the front phone turns toward the
 * pointer and the screens slide through the app; touch devices auto-cycle.
 * A brand-coloured light sits behind the phones (purple for SkillLink).
 * The server-rendered project image stays as the poster until the first frame.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import { Group, MathUtils, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, Texture, TextureLoader } from 'three';
import { PRODUCT } from '../config';
import { mouse } from '../hooks/useMouse';
import { createBackdropMaterial, createPhoneScreenMaterial } from '../materials/PhoneScreen';
import { dotTexture } from '../materials/textures';
import type { Quality } from '../Experience';

const SCREEN_ASPECT = 390 / 844;
const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

type PhoneState = { index: number; next: number; mix: number };

export function ProductScene({ track, quality, app }: { track: HTMLElement; quality: Quality; app: string }) {
  const cfg = PRODUCT.apps[app];
  const media = useMemo(() => track.closest<HTMLElement>('.kz-project-media'), [track]);
  const card = useMemo(() => track.closest<HTMLElement>('.kz-project'), [track]);
  const [textures, setTextures] = useState<Texture[] | null>(null);
  const onScreen = useRef(false);
  const hovered = useRef(false);
  const local = useRef({ x: 0, y: 0 });
  const hoverAmt = useRef(0);
  const front = useRef<Group>(null);
  const back = useRef<Group>(null);
  const ready = useRef(false);
  const phones = useRef<PhoneState[]>([{ index: 0, next: 0, mix: 0 }, { index: 1, next: 1, mix: 0 }]);
  const swapClock = useRef(0);

  // Lazy texture load when the card approaches the viewport; on-screen flag for the frame loop.
  useEffect(() => {
    let cancelled = false;
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      const loader = new TextureLoader();
      Promise.all(Array.from({ length: PRODUCT.screens }, (_, i) => loader.loadAsync(`/media/work/${cfg.dir}/screen-${i + 1}-540.webp`)))
        .then((tx) => {
          if (cancelled) { tx.forEach((t) => t.dispose()); return; }
          tx.forEach((t) => { t.colorSpace = SRGBColorSpace; t.anisotropy = 4; t.needsUpdate = true; });
          setTextures(tx);
        })
        .catch(() => {});
    }, { rootMargin: PRODUCT.preloadMargin });
    near.observe(track);
    const vis = new IntersectionObserver(([e]) => { onScreen.current = e.isIntersecting; });
    vis.observe(track);
    return () => { cancelled = true; near.disconnect(); vis.disconnect(); };
  }, [track, cfg.dir]);
  useEffect(() => () => textures?.forEach((t) => t.dispose()), [textures]);

  // Hover + pointer position relative to the card (mouse only).
  useEffect(() => {
    if (!card || !canHover) return;
    const enter = () => { hovered.current = true; swapClock.current = PRODUCT.swapEvery * 0.6; };
    const leave = () => { hovered.current = false; local.current.x = 0; local.current.y = 0; };
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      local.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      local.current.y = -(((e.clientY - r.top) / Math.max(1, Math.min(r.height, r.width / 1.5))) * 2 - 1);
    };
    card.addEventListener('pointerenter', enter);
    card.addEventListener('pointerleave', leave);
    card.addEventListener('pointermove', move);
    return () => { card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave); card.removeEventListener('pointermove', move); };
  }, [card]);

  // Poster swap is undone if this scene unmounts (route change, context loss, tier drop).
  useEffect(() => () => { if (media) media.dataset.ready = 'false'; if (card) delete card.dataset.kz3d; }, [media, card]);

  const screenMats = useMemo(() => [createPhoneScreenMaterial(SCREEN_ASPECT), createPhoneScreenMaterial(SCREEN_ASPECT)], []);
  const backdrop = useMemo(() => createBackdropMaterial(cfg.brand, cfg.accent), [cfg.brand, cfg.accent]);
  const quad = useMemo(() => new PlaneGeometry(2, 2), []);
  const blob = useMemo(() => {
    const map = dotTexture();
    return { map, mat: new MeshBasicMaterial({ map, color: '#000000', transparent: true, opacity: 0.55, depthWrite: false }) };
  }, []);
  useEffect(() => () => { screenMats.forEach((m) => m.dispose()); backdrop.dispose(); quad.dispose(); blob.map.dispose(); blob.mat.dispose(); }, [screenMats, backdrop, quad, blob]);

  useEffect(() => {
    if (!textures) return;
    screenMats.forEach((m, i) => { m.uniforms.uA.value = textures[i % textures.length]; m.uniforms.uB.value = textures[i % textures.length]; });
  }, [textures, screenMats]);

  const all = useRef<Group>(null);
  useFrame((state, delta) => {
    // Never show the phones before the card itself has revealed (scroll-in fade).
    if (all.current) all.current.visible = !card || card.classList.contains('is-in') || !document.documentElement.classList.contains('kz-js');
    if (!onScreen.current || !textures) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    // Backdrop size / radius in CSS px.
    const r = track.getBoundingClientRect();
    backdrop.uniforms.uSize.value = [r.width, r.height];
    if (card) backdrop.uniforms.uRadius.value = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 24;

    hoverAmt.current = MathUtils.damp(hoverAmt.current, hovered.current ? 1 : 0, 6, dt);
    const h = hoverAmt.current;
    backdrop.uniforms.uHover.value = h;

    // Screen cycling: while hovered (mouse) or continuously on touch devices.
    const cycling = canHover ? hovered.current : true;
    if (cycling) {
      swapClock.current += dt;
      const every = canHover ? PRODUCT.swapEvery : PRODUCT.autoSwapEvery;
      if (swapClock.current >= every) {
        swapClock.current = 0;
        phones.current.forEach((p, i) => {
          if (p.mix > 0) return;
          p.next = (p.index + 1) % textures.length;
          // Keep the two phones on different screens.
          if (i === 1 && p.next === phones.current[0].next) p.next = (p.next + 1) % textures.length;
          screenMats[i].uniforms.uB.value = textures[p.next];
          p.mix = 0.0001;
        });
      }
    }
    phones.current.forEach((p, i) => {
      if (p.mix <= 0) return;
      p.mix = Math.min(1, p.mix + dt / PRODUCT.swapDuration);
      screenMats[i].uniforms.uMix.value = p.mix;
      if (p.mix >= 1) {
        p.index = p.next;
        screenMats[i].uniforms.uA.value = textures[p.index];
        screenMats[i].uniforms.uMix.value = 0;
        p.mix = 0;
      }
    });

    // Phones: idle float + hover turn + pointer tilt.
    const lx = canHover ? local.current.x : mouse.x * 0.3;
    const ly = canHover ? local.current.y : 0;
    if (front.current) {
      const g = front.current;
      g.position.y = MathUtils.damp(g.position.y, -0.04 + Math.sin(t * 0.9) * 0.04 + h * 0.06, 4, dt);
      g.rotation.y = MathUtils.damp(g.rotation.y, -0.38 + h * 0.24 + lx * PRODUCT.tilt * h, 5, dt);
      g.rotation.x = MathUtils.damp(g.rotation.x, -ly * PRODUCT.tilt * 0.6 * h, 5, dt);
      g.rotation.z = Math.sin(t * 0.7) * 0.012;
      screenMats[0].uniforms.uSheen.value = g.rotation.y * 0.8;
    }
    if (back.current) {
      const g = back.current;
      g.position.x = MathUtils.damp(g.position.x, -0.6 - h * 0.08, 4, dt);
      g.position.y = MathUtils.damp(g.position.y, 0.06 + Math.sin(t * 0.8 + 1.4) * 0.05, 4, dt);
      g.rotation.y = MathUtils.damp(g.rotation.y, 0.44 - h * 0.08 + lx * 0.05, 4, dt);
      screenMats[1].uniforms.uSheen.value = g.rotation.y * 0.8;
    }

    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(() => { if (media) media.dataset.ready = 'true'; if (card) card.dataset.kz3d = 'ready'; });
    }
  });

  const { w, h, d, r } = PRODUCT.body;
  const sw = w * 0.93;
  const sh = sw / SCREEN_ASPECT;

  const phone = (i: number) => (
    <>
      <RoundedBox args={[w, h, d]} radius={r} smoothness={4} bevelSegments={quality.tier === 2 ? 4 : 2}>
        <meshStandardMaterial color={PRODUCT.bodyColor} metalness={0.35} roughness={0.42} />
      </RoundedBox>
      <mesh position={[0, 0, d / 2 + 0.001]} material={screenMats[i]}>
        <planeGeometry args={[sw, sh]} />
      </mesh>
      <RoundedBox args={[0.27, 0.075, 0.004]} radius={0.0375} smoothness={2} position={[0, sh / 2 - 0.09, d / 2 + 0.004]}>
        <meshBasicMaterial color="#000000" />
      </RoundedBox>
    </>
  );

  return (
    <>
      <PerspectiveCamera makeDefault fov={PRODUCT.fov} position={[0, 0.05, PRODUCT.cameraZ]} near={0.1} far={20} />
      <group ref={all}>
      {/* Backdrop: drawn in clip space; the geometry sits far outside the contact-shadow camera. */}
      <mesh geometry={quad} material={backdrop} renderOrder={-10} frustumCulled={false} position={[0, 0, -9]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.5, 3, 4]} intensity={1.1} />
      <pointLight position={[0.6, 0.4, -1.6]} intensity={14} distance={6} color={cfg.brand} />
      <pointLight position={[-2.5, -0.5, 2]} intensity={4} distance={7} color={cfg.accent} />
      {textures && (
        <>
          <group ref={back} position={[-0.6, 0.06, -0.75]} rotation={[0.02, 0.44, 0.03]} scale={0.92}>{phone(1)}</group>
          <group ref={front} position={[0.55, -0.04, 0]} rotation={[0, -0.38, 0]}>{phone(0)}</group>
          {quality.tier === 2 && !quality.lite ? (
            <ContactShadows position={[0, -1.22, 0]} scale={5} far={1.8} blur={PRODUCT.shadow.blur} opacity={PRODUCT.shadow.opacity} resolution={PRODUCT.shadow.resolution} color="#000000" />
          ) : (
            <mesh position={[0, -1.2, -0.2]} rotation={[-Math.PI / 2, 0, 0]} material={blob.mat}>
              <planeGeometry args={[3.2, 1.2]} />
            </mesh>
          )}
        </>
      )}
      </group>
    </>
  );
}

