import { ContractTransaction, ContractReceipt } from 'ethers';

import {
  addTransaction,
  updateTransaction,
} from 'components/MyAvatarMenu/RecentTransactionsModal';

type Options = {
  signingMessage?: string;
  sendingMessage?: string;
  minedMessage?: string;
  showInfo: (message: any) => void;
  showError: (message: any) => void;
  description?: string;
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
    description = 'Unlabeled transaction',
  }: Options
): Promise<SendAndTrackTxResult> => {
  const timestamp = Date.now();
  try {
    const promise = callback();
    showInfo(signingMessage);
    addTransaction({
      timestamp,
      status: 'pending',
      description,
    });
    const tx = await promise;
    showInfo(sendingMessage);
    updateTransaction(timestamp, { hash: tx.hash });
    const receipt = await tx.wait();
    updateTransaction(timestamp, { status: 'confirmed' });
    showInfo(minedMessage);
    return { tx, receipt }; // just guessing at a good return value here
  } catch (e: unknown) {
    updateTransaction(timestamp, { status: 'error' });
    showError(e);
    return { error: e }; // best behavior here TBD
  }
};
