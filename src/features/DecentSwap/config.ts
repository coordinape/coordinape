import { ChainId } from '@decent.xyz/box-common';
import { http, createConfig } from '@wagmi/core';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
} from '@wagmi/core/chains';
import {
  ETHEREUM_RPC_URL,
  ETHEREUM_SEPOLIA_RPC_URL,
  OPTIMISM_RPC_URL,
  OPTIMISM_SEPOLIA_RPC_URL,
} from 'features/auth/connectors';
import { defineChain } from 'viem';

import { IN_PREVIEW, IN_PRODUCTION } from 'config/env';
import { isFeatureEnabled } from 'config/features';

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}

const localhost = defineChain({
  id: 1338,
  name: 'Localhost 8546',
  rpcUrls: {
    default: {
      http: ['http://localhost:8546'],
    },
  },
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  gasSettings: {},
});

export const wagmiConfig = IN_PRODUCTION
  ? createConfig({
      chains: [mainnet, optimism, polygon, base, arbitrum],
      transports: {
        [mainnet.id]: http(ETHEREUM_RPC_URL),
        [optimism.id]: http(OPTIMISM_RPC_URL),
        [polygon.id]: http('https://polygon-rpc.com/'), //TODO: replace with alchemy rpc if available
        [optimismSepolia.id]: http(OPTIMISM_SEPOLIA_RPC_URL),
        [localhost.id]: http('http://localhost:8546'),
        [sepolia.id]: http(ETHEREUM_SEPOLIA_RPC_URL),
        [base.id]: http('https://mainnet.base.org'), //TODO: replace with alchemy rpc if available
        [arbitrum.id]: http('https://arbitrum-mainnet.infura.io'), //TODO: replace with alchemy rpc if available
      },
    })
  : IN_PREVIEW
    ? createConfig({
        chains: [
          mainnet,
          optimism,
          polygon,
          base,
          arbitrum,
          optimismSepolia,
          sepolia,
        ],
        transports: {
          [mainnet.id]: http(ETHEREUM_RPC_URL),
          [optimism.id]: http(OPTIMISM_RPC_URL),
          [polygon.id]: http('https://polygon-rpc.com/'), //TODO: replace with alchemy rpc if available
          [optimismSepolia.id]: http(OPTIMISM_SEPOLIA_RPC_URL),
          [sepolia.id]: http(ETHEREUM_SEPOLIA_RPC_URL),
          [base.id]: http('https://mainnet.base.org'), //TODO: replace with alchemy rpc if available
          [arbitrum.id]: http('https://arbitrum-mainnet.infura.io'), //TODO: replace with alchemy rpc if available
        },
      })
    : createConfig({
        chains: [
          mainnet,
          optimism,
          polygon,
          optimismSepolia,
          localhost,
          sepolia,
          base,
          arbitrum,
        ],
        transports: {
          [mainnet.id]: http(ETHEREUM_RPC_URL),
          [optimism.id]: http(OPTIMISM_RPC_URL),
          [polygon.id]: http('https://polygon-rpc.com/'), //TODO: replace with alchemy rpc if available
          [optimismSepolia.id]: http(OPTIMISM_SEPOLIA_RPC_URL),
          [localhost.id]: http('http://localhost:8546'),
          [sepolia.id]: http(ETHEREUM_SEPOLIA_RPC_URL),
          [base.id]: http('https://mainnet.base.org'), //TODO: replace with alchemy rpc if available
          [arbitrum.id]: http('https://arbitrum-mainnet.infura.io'), //TODO: replace with alchemy rpc if available
        },
      });

//Used to get the balance of the target chain for that environment
export const wagmiChain = IN_PRODUCTION
  ? optimism
  : IN_PREVIEW
    ? isFeatureEnabled('test_decent')
      ? optimism
      : optimismSepolia
    : localhost;

export const defaultAvailableChains = [
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.BASE,
  ChainId.ARBITRUM,
  ...(!IN_PRODUCTION ? [ChainId.SEPOLIA, ChainId.OPTIMISM_SEPOLIA] : []),
];
