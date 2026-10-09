import { AdditiveBlending, Color, NormalBlending, ShaderMaterial } from 'three';

/**
 * Glowing path material for TubeGeometry (uv.x runs 0 → 1 along the path).
 * - Travelled part (uv.x < uProgress) is bright; the rest is a dim hint.
 * - A soft pulse runs along the travelled part.
 * - uLight (0 dark → 1 light theme) swaps additive glow for a deeper,
 *   normally-blended colour so the path stays visible on light backgrounds.
 * Fresnel-ish edge falloff makes a thin tube read as a light beam.
 */
export function createGlowTubeMaterial(opts: { bright: string; dim: string; deep: string; opacity: number; halo?: boolean }) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uLight: { value: 0 },
      uOpacity: { value: opts.opacity },
      uBright: { value: new Color(opts.bright) },
      uDim: { value: new Color(opts.dim) },
      uDeep: { value: new Color(opts.deep) },
      uHalo: { value: opts.halo ? 1 : 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying float vFres;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normal);
        vFres = abs(dot(n, normalize(-mv.xyz)));
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uProgress, uTime, uLight, uOpacity, uHalo;
      uniform vec3 uBright, uDim, uDeep;
      varying vec2 vUv;
      varying float vFres;
      void main() {
        float travelled = smoothstep(uProgress + 0.004, uProgress - 0.004, vUv.x);
        float pulse = exp(-pow((fract(vUv.x * 3.0 - uTime) - 0.5) * 9.0, 2.0)) * travelled;
        float head = exp(-pow((vUv.x - uProgress) * 60.0, 2.0));
        float edge = mix(pow(vFres, 1.5), pow(vFres, 3.0), uHalo);
        vec3 lit = mix(uBright, uDeep, uLight);
        vec3 col = mix(uDim, lit, travelled) + lit * (pulse * 0.6 + head * 1.4);
        float a = (mix(0.45, 1.0, travelled) + head) * edge * uOpacity;
        gl_FragColor = vec4(col, a);
      }`,
  });
}

/** Switch blending with the theme (additive glow on dark, normal on light). */
export function setTubeTheme(mat: ShaderMaterial, light: number) {
  mat.uniforms.uLight.value = light;
  const want = light > 0.5 ? NormalBlending : AdditiveBlending;
  if (mat.blending !== want) { mat.blending = want; mat.needsUpdate = true; }
}
