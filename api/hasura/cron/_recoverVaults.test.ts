import { AddressZero } from '@ethersproject/constants';
import type { VercelRequest } from '@vercel/node';
import { DateTime } from 'luxon';

import { Contracts } from '../../../api-lib/contracts';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { chainId, provider } from '../../../src/utils/testing/provider';

import handler from './recoverVaults';

jest.mock('../../../api-lib/gql/adminClient', () => ({
  adminClient: { mutate: jest.fn(), query: jest.fn() },
}));

test('mix of invalid & valid txs', async () => {
  const req = {
    headers: { verification_key: process.env.HASURA_EVENT_SECRET },
  } as unknown as VercelRequest;
  const res: any = { status: jest.fn(() => res), json: jest.fn() };

  const contracts = new Contracts(chainId, provider, true);
  const chain_id = Number(contracts.chainId);
  const createVaultTx = await contracts.vaultFactory.createCoVault(
    contracts.getTokenAddress('DAI'),
    AddressZero
  );

  const validHashNoTx =
    '0x81abe75c28e2ed37af2437e26233cecc2edd655caee273ba4eed808535896fe6';

  (adminClient.query as jest.Mock).mockImplementation(() =>
    Promise.resolve({
      pending_vault_transactions: [
        { tx_hash: '0xdead', chain_id },
        { tx_hash: validHashNoTx, chain_id },
        {
          chain_id,
          org_id: '1',
          tx_hash: createVaultTx.hash,
          created_at: DateTime.now().minus({ minutes: 5.1 }),
        },
      ],
    })
  );

  (adminClient.mutate as jest.Mock).mockImplementation(() =>
    Promise.resolve({ insert_vaults_one: { id: 5 } })
  );

  await handler(req, res);

  expect(res.json).toHaveBeenCalled();
  const results = (res.json as any).mock.calls[0][0];
  expect(results).toEqual({
    processed_txs: {
      '0xdead':
        'error: invalid hash (argument="value", value="0xdead", code=INVALID_ARGUMENT, version=providers/5.5.0)',
      [validHashNoTx]: 'no tx found',
      [createVaultTx.hash]: 'added vault id 5',
    },
  });
});
