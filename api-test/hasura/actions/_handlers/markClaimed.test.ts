import { AddressZero } from '@ethersproject/constants';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { updateClaims } from '../../../../api/hasura/actions/_handlers/markClaimed';
import { Contracts } from '../../../../src/lib/vaults';
import { chainId, provider } from '../../../../src/utils/testing/provider';

jest.mock('../../../../api-lib/gql/adminClient', () => ({
  adminClient: { mutate: jest.fn(), query: jest.fn() },
}));

const mockClient = {
  query: adminClient.query as jest.Mock,
  mutate: adminClient.mutate as jest.Mock,
};

const mockClaimData = (address?: string) => ({
  distribution: {
    id: 1,
    vault: {
      id: 2,
      org_id: 3,
      symbol: 'DAI',
      chain_id: chainId,
      decimals: 18,
      vault_address: address || '0x1',
      simple_token_address: AddressZero,
    },
    epoch: { circle_id: 1 },
  },
});

test("don't update claim not owned by profile", async () => {
  mockClient.query.mockImplementation(async () => ({
    claims: [],
  }));

  expect(async () => {
    await updateClaims(1, 2, '0xabc');
  }).rejects.toThrow('no claim with id 2 & profile_id 1');
});

test('reject if no claims were updated', async () => {
  mockClient.query.mockImplementation(async () => ({
    claims: [mockClaimData()],
  }));

  mockClient.mutate.mockImplementation(async () => ({
    update_claims: {
      returning: [],
    },
  }));

  expect(async () => {
    await updateClaims(1, 2, '0xabc');
  }).rejects.toThrow('updated 0 claims');
});

test('create interaction_event with unwrapped amount', async () => {
  const contracts = new Contracts(chainId, provider);
  const { address } = await contracts.createVault('DAI', true);
  let actual;

  mockClient.query.mockImplementation(async () => ({
    claims: [mockClaimData(address)],
  }));

  mockClient.mutate.mockImplementation(async (query: any) => {
    if (query.update_claims)
      return {
        update_claims: {
          returning: [{ id: 17, new_amount: 10 }],
        },
      };

    if (query.insert_interaction_events_one) {
      actual = query.insert_interaction_events_one[0].object;
      return {
        insert_interaction_events_one: {
          __typename: 'insert_interaction_events_one',
        },
      };
    }
  });

  const result = await updateClaims(1, 2, '0xabc');
  expect(result).toEqual([17]);
  expect(actual.profile_id).toBe(1);
  expect(actual.org_id).toBe(3);
  expect(actual.data.symbol).toBe('Yearn DAI');
  const amount = actual.data.amount;
  expect(amount).toBeGreaterThan(10);
});
