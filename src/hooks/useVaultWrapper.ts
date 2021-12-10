import {
  ApeVaultWrapper,
  ApeVaultWrapper__factory,
} from '@coordinape/hardhat/dist/typechain';
import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import {
  BigNumber,
  BigNumberish,
  BytesLike,
  ContractTransaction,
} from 'ethers';

import { handleContractError } from 'utils/handleContractError';

import { IVault } from 'types';

// the two levels of function creation here may seem excessive
// ("why not just set this up inside the component?"),
// but it sets the stage for this transaction-handling code to be shared
// across all hooks, not just this file
const makeVaultTxFn =
  (web3Context: Web3ReactContextInterface, vault: IVault) =>
  async (
    callback: (apeVault: ApeVaultWrapper) => Promise<ContractTransaction>
  ) => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    return callback(apeVault).catch(e => handleContractError(e));
  };

export function useVaultWrapper(vault: IVault) {
  const web3Context = useWeb3React();
  const runVaultTx = makeVaultTxFn(web3Context, vault);

  const apeMigrate = () => runVaultTx(v => v.apeMigrate());

  const apeWithdraw = (shareAmount: BigNumberish, underlying: boolean) =>
    runVaultTx(v => v.apeWithdraw(shareAmount, underlying));

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
  // Getters:

  const getBestVault = async (): Promise<string> => {
    // returns best yearn vault address
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const bestVault: string = await apeVault.bestVault();
      return bestVault;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const getToken = async (): Promise<string> => {
    // returns token address
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const token: string = await apeVault.token();
      return token;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const getSimpleToken = async (): Promise<string> => {
    // returns simple token address
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const token: string = await apeVault.simpleToken();
      return token;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const getUnderlyingValue = async (): Promise<BigNumber> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const underlyingValue: BigNumber = await apeVault.underlyingValue();
      return underlyingValue;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const getYRegistry = async (): Promise<string> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const yRegistry: string = await apeVault.registry();
      return yRegistry;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const getYVault = async (): Promise<string> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const yVault: string = await apeVault.vault();
      return yVault;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const listVaults = async (): Promise<string[]> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const vaults: string[] = await apeVault.allVaults();
      return vaults;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const getOwner = async (): Promise<string> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const owner: string = await apeVault.owner();
      return owner;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const getTotalAssets = async (): Promise<BigNumber> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const totalAssets: BigNumber = await apeVault.totalAssets();
      return totalAssets;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const getTotalVaultBalance = async (account: string): Promise<BigNumber> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const totalVaultBalance: BigNumber = await apeVault.totalVaultBalance(
        account
      );
      return totalVaultBalance;
    } catch (e) {
      return handleContractError(e);
    }
  };

  const getProfit = async (): Promise<BigNumber> => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    try {
      const profit: BigNumber = await apeVault.profit();
      return profit;
    } catch (e) {
      return handleContractError(e);
    }
  };

  return {
    apeMigrate,
    apeWithdraw,
    apeWithdrawSimpleToken,
    approveCircleAdmin,
    exitVaultToken,
    syncUnderlying,
    updateAllowance,
    getBestVault,
    getToken,
    getSimpleToken,
    getUnderlyingValue,
    getYRegistry,
    getYVault,
    listVaults,
    getOwner,
    getTotalAssets,
    getTotalVaultBalance,
    getProfit,
  };
}
