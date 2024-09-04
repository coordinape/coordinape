import assert from 'assert';

import { AddressZero } from '@ethersproject/constants';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export const GANACHE_NETWORK_NAME = 'ci';
export const GANACHE_PORT = process.env.HARDHAT_GANACHE_PORT;
export const GANACHE_URL = `http://127.0.0.1:${GANACHE_PORT}`;

export const OPTIMISM_RPC_URL = process.env.OPTIMISM_RPC_URL;
export const OPTIMISM_SEPOLIA_RPC_URL =
  process.env.OPTIMISM_SEPOLIA_RPC_URL || 'https://sepolia.optimism.io';

assert(
  OPTIMISM_RPC_URL,
  'process.env.OPTIMISM_RPC_URL is missing, provide one in .env'
);

assert(
  process.env.BE_ALCHEMY_API_KEY,
  'process.env.BE_ALCHEMY_API_KEY is missing'
);
export const HARDHAT_ARCHIVE_RPC_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.BE_ALCHEMY_API_KEY}`;

export const HARDHAT_OWNER_ADDRESS =
  process.env.HARDHAT_OWNER_ADDRESS ?? AddressZero;
