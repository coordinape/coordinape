import { createWalletClient, Hex, http, WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { localhost, optimism, optimismSepolia } from 'viem/chains';

import {
  HARDHAT_GANACHE_PORT,
  VITE_ALCHEMY_OPTIMISM_API_KEY,
  VITE_ALCHEMY_OPTIMISM_SEPOLIA_API_KEY,
} from '../../config/env';
import { chain } from '../../features/cosoul/chains';

export function getWalletClient(privateKey: Hex): WalletClient;
export function getWalletClient(privateKey: Hex, chainId: number): WalletClient;
export function getWalletClient(
  privateKey: Hex,
  chainId?: number
): WalletClient {
  if (chainId === undefined) {
    chainId = Number(chain.chainId);
  }

  const account = privateKeyToAccount(privateKey);

  switch (chainId) {
    case 10: // Optimism
      return createWalletClient({
        account,
        chain: optimism,
        transport: http(
          `https://opt-mainnet.g.alchemy.com/v2/${VITE_ALCHEMY_OPTIMISM_API_KEY}`
        ),
      });
    case 11155420: // Optimism Sepolia
      return createWalletClient({
        account,
        chain: optimismSepolia,
        transport: http(
          `https://opt-sepolia.g.alchemy.com/v2/${VITE_ALCHEMY_OPTIMISM_SEPOLIA_API_KEY}`
        ),
      });
    case 1338: // Local development chain
      return createWalletClient({
        account,
        chain: localhost,
        transport: http(`http://localhost:${HARDHAT_GANACHE_PORT}`),
      });
    default:
      throw new Error(`no walletClient available for chain ${chainId}`);
  }
}
