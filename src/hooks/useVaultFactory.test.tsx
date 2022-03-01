import assert from 'assert';

import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import { act, render, waitFor } from '@testing-library/react';

import { HARDHAT_CHAIN_ID } from 'config/env';
import { TestWrapper } from 'utils/testing';

import { useContracts } from './useContracts';
import { useVaultFactory } from './useVaultFactory';

import { IVault } from 'types';

test('create a vault', async () => {
  let done = false;

  const Harness = () => {
    const { createVault } = useVaultFactory(1);
    const contracts = useContracts();
    if (!contracts) return null;

    createVault({ simpleTokenAddress: '0x0', type: 'USDC' }).then(
      (vault: IVault | undefined) => {
        expect(vault).toBeTruthy();
        assert(vault);
        expect(vault.id).toMatch(/0x[a-fA-F0-9]{40}/);
        expect(vault?.tokenAddress).toEqual(
          (deploymentInfo as any)[HARDHAT_CHAIN_ID].USDC.address
        );
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
});
