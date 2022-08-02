import { JsonRpcProvider } from '@ethersproject/providers';
import { Contracts } from 'lib/vaults';

import {
  HARDHAT_CHAIN_ID,
  HARDHAT_PORT,
  HARDHAT_GANACHE_CHAIN_ID,
  HARDHAT_GANACHE_PORT,
} from '../../config/env';

export const chainId = process.env.TEST_ON_HARDHAT_NODE
  ? HARDHAT_CHAIN_ID
  : HARDHAT_GANACHE_CHAIN_ID;
const port = process.env.TEST_ON_HARDHAT_NODE
  ? HARDHAT_PORT
  : HARDHAT_GANACHE_PORT;
export const rpcUrl = `http://localhost:${port}`;
export const provider = new JsonRpcProvider(rpcUrl);

export const takeSnapshot = async (): Promise<string> => {
  return (await provider.send('evm_snapshot', [])) as string;
};

export const restoreSnapshot = async (snapshotId?: string) => {
  if (!snapshotId) {
    console.error('No snapshot ID provided; not reverting.');
    return;
  }
  return provider.send('evm_revert', [snapshotId]);
};

export const getContracts = () => new Contracts(chainId, provider);
