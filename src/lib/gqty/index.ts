/**
 * GQTY: You can safely modify this file and Query Fetcher based on your needs
 */

import assert from 'assert';

import { createReactClient } from '@gqty/react';
import type { QueryFetcher } from 'gqty';
import { createClient } from 'gqty';

import type {
  GeneratedSchema,
  SchemaObjectTypes,
  SchemaObjectTypesNames,
} from './schema.generated';
import { generatedSchema, scalarsEnumsHash } from './schema.generated';

const queryFetcher: QueryFetcher = async function (query, variables) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (process.env.API_TOKEN) {
    // TODO: replace this with value from login (use Axios interceptor?)
    headers.Authorization = `Bearer ${process.env.API_TOKEN}`;
  } else if (process.env.HASURA_ADMIN_SECRET) {
    headers['x-hasura-admin-secret'] = process.env.HASURA_ADMIN_SECRET;
  }

  assert(process.env.REACT_APP_HASURA_URL, 'REACT_APP_HASURA_URL is not set');
  const response = await fetch(process.env.REACT_APP_HASURA_URL, {
    body: JSON.stringify({ query, variables }),
    method: 'POST',
    mode: 'cors',
    headers,
  });

  const json = await response.json();

  return json;
};

export const client = createClient<
  GeneratedSchema,
  SchemaObjectTypesNames,
  SchemaObjectTypes
>({
  schema: generatedSchema,
  scalarsEnumsHash,
  queryFetcher,
});

const { query, mutation, mutate, subscription, resolved, refetch, track } =
  client;

export { query, mutation, mutate, subscription, resolved, refetch, track };

const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    // Set this flag as "true" if your usage involves React Suspense
    // Keep in mind that you can overwrite it in a per-hook basis
    suspense: false,

    // Set this flag based on your needs
    staleWhileRevalidate: false,
  },
});

export {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
};

export * from './schema.generated';
