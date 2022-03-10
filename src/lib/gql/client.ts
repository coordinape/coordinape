import { REACT_APP_HASURA_URL } from '../../config/env';
import { getAuthToken } from '../../services/api';

import { apiFetch, Thunder } from './__generated__/zeusUser';

const thunder = Thunder(async (...params) => {
  const fetch = apiFetch([
    REACT_APP_HASURA_URL,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + getAuthToken(),
      },
    },
  ]);

  return fetch(...params);
});

export const client = {
  query: thunder('query'),
  mutate: thunder('mutation'),
  subscribe: thunder('subscription'),
};
