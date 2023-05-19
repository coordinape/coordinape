import { IN_DEVELOPMENT } from '../../config/env';

const TEST_NETWORK = true;

const optimism = {
  chainId: '0xa',
  chainName: 'Optimism',
  rpcUrls: ['https://mainnet.optimism.io'],
  blockExplorerUrls: ['https://optimistic.etherscan.io'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
};

const optimismTestNetwork = {
  chainId: '0x1A4',
  chainName: 'Optimism Goerli',
  rpcUrls: ['https://goerli.optimism.io'],
  blockExplorerUrls: ['https://goerli-explorer.optimism.io'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
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
};

export const chain = IN_DEVELOPMENT
  ? localhost
  : TEST_NETWORK
  ? optimismTestNetwork
  : optimism;
