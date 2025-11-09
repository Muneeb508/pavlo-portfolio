import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fixTransitionDelay } from './vite-plugin-fix-transition-delay';

export default defineConfig({
  plugins: [
    react(),
    fixTransitionDelay(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
