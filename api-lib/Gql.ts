import './node-fetch-shim';
import { AdminClient } from '../src/lib/gql/adminClient';

import { HASURA_GRAPHQL_ADMIN_SECRET, NODE_HASURA_URL } from './config';

export * from '../src/lib/gql/adminClient';
export const gql = new AdminClient(
  NODE_HASURA_URL,
  HASURA_GRAPHQL_ADMIN_SECRET
);
