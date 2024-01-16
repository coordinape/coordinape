import reactRefresh from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgrPlugin from 'vite-plugin-svgr';
// import vercel from 'vite-plugin-vercel';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
  },
  define: {
    'process.env': {},
    global: {},
  },
  plugins: [
    // vercel(),
    EnvironmentPlugin('all', { prefix: 'REACT_APP_' }),
    nodePolyfills(),
    tsconfigPaths(),
    reactRefresh(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
  ],
  test: {
    environment: 'happy-dom',
    include: ['**/*.test.tsx', '**/*.test.ts'],
    globals: true,
    poolOptions: {
      threads: {
        singleThread: true,
        isolate: true,
        maxThreads: 1,
      },
    },
  },
});
