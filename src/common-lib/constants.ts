import { IN_DEVELOPMENT } from '../config/env';

export enum ENTRANCE {
  ADMIN = 'circle-create-initial-admin',
  LINK = 'invite-link',
  MANUAL = 'manual-address-entry',
  CSV = 'CSV',
  NOMINATION = 'vouched-in',
  DISCORD_BOT = 'discord-bot',
  GUILD = 'guild',
}

export const loginSupportedChainIds: Record<string, string> = {
  1: 'Ethereum Mainnet',
  5: 'Görli Testnet',
  10: 'Optimism',
  137: 'Polygon',
  250: 'Fantom Opera',
  420: 'Optimism Goerli Testnet',
  1313161554: 'Near Aurora',
  ...(IN_DEVELOPMENT && { 1338: 'Localhost', 1337: 'locahost2' }),
};
