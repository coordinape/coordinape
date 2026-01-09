import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from '@wagmi/core';
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
  HARDHAT_GANACHE_PORT,
  IN_PREVIEW,
  IN_PRODUCTION,
  WALLET_CONNECT_V2_PROJECT_ID,
} from '../../config/env';
import { localhost } from '../../utils/viem/chains';
import {
  ARBITRUM_RPC_URL,
  BASE_RPC_URL,
  ETHEREUM_RPC_URL,
  ETHEREUM_SEPOLIA_RPC_URL,
  OPTIMISM_RPC_URL,
  OPTIMISM_SEPOLIA_RPC_URL,
  POLYGON_RPC_URL,
} from '../web3/rpcs';

type Chains = Parameters<typeof createConfig>[0]['chains'];
const wagmiChains: Chains = IN_PRODUCTION
  ? [optimism, mainnet, polygon, base, arbitrum]
  : IN_PREVIEW
    ? [optimismSepolia, mainnet, optimism, polygon, base, arbitrum, sepolia]
    : [
        localhost,
        mainnet,
        optimism,
        polygon,
        base,
        arbitrum,
        optimismSepolia,
        sepolia,
      ];

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
      chains: wagmiChains,
      transports: {
        [mainnet.id]: http(ETHEREUM_RPC_URL),
        [optimism.id]: http(OPTIMISM_RPC_URL),
        [polygon.id]: http(POLYGON_RPC_URL),
        [optimismSepolia.id]: http(OPTIMISM_SEPOLIA_RPC_URL),
        [localhost.id]: http(`http://localhost:${HARDHAT_GANACHE_PORT}`),
        [sepolia.id]: http(ETHEREUM_SEPOLIA_RPC_URL),
        [base.id]: http(BASE_RPC_URL),
        [arbitrum.id]: http(ARBITRUM_RPC_URL),
      },
    })
  : IN_PREVIEW
    ? createConfig({
        connectors,
        chains: wagmiChains,
        transports: {
          [mainnet.id]: http(ETHEREUM_RPC_URL),
          [optimism.id]: http(OPTIMISM_RPC_URL),
          [polygon.id]: http(POLYGON_RPC_URL),
          [optimismSepolia.id]: http(OPTIMISM_SEPOLIA_RPC_URL),
          [sepolia.id]: http(ETHEREUM_SEPOLIA_RPC_URL),
          [base.id]: http(BASE_RPC_URL),
          [arbitrum.id]: http(ARBITRUM_RPC_URL),
        },
      })
    : createConfig({
        connectors,
        chains: wagmiChains,
        transports: {
          [mainnet.id]: http(ETHEREUM_RPC_URL),
          [optimism.id]: http(OPTIMISM_RPC_URL),
          [polygon.id]: http(POLYGON_RPC_URL),
          [optimismSepolia.id]: http(OPTIMISM_SEPOLIA_RPC_URL),
          [localhost.id]: http(`http://localhost:${HARDHAT_GANACHE_PORT}`),
          [sepolia.id]: http(ETHEREUM_SEPOLIA_RPC_URL),
          [base.id]: http(BASE_RPC_URL),
          [arbitrum.id]: http(ARBITRUM_RPC_URL),
        },
      });
