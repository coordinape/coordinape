/**
 * GQTY: You can safely modify this file and Query Fetcher based on your needs
 */

// import assert from 'assert';

import { createReactClient } from '@gqty/react';
import axios from 'axios';
import type { QueryFetcher } from 'gqty';
import { createClient } from 'gqty';

import type {
  GeneratedSchema,
  SchemaObjectTypes,
  SchemaObjectTypesNames,
} from './schema.generated';
import { generatedSchema, scalarsEnumsHash } from './schema.generated';

// assert(process.env.REACT_APP_HASURA_URL, 'REACT_APP_HASURA_URL is not set');
const axiosInstance = axios.create({
  method: 'POST',
  baseURL: process.env.REACT_APP_HASURA_URL || 'http://missingurl.net',
  headers: { 'Content-Type': 'application/json' },
});

const queryFetcher: QueryFetcher = async function (query, variables) {
  const response = await axiosInstance({ data: { query, variables } });
  const json = await response.data;
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

export {
  query,
  mutation,
  mutate,
  subscription,
  resolved,
  refetch,
  track,
  axiosInstance as axios,
};

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
    suspense: true,

    // Set this flag based on your needs
    staleWhileRevalidate: true,
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
