// - Contract Imports
import { BigNumber, ethers } from 'ethers';

import {
  Cancel,
  ChangeMinDelay,
  DelegateWithdrawal,
  DelegateDeposit,
  Maybe,
  Execute,
  RemoveTokens,
  OverrideOnly,
  Schedule,
  SetRegistry,
  TransferOwnership,
  CallStatus,
  TimeStamps,
} from '../types/contractTypes';

import { useContracts } from './useContracts';

const handleError = (e: any) => {
  if (e.code === 4001) {
    throw Error(`Transaction rejected by your wallet`);
  }
  throw Error(`Failed to submit create vault.`);
};

export function useApeRouter() {
  const contracts = useContracts();

  const _transferOwnership = async (
    _params: TransferOwnership
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await contracts?.apeRouter.transferOwnership(
        _params._newOwner,
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
      tx = await contracts?.apeRouter.setRegistry(
        _params._registry,
        _params._overrides
      );
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
      tx = await contracts?.apeRouter.schedule(
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

  const _renounceOwnership = async (
    _params: OverrideOnly
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await contracts?.apeRouter.renounceOwnership(_params._overrides);
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
      tx = await contracts?.apeRouter.removeTokens(
        _params._token,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _execute = async (
    _params: Execute
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await contracts?.apeRouter.execute(
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

  const _delegateWithdrawal = async (
    _params: DelegateWithdrawal
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await contracts?.apeRouter.delegateWithdrawal(
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

  const _delegateDeposit = async (
    _params: DelegateDeposit
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await contracts?.apeRouter.delegateDeposit(
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

  const _changeMinDelay = async (
    _params: ChangeMinDelay
  ): Promise<Maybe<ethers.ContractTransaction>> => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await contracts?.apeRouter.changeMinDelay(
        _params._min,
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
      tx = await contracts?.apeRouter.cancel(_params._id, _params._overrides);
    } catch (e: any) {
      console.error(e);
      handleError(e);
    }
    return tx;
  };

  //Getters:

  const _getApeVaultFactory = async (
    _params: OverrideOnly
  ): Promise<Maybe<string[]>> => {
    let tx: any;
    try {
      tx = await contracts?.apeRouter.apeVaultFactory(_params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _getTimeStamps = async (
    _params: TimeStamps
  ): Promise<Maybe<BigNumber>> => {
    let tx: any;
    try {
      tx = await contracts?.apeRouter.timestamps(
        _params._arg0,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _getOwner = async (_params: OverrideOnly): Promise<Maybe<string[]>> => {
    let tx: any;
    try {
      tx = await contracts?.apeRouter.owner(_params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _getMinDelay = async (
    _params: OverrideOnly
  ): Promise<Maybe<BigNumber>> => {
    let tx: Maybe<BigNumber>;
    try {
      tx = await contracts?.apeRouter.minDelay(_params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _getIsReadyCall = async (
    _params: CallStatus
  ): Promise<Maybe<boolean>> => {
    let tx: Maybe<boolean>;
    try {
      tx = await contracts?.apeRouter.isReadyCall(
        _params._id,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _getIsPendingCall = async (
    _params: CallStatus
  ): Promise<Maybe<boolean>> => {
    let tx: Maybe<boolean>;
    try {
      tx = await contracts?.apeRouter.isPendingCall(
        _params._id,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _getIsDoneCall = async (
    _params: CallStatus
  ): Promise<Maybe<boolean>> => {
    let tx: Maybe<boolean>;
    try {
      tx = await contracts?.apeRouter.isDoneCall(
        _params._id,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  return {
    _cancel,
    _changeMinDelay,
    _transferOwnership,
    _setRegistry,
    _schedule,
    _renounceOwnership,
    _removeTokens,
    _execute,
    _delegateDeposit,
    _delegateWithdrawal,
    _getIsDoneCall,
    _getOwner,
    _getMinDelay,
    _getIsReadyCall,
    _getIsPendingCall,
    _getApeVaultFactory,
    _getTimeStamps,
  };
}
