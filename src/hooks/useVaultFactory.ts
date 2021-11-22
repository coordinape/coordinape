// - Contract Imports
import {
  ApeVaultWrapper,
  ApeVaultWrapper__factory,
} from '@coordinape/hardhat/dist/typechain';
import { useWeb3React } from '@web3-react/core';

import { CreateVault } from '../types/contractTypes';

import { useContracts } from './useContracts';

export function useVaultFactory() {
  const contracts = useContracts();
  const web3Context = useWeb3React();

  const _createApeVault = async (
    _params: CreateVault
  ): Promise<ApeVaultWrapper> => {
    try {
      const signer = await web3Context.library.getSigner();
      if (contracts) {
        let factory = contracts.apeVaultFactory;
        factory = factory.connect(signer);
        const tx = await factory.createApeVault(
          _params._token,
          _params._simpleToken
        );
        const receipt = await tx.wait();
        if (receipt && receipt?.events) {
          for (const event of receipt.events) {
            if (event?.event === 'VaultCreated') {
              const vaultAddress = event.args?.vault;
              const vault = ApeVaultWrapper__factory.connect(
                vaultAddress,
                signer
              );
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

  return { _createApeVault };
}
