// - Contract Imports
import { BigNumberish } from '@ethersproject/bignumber';
import { ContractReceipt } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';

import { ERC20Service } from 'services/erc20';

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
      if (contracts) {
        await token.approveUnlimited(contracts.apeRouter.address);
        const apeRouter = contracts.apeRouter.connect(signer);
        const tx = await apeRouter.delegateDeposit(
          vault.id,
          vault.tokenAddress,
          amount
        );
        const receipt = await tx.wait();
        return receipt;
      }
    } catch (e: any) {
      console.error(e);
      if (e.code === 4001) {
        throw Error(`Transaction rejected by your wallet`);
      }
    }
    throw Error(`Failed to deposit to the vault.`);
  };

  return { depositToken };
}
