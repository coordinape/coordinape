import { defineConfig } from 'cypress';

import plugins from './cypress/plugins/index';

export default defineConfig({
  defaultCommandTimeout: 15000,
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return plugins(on, config);
    },
    baseUrl: 'http://localhost:undefined',
  },
});
