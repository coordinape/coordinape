import {
  ApeRouter,
  ApeVaultWrapperImplementation,
  ApeVaultWrapperImplementation__factory,
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
  apeError('Transaction Failed');
  throw Error(`Transaction failed`);
};

export const makeVaultTxFn =
  (
    web3Context: Web3ReactContextInterface,
    vault: IVault,
    apeError: (error: any) => void
  ) =>
  async (
    callback: (
      apeVault: ApeVaultWrapperImplementation
    ) => Promise<ContractTransaction | string | BigNumberish | string[]>
  ) => {
    const signer = await web3Context.library.getSigner();
    const apeVault = ApeVaultWrapperImplementation__factory.connect(
      vault.id,
      signer
    );
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

type Options = {
  sendingMessage?: string;
  minedMessage?: string;
  showInfo: (message: any) => void;
  showError: (message: any) => void;
};

export const sendAndTrackTx = async (
  callback: () => Promise<ContractTransaction>,
  {
    sendingMessage = 'Sending transaction...',
    minedMessage = 'Transaction completed',
    showInfo,
    showError,
  }: Options
) => {
  try {
    const promise = callback();
    showInfo(sendingMessage);
    const tx = await promise;
    const receipt = await tx.wait();
    showInfo(minedMessage);
    return { tx, receipt }; // just guessing at a good return value here
  } catch (e) {
    showError(e);
  }
};
