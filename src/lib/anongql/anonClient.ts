import type { SubscriptionHookOptions } from '@apollo/client';
import { gql, useSubscription } from '@apollo/client';

import { Ops } from './__generated__/zeus/const';
import {
  apiFetch,
  FetchFunction,
  fullChainConstruct,
  GenericOperation,
  GraphQLTypes,
  InputType,
  OperationOptions,
  ValueTypes,
  Zeus,
} from './__generated__/zeus/index';

/* A bit verbose TS, but this allows us to enforce OperationName as a required */
export const ThunderRequireOperationName =
  (fn: FetchFunction) =>
  <
    O extends keyof typeof Ops,
    R extends keyof ValueTypes = GenericOperation<O>,
  >(
    operation: O
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z | ValueTypes[R],
    ops: Omit<OperationOptions, 'operationName'> & { operationName: string }
  ) =>
    fullChainConstruct(fn)(operation)(o as any, ops) as Promise<
      InputType<GraphQLTypes[R], Z>
    >;

const makeThunder = (headers = {}) =>
  ThunderRequireOperationName(async (...params) => {
    // Get the Hasura URL from environment variables
    const hasuraUrl =
      typeof process !== 'undefined' && process.env.VITE_HASURA_URL
        ? process.env.VITE_HASURA_URL
        : typeof window !== 'undefined' && (window as any).env?.VITE_HASURA_URL
          ? (window as any).env.VITE_HASURA_URL
          : typeof import.meta !== 'undefined' &&
              (import.meta as any).env?.VITE_HASURA_URL
            ? (import.meta as any).env.VITE_HASURA_URL
            : 'http://localhost:8080/v1/graphql'; // Fallback

    return apiFetch([
      hasuraUrl,
      {
        method: 'POST',
        headers: {
          'Hasura-Client-Name': 'web',
          Authorization: 'anon',
          ...headers,
        },
      },
    ])(...params);
  });

const thunder = makeThunder();

export const anonClient = {
  query: thunder('query'),
  // mutate: thunder('mutation'),
  // subscribe: thunder('subscription'),
};

export function useTypedSubscription<
  Z extends ValueTypes[O],
  O extends 'subscription_root',
>(
  subscription: Z | ValueTypes[O],
  options?: SubscriptionHookOptions<InputType<GraphQLTypes[O], Z>>,
  operationOptions?: OperationOptions
) {
  // @ts-ignore
  return useSubscription<InputType<GraphQLTypes[O], Z>>(
    // @ts-ignore
    gql(Zeus('subscription', subscription, operationOptions)),
    // @ts-ignore
    options
  );
}
