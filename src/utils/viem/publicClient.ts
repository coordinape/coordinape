import { createPublicClient, http, PublicClient } from 'viem';
import { localhost, optimism, optimismSepolia } from 'viem/chains';

export const getReadOnlyClient = (
  chainId: number
): PublicClient | undefined => {
  switch (chainId) {
    case 10: // Optimism
      return createPublicClient({
        chain: optimism,
        transport: http(
          `https://opt-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_OPTIMISM_API_KEY}`
        ),
      });
    case 11155420: // Optimism Sepolia
      return createPublicClient({
        chain: optimismSepolia,
        transport: http(
          `https://opt-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_OPTIMISM_SEPOLIA_API_KEY}`
        ),
      });
    case 1338: // Local development chain
      return createPublicClient({
        chain: localhost,
        transport: http('http://localhost:8546'),
      });
    default:
      return undefined;
  }
};
