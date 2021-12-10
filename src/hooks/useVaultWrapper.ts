import { useWeb3React } from '@web3-react/core';
import { BigNumber, BigNumberish, BytesLike } from 'ethers';

import { makeVaultTxFn } from 'utils/contractHelpers';

import { IVault } from 'types';

interface AllowanceProps {
  circle: BytesLike;
  tokenAddress: string;
  amount: BigNumberish;
  interval: BigNumberish;
  epochAmount: BigNumber;
  intervalStart: BigNumberish;
}

export function useVaultWrapper(vault: IVault) {
  const web3Context = useWeb3React();
  const runVaultTx = makeVaultTxFn(web3Context, vault);

  const apeMigrate = () => runVaultTx(v => v.apeMigrate());

  const apeWithdraw = (shareAmount: BigNumberish, underlying: boolean) =>
    runVaultTx(v => v.apeWithdraw(shareAmount, underlying));

  const apeWithdrawSimpleToken = (amount: BigNumberish) =>
    runVaultTx(v => v.apeWithdrawSimpleToken(amount));

  const approveCircleAdmin = (circle: BytesLike, adminAddress: string) =>
    runVaultTx(v => v.approveCircleAdmin(circle, adminAddress));

  const exitVaultToken = (underlying: boolean) =>
    runVaultTx(v => v.exitVaultToken(underlying));

  const syncUnderlying = () => runVaultTx(v => v.syncUnderlying());

  const updateAllowance = (props: AllowanceProps) =>
    runVaultTx(v =>
      v.updateAllowance(
        props.circle,
        props.tokenAddress,
        props.amount,
        props.interval,
        props.epochAmount,
        props.intervalStart
      )
    );

  // Getters:
  const getBestVault = () => runVaultTx(v => v.bestVault());

  const getToken = () => runVaultTx(v => v.token());

  const getSimpleToken = () => runVaultTx(v => v.simpleToken());

  const getUnderlyingValue = () => runVaultTx(v => v.underlyingValue());

  const getYRegistry = () => runVaultTx(v => v.registry());

  const getYVault = () => runVaultTx(v => v.vault());

  const listVaults = () => runVaultTx(v => v.allVaults());

  const getOwner = () => runVaultTx(v => v.owner());

  const getTotalAssets = () => runVaultTx(v => v.totalAssets());

  const getTotalVaultBalance = (account: string) =>
    runVaultTx(v => v.totalVaultBalance(account));

  const getProfit = () => runVaultTx(v => v.profit());

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
