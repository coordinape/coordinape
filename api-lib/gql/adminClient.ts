import { HASURA_GRAPHQL_ADMIN_SECRET, NODE_HASURA_URL } from '../config';

import { makeThunder } from './makeThunder';

const thunder = makeThunder({
  url: NODE_HASURA_URL,
  options: { adminSecret: HASURA_GRAPHQL_ADMIN_SECRET },
});

export const adminClient = {
  query: thunder('query'),
  mutate: thunder('mutation'),
  subscribe: thunder('subscription'),
};
