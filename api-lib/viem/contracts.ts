import {
  Address,
  Hex,
  TransactionReceipt,
  WalletClient,
  decodeEventLog,
  getContract,
  keccak256,
  toBytes,
} from 'viem';

import { CoLinksABI, CoSoulABI } from '../../src/contracts/abis';
import { chain } from '../../src/features/cosoul/chains';
import { wagmiChain } from '../../src/features/wagmi/config';
import {
  getCoSoulContract,
  getContractAddress,
} from '../../src/utils/viem/contracts';
import { getReadOnlyClient } from '../../src/utils/viem/publicClient';
import { BE_ALCHEMY_API_KEY, COSOUL_SIGNER_ADDR_PK } from '../config';

import { getWalletClient } from './walletClient';

export const PGIVE_SLOT = 0;
export const REP_SLOT = 1;

type Slot = typeof PGIVE_SLOT | typeof REP_SLOT;
type CoSoulArgs = { tokenId: number; amount: number };

export type CoLinksWithWallet = ReturnType<typeof getCoLinksContractWithWallet>;
export const getCoLinksContractWithWallet = (walletClient: WalletClient) => {
  return getContract({
    address: getContractAddress('CoLinks'),
    abi: CoLinksABI,
    client: {
      wallet: walletClient,
    },
  });
};

export const backendReadOnlyClient = () =>
  getReadOnlyClient(undefined, BE_ALCHEMY_API_KEY);

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

export type CoSoulWithWallet = ReturnType<typeof getCoSoulContractWithWallet>;
export const getCoSoulContractWithWallet = () => {
  return getContract({
    address: getContractAddress('CoSoul'),
    abi: CoSoulABI,
    client: {
      wallet: walletClient(),
    },
  });
};

export const mintCoSoulForAddress = async (address: string) => {
  const cosoul = getCoSoulContractWithWallet();
  const gasSettings = chain.gasSettings;

  // eslint-disable-next-line no-console
  console.log('minting CoSoul for address: ', address);

  const txHash = await cosoul.write.mintTo([address as Address] as const, {
    account: walletAccount(),
    chain: wagmiChain,
    ...gasSettings,
  });

  const publicClient = backendReadOnlyClient();
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

export const getOnChainPGive = async (tokenId: number) => {
  const cosoul = getCoSoulContract(backendReadOnlyClient());
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
  const cosoul = getCoSoulContractWithWallet();

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
    const cosoul = getCoSoulContractWithWallet();
    const gasSettings = chain.gasSettings;

    const txHash = await cosoul.write.batchSetSlot_UfO(
      [payload as Hex] as const,
      {
        account: walletAccount(),
        chain: wagmiChain,
        ...gasSettings,
      }
    );

    return await backendReadOnlyClient().waitForTransactionReceipt({
      hash: txHash,
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('No cosouls to update on chain');
    return;
  }
};
