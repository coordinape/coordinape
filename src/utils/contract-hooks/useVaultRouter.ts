// - Contract Imports
import { ethers } from 'ethers';

import {
  Cancel,
  ChangeMinDelay,
  DelegateDeposit,
  DelegateWithdrawal,
  Maybe,
  OverrideOnly,
  RemoveTokens,
  Schedule,
  SetRegistry,
  TransferOwnership,
} from '../../types/contractTypes';
import { useVaultContracts } from '../../utils/contracts/contracts';

const handleError = (e: any) => {
  if (e.code === 4001) {
    throw Error(`Transaction rejected by your wallet`);
  }
  throw Error(`Failed to submit create vault.`);
};

export function useVaultRouter() {
  const factory = useVaultContracts()?.ApeRouter;

  const _changeMinDelay = async (
    _params: ChangeMinDelay
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.changeMinDelay(_params._min, _params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _delegateDeposit = async (
    _params: DelegateDeposit
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.delegateDeposit(
        _params._apeVault,
        _params._token,
        _params._amount,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _delegateWithdrawal = async (
    _params: DelegateWithdrawal
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.delegateWithdrawal(
        _params._recipient,
        _params._apeVault,
        _params._token,
        _params._shareAmount,
        _params._underlying,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _execute = async (
    _params: Schedule
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.execute(
        _params._target,
        _params._data,
        _params._predecessor,
        _params._salt,
        _params._delay,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _removeTokens = async (
    _params: RemoveTokens
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.removeTokens(_params._token, _params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _renounceOwnership = async (
    _params: OverrideOnly
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.renounceOwnership(_params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _schedule = async (
    _params: Schedule
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.schedule(
        _params._target,
        _params._data,
        _params._predecessor,
        _params._salt,
        _params._delay,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _setRegistry = async (
    _params: SetRegistry
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.setRegistry(_params._registry, _params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _transferOwnership = async (
    _params: TransferOwnership
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.transferOwnership(
        _params._newOwner,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }

    return tx;
  };

  const _cancel = async (
    _params: Cancel
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.cancel(_params._id, _params._overrides);
    } catch (e: any) {
      handleError(e);
    }

    return tx;
  };

  return {
    _cancel,
    _transferOwnership,
    _changeMinDelay,
    _delegateDeposit,
    _delegateWithdrawal,
    _execute,
    _removeTokens,
    _renounceOwnership,
    _schedule,
    _setRegistry,
  };
}
