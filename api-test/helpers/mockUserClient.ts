import { NODE_HASURA_URL } from '../../api-lib/config';
import { makeThunder } from '../../api-lib/gql/makeThunder';
import { TEST_SKIP_AUTH } from '../../src/utils/testing/api';

export type UserOptions = {
  profileId: number;
  address: string;
};

const mapOptionsToHeaders = (options: UserOptions) => ({
  'x-hasura-role': 'user',
  'x-hasura-address': options.address,
  'x-hasura-user-id': options.profileId.toString(),
  authorization: TEST_SKIP_AUTH,
});

const thunder = (userOptions: UserOptions) =>
  makeThunder({
    url: NODE_HASURA_URL,
    headers: mapOptionsToHeaders(userOptions),
  });

export const mockUserClient = (userOptions: UserOptions) => ({
  query: thunder(userOptions)('query'),
  mutate: thunder(userOptions)('mutation'),
  subscribe: thunder(userOptions)('subscription'),
});
