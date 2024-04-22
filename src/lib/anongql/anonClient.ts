import type { SubscriptionHookOptions } from '@apollo/client';
import { gql, useSubscription } from '@apollo/client';

import { VITE_HASURA_URL } from '../../config/env';

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
  ThunderRequireOperationName(async (...params) =>
    apiFetch([
      VITE_HASURA_URL,
      {
        method: 'POST',
        headers: {
          'Hasura-Client-Name': 'web',
          'x-hasura-role': 'anon',
          ...headers,
        },
      },
    ])(...params)
  );

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
