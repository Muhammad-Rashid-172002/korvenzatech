import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ isSsrBuild }) => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      // The shared WebGL Experience is lazy: it boots after load/idle on capable (tier 1/2) devices only and
      // never blocks first paint. three.js core is split into its own long-cacheable vendor chunk (~700 kB min).
      chunkSizeWarningLimit: 800,
      rollupOptions: isSsrBuild ? undefined : {
        output: {
          manualChunks(id: string) {
            if (id.includes('/node_modules/three/')) return 'three';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
