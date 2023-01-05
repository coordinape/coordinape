import { DebugLogger } from 'common-lib/log';
import { ContractTransaction, ContractReceipt } from 'ethers';

import {
  addTransaction,
  updateTransaction,
} from 'components/MyAvatarMenu/RecentTransactionsModal';

const logger = new DebugLogger('sendAndTrackTx');

type Options = {
  savePending?: (txHash: string) => Promise<void>;
  deletePending?: (txHash: string) => Promise<void>;
  signingMessage?: string;
  sendingMessage?: string;
  minedMessage?: string;
  showDefault: (message: any) => void;
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
    showDefault,
    showError,
    description,
    chainId,
    savePending,
    deletePending,
  }: Options
): Promise<SendAndTrackTxResult> => {
  const timestamp = Date.now();
  try {
    const promise = callback();
    showDefault(signingMessage);
    addTransaction({ timestamp, status: 'pending', description, chainId });
    logger.log(`awaiting tx... description: ${description}`);
    const tx = await promise;
    logger.log(`done awaiting tx. hash: ${tx.hash}`);
    showDefault(sendingMessage);
    await savePending?.(tx.hash);
    updateTransaction(timestamp, { hash: tx.hash });
    logger.log('awaiting receipt...');
    const receipt = await tx.wait();
    logger.log('done awaiting receipt.');
    await deletePending?.(tx.hash);
    updateTransaction(timestamp, { status: 'confirmed' });
    showDefault(minedMessage);
    return { tx, receipt }; // just guessing at a good return value here
  } catch (e: unknown) {
    updateTransaction(timestamp, { status: 'error' });
    showError(e);
    return { error: e }; // best behavior here TBD
  }
};
