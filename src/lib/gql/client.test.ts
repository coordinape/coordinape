vi.mock('./__generated__/zeus', async () => {
  const originalModule = await vi.importActual('./__generated__/zeus');

  return {
    ...originalModule,
    Thunder: vi.fn(callback => () => callback),
    apiFetch: vi.fn(args => () => args),
  };
});

import { setAuthToken } from '../../features/auth/token';
import { TEST_SKIP_AUTH } from 'utils/testing/api';

import { client, setMockHeaders } from './client';

test('set Bearer authorization with token', async () => {
  setAuthToken('mock-token');
  const args = (await client.query(
    {
      profiles: [{}, { name: true }],
    },
    { operationName: 'test__getProfile' }
  )) as unknown as [string, Record<string, any>];
  expect(args[1].headers.Authorization).toEqual('Bearer mock-token');
});

test('set mock headers', async () => {
  const mockHeaders = {
    'x-hasura-role': 'user',
    'x-hasura-user-id': '111',
    'x-hasura-address': '0xface0101face',
  };
  setMockHeaders(mockHeaders);
  const args = (await client.query(
    {
      profiles: [{}, { name: true }],
    },
    { operationName: 'test__getProfile' }
  )) as unknown as [string, Record<string, any>];
  expect(args[1].headers).toMatchObject({
    ...mockHeaders,
    Authorization: TEST_SKIP_AUTH,
  });
});
