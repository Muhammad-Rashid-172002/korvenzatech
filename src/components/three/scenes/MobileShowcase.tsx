/**
 * MOBILE SHOWCASE — four phones floating in a dark studio, one per portfolio product
 * (CareDesk, IELTS AI Master, FitMind AI, SkillNova). Each phone slowly floats and turns on
 * its own rhythm and slides to its next screen every few seconds; the camera eases toward the
 * pointer and the group drifts with scroll. Phones rise into place the first time the
 * showcase becomes visible. The DOM fallback (CSS phones) stays until the first 3D frame.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import { Group, MathUtils, MeshBasicMaterial, PerspectiveCamera as Cam, PlaneGeometry, SRGBColorSpace, Texture, TextureLoader } from 'three';
import { PRODUCT, SHOWCASE } from '../config';
import { mouse } from '../hooks/useMouse';
import { createBackdropMaterial, createPhoneScreenMaterial } from '../materials/PhoneScreen';
import { dotTexture } from '../materials/textures';
import type { Quality } from '../Experience';

const CFG = SHOWCASE.mobile;
const SCREEN_ASPECT = 390 / 844;
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

export function MobileShowcaseScene({ track, quality }: { track: HTMLElement; quality: Quality }) {
  const host = useMemo(() => track.closest<HTMLElement>('.kz-showcase'), [track]);
  const [textures, setTextures] = useState<Texture[][] | null>(null);
  const onScreen = useRef(false);
  const enter = useRef(-1); // -1 = not started; else seconds since entrance began
  const cam = useRef<Cam>(null);
  const group = useRef<Group>(null);
  const phones = useRef<(Group | null)[]>([]);
  const swap = useRef(CFG.phones.map((_, i) => ({ index: 0, mix: 0, clock: -i * 1.05 })));
  const ready = useRef(false);

  // Lazy textures: CFG.screens per phone, loaded when the showcase approaches the viewport.
  useEffect(() => {
    let cancelled = false;
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      const loader = new TextureLoader();
      Promise.all(CFG.phones.map((p) => Promise.all(Array.from({ length: CFG.screens }, (_, i) => loader.loadAsync(`/media/work/${p.dir}/screen-${i + 1}-540.webp`)))))
        .then((sets) => {
          if (cancelled) { sets.flat().forEach((t) => t.dispose()); return; }
          sets.flat().forEach((t) => { t.colorSpace = SRGBColorSpace; t.anisotropy = 4; t.needsUpdate = true; });
          setTextures(sets);
        })
        .catch(() => {});
    }, { rootMargin: SHOWCASE.preloadMargin });
    near.observe(track);
    const vis = new IntersectionObserver(([e]) => { onScreen.current = e.isIntersecting; });
    vis.observe(track);
    return () => { cancelled = true; near.disconnect(); vis.disconnect(); };
  }, [track]);
  useEffect(() => () => textures?.flat().forEach((t) => t.dispose()), [textures]);
  useEffect(() => () => { if (host) host.dataset.ready = 'false'; }, [host]);

  const screenMats = useMemo(() => CFG.phones.map(() => createPhoneScreenMaterial(SCREEN_ASPECT)), []);
  const backdrop = useMemo(() => {
    const m = createBackdropMaterial(CFG.brand, CFG.accent);
    m.uniforms.uLight.value = [0.5, 0.42];
    return m;
  }, []);
  const quad = useMemo(() => new PlaneGeometry(2, 2), []);
  const blob = useMemo(() => {
    const map = dotTexture();
    return { map, mat: new MeshBasicMaterial({ map, color: '#000000', transparent: true, opacity: 0.6, depthWrite: false }) };
  }, []);
  useEffect(() => () => { screenMats.forEach((m) => m.dispose()); backdrop.dispose(); quad.dispose(); blob.map.dispose(); blob.mat.dispose(); }, [screenMats, backdrop, quad, blob]);

  useEffect(() => {
    if (!textures) return;
    screenMats.forEach((m, i) => { m.uniforms.uA.value = textures[i][0]; m.uniforms.uB.value = textures[i][0]; m.uniforms.uBright.value = 1.05; });
  }, [textures, screenMats]);

  useFrame((state, delta) => {
    if (!onScreen.current || !textures) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const r = track.getBoundingClientRect();
    backdrop.uniforms.uSize.value = [r.width, r.height];
    if (host) backdrop.uniforms.uRadius.value = parseFloat(getComputedStyle(host).borderTopLeftRadius) || 24;

    if (enter.current < 0) enter.current = 0;
    enter.current += dt;
    const e = enter.current / SHOWCASE.enterDuration;

    // Screen swaps (each phone on its own staggered clock).
    swap.current.forEach((s, i) => {
      const mat = screenMats[i];
      s.clock += dt;
      if (s.mix === 0 && s.clock >= CFG.swapEvery) {
        s.clock = 0;
        mat.uniforms.uB.value = textures[i][(s.index + 1) % textures[i].length];
        s.mix = 0.0001;
      }
      if (s.mix > 0) {
        s.mix = Math.min(1, s.mix + dt / CFG.swapDuration);
        mat.uniforms.uMix.value = s.mix;
        if (s.mix >= 1) { s.index = (s.index + 1) % textures[i].length; mat.uniforms.uA.value = textures[i][s.index]; mat.uniforms.uMix.value = 0; s.mix = 0; }
      }
    });

    // Scroll: -1 (showcase below centre) … 1 (above centre).
    const vh = window.innerHeight || 1;
    const sp = MathUtils.clamp((vh / 2 - (r.top + r.height / 2)) / vh, -1, 1);
    if (group.current) {
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, sp * 0.14, 3, dt);
      group.current.position.y = MathUtils.damp(group.current.position.y, sp * 0.18, 3, dt);
    }

    CFG.phones.forEach((p, i) => {
      const g = phones.current[i];
      if (!g) return;
      const k = ease(e - i * 0.12);
      g.position.set(p.pos[0], p.pos[1] + Math.sin(t * 0.75 + i * 1.7) * 0.07 - (1 - k) * 2.6, p.pos[2] - (1 - k) * 0.8);
      g.rotation.y = p.rotY + Math.sin(t * 0.32 + i * 2.1) * 0.09 + (1 - k) * (i < 2 ? 0.6 : -0.6) + mouse.x * 0.08;
      g.rotation.x = -mouse.y * 0.05 + Math.sin(t * 0.5 + i) * 0.02;
      g.rotation.z = Math.sin(t * 0.6 + i * 0.9) * 0.015;
      const s = p.scale * (0.86 + 0.14 * k);
      g.scale.setScalar(s);
      screenMats[i].uniforms.uSheen.value = g.rotation.y * 0.8;
    });

    if (cam.current) {
      const c = cam.current;
      c.position.x = MathUtils.damp(c.position.x, mouse.x * SHOWCASE.parallax.x, 2.5, dt);
      c.position.y = MathUtils.damp(c.position.y, 0.05 + mouse.y * SHOWCASE.parallax.y, 2.5, dt);
      c.lookAt(0, -0.05, -0.4);
    }

    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(() => { if (host) host.dataset.ready = 'true'; });
    }
  });

  const { w, h, d, r } = PRODUCT.body;
  const sw = w * 0.93;
  const sh = sw / SCREEN_ASPECT;
  const full = quality.tier === 2 && !quality.lite;

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={CFG.fov} position={[0, 0.05, CFG.cameraZ]} near={0.1} far={30} />
      <mesh geometry={quad} material={backdrop} renderOrder={-10} frustumCulled={false} position={[0, 0, -12]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2.5, 3.5, 4]} intensity={1.15} />
      <pointLight position={[0, 0.6, -2.6]} intensity={22} distance={8} color={CFG.brand} />
      <pointLight position={[-3.2, -0.6, 1.5]} intensity={6} distance={8} color={CFG.accent} />
      <pointLight position={[3.2, 1.2, 1.2]} intensity={4} distance={8} color="#A6EBCD" />
      {textures && (
        <group ref={group}>
          {CFG.phones.map((p, i) => (
            <group key={p.dir} ref={(g) => { phones.current[i] = g; }} position={p.pos} rotation={[0, p.rotY, 0]} scale={p.scale}>
              <RoundedBox args={[w, h, d]} radius={r} smoothness={4} bevelSegments={full ? 4 : 2}>
                <meshStandardMaterial color={PRODUCT.bodyColor} metalness={0.55} roughness={0.32} />
              </RoundedBox>
              <mesh position={[0, 0, d / 2 + 0.001]} material={screenMats[i]}>
                <planeGeometry args={[sw, sh]} />
              </mesh>
              <RoundedBox args={[0.27, 0.075, 0.004]} radius={0.0375} smoothness={2} position={[0, sh / 2 - 0.09, d / 2 + 0.004]}>
                <meshBasicMaterial color="#000000" />
              </RoundedBox>
            </group>
          ))}
          {full ? (
            <ContactShadows position={[0, -1.32, -0.4]} scale={8} far={2} blur={2.4} opacity={0.6} resolution={256} color="#000000" />
          ) : (
            <mesh position={[0, -1.3, -0.5]} rotation={[-Math.PI / 2, 0, 0]} material={blob.mat}>
              <planeGeometry args={[6, 1.6]} />
            </mesh>
          )}
        </group>
      )}
    </>
  );
}
