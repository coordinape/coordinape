import { Gql } from '../src/lib/gql/GqlHasuraAdmin';

import { LOCAL_HASURA_ADMIN_SECRET, LOCAL_HASURA_URL } from './config';

export * from '../src/lib/gql/GqlHasuraAdmin';
export const gql = new Gql(LOCAL_HASURA_URL, LOCAL_HASURA_ADMIN_SECRET);
