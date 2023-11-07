import assert from 'assert';

import { CoLinks } from '@coordinape/hardhat/dist/typechain/CoLinks';
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
  linkAmount: BigNumber;
  ethAmount: BigNumber;
  protocolEthAmount: BigNumber;
  targetEthAmount: BigNumber;
  supply: BigNumber;
};
export async function getLinkTxLogs() {
  const provider = getProvider(Number(chain.chainId));

  const coLinks = getCoLinksContract();
  const tradeTopic: string = ethers.utils.id(LINK_TX_SIG);

  assert(coLinks);
  // Get 10 blocks worth of key transactions and put them all in the db
  const currentBlock = await provider.getBlockNumber();
  const rawLogs = await provider.getLogs({
    address: coLinks.address,
    topics: [tradeTopic],
    fromBlock: currentBlock - BLOCKS_TO_FETCH,
    toBlock: currentBlock,
  });

  return rawLogs.map(rl => {
    const data = parseEventLog(coLinks, rl);
    return {
      data,
      transactionHash: rl.transactionHash,
    };
  });
}

export function parseEventLog(coLinks: CoLinks, log: ethers.providers.Log) {
  const sk = coLinks.interface.decodeEventLog(
    LINK_TX_SIG,
    log.data
  ) as unknown as LinkTx;
  return sk;
}
