import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fixTransitionDelay } from './vite-plugin-fix-transition-delay';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Only load prerender plugin during build to avoid dev server issues
let prerenderPlugin: any = null;
if (process.argv.includes('build')) {
  try {
    const vitePrerender = require('vite-plugin-prerender');
    prerenderPlugin = vitePrerender.default({
      routes: ['/about', '/work', '/photography', '/info', '/contact'],
      renderer: {
        renderAfterDocumentEvent: 'render-complete',
        renderAfterTime: 5000,
        maxConcurrentRoutes: 1,
      },
    });
  } catch (e) {
    // Plugin not available or has issues, continue without it
    console.warn('Prerender plugin not available, skipping prerendering');
  }
}

export default defineConfig({
  plugins: [
    react(),
    fixTransitionDelay(),
    ...(prerenderPlugin ? [prerenderPlugin] : []),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
