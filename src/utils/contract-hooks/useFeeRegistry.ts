// - Contract Imports
import { ethers } from 'ethers';

import {
  Cancel,
  ChangeMinDelay,
  Execute,
  GetVariableFee,
  Maybe,
  OverrideOnly,
  Schedule,
  TransferOwnership,
} from '../../types/contractTypes';
import { useVaultContracts } from '../../utils/contracts/contracts';

const handleError = (e: any) => {
  if (e.code === 4001) {
    throw Error(`Transaction rejected by your wallet`);
  } else {
    throw Error('Failed to complete transaction');
  }
};

export function useVault() {
  const factory = useVaultContracts()?.FeeRegistry;

  //   activateFee(
  //     overrides?: Overrides & { from?: string | Promise<string> }
  //   ): Promise<ContractTransaction>;
  const _activateFee = async (_params: OverrideOnly) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.activateFee(_params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _cancel = async (_params: Cancel) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.cancel(_params._id, _params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _changeMinDelay = async (_params: ChangeMinDelay) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.changeMinDelay(_params._min, _params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _execute = async (_params: Execute) => {
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

  const _getVariableFee = async (_params: GetVariableFee) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.getVariableFee(
        _params._tapTotal,
        _params._yield,
        _params.overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _renounceOwnership = async (_params: OverrideOnly) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.renounceOwnership(_params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _schedule = async (_params: Schedule) => {
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

  const _shutdownFee = async (_params: OverrideOnly) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.shutdownFee(_params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _transferOwnership = async (_params: TransferOwnership) => {
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

  return {
    _transferOwnership,
    _shutdownFee,
    _schedule,
    _activateFee,
    _cancel,
    _changeMinDelay,
    _execute,
    _getVariableFee,
    _renounceOwnership,
  };
}
