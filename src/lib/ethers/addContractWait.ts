import assert from 'assert';

import type { LogDescription } from '@ethersproject/abi';
import type { TransactionResponse } from '@ethersproject/abstract-provider';
import { BytesLike } from '@ethersproject/bytes';
import type {
  Contract,
  ContractReceipt,
  Event,
} from '@ethersproject/contracts';
import { deepCopy } from '@ethersproject/properties';

// source: https://github.com/ethers-io/ethers.js/blob/v5.7.2/packages/contracts/src.ts/index.ts#L334
// it's tweaked to pass typing & formatting checks but no functionality is changed
export function addContractWait(contract: Contract, tx: TransactionResponse) {
  const wait = tx.wait.bind(tx);
  tx.wait = (confirmations?: number) => {
    return wait(confirmations).then((receipt: ContractReceipt) => {
      (receipt as any).events = receipt.logs.map(log => {
        const event: Event = deepCopy(log) as Event;
        let parsed: LogDescription | null = null;
        try {
          parsed = contract.interface.parseLog(log);
        } catch (e) {} // eslint-disable-line no-empty

        // Successfully parsed the event log; include it
        if (parsed) {
          event.args = parsed.args;
          event.decode = (data: BytesLike, topics?: Array<any>) => {
            assert(parsed);
            return contract.interface.decodeEventLog(
              parsed.eventFragment,
              data,
              topics
            );
          };
          event.event = parsed.name;
          event.eventSignature = parsed.signature;
        }

        // Useful operations
        event.removeListener = () => contract.provider;
        event.getBlock = () => contract.provider.getBlock(receipt.blockHash);
        event.getTransaction = () =>
          contract.provider.getTransaction(receipt.transactionHash);
        event.getTransactionReceipt = () => Promise.resolve(receipt);

        return event;
      });

      return receipt;
    });
  };
}
