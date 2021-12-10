// - Contract Imports
import { BigNumberish } from '@ethersproject/bignumber';
import { ContractReceipt } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';

import { ERC20Service } from 'services/erc20';
import { makeRouterTxFn } from 'utils/contractHelpers';

import { useContracts } from './useContracts';

import { IVault } from 'types';

export function useVaultRouter() {
  const contracts = useContracts();
  const web3Context = useWeb3React();
  const runVaultRouter = makeRouterTxFn(web3Context, contracts);

  const depositToken = async (
    vault: IVault,
    amount: BigNumberish
  ): Promise<ContractReceipt> => {
    const signer = await web3Context.library.getSigner();
    const token = new ERC20Service(
      await web3Context.library,
      await signer.getAddress(),
      vault.tokenAddress
    );
    if (!contracts) {
      throw new Error('Contracts not loaded');
    }
    // Todo: Handle this separately and conditionally in UI
    await token.approveUnlimited(contracts.apeRouter.address);
    // Main logic
    const tx = await runVaultRouter(v =>
      v.delegateDeposit(vault.id, vault.tokenAddress, amount)
    );
    // Todo: handle this async
    const receipt = await tx.wait();
    return receipt;
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
