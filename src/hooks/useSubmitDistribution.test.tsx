import { act, render, waitFor } from '@testing-library/react';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { Asset } from 'services/contracts';
import { restoreSnapshot, takeSnapshot, TestWrapper } from 'utils/testing';

import { Vault } from './gql/useVaults';
import { useContracts } from './useContracts';
import { useSubmitDistribution } from './useSubmitDistribution';
import { useVaultFactory } from './useVaultFactory';
import { useVaultRouter } from './useVaultRouter';

let snapshotId: string;

jest.mock('lib/gql/mutations', () => {
  return {
    addVault: jest.fn().mockReturnValue({
      created_at: new Date(),
      created_by: 21,
      decimals: 18,
      id: 2,
      org_id: 2,
      simple_token_address: '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521',
      symbol: 'DAI',
      token_address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      updated_at: new Date(),
      vault_address: '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521',
    }),
    useSaveEpochDistribution: jest.fn().mockReturnValue({
      mutateAsync: jest.fn().mockReturnValue({
        id: 2,
      }),
    }),
    useUpdateDistribution: jest.fn().mockReturnValue({
      mutateAsync: jest.fn().mockReturnValue({
        id: 2,
      }),
    }),
  };
});

beforeAll(async () => {
  snapshotId = await takeSnapshot();
});

afterAll(async () => {
  await restoreSnapshot(snapshotId);
});

test('submit distribution', async () => {
  let vaults: GraphQLTypes['vaults'];
  let response: boolean;

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const submitDistribution = useSubmitDistribution();

    const contracts = useContracts();
    const { depositToken } = useVaultRouter(contracts);
    if (!contracts) return null;

    createVault({ simpleTokenAddress: '0x0', type: Asset.DAI })
      .then(v => {
        if (v) {
          vaults = v as GraphQLTypes['vaults'];
          return depositToken(vaults, 1000);
        }
      })
      .then(() => {
        if (!vaults) return;
        const vault: Vault = [
          {
            created_at: new Date(),
            created_by: vaults.created_by,
            symbol: vaults.symbol,
            token_address: vaults.token_address,
            simple_token_address: vaults.simple_token_address,
            decimals: vaults.decimals,
            id: vaults.id,
            org_id: vaults.org_id,
            vault_address: vaults.vault_address,
            updated_at: vaults.updated_at,
          },
        ];
        console.log(vault); // eslint-disable-line no-console

        submitDistribution({
          amount: 900,
          vault,
          circleId: 2,
          epochId: 2,
          users,
          gifts,
        }).then(r => (response = r));
      });

    return null;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  await waitFor(
    () => {
      expect(response).toBeTruthy();
      expect(vaults).toBeTruthy();
    },
    { timeout: 60000 }
  );
}, 60000);

const users: Record<string, number> = {
  '0x0000000000000000000000000000000000000001': 15,
  '0x0000000000000000000000000000000000000002': 13,
  '0x0000000000000000000000000000000000000003': 14,
};

const gifts = {
  '0x0000000000000000000000000000000000000001': 200,
  '0x0000000000000000000000000000000000000002': 300,
  '0x0000000000000000000000000000000000000003': 400,
};
