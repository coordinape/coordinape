import { Gql } from '../src/lib/gql/GqlHasuraAdmin';
import { HASURA_ADMIN_SECRET, HASURA_URL } from './config';

export * from '../src/lib/gql/GqlHasuraAdmin';
export const gql = new Gql(HASURA_URL, HASURA_ADMIN_SECRET);
