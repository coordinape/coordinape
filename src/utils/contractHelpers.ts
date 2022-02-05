import {
  ApeVaultWrapperImplementation,
  ApeVaultWrapperImplementation__factory,
} from '@coordinape/hardhat/dist/typechain';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { ContractTransaction, BigNumberish, ContractReceipt } from 'ethers';

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

type Options = {
  signingMessage?: string;
  sendingMessage?: string;
  minedMessage?: string;
  showInfo: (message: any) => void;
  showError: (message: any) => void;
};

export type SendAndTrackTxResult = {
  tx?: ContractTransaction;
  receipt?: ContractReceipt;
  error?: unknown;
};

export const sendAndTrackTx = async (
  callback: () => Promise<ContractTransaction>,
  {
    signingMessage = 'Please sign the transaction.',
    sendingMessage = 'Sending transaction...',
    minedMessage = 'Transaction completed',
    showInfo,
    showError,
  }: Options
): Promise<SendAndTrackTxResult> => {
  try {
    const promise = callback();
    showInfo(signingMessage);
    const tx = await promise;
    showInfo(sendingMessage);
    const receipt = await tx.wait();
    showInfo(minedMessage);
    return { tx, receipt }; // just guessing at a good return value here
  } catch (e: unknown) {
    showError(e);
    return { error: e }; // best behavior here TBD
  }
};
