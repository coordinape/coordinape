// - Contract Imports
import { useWeb3React } from '@web3-react/core';

import { useContracts } from './useContracts';

import { IVault } from 'types';

export function useVaultFactory() {
  const contracts = useContracts();
  const web3Context = useWeb3React();

  const createApeVault = async (
    tokenAddress: string,
    simpleTokenAddress: string,
    type: string
  ): Promise<IVault> => {
    try {
      const signer = await web3Context.library.getSigner();
      if (contracts) {
        let factory = contracts.apeVaultFactory;
        factory = factory.connect(signer);
        const tx = await factory.createApeVault(
          tokenAddress,
          simpleTokenAddress
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
      }
    } catch (e: any) {
      if (e.code === 4001) {
        throw Error(`Transaction rejected by your wallet`);
      }
      throw Error(`Failed to submit create vault.`);
    }
    throw Error(`Failed to create vault.`);
  };

  return { createApeVault };
}
