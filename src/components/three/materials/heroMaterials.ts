/**
 * Hero V2 building blocks: light-panel environment, glowing edge / ring / grid
 * shaders and a radial alpha mask. Pure three.js (no extra drei portals — see
 * the R3F portal note in Experience.tsx).
 */
import {
  CanvasTexture, SRGBColorSpace, Color, CylinderGeometry, DoubleSide, InstancedMesh, Matrix4,
  Mesh, MeshBasicMaterial, PlaneGeometry, PMREMGenerator, Quaternion, Scene, ShaderMaterial, Vector3,
  type WebGLRenderer,
} from 'three';
import { COLORS, HERO } from '../config';
import { AddEquation, CustomBlending, OneFactor, SrcAlphaFactor, ZeroFactor, type Material } from 'three';

/**
 * True light-additive blending for a transparent canvas: add RGB, never touch the
 * drawing buffer's alpha. (three's AdditiveBlending also adds alpha, which turns dim
 * glow into opaque near-black over the page behind the canvas.)
 */
export function lightAdditive<T extends Material>(m: T): T {
  m.blending = CustomBlending;
  m.blendEquation = AddEquation;
  m.blendSrc = SrcAlphaFactor; // material opacity still fades it; textures are premultiplied on black
  m.blendDst = OneFactor;
  m.blendSrcAlpha = ZeroFactor;
  m.blendDstAlpha = OneFactor;
  m.transparent = true;
  m.depthWrite = false;
  return m;
}

/**
 * Lightformer environment: bright emissive panels (white key top-left, emerald
 * rim right, teal strip behind, dim fill below) rendered once into a PMREM
 * cube map. Equivalent to drei <Environment><Lightformer/></Environment> with
 * frames={1}, without an extra React portal. Returns the env texture + dispose.
 */
export function buildLightformerEnv(gl: WebGLRenderer) {
  const s = new Scene();
  s.background = new Color('#020806');
  const geos: PlaneGeometry[] = [];
  const mats: MeshBasicMaterial[] = [];
  for (const lf of HERO.lightformers) {
    const g = new PlaneGeometry(lf.scale[0], lf.scale[1]);
    const m = new MeshBasicMaterial({ color: new Color(lf.color).multiplyScalar(lf.intensity), side: DoubleSide, toneMapped: false });
    const mesh = new Mesh(g, m);
    mesh.position.set(...lf.position);
    mesh.lookAt(0, 0, 0);
    s.add(mesh);
    geos.push(g); mats.push(m);
  }
  const pmrem = new PMREMGenerator(gl);
  const rt = pmrem.fromScene(s, 0.02);
  pmrem.dispose();
  geos.forEach((g) => g.dispose());
  mats.forEach((m) => m.dispose());
  return { texture: rt.texture, dispose: () => rt.dispose() };
}

/**
 * Glowing line work as thin instanced cylinders (real thickness, MSAA-smooth — WebGL
 * line width is always 1px). `segs` = flat [x0,y0,z0,x1,y1,z1, …]. A light sweep
 * travels diagonally across them every `period` seconds; back-face lines (z < 0) are
 * dimmer so the front contour reads first. uFlash adds a global flash (lock moment).
 */
