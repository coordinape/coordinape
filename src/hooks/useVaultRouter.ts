// - Contract Imports
import { BigNumberish } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';

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
    const myAddress = await contracts.getMyAddress();
    const allowance = await token.allowance(
      myAddress,
      contracts.router.address
    );

    if (allowance.lt(amount)) {
      const result = await sendAndTrackTx(
        () => token.approve(contracts.router.address, amount),
        {
          showError,
          showInfo,
          signingMessage:
            'Please sign the transaction to approve the transfer.',
        }
      );
      if (result.error) return result;
    }

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
