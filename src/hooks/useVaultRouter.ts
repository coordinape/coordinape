// - Contract Imports
import { BigNumberish } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { Contracts } from 'services/contracts';
import { sendAndTrackTx, SendAndTrackTxResult } from 'utils/contractHelpers';

import { useApeSnackbar } from './useApeSnackbar';

export function useVaultRouter(contracts?: Contracts) {
  const { account } = useWeb3React();
  const { showError, showInfo } = useApeSnackbar();

  const depositToken = async (
    vault: GraphQLTypes['vaults'],
    amount: BigNumberish
  ): Promise<SendAndTrackTxResult> => {
    if (!contracts) throw new Error('Contracts not loaded');
    const token = contracts.getERC20(vault.token_address as string);
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
        contracts.router.delegateDeposit(
          vault.vault_address as string,
          vault.token_address as string,
          amount
        ),
      {
        showError,
        showInfo,
        signingMessage: 'Please sign the transaction to deposit tokens.',
      }
    );
  };

  const delegateWithdrawal = async (
    vault: GraphQLTypes['vaults'],
    tokenAddress: string,
    shareAmount: BigNumberish,
    underlying: boolean
  ) => {
    if (!contracts || !account)
      throw new Error('Contracts or account not loaded');
    return contracts.router.delegateWithdrawal(
      account,
      vault.vault_address as string,
      tokenAddress,
      shareAmount,
      underlying
    );
  };

  return { depositToken, delegateWithdrawal };
}
