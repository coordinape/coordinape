import { DebugLogger } from 'common-lib/log';
import {
  BaseError,
  ContractFunctionRevertedError,
  TransactionReceipt,
} from 'viem';

import {
  addTransaction,
  updateTransaction,
} from 'components/RecentTransactionsModal';

import { getReadOnlyClient } from './publicClient';

const logger = new DebugLogger('sendAndTrackTx');

type Options = {
  savePending?: (txHash: `0x${string}`) => Promise<void>;
  deletePending?: (txHash: `0x${string}`) => Promise<void>;
  signingMessage?: string;
  sendingMessage?: string;
  minedMessage?: string;
  showDefault?: (message: any) => void;
  description: string;
  chainId: string;
  // publicClient: PublicClient;
};

export type SendAndTrackTxResult = {
  hash?: `0x${string}`;
  receipt?: TransactionReceipt;
  error?: unknown;
};

export const sendAndTrackTx = async (
  callback: () => Promise<`0x${string}`>,
  {
    signingMessage = 'Please sign the transaction.',
    sendingMessage = 'Sending transaction...',
    minedMessage = 'Transaction completed',
    showDefault,
    description,
    chainId,
    savePending,
    deletePending,
    // publicClient,
  }: Options
): Promise<SendAndTrackTxResult> => {
  const timestamp = Date.now();
  try {
    const publicClient = getReadOnlyClient(Number(chainId));

    if (!publicClient) {
      throw new Error(`no publicClient available for chain ${chainId}`);
    }

    const promise = callback();
    showDefault?.(signingMessage);
    addTransaction({ timestamp, status: 'pending', description, chainId });
    logger.log(`awaiting tx... description: ${description}`);

    let hash = await promise;
    logger.log(`done awaiting tx. hash: ${hash}`);
    showDefault?.(sendingMessage);

    const getReceipt = async (): Promise<TransactionReceipt> => {
      await savePending?.(hash);
      updateTransaction(timestamp, { hash });
      logger.log('awaiting receipt...');

      try {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        return receipt;
      } catch (err: any) {
        if (err.code === 'TRANSACTION_REPLACED') {
          if (err.replacement) {
            hash = err.replacement.hash;
            logger.log('transaction replaced! new hash:', hash);
            return await getReceipt();
          }
        }
        throw err;
      }
    };

    const receipt = await getReceipt();
    logger.log('done awaiting receipt.');
    await deletePending?.(hash);
    updateTransaction(timestamp, { status: 'confirmed' });
    showDefault?.(minedMessage);
    return { hash, receipt };
  } catch (e: unknown) {
    updateTransaction(timestamp, { status: 'error' });
    if (e instanceof BaseError) {
      if (e.message.includes('insufficient funds for gas')) {
        return { error: 'Insufficient funds for gas.' };
      } else if (e.message.includes('user rejected transaction')) {
        return { error: 'User rejected transaction' };
      } else if (e instanceof ContractFunctionRevertedError) {
        return { error: e.reason ?? 'Contract function reverted' };
      }
    }
    return { error: e instanceof Error ? e.message : String(e) };
  }
};
