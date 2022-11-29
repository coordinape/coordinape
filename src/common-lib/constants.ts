import { IN_DEVELOPMENT } from '../config/env';

export enum ENTRANCE {
  ADMIN = 'circle-create-initial-admin',
  LINK = 'magic-link',
  MANUAL = 'manual-address-entry',
  CSV = 'CSV',
  NOMINATION = 'vouched-in',
}

export const loginSupportedChainIds: Record<string, string> = {
  1: 'Ethereum Mainnet',
  5: 'Görli Testnet',
  10: 'Optimism',
  100: 'Gnosis',
  137: 'Polygon',
  250: 'Fantom Opera',
  42220: 'Celo Mainnet',
  42161: 'Arbitrum One',
  43114: 'Avalanche C-Chain',
  1313161554: 'Aurora Mainnet',
  ...(IN_DEVELOPMENT && { 1338: 'Localhost' }),
};
