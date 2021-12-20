import {
  ApeDistributor,
  ApeRouter,
  ApeVaultWrapper,
  ApeVaultWrapper__factory,
} from '@coordinape/hardhat/dist/typechain';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { ContractTransaction, BigNumberish } from 'ethers';

import { Contracts } from 'services/contracts';

import { IVault } from 'types';

export const handleContractError = (apeError: (error: any) => void, e: any) => {
  console.error(e);
  if (e.code === 4001) {
    apeError('Transaction rejected by your wallet');
    throw Error(`Transaction rejected by your wallet`);
  }
  apeError('Failed to submit create vault');
  throw Error(`Failed to submit create vault.`);
};

export const makeVaultTxFn =
  (
    web3Context: Web3ReactContextInterface,
    vault: IVault,
    apeError: (error: any) => void
  ) =>
  async (
    callback: (
      apeVault: ApeVaultWrapper
    ) => Promise<ContractTransaction | string | BigNumberish | string[]>
  ) => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    return callback(apeVault).catch(e => handleContractError(apeError, e));
  };

export const makeRouterTxFn =
  (
    web3Context: Web3ReactContextInterface,
    contracts: Contracts | undefined,
    apeError: (error: any) => void
  ) =>
  async (callback: (apeRouter: ApeRouter) => Promise<ContractTransaction>) => {
    if (!contracts) {
      apeError('Contracts not loaded');
      return;
    }
    const signer = await web3Context.library.getSigner();
    const apeRouter = await contracts.apeRouter.connect(signer);
    return callback(apeRouter).catch(e => handleContractError(apeError, e));
  };

export const makeDistributorTxFn =
  (
    web3Context: Web3ReactContextInterface,
    contracts: Contracts | undefined,
    apeError: (error: any) => void
  ) =>
  async (
    callback: (apeDistributor: ApeDistributor) => Promise<ContractTransaction>
  ) => {
    if (!contracts) {
      apeError('Contracts not loaded');
      return;
    }
    const signer = await web3Context.library.getSigner();
    const apeDistributor = contracts.apeDistributor.connect(signer);
    return callback(apeDistributor).catch(e =>
      handleContractError(apeError, e)
    );
  };
