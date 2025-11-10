import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fixTransitionDelay } from './vite-plugin-fix-transition-delay';
import vitePrerender from 'vite-plugin-prerender';

export default defineConfig({
  plugins: [
    react(),
    fixTransitionDelay(),
    vitePrerender({
      routes: ['/about', '/work', '/photography', '/info', '/contact'],
      renderer: {
        renderAfterDocumentEvent: 'render-complete',
        renderAfterTime: 5000,
        maxConcurrentRoutes: 1,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
