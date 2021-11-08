// - Contract Imports
import { ethers } from 'ethers';

import {
  AddFunds,
  Maybe,
  DepositSimpleToken,
  WithdrawUnderlying,
  ApproveCircleAdmin,
  ExitVaultToken,
  SetRegistry,
  OverrideOnly,
  Tap,
  TransferOwnership,
  UpdateAllowance,
  ApeWithdraw,
} from '../../types/contractTypes';
import { useVaultContracts } from '../contracts/contracts';

const handleError = (e: any) => {
  /**
   * Function to handle throwing errors (To reduce code repetition)
   */
  if (e.code === 4001) {
    throw Error('The transaction was rejected by your wallet');
  } else {
    throw Error('The transaction Failed');
  }
};

export function useVaultWrapper() {
  const factory = useVaultContracts()?.ApeVaultWrapper;

  const _apeWithdraw = async (_params: ApeWithdraw) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.apeWithdraw(
        _params._shareAmount,
        _params._underlying,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _apeMigrate = async (_params: OverrideOnly) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.apeMigrate(_params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _updateAllowance = async (_params: UpdateAllowance) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.updateAllowance(
        _params._circle,
        _params._token,
        _params._amount,
        _params._interval,
        _params._epochAmount,
        _params._overrides
      );
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

  const _tap = async (_params: Tap) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.tap(
        _params._value,
        _params._type,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _syncUnderlying = async (_params: OverrideOnly) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.syncUnderlying(_params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _setRegistry = async (_params: SetRegistry) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.setRegistry(_params._registry, _params._overrides);
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

  const _exitVaultToken = async (_params: ExitVaultToken) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.exitVaultToken(
        _params._underlying,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _approveCircleAdmin = async (_params: ApproveCircleAdmin) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.approveCircleAdmin(
        _params._circle,
        _params._admin,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _withdrawUnderlying = async (_params: WithdrawUnderlying) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.apeWithdraw(_params._amount, _params._overrides);
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _withdrawSimpleToken = async (_params: DepositSimpleToken) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.apeWithdrawSimpleToken(
        _params._amount,
        _params._overrides
      );
    } catch (e: any) {
      console.error(e);
      handleError(e);
    }
    return tx;
  };

  const _addFunds = async (_params: AddFunds) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.addFunds(_params._amount, _params._overrides);
    } catch (e: any) {
      handleError(e);
    }

    return tx;
  };

  return {
    _withdrawSimpleToken,
    _addFunds,
    _withdrawUnderlying,
    _approveCircleAdmin,
    _exitVaultToken,
    _renounceOwnership,
    _setRegistry,
    _syncUnderlying,
    _tap,
    _transferOwnership,
    _updateAllowance,
    _apeMigrate,
    _apeWithdraw,
  };
}
