// - Contract Imports
import { BigNumberish } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import { Contracts } from 'services/contracts';
import { sendAndTrackTx, SendAndTrackTxResult } from 'utils/contractHelpers';

import { useApeSnackbar } from './useApeSnackbar';

import { IVault } from 'types';

export function useVaultRouter(contracts?: Contracts) {
  const { account } = useWeb3React();
  const { showError, showInfo } = useApeSnackbar();

  const depositToken = async (
    vault: IVault,
    amount: BigNumberish
  ): Promise<SendAndTrackTxResult> => {
    if (!contracts) throw new Error('Contracts not loaded');
    const token = contracts.getERC20(vault.tokenAddress);

    // Todo: Handle this separately and conditionally in UI
    await sendAndTrackTx(
      () =>
        token.approve(contracts.router.address, ethers.constants.MaxUint256),
      {
        showError,
        showInfo,
        signingMessage: 'Please sign the transaction to approve the transfer.',
      }
    );

    return sendAndTrackTx(
      () =>
        contracts.router.delegateDeposit(vault.id, vault.tokenAddress, amount),
      {
        showError,
        showInfo,
        signingMessage: 'Please sign the transaction to deposit tokens.',
      }
    );
  };

  const delegateWithdrawal = async (
    vault: IVault,
    tokenAddress: string,
    shareAmount: BigNumberish,
    underlying: boolean
  ) => {
    if (!contracts || !account)
      throw new Error('Contracts or account not loaded');
    return contracts.router.delegateWithdrawal(
      account,
      vault.id,
      tokenAddress,
      shareAmount,
      underlying
    );
  };

  return { depositToken, delegateWithdrawal };
}
