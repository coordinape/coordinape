import { IN_DEVELOPMENT, IN_PREVIEW } from '../config/env.js';

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
  10: 'Optimism',
  137: 'Polygon',
  250: 'Fantom Opera',
  1313161554: 'Near Aurora',
  ...(IN_PREVIEW && { 11155420: 'Optimism Sepolia' }),
  ...(IN_DEVELOPMENT && {
    11155420: 'Optimism Sepolia',
    1338: 'Localhost Ganache',
    1337: 'Locahost Hardhat',
  }),
};
