import { JsonRpcProvider } from '@ethersproject/providers';

import {
  ALCHEMY_ETH_MAINNET_API_KEY,
  ALCHEMY_OPTIMISM_API_KEY,
  ALCHEMY_OPTIMISM_SEPOLIA_API_KEY,
  HARDHAT_GANACHE_PORT,
  HARDHAT_PORT,
} from './config.js';

export function getProvider(chainId: number) {
  // eslint-disable-next-line no-console
  console.log('getProvider for chainId', chainId);
  switch (chainId) {
    // TODO: return different providers for different production chains
    case 1: // mainnet
      return new JsonRpcProvider(
        `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_ETH_MAINNET_API_KEY}`
      );
    case 10: // Optimism
      return new JsonRpcProvider(
        `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_OPTIMISM_API_KEY}`
      );
    case 11155420: {
      // Optimism Seplolia
      const url = `https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_OPTIMISM_SEPOLIA_API_KEY}`;
      // eslint-disable-next-line no-console
      console.log('Optimism Seplolia url', url);
      return new JsonRpcProvider(url);
    }
    case 1337:
      return new JsonRpcProvider('http://localhost:' + HARDHAT_PORT);
    case 1338:
      return new JsonRpcProvider('http://localhost:' + HARDHAT_GANACHE_PORT);
    default:
      throw new Error(`chainId ${chainId} is unsupported`);
  }
}
