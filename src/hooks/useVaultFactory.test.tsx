import { act, render, waitFor } from '@testing-library/react';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';
import { Asset } from 'lib/vaults';

import { restoreSnapshot, takeSnapshot, TestWrapper } from 'utils/testing';

import { useContracts } from './useContracts';
import { useVaultFactory } from './useVaultFactory';

let snapshotId: string;

jest.mock('lib/gql/mutations', () => {
  return {
    addVault: jest.fn().mockReturnValue(
      Promise.resolve({
        insert_vaults_one: {
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
        },
      })
    ),
  };
});

beforeAll(async () => {
  snapshotId = await takeSnapshot();
});

afterAll(async () => {
  await restoreSnapshot(snapshotId);
});

test('create a vault', async () => {
  let vault: GraphQLTypes['vaults'];
  let daiAddress: string;

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const contracts = useContracts();
    if (!contracts) return null;

    daiAddress = contracts.getToken('DAI').address;

    createVault({ simpleTokenAddress: '0x0', type: Asset.DAI }).then(v => {
      if (v) vault = v as GraphQLTypes['vaults'];
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
      expect(vault).toBeTruthy();
      expect(vault.vault_address).toMatch(/0x[a-fA-F0-9]{40}/);
      expect(vault.token_address).toEqual(daiAddress);
      expect(vault.decimals).toEqual(18);
    },
    { timeout: 10000 }
  );
}, 10000);

test('create a vault with a custom asset', async () => {
  let vault: GraphQLTypes['vaults'];
  const yamAddress = '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521';

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const contracts = useContracts();
    if (!contracts) return null;

    createVault({ simpleTokenAddress: yamAddress }).then(v => {
      if (v) vault = v as GraphQLTypes['vaults'];
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
      expect(vault).toBeTruthy();
      expect(vault.vault_address).toMatch(/0x[a-fA-F0-9]{40}/);
      expect(vault.simple_token_address).toEqual(yamAddress);
      expect(vault.decimals).toEqual(18);
    },
    { timeout: 10000 }
  );
}, 10000);
