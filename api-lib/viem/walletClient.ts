import { createWalletClient, Hex, http, WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { optimism, optimismSepolia } from 'viem/chains';

import { chain } from '../../src/features/cosoul/chains';
import { localhost } from '../../src/utils/viem/chains';
import { BE_ALCHEMY_API_KEY, HARDHAT_GANACHE_PORT } from '../config';

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
          `https://opt-mainnet.g.alchemy.com/v2/${BE_ALCHEMY_API_KEY}`
        ),
      });
    case 11155420: // Optimism Sepolia
      return createWalletClient({
        account,
        chain: optimismSepolia,
        transport: http(
          `https://opt-sepolia.g.alchemy.com/v2/${BE_ALCHEMY_API_KEY}`
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
