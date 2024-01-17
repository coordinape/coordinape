import reactRefresh from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// import EnvironmentPlugin from 'vite-plugin-environment';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgrPlugin from 'vite-plugin-svgr';
// import vercel from 'vite-plugin-vercel';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  appType: 'mpa',
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
    // vercel(),
    // EnvironmentPlugin('all'),
    nodePolyfills(),
    tsconfigPaths(),
    reactRefresh(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  test: {
    environment: 'happy-dom',
    include: ['**/*.test.tsx', '**/*.test.ts'],
    globals: true,
    maxConcurrency: 1,
    fileParallelism: false,
    setupFiles: ['./src/setupTests.ts'],
  },
});
