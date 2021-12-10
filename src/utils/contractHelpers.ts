import {
  ApeRouter,
  ApeVaultFactory,
  ApeVaultWrapper,
  ApeVaultWrapper__factory,
} from '@coordinape/hardhat/dist/typechain';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { ContractTransaction, BigNumberish } from 'ethers';

import { IVault } from 'types';

export const handleContractError = (e: any) => {
  console.error(e);
  if (e.code === 4001) {
    throw Error(`Transaction rejected by your wallet`);
  }
  throw Error(`Failed to submit create vault.`);
};

export const makeVaultTxFn =
  (web3Context: Web3ReactContextInterface, vault: IVault) =>
  async (
    callback: (
      apeVault: ApeVaultWrapper
    ) => Promise<ContractTransaction | string | BigNumberish | string[]>
  ) => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapper__factory.connect(vault.id, signer);
    return callback(apeVault).catch(e => handleContractError(e));
  };

export const makeRouterTxFn =
  (web3Context: Web3ReactContextInterface, contracts: any) =>
  async (callback: (apeRouter: ApeRouter) => Promise<ContractTransaction>) => {
    const signer = await web3Context.library.getSigner();
    const apeRouter = contracts.apeRouter.connect(signer);
    return callback(apeRouter).catch(e => handleContractError(e));
  };

export const makeFactoryTxFn =
  (web3Context: Web3ReactContextInterface, contracts: any) =>
  async (
    callback: (apeFactory: ApeVaultFactory) => Promise<ContractTransaction>
  ) => {
    const signer = await web3Context.library.getSigner();
    const apeFactory = contracts.apeFactory.connect(signer);
    return callback(apeFactory).catch(e => handleContractError(e));
  };
