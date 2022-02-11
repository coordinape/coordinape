import './node-fetch-shim';
import { Gql } from '../src/lib/gql/GqlHasuraAdmin';

import { HASURA_GRAPHQL_ADMIN_SECRET, NODE_HASURA_URL } from './config';

export * from '../src/lib/gql/GqlHasuraAdmin';
export const gql = new Gql(NODE_HASURA_URL, HASURA_GRAPHQL_ADMIN_SECRET);