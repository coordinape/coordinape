// - Contract Imports
import { BigNumberish } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import { ContractTransaction, ethers } from 'ethers';

import { makeRouterTxFn } from 'utils/contractHelpers';

import { useApeSnackbar } from './useApeSnackbar';
import { useContracts } from './useContracts';

import { IVault } from 'types';

export function useVaultRouter() {
  const contracts = useContracts();
  const web3Context = useWeb3React();
  const { apeError, apeInfo } = useApeSnackbar();
  const runVaultRouter = makeRouterTxFn(web3Context, contracts, apeError);

  const depositToken = async (
    vault: IVault,
    amount: BigNumberish
  ): Promise<ContractTransaction | undefined> => {
    if (!contracts) throw new Error('Contracts not loaded');
    const token = contracts.getERC20(vault.tokenAddress);
    // Todo: Handle this separately and conditionally in UI
    await token.approve(
      contracts.apeRouter.address,
      ethers.constants.MaxUint256
    );
    apeInfo('Deposit pending');
    return await runVaultRouter(v =>
      v.delegateDeposit(vault.id, vault.tokenAddress, amount)
    );
  };

  const delegateWithdrawal = async (
    vault: IVault,
    tokenAddress: string,
    shareAmount: BigNumberish,
    underlying: boolean
  ) => {
    const signer = await web3Context.library.getSigner();
    runVaultRouter(v =>
      v.delegateWithdrawal(
        signer,
        vault.id,
        tokenAddress,
        shareAmount,
        underlying
      )
    );
  };

  return { depositToken, delegateWithdrawal };
}