export function buildSegmentGlow(segs: ArrayLike<number>, opts: { radius: number; base: number; period: number; width: number; span: number; backDim?: number; sides?: number }) {
  const count = segs.length / 6;
  const cyl = new CylinderGeometry(1, 1, 1, opts.sides ?? 6, 1, true);
  const mat = lightAdditive(new ShaderMaterial({
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new Color(COLORS.accent) },
      uHot: { value: new Color(COLORS.ice) },
      uBase: { value: opts.base },
      uPeriod: { value: opts.period },
      uWidth: { value: opts.width },
      uRadius: { value: opts.span },
      uBackDim: { value: opts.backDim ?? 1 },
      uFade: { value: 1 },
      uFlash: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vLocal;
      void main() {
        vec4 lp = instanceMatrix * vec4(position, 1.0);
        vLocal = lp.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * lp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime, uBase, uPeriod, uWidth, uRadius, uFade, uBackDim, uFlash;
      uniform vec3 uColor, uHot;
      varying vec3 vLocal;
      void main() {
        float k = fract(uTime / uPeriod) * 2.0 - 0.5;           // -0.5 .. 1.5
        float along = dot(normalize(vec3(0.6, 0.75, 0.3)), vLocal) / (uRadius * 2.0) + 0.5;
        float sweep = exp(-pow((along - k) / uWidth, 2.0) * 4.0);
        float face = vLocal.z < 0.0 ? uBackDim : 1.0;
        vec3 col = (uColor * (uBase + sweep * 2.2) + uHot * (sweep * 0.9 + uFlash)) * face;
        gl_FragColor = vec4(col * uFade, 1.0);
      }`,
  }));
  const mesh = new InstancedMesh(cyl, mat, count);
  const a = new Vector3(), b = new Vector3(), mid = new Vector3(), dir = new Vector3();
  const q = new Quaternion(), up = new Vector3(0, 1, 0), m = new Matrix4(), sc = new Vector3();
  const r = opts.radius;
  for (let i = 0; i < count; i++) {
    a.set(segs[i * 6], segs[i * 6 + 1], segs[i * 6 + 2]);
    b.set(segs[i * 6 + 3], segs[i * 6 + 4], segs[i * 6 + 5]);
    mid.copy(a).add(b).multiplyScalar(0.5);
    dir.copy(b).sub(a);
    const len = dir.length() + r * 2; // overlap at corners so joints stay closed
    q.setFromUnitVectors(up, dir.normalize());
    m.compose(mid, q, sc.set(r, len, r));
    mesh.setMatrixAt(i, m);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  return { mesh, mat, dispose: () => { cyl.dispose(); mat.dispose(); mesh.dispose(); } };
}

/**
 * Shockwave: a thin bright ring expanding in the logo plane (lock moment, click).
 * uR = current radius (world), uW = ring width, uA = intensity.
 */
export function createShockwaveMaterial() {
  return lightAdditive(new ShaderMaterial({
    toneMapped: false,
    uniforms: { uR: { value: 0 }, uW: { value: 0.12 }, uA: { value: 0 }, uColor: { value: new Color(COLORS.accent) }, uHot: { value: new Color(COLORS.ice) } },
    vertexShader: /* glsl */ `varying vec2 vP; void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uR, uW, uA; uniform vec3 uColor, uHot; varying vec2 vP;
      void main() {
        float d = length(vP) - uR;
        float ring = exp(-pow(d / uW, 2.0)) + 0.35 * exp(-pow((d + uW * 2.5) / (uW * 3.0), 2.0));
        if (ring * uA < 0.003) discard;
        gl_FragColor = vec4(mix(uColor, uHot, 0.5) * ring * uA, 1.0);
      }`,
  }));
}

/**
 * Ring = light trail on a tube. uv.x runs along the ring: bright head at uHead,
 * fading tail of length uTrail behind it, faint base everywhere else. uDraw
 * (0→1) reveals the ring on load like a pen stroke.
 */
export function createRingMaterial(pass: 'main' | 'rt' = 'main') {
  const m = lightAdditive(new ShaderMaterial({
    toneMapped: false,
    uniforms: {
      uHead: { value: 0 },
      uTrail: { value: HERO.ringTrail },
      uBase: { value: HERO.ringBase },
      uDraw: { value: 0 },
      uFade: { value: 1 },
      uOn: { value: 1 },
      /** World → glass-K local space; the ring dims where it passes in front of the K. */
      uToK: { value: new Matrix4() },
      uKFade: { value: pass === 'main' ? 1 : 0 },
      uColor: { value: new Color(COLORS.accent) },
      uHot: { value: new Color(COLORS.ice) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying float vFres; varying vec3 vWorld;
      void main() {
        vUv = uv;
        vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vFres = abs(dot(normalize(normalMatrix * normal), normalize(-mv.xyz)));
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uHead, uTrail, uDraw, uFade, uBase, uOn, uKFade;
      uniform vec3 uColor, uHot;
      uniform mat4 uToK;
      varying vec2 vUv; varying float vFres; varying vec3 vWorld;
      void main() {
        if (vUv.x > uDraw) discard;
        float d = fract(uHead - vUv.x);                 // distance behind the head
        float tail = pow(clamp(1.0 - d / uTrail, 0.0, 1.0), 2.2);
        float head = exp(-d * 60.0) + exp(-(1.0 - d) * 200.0);
        float core = pow(vFres, 0.6);                   // brighter in the middle of the tube
        float i = (uBase + tail * 1.35 + head * 1.8) * core;
        vec3 col = mix(uColor, uHot, clamp(head + tail * 0.25, 0.0, 1.0)) * i;
        // pen tip glow while drawing in
        col += uHot * exp(-abs(vUv.x - uDraw) * 120.0) * step(uDraw, 0.999) * 1.5;
        // where the ring crosses in front of the K, let it fade so no streak cuts through the logo
        vec3 k = (uToK * vec4(vWorld, 1.0)).xyz;
        float over = (1.0 - smoothstep(0.9, 1.6, abs(k.x))) * (1.0 - smoothstep(1.2, 1.9, abs(k.y))) * smoothstep(-0.1, 0.35, k.z);
        col *= 1.0 - 0.88 * over * uKFade;
        gl_FragColor = vec4(col * uFade * uOn, 1.0);
      }`,
  }));
  // 'rt' twin: lives in the opaque list so three's transmission pass sees it (the glass K
  // refracts the rings behind it); it outputs only into that render target.
  if (pass === 'rt') m.transparent = false;
  return m;
}

/**
 * Gate a mesh to one render pass: 'rt' = only three's transmission render target,
 * 'main' = only the visible frame. The material needs a `uOn` uniform.
 */
