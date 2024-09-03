import { IN_DEVELOPMENT, IN_PREVIEW, IN_PRODUCTION } from '../../config/env';
import { isFeatureEnabled } from '../../config/features';

const optimism = {
  chainId: '0xa',
  chainName: 'OP Mainnet',
  rpcUrls: ['https://mainnet.optimism.io'],
  blockExplorerUrls: ['https://optimistic.etherscan.io'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  gasSettings: {
    maxFeePerGas: 100000000n,
    maxPriorityFeePerGas: 50n,
  },
};
const base = {
  chainId: '0x2105',
  chainName: 'Base Mainnet',
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org/'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  gasSettings: {
    maxFeePerGas: 100000000n,
    maxPriorityFeePerGas: 50n,
  },
};
const baseSepola = {
  chainId: '0x14a34',
  chainName: 'Base Sepolia',
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org/'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  gasSettings: {
    maxFeePerGas: 1000000n,
    maxPriorityFeePerGas: 50n,
  },
};

const optimismSepolia = {
  chainId: '0xAA37DC',
  chainName: 'Optimism Sepolia',
  rpcUrls: ['https://sepolia.optimism.io'],
  blockExplorerUrls: ['https://sepolia-optimism.etherscan.io/'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  gasSettings: {},
};
const localhost = {
  chainId: '0x53A',
  chainName: 'Localhost 8546',
  rpcUrls: ['http://localhost:8546'], // TOOD: idk if this is work
  blockExplorerUrls: ['http://localhost:8546'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  gasSettings: {},
};

// Get the proper chain based on the environment
// production: optimism
// staging: optimismSepolia
// localhost: localhost ganache

export const chain = IN_DEVELOPMENT
  ? localhost
  : IN_PRODUCTION
    ? optimism
    : IN_PREVIEW
      ? optimismSepolia
      : isFeatureEnabled('test_decent')
        ? optimismSepolia
        : optimism;

export const baseChain = IN_PRODUCTION ? base : baseSepola;
