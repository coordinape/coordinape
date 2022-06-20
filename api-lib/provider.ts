import { JsonRpcProvider } from '@ethersproject/providers';

import {
  ETHEREUM_RPC_URL,
  GOERLI_RPC_URL,
  HARDHAT_GANACHE_PORT,
} from './config';

export function getProvider(chainId: number) {
  switch (chainId) {
    // TODO: return different providers for different production chains
    case 1: // mainnet
      return new JsonRpcProvider(ETHEREUM_RPC_URL);
    case 5: // Goerli
      return new JsonRpcProvider(GOERLI_RPC_URL);
    case 1337:
    case 1338:
      return new JsonRpcProvider('http://localhost:' + HARDHAT_GANACHE_PORT);
    default:
      throw new Error(`chainId ${chainId} is unsupported`);
  }
}
