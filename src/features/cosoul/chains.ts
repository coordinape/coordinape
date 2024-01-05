import { BigNumber } from 'ethers';

import { IN_PREVIEW, IN_PRODUCTION } from '../../config/env';

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
    maxFeePerGas: BigNumber.from('1000000000'),
    maxPriorityFeePerGas: BigNumber.from('500'),
  },
};

const optimismSepolia = {
  chainId: 'AA37DC',
  chainName: 'Optimism Sepolia',
  rpcUrls: ['https://goerli.optimism.io'],
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
  blockExplorerUrls: ['https://goerli-explorer.optimism.io'],
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
export const chain = IN_PRODUCTION
  ? optimism
  : IN_PREVIEW
  ? optimismSepolia
  : localhost;
