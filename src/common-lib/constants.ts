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
  137: 'Polygon',
  250: 'Fantom Opera',
  1313161554: 'Near Aurora',
  ...(IN_DEVELOPMENT && { 1338: 'Localhost' }),
};
