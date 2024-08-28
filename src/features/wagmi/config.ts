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
  MAGIC_API_KEY,
  VITE_ALCHEMY_ETH_MAINNET_API_KEY,
  VITE_ALCHEMY_ETH_SEPOLIA_API_KEY,
  VITE_ALCHEMY_OPTIMISM_API_KEY,
  VITE_ALCHEMY_OPTIMISM_SEPOLIA_API_KEY,
  WALLET_CONNECT_V2_PROJECT_ID,
} from '../../config/env';
import { isFeatureEnabled } from '../../config/features';
import { localhost } from '../../utils/viem/chains';
import { getRainbowMagicWallet } from '../magiclink/RainbowMagicConnector';

export const OPTIMISM_RPC_URL = `https://opt-mainnet.g.alchemy.com/v2/${VITE_ALCHEMY_OPTIMISM_API_KEY}`;
export const ETHEREUM_RPC_URL = `https://eth-mainnet.g.alchemy.com/v2/${VITE_ALCHEMY_ETH_MAINNET_API_KEY}`;
export const OPTIMISM_SEPOLIA_RPC_URL = `https://opt-sepolia.g.alchemy.com/v2/${VITE_ALCHEMY_OPTIMISM_SEPOLIA_API_KEY}`;
export const ETHEREUM_SEPOLIA_RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${VITE_ALCHEMY_ETH_SEPOLIA_API_KEY}`;

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

const magicWallet = getRainbowMagicWallet({
  chains: [...wagmiChains],
  apiKey: MAGIC_API_KEY,
});

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        rainbowWallet,
        coinbaseWallet,
        metaMaskWallet,
        walletConnectWallet,
        magicWallet,
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
        [polygon.id]: http('https://polygon-rpc.com/'), //TODO: replace with alchemy rpc if available
        [optimismSepolia.id]: http(OPTIMISM_SEPOLIA_RPC_URL),
        [localhost.id]: http(`http://localhost:${HARDHAT_GANACHE_PORT}`),
        [sepolia.id]: http(ETHEREUM_SEPOLIA_RPC_URL),
        [base.id]: http('https://mainnet.base.org'), //TODO: replace with alchemy rpc if available
        [arbitrum.id]: http('https://arbitrum-mainnet.infura.io'), //TODO: replace with alchemy rpc if available
      },
    })
  : IN_PREVIEW
    ? createConfig({
        connectors,
        chains: wagmiChains,
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
        chains: wagmiChains,
        transports: {
          [mainnet.id]: http(ETHEREUM_RPC_URL),
          [optimism.id]: http(OPTIMISM_RPC_URL),
          [polygon.id]: http('https://polygon-rpc.com/'), //TODO: replace with alchemy rpc if available
          [optimismSepolia.id]: http(OPTIMISM_SEPOLIA_RPC_URL),
          [localhost.id]: http(`http://localhost:${HARDHAT_GANACHE_PORT}`),
          [sepolia.id]: http(ETHEREUM_SEPOLIA_RPC_URL),
          [base.id]: http('https://mainnet.base.org'), //TODO: replace with alchemy rpc if available
          [arbitrum.id]: http('https://arbitrum-mainnet.infura.io'), //TODO: replace with alchemy rpc if available
        },
      });

const getChain = () => {
  if (isFeatureEnabled('test_decent') || IN_PRODUCTION) {
    return optimism;
  } else if (IN_PREVIEW) {
    return optimismSepolia;
  } else {
    return localhost;
  }
};

export const wagmiChain = getChain();
