import assert from 'assert';

import { act, render, waitFor } from '@testing-library/react';

import { restoreSnapshot, takeSnapshot, TestWrapper } from 'utils/testing';

import { useContracts } from './useContracts';
import { useVaultFactory } from './useVaultFactory';

import { IVault } from 'types';

let snapshotId: string;

beforeAll(async () => {
  snapshotId = await takeSnapshot();
});

afterAll(async () => {
  await restoreSnapshot(snapshotId);
});

test('create a vault', async () => {
  let done = false;

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const contracts = useContracts();
    if (!contracts) return null;

    createVault({ simpleTokenAddress: '0x0', type: 'DAI' }).then(
      (vault: IVault | undefined) => {
        expect(vault).toBeTruthy();
        assert(vault);
        expect(vault.id).toMatch(/0x[a-fA-F0-9]{40}/);
        expect(vault?.tokenAddress).toEqual(contracts.getToken('DAI').address);
        done = true;
      }
    );
    return null;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  await waitFor(() => expect(done).toBeTruthy());
}, 10000);
