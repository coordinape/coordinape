import { REACT_APP_HASURA_URL } from '../../config/env';
import { getAuthToken } from '../../services/api';

import { apiFetch, Thunder } from './__generated__/zeus';

const thunder = Thunder(async (...params) => {
  return apiFetch([
    REACT_APP_HASURA_URL,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + getAuthToken(),
      },
    },
  ])(...params);
});

export const client = {
  query: thunder('query'),
  mutate: thunder('mutation'),
  subscribe: thunder('subscription'),
};
