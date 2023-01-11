import { HASURA_GRAPHQL_ADMIN_SECRET, NODE_HASURA_URL } from '../config';

import { ZeusScalars } from './__generated__/zeus';
import { makeThunder } from './makeThunder';

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

const thunder = makeThunder({
  url: NODE_HASURA_URL,
  headers: {
    'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
    'Hasura-Client-Name': 'serverless-function',
  },
  // 45 sec - vercel has a 60s timeout and we are trying to figure out why we are hitting it
  // so setting this lower might help us -g
  timeout: 45 * 1000,
});

export const adminClient = {
  query: thunder('query', { scalars }),
  mutate: thunder('mutation', { scalars }),
  subscribe: thunder('subscription', { scalars }),
};
