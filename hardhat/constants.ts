import dotenv from 'dotenv';
import { BigNumber } from 'ethers';

dotenv.config({ path: '../.env' });

export const FORK_MAINNET = process.env.FORK_MAINNET || process.env.CI;
export const GANACHE_NETWORK_NAME = 'ci';
export const GANACHE_PORT = process.env.HARDHAT_GANACHE_PORT;
export const GANACHE_URL = `http://127.0.0.1:${GANACHE_PORT}`;
export const ETHEREUM_RPC_URL =
  process.env.ETHEREUM_RPC_URL ?? 'http://127.0.0.1:7545';

export const FORKED_BLOCK = process.env.HARDHAT_FORK_BLOCK
  ? parseInt(process.env.HARDHAT_FORK_BLOCK)
  : undefined;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const HARDHAT_OWNER_ADDRESS =
  process.env.HARDHAT_OWNER_ADDRESS ?? ZERO_ADDRESS;

export const YEARN_REGISTRY_ADDRESS =
  '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804';

export const USDC_WHALE_ADDRESS = '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503';
export const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
export const USDC_YVAULT_ADDRESS = '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9';
export const USDC_DECIMAL_MULTIPLIER = BigNumber.from('10').pow(6);

export const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
export const DAI_YVAULT_ADDRESS = '0xdA816459F1AB5631232FE5e97a05BBBb94970c95';
