import reactRefresh from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgrPlugin from 'vite-plugin-svgr';
import vercel from 'vite-plugin-vercel';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/

const env = loadEnv('all', process.cwd());

export default defineConfig({
  appType: 'spa',
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env': {},
    global: {
      window: {
        origin: 'http://localhost:3000',
      },
    },
  },
  plugins: [
    vercel(),
    nodePolyfills(),
    tsconfigPaths(),
    reactRefresh({
      include: '**/*.tsx',
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'bundle-stats.html',
    }) as PluginOption,
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      '^/api/.*': {
        target: `http://localhost:${env.VITE_API_PORT}`,
        secure: false,
        ws: false,
      },
      '/stats/js/script.js': {
        target: `http://localhost:${env.VITE_API_PORT}`,
        secure: false,
        ws: false,
      },
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['**/*.test.tsx', '**/*.test.ts'],
    globals: true,
    maxConcurrency: 1,
    fileParallelism: false,
    setupFiles: ['./src/setupTests.ts'],
  },
});
