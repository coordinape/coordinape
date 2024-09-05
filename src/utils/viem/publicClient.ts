import { createPublicClient, http } from 'viem';
import { localhost, optimism, optimismSepolia } from 'viem/chains';

import {
  HARDHAT_GANACHE_PORT,
  VITE_FE_ALCHEMY_API_KEY,
} from '../../config/env';
import { chain } from '../../features/cosoul/chains';

export type ReadOnlyClient = ReturnType<typeof getReadOnlyClient>;
export function getReadOnlyClient(chainId?: number, alchemyApiKey?: string) {
  const apiKey = alchemyApiKey ?? VITE_FE_ALCHEMY_API_KEY;

  if (chainId === undefined) {
    chainId = Number(chain.chainId);
  }

  switch (chainId) {
    case 10: // Optimism
      return createPublicClient({
        chain: optimism,
        transport: http(`https://opt-mainnet.g.alchemy.com/v2/${apiKey}`),
      });
    case 11155420: // Optimism Sepolia
      return createPublicClient({
        chain: optimismSepolia,
        transport: http(`https://opt-sepolia.g.alchemy.com/v2/${apiKey}`),
      });
    case 1338: // Local development/CI chain
      return createPublicClient({
        chain: localhost,
        transport: http(`http://localhost:${HARDHAT_GANACHE_PORT}`),
      });
    default:
      throw new Error(`no publicClient available for chain ${chainId}`);
  }
}
