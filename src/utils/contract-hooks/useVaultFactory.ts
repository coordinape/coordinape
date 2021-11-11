// - Contract Imports
import { ethers } from 'ethers';

import { CreateVault, Maybe } from '../../types/contractTypes';
import { useVaultContracts } from '../../utils/contracts/contracts';

export function useVault() {
  const factory = useVaultContracts()?.ApeVaultFactory;

  const _createApeVault = async (
    _params: CreateVault
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.createApeVault(
        _params._token,
        _params._simpleToken,
        _params._overrides
      );
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
