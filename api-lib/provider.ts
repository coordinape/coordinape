import { JsonRpcProvider } from '@ethersproject/providers';

import {
  BE_ALCHEMY_API_KEY,
  HARDHAT_GANACHE_PORT,
  HARDHAT_PORT,
} from './config';

export function getProvider(chainId: number) {
  switch (chainId) {
    // TODO: return different providers for different production chains
    case 1: // mainnet
      return new JsonRpcProvider(
        `https://eth-mainnet.g.alchemy.com/v2/${BE_ALCHEMY_API_KEY}`
      );
    case 10: // Optimism
      return new JsonRpcProvider(
        `https://opt-mainnet.g.alchemy.com/v2/${BE_ALCHEMY_API_KEY}`
      );
    case 8453: // Base
      return new JsonRpcProvider(
        `https://base-mainnet.g.alchemy.com/v2/${BE_ALCHEMY_API_KEY}`
      );
    case 84532: // Base Sepolia
      return new JsonRpcProvider(
        `https://base-sepolia.g.alchemy.com/v2/${BE_ALCHEMY_API_KEY}`
      );
    case 11155420: {
      // Optimism Seplolia
      const url = `https://opt-sepolia.g.alchemy.com/v2/${BE_ALCHEMY_API_KEY}`;
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
