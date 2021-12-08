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
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    },
  },
  destination: './src/lib/gqty/index.ts',
  subscriptions: false,
  javascriptOutput: false,
};

module.exports = config;
