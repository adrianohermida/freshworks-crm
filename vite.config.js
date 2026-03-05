import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Ajuste para GitHub Pages
const repoName = 'freshworks-crm';

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error',
  base: `/${repoName}/`, // Caminho base para GitHub Pages
  build: {
    outDir: 'docs', // Output para docs/
    emptyOutDir: true
  },
  plugins: [
    react(),
  ]
});