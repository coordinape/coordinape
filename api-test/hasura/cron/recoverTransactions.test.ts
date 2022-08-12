import { BigNumber } from '@ethersproject/bignumber';
import { hexZeroPad } from '@ethersproject/bytes';
import { AddressZero } from '@ethersproject/constants';
import { parseUnits } from '@ethersproject/units';
import type { VercelRequest } from '@vercel/node';
import { DateTime } from 'luxon';

import { adminClient } from '../../../api-lib/gql/adminClient';
import handler from '../../../api/hasura/cron/recoverTransactions';
import { createDistribution } from '../../../src/lib/merkle-distributor';
import { Contracts, encodeCircleId } from '../../../src/lib/vaults';
import { uploadEpochRoot } from '../../../src/lib/vaults/distributor';
import { mint } from '../../../src/utils/testing/mint';
import { chainId, provider } from '../../../src/utils/testing/provider';

jest.mock('../../../api-lib/gql/adminClient', () => ({
  adminClient: { mutate: jest.fn(), query: jest.fn() },
}));

beforeEach(async () => {
  await mint({ token: 'DAI', amount: '1000' });
});

test('mix of invalid & valid txs', async () => {
  const req = {
    headers: { verification_key: process.env.HASURA_EVENT_SECRET },
  } as unknown as VercelRequest;
  const res: any = { status: jest.fn(() => res), json: jest.fn() };

  const contracts = new Contracts(chainId, provider);
  const chain_id = Number(contracts.chainId);
  const daiAddress = contracts.getTokenAddress('DAI');

  const createVaultTx = await contracts.vaultFactory.createCoVault(
    AddressZero,
    daiAddress
  );
  const r1 = await createVaultTx.wait();
  const vaultAddress = r1.events?.find(e => e.event === 'VaultCreated')?.args
    ?.vault;

  const token = contracts.getERC20(daiAddress);
  const total = parseUnits('1000', 18);
  await token.transfer(vaultAddress, parseUnits('1000', 18));

  const userAddress = hexZeroPad('0xabc', 20);
  const circleId = 1;
  const gifts = { [userAddress]: 1, [hexZeroPad('0xdef', 20)]: 1 };
  const dist = createDistribution(gifts, undefined, total, total);
  const distributeTx = await uploadEpochRoot(
    contracts,
    { simple_token_address: daiAddress, vault_address: vaultAddress },
    circleId,
    dist.merkleRoot,
    total
  );
  const r2 = await distributeTx.wait();
  const epochId = r2.events?.find(e => e.event === 'EpochFunded')?.args
    ?.epochId;

  const { index, proof, amount } = dist.claims[userAddress];

  const claimTx = await contracts.distributor.claim(
    vaultAddress,
    encodeCircleId(circleId),
    daiAddress,
    BigNumber.from(epochId),
    BigNumber.from(index),
    userAddress,
    amount,
    false,
    proof
  );

  const hash1 = hexZeroPad('0xa', 32);
  const earlier = DateTime.now().minus({ minutes: 5.1 });

  (adminClient.query as jest.Mock).mockImplementation((query: any) => {
    if (query.pending_vault_transactions)
      return Promise.resolve({
        pending_vault_transactions: [
          { tx_hash: '0xaaaa', created_at: DateTime.now() },
          { tx_hash: '0xdead', chain_id, created_at: earlier },
          { tx_hash: hash1, chain_id, created_at: earlier },
          {
            chain_id,
            org_id: '1',
            tx_hash: createVaultTx.hash,
            tx_type: 'Vault_Deploy',
            created_at: earlier,
          },
          {
            chain_id,
            distribution_id: 7,
            tx_hash: distributeTx.hash,
            tx_type: 'Distribution',
            created_at: earlier,
          },
          {
            chain_id,
            claim_id: 10,
            tx_hash: claimTx.hash,
            tx_type: 'Claim',
            created_at: 'earlier',
          },
        ],
      });

    if (query.distributions_by_pk)
      return Promise.resolve({
        distributions_by_pk: {
          vault: { id: 5, vault_address: vaultAddress },
          epoch: { circle_id: circleId },
          tx_hash: undefined,
          total_amount: parseUnits('1500', 18).toString(),
          distribution_json: JSON.stringify({
            previousTotal: parseUnits('500', 18).toString(),
          }),
        },
      });

    if (query.claims_by_pk)
      return Promise.resolve({
        claims_by_pk: {
          address: userAddress,
          distribution: {
            vault: { vault_address: '0xvault' },
            epoch: { circle: { id: circleId } },
          },
        },
      });
  });

  (adminClient.mutate as jest.Mock).mockImplementation((query: any) => {
    if (query.insert_vaults_one)
      return Promise.resolve({ insert_vaults_one: { id: 5 } });

    if (query.update_distributions_by_pk)
      return Promise.resolve({ update_distributions_by_pk: { id: 7 } });

    if (query.update_claims)
      return Promise.resolve({ update_claims: { affected_rows: 3 } });
  });

  await handler(req, res);

  expect(res.json).toHaveBeenCalled();
  const results = (res.json as any).mock.calls[0][0];
  expect(results).toEqual({
    processed_txs: {
      '0xaaaa': 'not old enough',
      '0xdead':
        'error: invalid hash (argument="value", value="0xdead", code=INVALID_ARGUMENT, version=providers/5.5.0)',
      [hash1]: 'error: no tx found',
      [createVaultTx.hash]: 'added vault id 5',
      [distributeTx.hash]: 'updated distribution id 7',
      [claimTx.hash]: 'updated 3 claims',
    },
    stackTraces: expect.any(Array),
  });
}, 10000);
