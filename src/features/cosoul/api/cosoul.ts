import { Address, decodeEventLog, keccak256, Log, toBytes } from 'viem';

import { CoSoulABI } from '../../../contracts/abis';
import { getCoSoulContract } from '../../../utils/viem/contracts';
import {
  getReadOnlyClient,
  ReadOnlyClient,
} from '../../../utils/viem/publicClient';

export const PGIVE_SYNC_DURATION_DAYS = 30;

// get the cosoul token id for a given address
export const getTokenId = async (
  address: string,
  publicClient?: ReadOnlyClient
) => {
  const contract = getCoSoulContract(publicClient);

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
