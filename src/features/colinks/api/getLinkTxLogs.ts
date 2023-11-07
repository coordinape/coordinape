import assert from 'assert';

import { SoulKeys } from '@coordinape/hardhat/dist/typechain/SoulKeys';
import { BigNumber, ethers } from 'ethers';

import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../../cosoul/chains';

import { getCoLinksContract } from './colinks';

const LINK_TX_SIG =
  'LinkTx(address,address,bool,uint256,uint256,uint256,uint256,uint256)';
const BLOCKS_TO_FETCH = 10;

export type LinkTx = {
  holder: string;
  target: string;
  isBuy: boolean;
  shareAmount: BigNumber;
  ethAmount: BigNumber;
  protocolEthAmount: BigNumber;
  targetEthAmount: BigNumber;
  supply: BigNumber;
};
export async function getLinkTxLogs() {
  const provider = getProvider(Number(chain.chainId));

  const soulKeys = getCoLinksContract();
  const tradeTopic: string = ethers.utils.id(LINK_TX_SIG);

  assert(soulKeys);
  // Get 10 blocks worth of key transactions and put them all in the db
  const currentBlock = await provider.getBlockNumber();
  const rawLogs = await provider.getLogs({
    address: soulKeys.address,
    topics: [tradeTopic],
    fromBlock: currentBlock - BLOCKS_TO_FETCH,
    toBlock: currentBlock,
  });

  return rawLogs.map(rl => {
    const data = parseEventLog(soulKeys, rl);
    return {
      data,
      transactionHash: rl.transactionHash,
    };
  });
}

export function parseEventLog(soulKeys: SoulKeys, log: ethers.providers.Log) {
  const sk = soulKeys.interface.decodeEventLog(
    LINK_TX_SIG,
    log.data
  ) as unknown as LinkTx;
  return sk;
}
