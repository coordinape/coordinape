import { createPublicClient, http } from 'viem';
import { localhost, optimism, optimismSepolia } from 'viem/chains';

import { chain } from '../../features/cosoul/chains';
import {
  VITE_ALCHEMY_OPTIMISM_API_KEY,
  VITE_ALCHEMY_OPTIMISM_SEPOLIA_API_KEY,
} from 'config/env';

export function getReadOnlyClient(chainId?: number) {
  if (chainId === undefined) {
    chainId = Number(chain.chainId);
  }

  switch (chainId) {
    case 10: // Optimism
      return createPublicClient({
        chain: optimism,
        transport: http(
          `https://opt-mainnet.g.alchemy.com/v2/${VITE_ALCHEMY_OPTIMISM_API_KEY}`
        ),
      });
    case 11155420: // Optimism Sepolia
      return createPublicClient({
        chain: optimismSepolia,
        transport: http(
          `https://opt-sepolia.g.alchemy.com/v2/${VITE_ALCHEMY_OPTIMISM_SEPOLIA_API_KEY}`
        ),
      });
    case 1338: // Local development chain
      return createPublicClient({
        chain: localhost,
        transport: http('http://localhost:8546'),
      });
    default:
      throw new Error(`no publicClient available for chain ${chainId}`);
  }
}
