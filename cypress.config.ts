import { defineConfig } from 'cypress';
import pick from 'lodash/pick';

import plugins from './cypress/plugins/index';

export default defineConfig({
  defaultCommandTimeout: 60000,
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return plugins(on, config);
    },
  },
  env: {
    ...pick(process.env, [
      'HARDHAT_GANACHE_PORT',
      'HASURA_GRAPHQL_ADMIN_SECRET',
      'LOCAL_WEB_PORT',
      'NODE_HASURA_URL',
    ]),
  },
});
