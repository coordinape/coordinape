import { HASURA_GRAPHQL_ADMIN_SECRET, NODE_HASURA_URL } from '../config';

import { makeThunder } from './makeThunder';

const thunder = makeThunder({
  url: NODE_HASURA_URL,
  headers: {
    'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
    'Hasura-Client-Name': 'serverless-function',
  },
  // 45 sec - vercel has a 60s timeout and we are trying to figure out why we are hitting it
  // so setting this lower might help us -g
  timeout: 45 * 1000,
});

export const adminClient = {
  query: thunder('query'),
  mutate: thunder('mutation'),
  subscribe: thunder('subscription'),
};
