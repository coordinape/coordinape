import { ApeVaultWrapper__factory } from '@coordinape/hardhat/dist/typechain';
import { useWeb3React } from '@web3-react/core';
import { BigNumberish, BytesLike, ContractTransaction } from 'ethers';

import { handleContractError } from 'utils/handleContractError';

import { IVault } from 'types';

export function useVaultWrapper(vault: IVault) {
  const web3Context = useWeb3React();

  // Admin functions
  const apeMigrate = async (): Promise<ContractTransaction> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const tx = await apeVault.apeMigrate();
      return tx;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const apeWithdraw = async (
    shareAmount: BigNumberish,
    underlying: boolean
  ): Promise<ContractTransaction> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const tx = await apeVault.apeWithdraw(shareAmount, underlying);
      return tx;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const apeWithdrawSimpleToken = async (
    amount: BigNumberish
  ): Promise<ContractTransaction> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const tx = await apeVault.apeWithdrawSimpleToken(amount);
      return tx;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const approveCircleAdmin = async (
    circle: BytesLike,
    adminAddress: string
  ): Promise<ContractTransaction> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const tx = await apeVault.approveCircleAdmin(circle, adminAddress);
      return tx;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const exitVaultToken = async (
    underlying: boolean
  ): Promise<ContractTransaction> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const tx = await apeVault.exitVaultToken(underlying);
      return tx;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const syncUnderlying = async (): Promise<ContractTransaction> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const tx = await apeVault.syncUnderlying();
      return tx;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const updateAllowance = async (
    circle: BytesLike,
    tokenAddress: string,
    amount: BigNumberish,
    interval: BigNumberish,
    epochAmount: BigNumberish,
    intervalStart: BigNumberish
  ): Promise<ContractTransaction> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const tx = await apeVault.updateAllowance(
        circle,
        tokenAddress,
        amount,
        interval,
        epochAmount,
        intervalStart
      );
      return tx;
    } catch (e) {
      return handleContractError(e);
    }
  };

  // Todo: add all the needed getters
  // // Getters:

  // const _getAllowanceModule = async (
  //   _params: OverrideOnly
  // ): Promise<Maybe<[string]>> => {
  //   let tx: any;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.allowanceModule(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getVault = async (_params: OverrideOnly): Promise<Maybe<[string]>> => {
  //   let tx: any;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.vault(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getUnderlyingValue = async (
  //   _params: OverrideOnly
  // ): Promise<Maybe<BigNumber>> => {
  //   let tx: Maybe<BigNumber>;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.underlyingValue(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getTotalVaultBalance = async (
  //   _params: TotalVaultBalance
  // ): Promise<Maybe<BigNumber>> => {
  //   let tx: any;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.totalVaultBalance(
  //       _params._account,
  //       _params._overrides
  //     );
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getTotalAssets = async (
  //   _params: OverrideOnly
  // ): Promise<Maybe<BigNumber>> => {
  //   let tx: Maybe<BigNumber>;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.totalAssets(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getToken = async (_params: OverrideOnly): Promise<Maybe<[string]>> => {
  //   let tx: any;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.token(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getSimpleToken = async (
  //   _params: OverrideOnly
  // ): Promise<Maybe<[string]>> => {
  //   let tx: any;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.simpleToken(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getRegistry = async (
  //   _params: OverrideOnly
  // ): Promise<Maybe<[string]>> => {
  //   let tx: any;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.registry(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getProfit = async (
  //   _params: OverrideOnly
  // ): Promise<Maybe<BigNumber>> => {
  //   let tx: Maybe<BigNumber>;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.profit(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getOwner = async (_params: OverrideOnly): Promise<Maybe<[string]>> => {
  //   let tx: any;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.owner(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _hasAccess = async (_params: HasAccess): Promise<Maybe<boolean>> => {
  //   let tx: Maybe<boolean>;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.hasAccess(
  //       _params._arg0,
  //       _params._overrides
  //     );
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getBestVault = async (
  //   _params: OverrideOnly
  // ): Promise<Maybe<[string]>> => {
  //   let tx: any;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.bestVault(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getApeRegistry = async (
  //   _params: OverrideOnly
  // ): Promise<Maybe<[string]>> => {
  //   let tx: any;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.apeRegistry(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }
  //   return tx;
  // };

  // const _getAllVaults = async (
  //   _params: OverrideOnly
  // ): Promise<Maybe<[string[]]>> => {
  //   let tx: any;
  //   try {
  //     tx = await contracts?.apeVaultWrapper.allVaults(_params._overrides);
  //   } catch (e: any) {
  //     console.error(e);
  //     handleContractError(e);
  //   }

  //   return tx;
  // };

  return {
    apeMigrate,
    apeWithdraw,
    apeWithdrawSimpleToken,
    approveCircleAdmin,
    exitVaultToken,
    syncUnderlying,
    updateAllowance,
    // _getAllowanceModule,
    // _getVault,
    // _getUnderlyingValue,
    // _getTotalVaultBalance,
    // _getTotalAssets,
    // _getToken,
    // _getSimpleToken,
    // _getRegistry,
    // _getProfit,
    // _getOwner,
    // _hasAccess,
    // _getBestVault,
    // _getApeRegistry,
    // _getAllVaults,
  };
}
