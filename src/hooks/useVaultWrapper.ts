// // - Contract Imports
// import { BigNumber, ethers } from 'ethers';

// import {
//   AddFunds,
//   ApeWithdraw,
//   ApproveCircleAdmin,
//   ExitVaultToken,
//   HasAccess,
//   Maybe,
//   OverrideOnly,
//   SetRegistry,
//   Tap,
//   TotalVaultBalance,
//   TransferOwnership,
//   UpdateAllowance,
//   WithdrawSimpleToken,
// } from '../types/contractTypes';

// import { useContracts } from './useContracts';

// const handleError = (e: any) => {
//   if (e.code === 4001) {
//     throw Error(`Transaction rejected by your wallet`);
//   }
//   throw Error(`Failed to submit create vault.`);
// };

// export function useVaultWrapper() {
//   const contracts = useContracts();

//   const _addFunds = async (
//     _params: AddFunds
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.addFunds(
//         _params._amount,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _apeMigrate = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.apeMigrate(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _apeWithdraw = async (
//     _params: ApeWithdraw
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.apeWithdraw(
//         _params._shareAmount,
//         _params._underlying,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _apeWithdrawSimpleToken = async (
//     _params: WithdrawSimpleToken
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.apeWithdrawSimpleToken(
//         _params._amount,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _approveCircleAdmin = async (
//     _params: ApproveCircleAdmin
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.approveCircleAdmin(
//         _params._circle,
//         _params._admin,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _exitVaultToken = async (
//     _params: ExitVaultToken
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.exitVaultToken(
//         _params._underlying,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _renounceOwnership = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.renounceOwnership(
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _setRegistry = async (
//     _params: SetRegistry
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.setRegistry(
//         _params._registry,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _syncUnderlying = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.syncUnderlying(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _tap = async (
//     _params: Tap
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.tap(
//         _params._value,
//         _params._type,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _transferOwnership = async (
//     _params: TransferOwnership
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.transferOwnership(
//         _params._newOwner,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _updateAllowance = async (
//     _params: UpdateAllowance
//   ): Promise<Maybe<ethers.ContractTransaction>> => {
//     let tx: Maybe<ethers.ContractTransaction>;
//     try {
//       tx = await contracts?.apeVaultWrapper.updateAllowance(
//         _params._circle,
//         _params._token,
//         _params._amount,
//         _params._interval,
//         _params._epochAmount,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   //Getters:

//   const _getAllowanceModule = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<[string]>> => {
//     let tx: any;
//     try {
//       tx = await contracts?.apeVaultWrapper.allowanceModule(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getVault = async (_params: OverrideOnly): Promise<Maybe<[string]>> => {
//     let tx: any;
//     try {
//       tx = await contracts?.apeVaultWrapper.vault(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getUnderlyingValue = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<BigNumber>> => {
//     let tx: Maybe<BigNumber>;
//     try {
//       tx = await contracts?.apeVaultWrapper.underlyingValue(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getTotalVaultBalance = async (
//     _params: TotalVaultBalance
//   ): Promise<Maybe<BigNumber>> => {
//     let tx: any;
//     try {
//       tx = await contracts?.apeVaultWrapper.totalVaultBalance(
//         _params._account,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getTotalAssets = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<BigNumber>> => {
//     let tx: Maybe<BigNumber>;
//     try {
//       tx = await contracts?.apeVaultWrapper.totalAssets(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getToken = async (_params: OverrideOnly): Promise<Maybe<[string]>> => {
//     let tx: any;
//     try {
//       tx = await contracts?.apeVaultWrapper.token(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getSimpleToken = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<[string]>> => {
//     let tx: any;
//     try {
//       tx = await contracts?.apeVaultWrapper.simpleToken(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getRegistry = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<[string]>> => {
//     let tx: any;
//     try {
//       tx = await contracts?.apeVaultWrapper.registry(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getProfit = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<BigNumber>> => {
//     let tx: Maybe<BigNumber>;
//     try {
//       tx = await contracts?.apeVaultWrapper.profit(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getOwner = async (_params: OverrideOnly): Promise<Maybe<[string]>> => {
//     let tx: any;
//     try {
//       tx = await contracts?.apeVaultWrapper.owner(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _hasAccess = async (_params: HasAccess): Promise<Maybe<boolean>> => {
//     let tx: Maybe<boolean>;
//     try {
//       tx = await contracts?.apeVaultWrapper.hasAccess(
//         _params._arg0,
//         _params._overrides
//       );
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getBestVault = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<[string]>> => {
//     let tx: any;
//     try {
//       tx = await contracts?.apeVaultWrapper.bestVault(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getApeRegistry = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<[string]>> => {
//     let tx: any;
//     try {
//       tx = await contracts?.apeVaultWrapper.apeRegistry(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }
//     return tx;
//   };

//   const _getAllVaults = async (
//     _params: OverrideOnly
//   ): Promise<Maybe<[string[]]>> => {
//     let tx: any;
//     try {
//       tx = await contracts?.apeVaultWrapper.allVaults(_params._overrides);
//     } catch (e: any) {
//       console.error(e);
//       handleError(e);
//     }

//     return tx;
//   };

//   return {
//     _addFunds,
//     _apeMigrate,
//     _apeWithdraw,
//     _apeWithdrawSimpleToken,
//     _approveCircleAdmin,
//     _exitVaultToken,
//     _renounceOwnership,
//     _setRegistry,
//     _syncUnderlying,
//     _tap,
//     _transferOwnership,
//     _updateAllowance,
//     _getAllowanceModule,
//     _getVault,
//     _getUnderlyingValue,
//     _getTotalVaultBalance,
//     _getTotalAssets,
//     _getToken,
//     _getSimpleToken,
//     _getRegistry,
//     _getProfit,
//     _getOwner,
//     _hasAccess,
//     _getBestVault,
//     _getApeRegistry,
//     _getAllVaults,
//   };
// }
export {};
