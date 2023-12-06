import { Logger } from '@ethersproject/logger';
import { DebugLogger } from 'common-lib/log';
import { BaseContract, ContractReceipt, ContractTransaction } from 'ethers';
import { addContractWait } from 'lib/ethers/addContractWait';

import {
  addTransaction,
  updateTransaction,
} from 'components/RecentTransactionsModal';

const { TRANSACTION_REPLACED } = Logger.errors;
const logger = new DebugLogger('sendAndTrackTx');

type Options = {
  savePending?: (txHash: string) => Promise<void>;
  deletePending?: (txHash: string) => Promise<void>;
  signingMessage?: string;
  sendingMessage?: string;
  minedMessage?: string;
  showDefault?: (message: any) => void;
  description: string;
  chainId: string;
  contract?: BaseContract;
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
    description,
    chainId,
    savePending,
    deletePending,
    contract,
  }: Options
): Promise<SendAndTrackTxResult> => {
  const timestamp = Date.now();
  try {
    const promise = callback();
    showDefault?.(signingMessage);
    addTransaction({ timestamp, status: 'pending', description, chainId });
    logger.log(`awaiting tx... description: ${description}`);

    let tx = await promise;
    logger.log(`done awaiting tx. hash: ${tx.hash}`);
    showDefault?.(sendingMessage);

    const getReceipt = async (): Promise<ContractReceipt> => {
      await savePending?.(tx.hash);
      updateTransaction(timestamp, { hash: tx.hash });
      logger.log('awaiting receipt...');

      try {
        return await tx.wait();
      } catch (err: any) {
        const { code, reason } = err;
        // https://docs.ethers.org/v5/api/utils/logger/#errors--transaction-replaced
        if (code === TRANSACTION_REPLACED && reason === 'repriced') {
          tx = err.replacement;
          logger.log('transaction repriced! new hash:', tx.hash);
          if (contract) addContractWait(contract, tx);
          return await getReceipt();
        } else {
          throw err;
        }
      }
    };

    const receipt = await getReceipt();
    logger.log('done awaiting receipt.');
    await deletePending?.(tx.hash);
    updateTransaction(timestamp, { status: 'confirmed' });
    showDefault?.(minedMessage);
    return { tx, receipt };
  } catch (e: any) {
    updateTransaction(timestamp, { status: 'error' });
    if (e.data?.message?.match(/insufficient funds for gas/)) {
      return { error: 'Insufficient funds for gas.' };
    } else if (e.message?.match(/user rejected transaction/)) {
      return { error: 'User rejected transaction' };
    }
    return { error: e.data?.message ?? e.message ?? e };
  }
};
