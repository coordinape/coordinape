import { z } from 'zod';

// this is currently the single source of truth about what vault types the app
// should support. it should probably live somewhere else
export const zAssetEnum = z.enum([
  'DAI',
  'USDC',
  'YFI',
  'SUSHI',
  'ALUSD',
  'USDT',
  'WETH',
  'OTHER',
]);
export type TAssetEnum = z.infer<typeof zAssetEnum>;

export const chainIds = {
  MAINNET: 1,
  RINKEBY: 4,
} as const;

type ChainId = 1 | 4;

export interface ITokenData {
  symbol: string;
  decimals: number; // Fix: fetch this from smart-contract
  addresses: Record<ChainId, string>;
}

const { MAINNET, RINKEBY } = chainIds;

// FIXME: this should be better integrated with contracts.ts & deployment info.
// it should not be used to get token addresses. keeping it here for now
// because it is used to look up the decimals for token contracts
export const knownTokens: Record<string, ITokenData> = {
  USDC: {
    symbol: 'USDC',
    decimals: 6,
    addresses: {
      [MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [RINKEBY]: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
    },
  },
  yvUSDC: {
    symbol: 'yvUSDC',
    decimals: 6,
    addresses: {
      [MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [RINKEBY]: '0xc33f0a62f2c9c301b522eb4f208c0e1aa8a34677',
    },
  },
  DAI: {
    symbol: 'DAI',
    decimals: 18,
    addresses: {
      [MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [RINKEBY]: '0x7C38c1913A7d512437E7f97D83519C1f9B59239e',
    },
  },
  yvDAI: {
    symbol: 'yvDAI',
    decimals: 18,
    addresses: {
      [MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [RINKEBY]: '0xc33f0a62f2c9c301b522eb4f208c0e1aa8a34677',
    },
  },
  YFI: {
    symbol: 'YFI',
    decimals: 18,
    addresses: {
      [MAINNET]: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      [RINKEBY]: '0x3efb9863b9b94c200bb8adba46adc8bb9d21e1c9',
    },
  },
  yvYFI: {
    symbol: 'yvYFI',
    decimals: 18,
    addresses: {
      [MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [RINKEBY]: '0xc33f0a62f2c9c301b522eb4f208c0e1aa8a34677',
    },
  },
  SUSHI: {
    symbol: 'SUSHI',
    decimals: 18,
    addresses: {
      [MAINNET]: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      [RINKEBY]: '0x0ead1160bd2ca5a653e11fae3d2b39e4948bda4d',
    },
  },
  yvSUSHI: {
    symbol: 'yvSUSHI',
    decimals: 18,
    addresses: {
      [MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [RINKEBY]: '0xc33f0a62f2c9c301b522eb4f208c0e1aa8a34677',
    },
  },
  ALUSD: {
    symbol: 'ALUSD',
    decimals: 18,
    addresses: {
      [MAINNET]: '0xbc6da0fe9ad5f3b0d58160288917aa56653660e9',
      [RINKEBY]: '0xc89e05ad29531c2d8b5291546e1e064d42ff65c1',
    },
  },
  yvalUSD: {
    symbol: 'yvalUSD',
    decimals: 18,
    addresses: {
      [MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [RINKEBY]: '0xc33f0a62f2c9c301b522eb4f208c0e1aa8a34677',
    },
  },
  USDT: {
    symbol: 'USDT',
    decimals: 18,
    addresses: {
      [MAINNET]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [RINKEBY]: '0x01547ef97f9140dbdf5ae50f06b77337b95cf4bb',
    },
  },
  yvUSDT: {
    symbol: 'yvUSDT',
    decimals: 18,
    addresses: {
      [MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [RINKEBY]: '0xc33f0a62f2c9c301b522eb4f208c0e1aa8a34677',
    },
  },
  WETH: {
    symbol: 'WETH',
    decimals: 18,
    addresses: {
      [MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      [RINKEBY]: '0xc778417e063141139fce010982780140aa0cd5ab',
    },
  },
  yvWETH: {
    symbol: 'yvWETH',
    decimals: 18,
    addresses: {
      [MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [RINKEBY]: '0xc33f0a62f2c9c301b522eb4f208c0e1aa8a34677',
    },
  },
};
