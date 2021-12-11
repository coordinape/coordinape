import { entries } from 'utils/type-utils';

import { INFURA_PROJECT_ID } from './constants';

import {
  IKnownTokenData,
  INetwork,
  IToken,
  KnownToken,
  NetworkId,
} from 'types';

export const networkIds = {
  MAINNET: 1,
  HARDHAT: 1337,
  RINKEBY: 4,
} as const;

// TODO integrate deploymentInfo.json with this
const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.MAINNET]: {
    label: 'Mainnet',
    url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  },
  // Hardhat forked mainnet
  [networkIds.HARDHAT]: {
    label: 'Hardhat',
    url: `http://localhost:8545`,
  },
  [networkIds.RINKEBY]: {
    label: 'rinkeby',
    url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  },
};

export const supportedNetworkIds = Object.keys(networks).map(
  Number
) as NetworkId[];

export const supportedNetworkURLs = entries(networks).reduce<{
  [networkId: number]: string;
}>(
  (acc, [networkId, network]) => ({
    ...acc,
    [networkId]: network.url,
  }),
  {}
);

export const knownTokens: { [name in KnownToken]: IKnownTokenData } = {
  usdc: {
    symbol: 'USDC',
    decimals: 6,
    addresses: {
      [networkIds.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [networkIds.HARDHAT]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [networkIds.RINKEBY]: '0x866CcA6D3902B030a7389A1aDeD4c32Ff3696800',
    },
  },
  yvUsdc: {
    symbol: 'yvUSDC',
    decimals: 6,
    addresses: {
      [networkIds.MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.HARDHAT]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.RINKEBY]: '0xc33f0a62f2c9c301b522eb4f208c0e1aa8a34677',
    },
  },
  dai: {
    symbol: 'DAI',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.HARDHAT]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.RINKEBY]: '0x7C38c1913A7d512437E7f97D83519C1f9B59239e',
    },
  },
};

const validNetworkId = (networkId: number): networkId is NetworkId => {
  return networks[networkId as NetworkId] !== undefined;
};

export const getToken = (networkId: number, tokenId: KnownToken): IToken => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  const token = knownTokens[tokenId];
  if (!token) {
    throw new Error(`Unsupported token id: '${tokenId}'`);
  }

  const address = token.addresses[networkId];

  if (!address) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  return {
    address,
    decimals: token.decimals,
    symbol: token.symbol,
  };
};

export const getEtherscanURL = (networkId: number): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }
  if (networkId === 1) return 'https://etherscan.io';
  return '';
};
