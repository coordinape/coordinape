import { DateTime } from 'luxon';

import { getEmissionTier, getGiveCap } from './emissionTiers';

// TODO change
export const MAX_GIVE = 13;

// Points per give calculated from pre-tier give rates, and now hard-coded.
export const POINTS_PER_GIVE = 60 * 60 * 24;

export const getAvailablePoints = (
  balance: number,
  checkpoint: string,
  tokenBalance: number = 0
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
