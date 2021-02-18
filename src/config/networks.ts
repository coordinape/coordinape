import {
  IKnownTokenData,
  INetwork,
  IToken,
  KnownContract,
  KnownToken,
  NetworkId,
} from 'types';
import { entries } from 'utils/type-utils';

import { INFURA_PROJECT_ID } from './constants';

export const networkIds = {
  MAINNET: 1,
} as const;

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.MAINNET]: {
    label: 'Mainnet',
    url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    contracts: {
      stake: '0x9b7b6BBd7d87e381F07484Ea104fcc6A0363DF39',
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
    },
    image: '/images/token/FMA.png',
  },
  flap: {
    symbol: 'FMA',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0xCfb72ED3647cC8E7FA52E4F121eCdAbEfC305e7f',
    },
    image: '/images/token/FLAP.png',
  },
  fss: {
    symbol: 'FSS',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0x9b7b6bbd7d87e381f07484ea104fcc6a0363df39',
    },
    image: '/images/token/FSS.png',
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
