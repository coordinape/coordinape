import { REACT_APP_HASURA_URL } from '../../config/env';
import { getAuthToken } from '../../services/api';

import { apiFetch, Thunder } from './__generated__/zeus';

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
  query: thunder('query'),
  mutate: thunder('mutation'),
  subscribe: thunder('subscription'),
  superQuery: makeThunder({ 'X-Preferred-Role': 'superadmin' })('query'),
};
