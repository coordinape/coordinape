import { Gql } from '../src/lib/gql/GqlHasuraAdmin';
import { NODE_HASURA_ADMIN_SECRET, NODE_HASURA_URL } from './config';

export * from '../src/lib/gql/GqlHasuraAdmin';
export const gql = new Gql(NODE_HASURA_URL, NODE_HASURA_ADMIN_SECRET);
