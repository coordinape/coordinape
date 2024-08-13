import {
  Address,
  decodeEventLog,
  Hex,
  keccak256,
  Log,
  toBytes,
  TransactionReceipt,
} from 'viem';

import { COSOUL_SIGNER_ADDR_PK } from '../../../../api-lib/config';
import { CoSoulABI } from '../../../../contracts/abis';
import {
  getCoSoulContract,
  getCoSoulContractWithWallet,
} from '../../../utils/viem/contracts';
import { getReadOnlyClient } from '../../../utils/viem/publicClient';
import { getWalletClient } from '../../../utils/viem/walletClient';
import { wagmiChain } from '../../wagmi/config';
import { chain } from '../chains';

export const PGIVE_SLOT = 0;
export const REP_SLOT = 1;
export const PGIVE_SYNC_DURATION_DAYS = 30;

type Slot = typeof PGIVE_SLOT | typeof REP_SLOT;
type CoSoulArgs = { tokenId: number; amount: number };

function walletClient() {
  const client = getWalletClient(COSOUL_SIGNER_ADDR_PK as Hex);
  if (!client) {
    throw new Error('Wallet client not found');
  }
  return client;
}

function walletAccount() {
  const account = walletClient().account;
  if (!account) {
    throw new Error('Wallet account not found');
  }
  return account;
}

function coSoulWithWallet() {
  return getCoSoulContractWithWallet(walletClient());
}

// get the cosoul token id for a given address
export const getTokenId = async (address: string) => {
  const contract = getCoSoulContract();

  const balanceOf = await contract.read.balanceOf([
    // see if they have any CoSoul tokens
    address as Address,
  ] as const);

  // if they don't have a balance there is nothing more to do
  if (balanceOf === 0n) {
    return undefined;
  }

  // fetch their first token because they can only have one per the contract
  return await contract.read.tokenOfOwnerByIndex([
    address as Address,
    0n,
  ] as const);
};

export const mintCoSoulForAddress = async (address: string) => {
  // TODO: test this

  const cosoul = coSoulWithWallet();
  const gasSettings = chain.gasSettings;

  // eslint-disable-next-line no-console
  console.log('minting CoSoul for address: ', address);

  const txHash = await cosoul.write.mintTo([address as Address] as const, {
    account: walletAccount(),
    chain: wagmiChain,
    ...gasSettings,
  });

  const publicClient = getReadOnlyClient();
  return await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
};

export async function getMintInfoFromReceipt(receipt: TransactionReceipt) {
  const transferEventSignature = keccak256(
    toBytes('Transfer(address,address,uint256)')
  );

  if (receipt.logs === undefined) {
    throw new Error('No logs found in the transaction receipt');
  }

  for (const log of receipt.logs) {
    if (log.topics[0] === transferEventSignature) {
      const decodedLog = decodeEventLog({
        abi: CoSoulABI,
        data: log.data,
        topics: log.topics,
        eventName: 'Transfer',
      });

      const { from, to, tokenId } = decodedLog.args;

      return { from, to, tokenId };
    }
  }

  throw new Error('No Transfer event found in the transaction receipt');
}

// TODO: test this
export async function getMintInfo(txHash: string, chainId: number) {
  const publicClient = getReadOnlyClient(chainId);

  const receipt = await publicClient.getTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const transferEventSignature = keccak256(
    toBytes('Transfer(address,address,uint256)')
  );

  if (receipt.logs === undefined) {
    throw new Error('No logs found in the transaction receipt');
  }

  for (const log of receipt.logs) {
    if (log.topics[0] === transferEventSignature) {
      const decodedLog = decodeEventLog({
        abi: CoSoulABI,
        data: log.data,
        topics: log.topics,
        eventName: 'Transfer',
      });

      const { from, to, tokenId } = decodedLog.args;

      return { from, to, tokenId: tokenId };
    }
  }

  throw new Error('No Transfer event found in the transaction receipt');
}

