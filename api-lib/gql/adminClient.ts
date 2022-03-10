import '../node-fetch-shim';

import { apiFetch, Thunder } from '../../src/lib/gql/__generated__/zeusAdmin';
import { HASURA_GRAPHQL_ADMIN_SECRET, NODE_HASURA_URL } from '../config';

const thunder = Thunder(async (...params) => {
  return apiFetch([
    NODE_HASURA_URL,
    {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
      },
    },
  ])(...params);
});

export const adminClient = {
  query: thunder('query'),
  mutate: thunder('mutation'),
  subscribe: thunder('subscription'),
};
