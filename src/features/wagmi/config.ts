import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
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

import {
  IN_PREVIEW,
  IN_PRODUCTION,
  WALLET_CONNECT_V2_PROJECT_ID,
} from 'config/env';
import { isFeatureEnabled } from 'config/features';
import { localhost } from 'utils/viem/chains';

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        rainbowWallet,
        coinbaseWallet,
        metaMaskWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'CoLinks',
    projectId: WALLET_CONNECT_V2_PROJECT_ID, //TODO test walletconnect. is this walletconnect or something other project id?
  }
);

export const wagmiConfig = IN_PRODUCTION
  ? createConfig({
      connectors,
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
        connectors,
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
        connectors,
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
export const wagmiChain =
  isFeatureEnabled('test_decent') || IN_PRODUCTION
    ? optimism
    : IN_PREVIEW
      ? optimismSepolia
      : localhost;
