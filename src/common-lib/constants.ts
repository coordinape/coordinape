export enum ENTRANCE {
  ADMIN = 'circle-create-initial-admin',
  LINK = 'magic-link',
  MANUAL = 'manual-address-entry',
  CSV = 'CSV',
  NOMINATION = 'vouched-in',
}

export const loginSupportedChainIds: { [key: number]: string } = {
  1: 'Ethereum Mainnet',
  5: 'Görli Testnet',
  10: 'Optimism',
  100: 'Gnosis',
  137: 'Polygon',
  250: 'Fantom Opera',
  1338: 'Localhost',
  42220: 'Celo Mainnet',
  42161: 'Arbitrum One',
  43114: 'Avalanche C-Chain',
};
