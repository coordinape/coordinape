import { gql, useSubscription } from '@apollo/client';
import type { SubscriptionHookOptions } from '@apollo/client';
import { getAuthToken } from 'features/auth';
import isEmpty from 'lodash/isEmpty';

import { REACT_APP_HASURA_URL } from '../../config/env';
import {
  Zeus,
  apiFetch,
  FetchFunction,
  fullChainConstruct,
  GenericOperation,
  GraphQLTypes,
  InputType,
  OperationOptions,
  ValueTypes,
} from '../gql/__generated__/zeus/index';
import { TEST_SKIP_AUTH } from 'utils/testing/api';

import { Ops } from './__generated__/zeus/const';

let mockHeaders: Record<string, string> = {};

export const setMockHeaders = (h: Record<string, string>) => {
  mockHeaders = h;
};

/* A bit verbose TS, but this allows us to enforce OperationName as a required */
export const ThunderRequireOperationName =
  (fn: FetchFunction) =>
  <
    O extends keyof typeof Ops,
    R extends keyof ValueTypes = GenericOperation<O>
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
      REACT_APP_HASURA_URL,
      {
        method: 'POST',
        headers: {
          Authorization: isEmpty(mockHeaders)
            ? 'Bearer ' + getAuthToken()
            : TEST_SKIP_AUTH,
          'Hasura-Client-Name': 'web',
          ...mockHeaders,
          ...headers,
        },
      },
    ])(...params)
  );

const thunder = makeThunder();

export const client = {
  query: thunder('query'),
  mutate: thunder('mutation'),
  subscribe: thunder('subscription'),
};

export function useTypedSubscription<
  Z extends ValueTypes[O],
  O extends 'subscription_root'
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
