import { JsonRpcProvider } from '@ethersproject/providers';

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

let _provider: JsonRpcProvider;

export const provider = () => {
  if (!_provider) _provider = new JsonRpcProvider(rpcUrl);
  return _provider;
};

// These functions take optional provider args because the default provider may
// not always be set up correctly, e.g. in Cypress

export const takeSnapshot = async (
  myProvider?: JsonRpcProvider
): Promise<string> => {
  return (await (myProvider || provider()).send('evm_snapshot', [])) as string;
};

export const restoreSnapshot = async (
  snapshotId?: string,
  myProvider?: JsonRpcProvider
) => {
  if (!snapshotId) {
    console.error('No snapshot ID provided; not reverting.');
    return;
  }
  return (myProvider || provider()).send('evm_revert', [snapshotId]);
};
