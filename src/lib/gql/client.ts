import { getAuthToken } from 'features/auth';
import isEmpty from 'lodash/isEmpty';

import { REACT_APP_HASURA_URL } from '../../config/env';
import { TEST_SKIP_AUTH } from 'utils/testing/api';

import { apiFetch, Thunder } from './__generated__/zeus';

let mockHeaders: Record<string, string> = {};

export const setMockHeaders = (h: Record<string, string>) => {
  mockHeaders = h;
};

const makeThunder = (headers = {}) =>
  Thunder(async (...params) =>
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
