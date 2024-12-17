import { DateTime } from 'luxon';

import { getEmissionTier, getGiveCap } from './emissionTiers';

// Points per give calculated from pre-tier give rates, and now hard-coded.
export const POINTS_PER_GIVE = 60 * 60 * 24;

export type TokenContract = {
  symbol: string;
  chain: number;
  contract: string;
};

export const TOKENS: TokenContract[] = [
  {
    symbol: 'CO',
    chain: 1,
    contract: '0xf828ba501b108fbc6c88ebdff81c401bb6b94848',
  },
  {
    symbol: 'AAVE',
    chain: 1,
    contract: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  },
];

export const CO_CONTRACT = TOKENS.find(t => t.symbol === 'CO')!.contract;
export const CO_CHAIN = TOKENS.find(t => t.symbol === 'CO')!.chain;

export const getAvailablePoints = (
  balance: number,
  checkpoint: string,
  tokenBalance: bigint = 0n
) => {
  const checkpointTime = DateTime.fromISO(checkpoint);
  const secondsSinceLastCheckpoint = DateTime.now()
    .diff(checkpointTime)
    .as('seconds');

  const emissionRate = getEmissionTier(tokenBalance).multiplier;
  const giveCap = getGiveCap(tokenBalance);

  const accruedPoints = secondsSinceLastCheckpoint * emissionRate;
  return Math.min(balance + accruedPoints, giveCap * POINTS_PER_GIVE);
};
