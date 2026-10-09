import { Color, ShaderMaterial, Texture } from 'three';

/**
 * Phone display: rounded-corner screen that slides from one texture to the next
 * (uMix 0 → 1) and carries a faint glass sheen that moves with the phone's tilt.
 */
export function createPhoneScreenMaterial(aspect: number) {
  return new ShaderMaterial({
    transparent: true,
    toneMapped: false,
    uniforms: {
      uA: { value: null as Texture | null },
      uB: { value: null as Texture | null },
      uMix: { value: 0 },
      uAspect: { value: aspect },
      uRadius: { value: 0.11 },
      uSheen: { value: 0 },
      uBright: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uA, uB;
      uniform float uMix, uAspect, uRadius, uSheen, uBright;
      varying vec2 vUv;
      float sdRound(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
      void main() {
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
        float d = sdRound(p, vec2(uAspect, 1.0) * 0.5, uRadius * uAspect);
        float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
        // Push transition: the next screen slides up from the bottom, like scrolling the app.
        float m = smoothstep(0.0, 1.0, uMix);
        vec3 col;
        if (vUv.y >= m) col = texture2D(uA, vec2(vUv.x, vUv.y - m)).rgb;
        else col = texture2D(uB, vec2(vUv.x, vUv.y - m + 1.0)).rgb;
        col *= 1.0 - 0.25 * exp(-abs(vUv.y - m) * 90.0) * step(0.001, m) * step(m, 0.999);
        col *= uBright;
        float sheen = smoothstep(0.35, 0.0, abs(vUv.x + vUv.y * 0.6 - 0.55 - uSheen)) * 0.08;
        gl_FragColor = vec4(col + sheen, alpha);
        #include <colorspace_fragment>
      }`,
  });
}

/**
 * Card backdrop drawn straight in clip space (fills the view rectangle): deep
 * green-black base, a brand-coloured light behind the phones, and rounded top
 * corners matching the card radius so the WebGL rect never pokes out.
 */
export function createBackdropMaterial(brand: string, accent: string) {
  return new ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    transparent: true,
    toneMapped: false,
    uniforms: {
      uSize: { value: [1, 1] as [number, number] },
      uRadius: { value: 24 },
      uBrand: { value: new Color(brand) },
      uAccent: { value: new Color(accent) },
      uBase0: { value: new Color('#040A08') },
      uBase1: { value: new Color('#0C1A15') },
      uHover: { value: 0 },
      uLight: { value: [0.62, 0.55] as [number, number] },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec2 uSize, uLight;
      uniform float uRadius, uHover;
      uniform vec3 uBrand, uAccent, uBase0, uBase1;
      varying vec2 vUv;
      void main() {
        vec2 px = vUv * uSize;
        // Rounded top corners only (the bottom edge meets the card text).
        vec2 c = vec2(clamp(px.x, uRadius, uSize.x - uRadius), min(px.y, uSize.y - uRadius));
        float d = (px.y > uSize.y - uRadius) ? length(px - c) - uRadius : -1.0;
        float alpha = 1.0 - smoothstep(-0.75, 0.75, d);
        vec2 q = (vUv - uLight) * vec2(uSize.x / uSize.y, 1.0);
        float glow = exp(-dot(q, q) * 4.5) * (0.22 + uHover * 0.12);
        vec2 q2 = (vUv - vec2(0.18, 0.85)) * vec2(uSize.x / uSize.y, 1.0);
        float glow2 = exp(-dot(q2, q2) * 7.0) * 0.06;
        vec3 base = mix(uBase0, uBase1, vUv.y);
        vec3 col = base + uBrand * glow + uAccent * glow2;
        col *= 1.0 - 0.25 * length(vUv - 0.5);
        gl_FragColor = vec4(col, alpha);
        #include <colorspace_fragment>
      }`,
  });
}