export async function getMintInfofromLogs(log: Log | undefined) {
  if (log === undefined) return null;

  try {
    const decodedLog = decodeEventLog({
      abi: CoSoulABI,
      data: log.data,
      topics: log.topics,
      eventName: 'Transfer',
    });

    const { from, to, tokenId } = decodedLog.args;

    return {
      from,
      to,
      tokenId: Number(tokenId), // Convert BigInt to Number
    };
  } catch (error) {
    console.error('Error decoding log:', error);
    return null;
  }
}

export const getOnChainPGive = async (tokenId: number) => {
  const cosoul = getCoSoulContract();
  return await cosoul.read.getSlot([PGIVE_SLOT, BigInt(tokenId)] as const);
};

export const setOnChainPGive = async (params: CoSoulArgs) => {
  return await setSlotOnChain(PGIVE_SLOT, params);
};

export const setOnChainRep = async (params: CoSoulArgs) => {
  return await setSlotOnChain(REP_SLOT, params);
};

// set the on-chain PGIVE balance for a given token
const setSlotOnChain = async (slot: Slot, params: CoSoulArgs) => {
  const cosoul = coSoulWithWallet();

  const amount = Math.floor(params.amount);
  // eslint-disable-next-line no-console
  console.log(
    `updating on-chain cosoul tokenId: ${params.tokenId} slot ${slot} to ${amount}`
  );

  const gasSettings = chain.gasSettings;

  return await cosoul.write.setSlot(
    [BigInt(slot), amount, BigInt(params.tokenId)] as const,
    {
      account: walletAccount(),
      chain: wagmiChain,
      ...gasSettings,
    }
  );
};

const paddedHex = (n: number, length: number = 8): string => {
  const _hex = n.toString(16); // convert number to hexadecimal
  const hexLen = _hex.length;
  const extra = '0'.repeat(length - hexLen);
  if (hexLen === length) {
    return _hex;
  } else if (hexLen < length) {
    return extra + _hex;
  } else {
    throw new Error(
      `Number: ${n} is too large to be padded in length ${length} bytes, _hex: ${_hex}; hexLen: ${hexLen}; extra: ${extra}`
    );
  }
};

const getPayload = (amount: number, tokenId: number): string =>
  paddedHex(amount) + paddedHex(tokenId);

export const setBatchOnChainPGive = async (params: CoSoulArgs[]) => {
  return await setBatchSlotOnChain(PGIVE_SLOT, params);
};
export const setBatchOnChainRep = async (params: CoSoulArgs[]) => {
  return await setBatchSlotOnChain(REP_SLOT, params);
};

/*
 * setBatchSlotOnChain: set a batch of cosoul slots to given values on chain
 * @param params: an array of objects with tokenId and amounts
 * @returns: a promise that resolves when the transaction is mined
 *
 * The contract expects data in the following format:
 * @param _data bytes data
 *    3 bits for slot | one byte
 *    after previous byte, alternate bewteen next elements like a packed array
 *    4 bytes for each amount
 *    4 bytes for each token ID
 */
export const setBatchSlotOnChain = async (slot: Slot, params: CoSoulArgs[]) => {
  let payload = '0x' + paddedHex(slot, 2); // 1byte for slot
  for (const { tokenId, amount } of params) {
    if (amount > 0) {
      // four bytes for pgive and four bytes for tokenId
      payload += getPayload(Math.floor(amount), tokenId);
    }
  }

  // payload is only 0x00 if no pgive needs to be updated on chain
  if (payload.length > 4) {
    const cosoul = coSoulWithWallet();
    const gasSettings = chain.gasSettings;

    const txHash = await cosoul.write.batchSetSlot_UfO(
      [payload as Hex] as const,
      {
        account: walletAccount(),
        chain: wagmiChain,
        ...gasSettings,
      }
    );

    return await getReadOnlyClient().waitForTransactionReceipt({
      hash: txHash,
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('No cosouls to update on chain');
    return;
  }
};
