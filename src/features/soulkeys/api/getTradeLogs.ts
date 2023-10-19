import assert from 'assert';

import { SoulKeys } from '@coordinape/hardhat/dist/typechain/SoulKeys';
import { ethers } from 'ethers';

import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../../cosoul/chains';

import { getSoulKeysContract } from './soulkeys';

const TRADE_SIG =
  'Trade(address,address,bool,uint256,uint256,uint256,uint256,uint256)';
const BLOCKS_TO_FETCH = 10;

export async function getTradeLogs() {
  const provider = getProvider(Number(chain.chainId));

  const soulKeys = getSoulKeysContract();
  const tradeTopic: string = ethers.utils.id(TRADE_SIG);

  assert(soulKeys);
  // Get 10 blocks worth of key transactions and put them all in the db
  const currentBlock = await provider.getBlockNumber();
  const rawLogs = await provider.getLogs({
    address: soulKeys.address,
    topics: [tradeTopic],
    fromBlock: currentBlock - BLOCKS_TO_FETCH,
    toBlock: currentBlock,
  });

  return rawLogs.map(rl => ({
    transactionHash: rl.transactionHash,
    data: parseEventLog(soulKeys, rl),
  }));
}

export function parseEventLog(soulKeys: SoulKeys, log: ethers.providers.Log) {
  const sk = soulKeys.interface.decodeEventLog(TRADE_SIG, log.data);
  return sk;
}
