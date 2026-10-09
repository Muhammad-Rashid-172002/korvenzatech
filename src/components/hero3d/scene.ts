/**
 * KorvenzaTech hero sculpture — an original "engineered lattice" composition.
 *
 * A faceted metallic core sits inside layered translucent glass planes,
 * precision rings and a quiet constellation of connected nodes: precision
 * engineering + connected systems, rendered with physically based materials
 * and image-based lighting.
 *
 * Imperative Three.js (no React reconciler) keeps the lazy chunk small and the
 * render loop free of React work. Loaded only on the homepage via dynamic import.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  IcosahedronGeometry,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export type HeroSceneOptions = {
  canvas: HTMLCanvasElement;
  /** Low-power devices: lower DPR, no transmission pass, fewer nodes. */
  quality: 'high' | 'low';
  /** prefers-reduced-motion: render still frames only. */
  reducedMotion: boolean;
  /** Time (seconds) of the still frame used for reduced motion and the poster image. */
  stillTime?: number;
  onFirstFrame?: () => void;
  onFail?: () => void;
};

export type HeroSceneHandle = { dispose: () => void };

const EMERALD = new Color('#19C784');
const DEEP = new Color('#087F5B');

/** Soft radial contact shadow, generated once — cheaper than real-time shadow maps. */
function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, 'rgba(0,0,0,0.62)');
  grd.addColorStop(0.45, 'rgba(0,0,0,0.28)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(25,199,132,0.55)');
  grd.addColorStop(0.5, 'rgba(25,199,132,0.12)');
  grd.addColorStop(1, 'rgba(25,199,132,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** Etched "blueprint" glass: faint fill, fine grid and a crisp frame. */
function makeBlueprintTexture() {
  const W = 512, H = 326;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d')!;
  const fill = g.createLinearGradient(0, 0, W, H);
  fill.addColorStop(0, 'rgba(166,235,205,0.16)');
  fill.addColorStop(1, 'rgba(25,199,132,0.05)');
  g.fillStyle = fill;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(166,235,205,0.16)';
  g.lineWidth = 1;
  for (let x = 32; x < W; x += 32) { g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, H); g.stroke(); }
  for (let y = 32; y < H; y += 32) { g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); g.stroke(); }
  g.strokeStyle = 'rgba(110,221,176,0.55)';
  g.lineWidth = 2;
  g.strokeRect(14, 14, 120, 18);
  g.strokeRect(14, 44, 220, 8);
  g.strokeRect(W - 150, H - 70, 130, 50);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Deterministic pseudo-random so the composition is identical on every load. */
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function createHeroScene(opts: HeroSceneOptions): HeroSceneHandle {
  const { canvas, quality, reducedMotion } = opts;
  const stillTime = opts.stillTime ?? 2.4;
  const high = quality === 'high';

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    opts.onFail?.();
    return { dispose() {} };
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, high ? 1.75 : 1.25));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0.35, 8.6);

  // Image-based lighting gives believable reflections without shadow maps.
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.7;

  const key = new DirectionalLight('#F3FFF9', 2.1);
  key.position.set(3.5, 4.5, 5);
  const rim = new PointLight(EMERALD, 28, 14, 2);
  rim.position.set(-2.6, 1.4, -2.8);
  const under = new PointLight(DEEP, 10, 10, 2);
  under.position.set(1.8, -2.2, 1.5);
  const hemi = new HemisphereLight('#D2F5E5', '#04140E', 0.35);
  scene.add(key, rim, under, hemi);

  const disposables: { dispose: () => void }[] = [envRT, pmrem];
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

  const root = new Group();
  root.position.y = 0.12;
  scene.add(root);

  // --- Core: faceted, polished metal ---------------------------------------
  const coreGeo = track(new IcosahedronGeometry(0.86, 0));
  const coreMat = track(new MeshPhysicalMaterial({
    color: '#0B7A55', metalness: 0.92, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2,
    flatShading: true, envMapIntensity: 0.9, sheen: 0.4, sheenColor: new Color('#6EDDB0'),
  }));
  const core = new Mesh(coreGeo, coreMat);
  root.add(core);

  // Inner glow sprite-plane behind the core (cheap bloom substitute).
  const glowTex = track(makeGlowTexture());
  const glowMat = track(new MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending }));
  const glow = new Mesh(track(new PlaneGeometry(5.2, 5.2)), glowMat);
  glow.position.set(0, 0.12, -1.6); // outside the rotating group so it always faces the camera
  scene.add(glow);

  // --- Glass planes: layered system architecture ---------------------------
  // The canvas is transparent over a CSS backdrop, so a transmission pass would
  // only refract emptiness. Clear-coated, reflective glass reads better and is cheaper.
  const blueprint = track(makeBlueprintTexture());
  const glassMat = track(new MeshPhysicalMaterial({
    color: '#FFFFFF', map: blueprint, metalness: 0, roughness: 0.08, transparent: true, opacity: 1,
    clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.55, side: DoubleSide, depthWrite: false,
  }));
  const PLATE_W = 2.2, PLATE_H = 1.4, PLATE_D = 0.06;
  const plateGeo = track(new RoundedBoxGeometry(PLATE_W, PLATE_H, PLATE_D, 4, 0.08));
  const edgeSrc = new BoxGeometry(PLATE_W, PLATE_H, PLATE_D);
  const edgeGeo = track(new EdgesGeometry(edgeSrc));
  edgeSrc.dispose();
  const edgeMat = track(new LineBasicMaterial({ color: '#A6EBCD', transparent: true, opacity: 0.75, depthWrite: false }));
  const plates = new Group();
  const plateDefs = [
    { p: [-0.95, 0.55, -0.55], r: [-0.12, 0.42, 0.06] },
    { p: [0.95, -0.35, -0.2], r: [0.1, -0.48, -0.05] },
    { p: [0.05, 0.1, -1.25], r: [0.04, 0.02, 0.0] },
  ] as const;
  plateDefs.forEach(({ p, r }, i) => {
    const m = new Mesh(plateGeo, glassMat);
    m.position.set(p[0], p[1], p[2]);
    m.rotation.set(r[0], r[1], r[2]);
    m.renderOrder = 2;
    m.add(new LineSegments(edgeGeo, edgeMat));
    m.userData = { base: m.position.clone(), phase: i * 2.1 };
    plates.add(m);
  });
  root.add(plates);

  // --- Precision rings -----------------------------------------------------
  const ringMat = track(new MeshStandardMaterial({ color: '#A6EBCD', metalness: 1, roughness: 0.32 }));
  const ringA = new Mesh(track(new TorusGeometry(1.85, 0.012, 12, 220)), ringMat);
  ringA.rotation.set(1.28, 0.1, 0.32);
  const ringB = new Mesh(track(new TorusGeometry(2.25, 0.008, 12, 240)), ringMat);
  ringB.rotation.set(1.62, -0.42, -0.2);
  root.add(ringA, ringB);

  // --- Connected nodes (instanced) + links --------------------------------
  const rand = rng(7);
  const nodeCount = high ? 64 : 36;
  const nodePositions: Vector3[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const rad = 2.05 + rand() * 0.75;
    const s = Math.sqrt(1 - u * u);
    nodePositions.push(new Vector3(Math.cos(th) * s * rad, u * rad * 0.72, Math.sin(th) * s * rad));
  }
  const nodeMat = track(new MeshStandardMaterial({ color: '#6EDDB0', emissive: '#19C784', emissiveIntensity: 1.1, metalness: 0.2, roughness: 0.4 }));
  const nodes = new InstancedMesh(track(new SphereGeometry(0.021, 10, 10)), nodeMat, nodeCount);
  const dummy = new Object3D();
  nodePositions.forEach((v, i) => {
    dummy.position.copy(v);
    dummy.scale.setScalar(0.7 + rand() * 0.9);
    dummy.updateMatrix();
    nodes.setMatrixAt(i, dummy.matrix);
  });
  const constellation = new Group();
  constellation.add(nodes);

  const linkVerts: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    let links = 0;
    for (let j = i + 1; j < nodeCount && links < 2; j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < 0.95) {
        linkVerts.push(...nodePositions[i].toArray(), ...nodePositions[j].toArray());
        links++;
      }
    }
  }
  const linkGeo = track(new BufferGeometry());
  linkGeo.setAttribute('position', new Float32BufferAttribute(linkVerts, 3));
  const linkMat = track(new LineBasicMaterial({ color: '#19C784', transparent: true, opacity: 0.22, depthWrite: false }));
  constellation.add(new LineSegments(linkGeo, linkMat));
  root.add(constellation);

  // --- Contact shadow ------------------------------------------------------
  const shadowTex = track(makeShadowTexture());
  const shadow = new Mesh(
    track(new PlaneGeometry(3.8, 3.8)),
    track(new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.55 })),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.9;
  scene.add(shadow);

  // --- Interaction ---------------------------------------------------------
  const pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return; // touch: no tilt, keep scroll natural
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });

  // --- Sizing --------------------------------------------------------------
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (reducedMotion) renderFrame(stillTime);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // --- Loop ----------------------------------------------------------------
  const t0 = performance.now();
  let raf = 0;
  let visible = true;
  let first = true;

  function renderFrame(t: number) {
    eased.x = MathUtils.lerp(eased.x, pointer.x, 0.045);
    eased.y = MathUtils.lerp(eased.y, pointer.y, 0.045);

    root.rotation.y = t * 0.11 + eased.x * 0.38;
    root.rotation.x = -0.08 + eased.y * 0.16;
    core.rotation.set(t * 0.18, t * 0.24, 0);
    constellation.rotation.y = -t * 0.035;
    ringA.rotation.z = 0.32 + t * 0.06;
    ringB.rotation.z = -0.2 - t * 0.045;
    plates.children.forEach((m) => {
      const { base, phase } = m.userData as { base: Vector3; phase: number };
      m.position.y = base.y + Math.sin(t * 0.6 + phase) * 0.06;
    });
    camera.position.x = Math.sin(t * 0.07) * 0.25;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    if (first) { first = false; opts.onFirstFrame?.(); }
  }

  // Low-power devices render at ~30fps; the motion is slow enough that this is imperceptible.
  const minFrameMs = high ? 0 : 1000 / 30;
  let last = 0;
  const loop = (now: number) => {
    raf = 0;
    if (!visible || document.hidden) return;
    if (now - last >= minFrameMs - 1) { last = now; renderFrame(stillTime + (now - t0) / 1000); }
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!raf && !reducedMotion) raf = requestAnimationFrame(loop); };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  }, { threshold: 0.01 });
  io.observe(canvas);
  const onVisibility = () => { if (!document.hidden) start(); };
  document.addEventListener('visibilitychange', onVisibility);

  const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); opts.onFail?.(); };
  canvas.addEventListener('webglcontextlost', onLost);

  resize();
  if (reducedMotion) renderFrame(stillTime); else start();

  return {
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      disposables.forEach((d) => d.dispose());
      nodes.dispose();
      renderer.dispose();
    },
  };
}
