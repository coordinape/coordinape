import { getAuthToken } from 'features/auth';
import isEmpty from 'lodash/isEmpty';

import { REACT_APP_HASURA_URL } from '../../config/env';
import { TEST_SKIP_AUTH } from 'utils/testing/api';

import {
  apiFetch,
  FetchFunction,
  fullChainConstruct,
  GenericOperation,
  GraphQLTypes,
  InputType,
  OperationOptions,
  ValueTypes,
} from './__generated__/zeus';
import { Ops } from './__generated__/zeus/const';

let mockHeaders: Record<string, string> = {};

export const setMockHeaders = (h: Record<string, string>) => {
  mockHeaders = h;
};

export const ThunderButCool =
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
  ThunderButCool(async (...params) =>
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

// const t = ReturnType<thunder('query')>
// type thunderParams = Parameters<typeof Return thunder('query')>;

export const client = {
  query: thunder('query'),
  mutate: thunder('mutation'),
  subscribe: thunder('subscription'),
};
