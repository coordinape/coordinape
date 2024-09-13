// extension/vite.config.ts
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import manifest from './public/manifest.json';

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  root: __dirname, // Use the extension directory as root
  build: {
    outDir: '../dist-extension', // Output directory for the extension
    // rollupOptions: {
    // input: {
    // popup: resolve(__dirname, 'Popup.html'),
    // background: resolve(__dirname, 'src/background/Background.ts'),
    // Add other entry points as needed
    // },
    // output: {
    //   entryFileNames: chunkInfo => {
    //     if (chunkInfo.name === 'background') return 'background/[name].js';
    //     return '[name].js';
    //   },
    //   chunkFileNames: 'js/[name].js',
    //   assetFileNames: 'assets/[name].[ext]',
    // },
    // },
    sourcemap: true,
    emptyOutDir: true,
  },
});
