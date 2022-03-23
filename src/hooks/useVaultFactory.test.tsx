import { act, render, waitFor } from '@testing-library/react';
import { ValueTypes } from 'lib/gql/__generated__/zeus';
import * as mutations from 'lib/gql/mutations';

import { Asset } from 'services/contracts';
import { restoreSnapshot, takeSnapshot, TestWrapper } from 'utils/testing';

import { useContracts } from './useContracts';
import { useVaultFactory } from './useVaultFactory';

let snapshotId: string;

jest.mock('lib/gql/mutations');
const mockMutation = mutations.addVault as jest.Mock;

mockMutation.mockImplementation(() => {
  //TODO: Add a more robust mock if we choose to return a real response from Hasura
  return true;
}) as jest.MockedFunction<typeof mutations.addVault>;

beforeAll(async () => {
  snapshotId = await takeSnapshot();
});

afterAll(async () => {
  await restoreSnapshot(snapshotId);
});

test('create a vault', async () => {
  let vault: ValueTypes['vaults'];
  let daiAddress: string;

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const contracts = useContracts();
    if (!contracts) return null;

    daiAddress = contracts.getToken('DAI').address;

    createVault({ simpleTokenAddress: '0x0', type: Asset.DAI }).then(v => {
      if (v) vault = v as ValueTypes['vaults'];
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
      expect(vault.id).toMatch(/0x[a-fA-F0-9]{40}/);
      expect(vault.token_address).toEqual(daiAddress);
      expect(vault.decimals).toEqual(18);
    },
    { timeout: 10000 }
  );
}, 10000);

test('create a vault with a custom asset', async () => {
  let vault: ValueTypes['vaults'];
  const yamAddress = '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521';

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const contracts = useContracts();
    if (!contracts) return null;

    createVault({ simpleTokenAddress: yamAddress }).then(v => {
      if (v) vault = v as ValueTypes['vaults'];
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
      expect(vault.id).toMatch(/0x[a-fA-F0-9]{40}/);
      expect(vault.simple_token_address).toEqual(yamAddress);
      expect(vault.decimals).toEqual(18);
    },
    { timeout: 10000 }
  );
}, 10000);
