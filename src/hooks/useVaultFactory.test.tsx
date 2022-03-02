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
  let vault: IVault;
  let daiAddress: string;

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const contracts = useContracts();
    if (!contracts) return null;

    daiAddress = contracts.getToken('DAI').address;

    createVault({ simpleTokenAddress: '0x0', type: 'DAI' }).then(v => {
      if (v) vault = v;
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

  await waitFor(() => {
    expect(vault).toBeTruthy();
    expect(vault.id).toMatch(/0x[a-fA-F0-9]{40}/);
    expect(vault.tokenAddress).toEqual(daiAddress);
  });
}, 10000);
