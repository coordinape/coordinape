import type { BigNumber } from 'ethers';

export type CustomToken = {
  symbol: string;
  decimals: number;
  address: string;
  availableBalance: number | BigNumber;
};

export type LockedTokenDistribution = {
  tx_hash: string | undefined;
  chain_id: number;
};
