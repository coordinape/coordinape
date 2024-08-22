import { hashMessage } from 'viem';
import { vi } from 'vitest';

import handler from '../_api/login';
import { adminClient } from '../api-lib/gql/adminClient';
import { generateMessage } from '../src/features/auth/login';
import { testAccounts } from '../src/utils/testing/accountsHelper';
import { localCI } from '../src/utils/viem/chains';

describe('Login Handler', () => {
  let res, address, wallet;

  // we pick a different address so we don't collide with other test data
  const ADDRESS_INDEX = 8;

  beforeEach(async () => {
    res = { status: vi.fn(() => res), json: vi.fn() };
    wallet = testAccounts.getWalletClient(ADDRESS_INDEX);
    address = wallet.account.address;
  });

  const sendMockReq = async (chainId: number, bad?: boolean) => {
    const data = generateMessage({ address, chainId });

    const payload = {
      address,
      data,
      hash: hashMessage(data),
      signature: await wallet.signMessage({ message: data }),
      connectorName: 'testing',
    };

    if (bad) payload.signature = payload.signature.replace('1', '2');

    const req = {
      body: { input: { payload } },
      headers: { host: 'localhost:3000' },
    };
    // @ts-ignore
    return handler(req, res);
  };

  test('reject invalid chain id', async () => {
    await sendMockReq(777);
    expect(res.json.mock.calls[0][0].message).toEqual('unsupported chain 777');
  });

  test('reject invalid signature', async () => {
    await sendMockReq(localCI.id, true);
    expect(res.json.mock.calls[0][0].message).toMatch(/SIWE error/);
  });

  test('allow login with valid signature', async () => {
    await sendMockReq(localCI.id);
    expect(res.json.mock.calls[0][0].token).toMatch(/\d+\|[A-Za-z0-9]{40}/);

    const { profiles } = await adminClient.query(
      {
        profiles: [
          { where: { address: { _eq: address.toLowerCase() } } },
          { connector: true },
        ],
      },
      { operationName: 'test' }
    );

    expect(profiles[0]?.connector).toBe('testing');
  });
});
