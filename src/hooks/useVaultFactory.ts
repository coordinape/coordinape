// - Contract Imports
import { useWeb3React } from '@web3-react/core';

import { makeFactoryTxFn } from 'utils/contractHelpers';

import { useContracts } from './useContracts';

import { IVault } from 'types';

export function useVaultFactory() {
  const contracts = useContracts();
  const web3Context = useWeb3React();
  const runVaultFactory = makeFactoryTxFn(web3Context, contracts);

  const createApeVault = async (
    tokenAddress: string,
    simpleTokenAddress: string,
    type: string
  ): Promise<IVault | undefined> => {
    const tx = await runVaultFactory(v =>
      v.createApeVault(tokenAddress, simpleTokenAddress)
    );
    const receipt = await tx.wait();
    if (receipt && receipt?.events) {
      for (const event of receipt.events) {
        if (event?.event === 'VaultCreated') {
          const vaultAddress = event.args?.vault;
          const vault: IVault = {
            id: vaultAddress,
            transactions: [],
            tokenAddress,
            simpleTokenAddress,
            type,
          };
          return vault;
        }
      }
      console.error('VaultCreated event not found');
    }
  };

  return { createApeVault };
}
