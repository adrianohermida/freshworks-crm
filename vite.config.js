import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { promises as fs } from 'fs';
import path from 'path';

// Ajuste para GitHub Pages
const repoName = 'freshworks-crm';

// Plugin para copiar public/index.html para docs/index.html após o build
function copyIndexHtmlPlugin() {
  return {
    name: 'copy-index-html',
    async closeBundle() {
      const src = path.resolve(__dirname, 'public/index.html');
      const dest = path.resolve(__dirname, 'docs/index.html');
      try {
        await fs.copyFile(src, dest);
        // Opcional: log para depuração
        // console.log('index.html copiado para docs/');
      } catch (err) {
        console.error('Erro ao copiar index.html:', err);
      }
    }
  };
}

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
    copyIndexHtmlPlugin(),
  ]
});