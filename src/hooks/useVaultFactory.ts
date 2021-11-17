// - Contract Imports
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import { CreateVault, Maybe } from '../types/contractTypes';

import { useContracts } from './useContracts';

export function useVaultFactory() {
  const contracts = useContracts();
  const web3Context = useWeb3React();

  const _createApeVault = async (
    _params: CreateVault
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      const signer = await web3Context.library.getSigner();
      if (contracts) {
        let factory = contracts.apeVaultFactory;
        factory = factory.connect(signer);
        tx = await factory.createApeVault(_params._token, _params._simpleToken);
      }
    } catch (e: any) {
      console.error(e);
      if (e.code === 4001) {
        throw Error(`Transaction rejected by your wallet`);
      }
      throw Error(`Failed to submit create vault.`);
    }

    return tx;
  };

  return { _createApeVault };
}
