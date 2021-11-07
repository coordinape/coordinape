// - Contract Imports
import { ethers } from 'ethers';

import {
  AddFunds,
  Maybe,
  DepositSimpleToken,
  WithdrawUnderlying,
  ApproveCircleAdmin,
  ExitVaultToken,
} from '../../types/contractTypes';
import { useVaultContracts } from '../contracts/contracts';

//     "hasAccess(address)": FunctionFragment;
//     "owner()": FunctionFragment;
//     "profit()": FunctionFragment;
//     "registry()": FunctionFragment;
//     "renounceOwnership()": FunctionFragment;
//     "setRegistry(address)": FunctionFragment;
//     "simpleToken()": FunctionFragment;
//     "syncUnderlying()": FunctionFragment;
//     "tap(uint256,uint8)": FunctionFragment;
//     "token()": FunctionFragment;
//     "totalAssets()": FunctionFragment;
//     "totalVaultBalance(address)": FunctionFragment;
//     "transferOwnership(address)": FunctionFragment;
//     "underlyingValue()": FunctionFragment;
//     "updateAllowance(bytes32,address,uint256,uint256,uint256)": FunctionFragment;
//     "vault()": FunctionFragment;

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

  //! Leave off on line 305, ApeVaultWrapper.ts

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
      tx = await factory?.apeWithdrawUnderlying(
        _params._amount,
        _params._overrides
      );
    } catch (e: any) {
      handleError(e);
    }
    return tx;
  };

  const _depositSimpleToken = async (_params: DepositSimpleToken) => {
    let tx: Maybe<ethers.ContractTransaction>;
    try {
      tx = await factory?.apeDepositSimpleToken(
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
    _depositSimpleToken,
    _addFunds,
    _withdrawUnderlying,
    _approveCircleAdmin,
    _exitVaultToken,
  };
}
