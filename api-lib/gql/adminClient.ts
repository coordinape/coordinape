import { HASURA_GRAPHQL_ADMIN_SECRET, NODE_HASURA_URL } from '../config';

import { apiFetch, Thunder } from './__generated__/zeus';

const thunder = Thunder(async (...params) => {
  return apiFetch([
    NODE_HASURA_URL,
    {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
        'Hasura-Client-Name': 'serverless-function',
      },
    },
  ])(...params);
});

export const adminClient = {
  query: thunder('query'),
  mutate: thunder('mutation'),
  subscribe: thunder('subscription'),
};
