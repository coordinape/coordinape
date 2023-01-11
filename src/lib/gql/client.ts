import { getAuthToken } from 'features/auth';

import { REACT_APP_HASURA_URL } from '../../config/env';

import { apiFetch, Thunder, ZeusScalars } from './__generated__/zeus';

const scalars = ZeusScalars({
  timestamp: {
    decode: (e: unknown) => e as Date,
    encode: (e: unknown) => (e as Date).toISOString(),
  },
  timestamptz: {
    decode: (e: unknown) => e as string,
    encode: (e: unknown) => (e as Date).toISOString(),
  },
  citext: {
    decode: (e: unknown) => e as string,
    encode: (e: unknown) => e as string,
  },
  bigint: {
    decode: (e: unknown) => e as number,
    encode: (e: unknown) => (e as number).toString(),
  },
  numeric: {
    decode: (e: unknown) => e as number,
    encode: (e: unknown) => (e as number).toString(),
  },
});

const makeThunder = (headers = {}) =>
  Thunder(async (...params) =>
    apiFetch([
      REACT_APP_HASURA_URL,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + getAuthToken(),
          'Hasura-Client-Name': 'web',
          ...headers,
        },
      },
    ])(...params)
  );

const thunder = makeThunder();

export const client = {
  query: thunder('query', { scalars }),
  mutate: thunder('mutation', { scalars }),
  subscribe: thunder('subscription', { scalars }),
};
