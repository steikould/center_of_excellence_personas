import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the built atlas can be served from any sub-path the
  // enterprise deployment platform hands out.
  base: './',
  build: { outDir: 'dist', sourcemap: true },
});
