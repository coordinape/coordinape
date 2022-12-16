import { hashMessage } from '@ethersproject/hash';

import { adminClient } from '../api-lib/gql/adminClient';
import handler from '../api/login';
import { generateMessage } from '../src/features/auth/login';
import { provider } from '../src/utils/testing/provider';

let res, address;

beforeEach(async () => {
  res = { status: jest.fn(() => res), json: jest.fn() };
  address = await provider().getSigner().getAddress();
});

const sendMockReq = async (chainId: number, bad?: boolean) => {
  const data = generateMessage({ address, chainId });

  const payload = {
    address,
    data,
    hash: hashMessage(data),
    // need to use this because ganache doesn't support personal_sign
    signature: await provider().getSigner()._legacySignMessage(data),
    connectorName: 'testing',
  };

  if (bad) payload.signature = payload.signature.replace('1', '2');

  const req = { body: { input: { payload } } };
  // @ts-ignore
  return handler(req, res);
};

test('reject invalid chain id', async () => {
  await sendMockReq(777);
  expect(res.json.mock.calls[0][0].message).toEqual('unsupported chain 777');
});

test('reject invalid signature', async () => {
  await sendMockReq(1, true);
  expect(res.json.mock.calls[0][0].message).toMatch(/SIWE error/);
});

test('allow login with valid signature', async () => {
  await sendMockReq(5);
  expect(res.json.mock.calls[0][0].token).toMatch(/\d+\|[A-Za-z0-9]{40}/);

  const { profiles } = await adminClient.query({
    profiles: [
      { where: { address: { _eq: address.toLowerCase() } } },
      { connector: true },
    ],
  });

  expect(profiles[0]?.connector).toBe('testing');
});
