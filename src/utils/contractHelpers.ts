import { ContractTransaction, ContractReceipt } from 'ethers';
import { deletePendingTx } from 'lib/gql/mutations';

import {
  addTransaction,
  updateTransaction,
} from 'components/MyAvatarMenu/RecentTransactionsModal';

type Options = {
  savePending?: (txHash: string, chainId: string) => Promise<void>;
  signingMessage?: string;
  sendingMessage?: string;
  minedMessage?: string;
  showInfo: (message: any) => void;
  showError: (message: any) => void;
  description: string;
  chainId: string;
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
    description,
    chainId,
    savePending,
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
      chainId,
    });
    const tx = await promise;
    if (savePending) savePending(tx.hash, chainId);
    showInfo(sendingMessage);
    updateTransaction(timestamp, { hash: tx.hash });
    const receipt = await tx.wait();
    if (savePending) deletePendingTx(tx.hash);
    updateTransaction(timestamp, { status: 'confirmed' });
    showInfo(minedMessage);
    return { tx, receipt }; // just guessing at a good return value here
  } catch (e: unknown) {
    updateTransaction(timestamp, { status: 'error' });
    showError(e);
    return { error: e }; // best behavior here TBD
  }
};
