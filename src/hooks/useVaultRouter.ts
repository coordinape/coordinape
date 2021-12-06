// - Contract Imports
import { BigNumberish } from '@ethersproject/bignumber';
import { ContractReceipt } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { Signer } from 'ethers';

import { ERC20Service } from 'services/erc20';
import { handleContractError } from 'utils/handleContractError';

import { useContracts } from './useContracts';

import { IVault } from 'types';

export function useVaultRouter() {
  const contracts = useContracts();
  const web3Context = useWeb3React();

  const depositToken = async (
    vault: IVault,
    amount: BigNumberish
  ): Promise<ContractReceipt> => {
    try {
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
      const apeRouter = contracts.apeRouter.connect(signer);
      const tx = await apeRouter.delegateDeposit(
        vault.id,
        vault.tokenAddress,
        amount
      );
      // Todo: handle this async
      const receipt = await tx.wait();
      return receipt;
    } catch (e: any) {
      handleContractError(e);
    }
    throw Error(`Failed to deposit to the vault.`);
  };

  const delegateWithdrawal = async (
    vault: IVault,
    shareAmount: BigNumberish,
    underlying: boolean
  ): Promise<ContractReceipt> => {
    if (!contracts) {
      throw new Error('Contracts not loaded');
    }
    try {
      const signer: Signer = await web3Context.library.getSigner();
      const tx = await contracts.apeRouter.delegateWithdrawal(
        await signer.getAddress(),
        vault.id,
        vault.tokenAddress,
        shareAmount,
        underlying
      );
      // Todo: handle this async
      const receipt = await tx.wait();
      return receipt;
    } catch (e: any) {
      handleContractError(e);
    }
    throw Error('Failed to withdraw from the vault.');
  };

  return { depositToken, delegateWithdrawal };
}
