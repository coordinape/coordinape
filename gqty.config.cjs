require('dotenv').config();

/**
 * @type {import("@gqty/cli").GQtyConfig}
 */
const config = {
  react: true,
  scalarTypes: { DateTime: 'string' },
  introspection: {
    endpoint: process.env.REACT_APP_HASURA_URL,
    headers: {
      // this only needs to be set when we're doing `gqty generate`
      // and can probably be replaced in the future with a user-level auth token
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    },
  },
  destination: './src/lib/gqty/index.ts',
  subscriptions: false,
  javascriptOutput: false,
};

module.exports = config;
