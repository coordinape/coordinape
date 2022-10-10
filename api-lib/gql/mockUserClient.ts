import { NODE_HASURA_URL } from '../config';

import { makeThunder, UserOptions } from './makeThunder';

const thunder = (userOptions: UserOptions) =>
  makeThunder({
    url: NODE_HASURA_URL,
    options: userOptions,
  });

export const mockUserClient = (userOptions: UserOptions) => ({
  query: thunder(userOptions)('query'),
  mutate: thunder(userOptions)('mutation'),
  subscribe: thunder(userOptions)('subscription'),
});
