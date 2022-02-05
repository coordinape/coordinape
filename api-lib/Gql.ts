import './node-fetch-shim';
import { Gql } from '../src/lib/gql/GqlHasuraAdmin';
import { SCRIPT_HASURA_ADMIN_SECRET, NODE_HASURA_URL } from './config';

export * from '../src/lib/gql/GqlHasuraAdmin';
export const gql = new Gql(NODE_HASURA_URL, SCRIPT_HASURA_ADMIN_SECRET);
