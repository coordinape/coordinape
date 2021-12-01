import { entries } from 'utils/type-utils';

import { INFURA_PROJECT_ID } from './constants';

import {
  IKnownTokenData,
  INetwork,
  IToken,
  KnownContract,
  KnownToken,
  NetworkId,
} from 'types';

export const networkIds = {
  MAINNET: 1,
  HARDHAT: 1337,
  RINKEBY: 4,
} as const;

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.MAINNET]: {
    label: 'Mainnet',
    url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    contracts: {
      stake: '0x9b7b6BBd7d87e381F07484Ea104fcc6A0363DF39',
      yRegistry: '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804',
    },
  },
  // Hardhat forked mainnet
  [networkIds.HARDHAT]: {
    label: 'Hardhat',
    url: `http://localhost:8545`,
    contracts: {
      stake: '0x9b7b6BBd7d87e381F07484Ea104fcc6A0363DF39',
      yRegistry: '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804',
    },
  },
  [networkIds.RINKEBY]: {
    label: 'rinkeby',
    url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
    contracts: {
      stake: '0x9b7b6BBd7d87e381F07484Ea104fcc6A0363DF39',
      yRegistry: '0x86bc1c17e7579a688463f34941df0a0437269f43',
    },
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
  fma: {
    symbol: 'FMA',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0x0f8794f66c7170c4f9163a8498371a747114f6c4',
      [networkIds.HARDHAT]: '0x0f8794f66c7170c4f9163a8498371a747114f6c4',
    },
    image: '/images/token/FMA.png',
  },
  flap: {
    symbol: 'FMA',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0xCfb72ED3647cC8E7FA52E4F121eCdAbEfC305e7f',
      [networkIds.HARDHAT]: '0xCfb72ED3647cC8E7FA52E4F121eCdAbEfC305e7f',
    },
    image: '/images/token/FLAP.png',
  },
  fss: {
    symbol: 'FSS',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0x9b7b6bbd7d87e381f07484ea104fcc6a0363df39',
      [networkIds.HARDHAT]: '0x9b7b6bbd7d87e381f07484ea104fcc6a0363df39',
    },
    image: '/images/token/FSS.png',
  },
  usdc: {
    symbol: 'USDC',
    decimals: 6,
    addresses: {
      [networkIds.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [networkIds.HARDHAT]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [networkIds.RINKEBY]: '0x866CcA6D3902B030a7389A1aDeD4c32Ff3696800',
    },
    image: '',
  },
  yvUsdc: {
    symbol: 'yvUSDC',
    decimals: 6,
    addresses: {
      [networkIds.MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.HARDHAT]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.RINKEBY]: '0xc33f0a62f2c9c301b522eb4f208c0e1aa8a34677',
    },
    image: '',
  },
  dai: {
    symbol: 'DAI',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.HARDHAT]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [networkIds.RINKEBY]: '0x7C38c1913A7d512437E7f97D83519C1f9B59239e',
    },
    image: '',
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
    image: token.image,
  };
};

export const getEtherscanURL = (networkId: number): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }
  if (networkId === 1) return 'https://etherscan.io';
  return '';
};

export const getContractAddress = (
  networkId: number,
  contract: KnownContract
): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }
  return networks[networkId].contracts[contract];
};
