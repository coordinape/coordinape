import { HASURA_GRAPHQL_ADMIN_SECRET, NODE_HASURA_URL } from '../config';

import { makeThunder } from './makeThunder';

const thunder = makeThunder(NODE_HASURA_URL, HASURA_GRAPHQL_ADMIN_SECRET);

export const adminClient = {
  query: thunder('query'),
  mutate: thunder('mutation'),
  subscribe: thunder('subscription'),
};
