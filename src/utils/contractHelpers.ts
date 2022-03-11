import { ContractTransaction, ContractReceipt } from 'ethers';

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