export function gateToPass(mesh: Mesh, mat: ShaderMaterial, pass: 'main' | 'rt') {
  mesh.onBeforeRender = (renderer) => {
    const inRT = !!renderer.getRenderTarget();
    mat.uniforms.uOn.value = (pass === 'rt') === inRT ? 1 : 0;
    mat.uniformsNeedUpdate = true;
  };
}

/**
 * Perspective grid floor: anti-aliased lines (fwidth), brighter near the
 * centre, fading out radially and with distance so it melts into the page.
 */
export function createGridMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    fog: false,
    uniforms: {
      uCell: { value: HERO.floor.cell },
      uFadeR: { value: HERO.floor.fadeRadius },
      uOpacity: { value: HERO.floor.lineOpacity },
      uColor: { value: new Color(COLORS.accent) },
      uTime: { value: 0 },
      uFade: { value: 1 },
      uShockR: { value: -10 },
      uShockA: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vXZ;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vXZ = position.xy;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uCell, uFadeR, uOpacity, uTime, uFade, uShockR, uShockA;
      uniform vec3 uColor;
      varying vec2 vXZ;
      // Anti-aliased grid line that fades out where cells get smaller than a few pixels
      // (grazing angles / distance) instead of breaking into dashed fragments.
      float gridLine(vec2 g) {
        vec2 w = fwidth(g);
        vec2 l = abs(fract(g - 0.5) - 0.5) / max(w, 1e-4);
        vec2 lod = 1.0 - smoothstep(0.12, 0.45, w);
        vec2 a = (1.0 - min(l, 1.0)) * lod;
        return max(a.x, a.y);
      }
      void main() {
        float line = gridLine(vXZ / uCell);
        float major = gridLine(vXZ / (uCell * 4.0));
        float r = length(vXZ);
        float fade = smoothstep(uFadeR, uFadeR * 0.1, r);
        fade *= fade;                                         // faster falloff toward the edges
        fade *= smoothstep(-uFadeR * 0.75, -uFadeR * 0.15, vXZ.x); // and away from the text column (left)
        // a slow pulse ring travelling outward from under the crystal
        float pulse = exp(-pow(r - mod(uTime * 1.2, uFadeR * 1.2), 2.0) * 1.5) * 0.6;
        pulse += exp(-pow((r - uShockR) * 2.5, 2.0)) * uShockA * 2.0;
        float a = (line * 0.55 + major * 0.45) * fade * uOpacity * (1.0 + pulse);
        gl_FragColor = vec4(uColor * (0.7 + pulse), a * uFade);
        #include <colorspace_fragment>
      }`,
  });
}

/** White-centre → transparent-edge radial mask (alphaMap for the reflector disc). */
export function radialAlphaTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, '#fff');
  grd.addColorStop(0.45, '#888');
  grd.addColorStop(1, '#000');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/**
 * Radial glow drawn on black (premultiplied): for lightAdditive materials only
 * the RGB counts, so the falloff must live in the colour, not the alpha.
 * `hard` makes a small bright core (data packets, particles).
 */
export function additiveGlowTexture(color: string, hard = false) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  g.fillStyle = '#000';
  g.fillRect(0, 0, 128, 128);
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  if (hard) {
    grd.addColorStop(0, '#ffffff');
    grd.addColorStop(0.12, color);
    grd.addColorStop(0.35, 'rgba(0,0,0,0)');
  } else {
    grd.addColorStop(0, color);
    grd.addColorStop(0.45, 'rgba(0,0,0,0)');
  }
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/**
 * Backdrop seen only by glass. three's transmission pass clears its buffer to
 * half-transparent white when the canvas is transparent, so glass would refract
 * a milky grey void. This far plane is opaque dark green inside that pass and
 * writes nothing (rgba 0) in the normal pass, leaving the page visible.
 */
export function createGlassBackdrop(color: string) {
  const mat = new ShaderMaterial({
    depthWrite: false,
    toneMapped: false,
    uniforms: { uColor: { value: new Color(color) }, uOn: { value: 0 } },
    vertexShader: /* glsl */ `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uOn;
      void main() { gl_FragColor = vec4(uColor * uOn, uOn); }`,
  });
  const geo = new PlaneGeometry(1, 1);
  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -100;
  mesh.onBeforeRender = (renderer) => { mat.uniforms.uOn.value = renderer.getRenderTarget() ? 1 : 0; mat.uniformsNeedUpdate = true; };
  return { mesh, dispose: () => { geo.dispose(); mat.dispose(); } };
}

/**
 * Glass body tint (additive, drawn over the clear glass K at rest): a faint emerald fill
 * plus a fresnel rim, so a perfectly clear slab still reads as a solid emerald glass form
 * on a dark background (a flat slab of real glass is otherwise nearly invisible).
 */
export function createGlassTintMaterial(color: string, fill: number, rim: number) {
  return lightAdditive(new ShaderMaterial({
    toneMapped: false,
    uniforms: { uColor: { value: new Color(color) }, uFill: { value: fill }, uRim: { value: rim }, uFade: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uFill, uRim, uFade;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.5);
        gl_FragColor = vec4(uColor * (uFill + uRim * f) * uFade, 1.0);
      }`,
  }));
}
