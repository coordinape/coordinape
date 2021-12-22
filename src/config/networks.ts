import { z } from 'zod';

import { entries } from 'utils/type-utils';

import { INFURA_PROJECT_ID } from './constants';

import { IKnownTokenData, INetwork, IToken } from 'types';

// TODO: This are coupled in a few places, make sure that they all
// stay compatible.
export type NetworkId = 1 | 4 | 1337;
export type KnownToken =
  | 'USDC'
  | 'yvUSDC'
  | 'DAI'
  | 'YFI'
  | 'SUSHI'
  | 'ALUSD'
  | 'ETH'
  | 'USDT';

export const networkIds = {
  MAINNET: 1,
  HARDHAT: 1337,
  RINKEBY: 4,
} as const;

export const zAssetEnum = z.enum([
  'DAI',
  'USDC',
  'YFI',
  'SUSHI',
  'ALUSD',
  'USDT',
  'ETH',
  'OTHER',
]);
export type TAssetEnum = z.infer<typeof zAssetEnum>;

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
  USDC: {
    symbol: 'USDC',
    decimals: 6,
    addresses: {
      [networkIds.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [networkIds.HARDHAT]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [networkIds.RINKEBY]: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
    },
  },
  yvUSDC: {
    symbol: 'yvUSDC',
    decimals: 6,
    addresses: {
      [networkIds.MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.HARDHAT]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.RINKEBY]: '0xc33f0a62f2c9c301b522eb4f208c0e1aa8a34677',
    },
  },
  DAI: {
    symbol: 'DAI',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.HARDHAT]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.RINKEBY]: '0x7C38c1913A7d512437E7f97D83519C1f9B59239e',
    },
  },
  YFI: {
    symbol: 'YFI',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      [networkIds.HARDHAT]: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      [networkIds.RINKEBY]: '0x3efb9863b9b94c200bb8adba46adc8bb9d21e1c9',
    },
  },
  SUSHI: {
    symbol: 'SUSHI',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      [networkIds.HARDHAT]: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      [networkIds.RINKEBY]: '0x0ead1160bd2ca5a653e11fae3d2b39e4948bda4d',
    },
  },
  ALUSD: {
    symbol: 'ALUSD',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0xbc6da0fe9ad5f3b0d58160288917aa56653660e9',
      [networkIds.HARDHAT]: '0xbc6da0fe9ad5f3b0d58160288917aa56653660e9',
      [networkIds.RINKEBY]: '0xc89e05ad29531c2d8b5291546e1e064d42ff65c1',
    },
  },
  USDT: {
    symbol: 'USDT',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [networkIds.HARDHAT]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [networkIds.RINKEBY]: '0x01547ef97f9140dbdf5ae50f06b77337b95cf4bb',
    },
  },
  ETH: {
    symbol: 'ETH',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      [networkIds.HARDHAT]: '0x0000000000000000000000000000000000000000',
      [networkIds.RINKEBY]: '0xc778417e063141139fce010982780140aa0cd5ab',
    },
  },
};

export const validNetworkId = (networkId?: number): networkId is NetworkId => {
  return !!networkId && networks[networkId as NetworkId] !== undefined;
};

export const getToken = (networkId: number, tokenId: string): IToken => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  const token = knownTokens[tokenId as KnownToken];
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
