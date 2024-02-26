import { DateTime } from 'luxon';

// EMISSION_PER_SECOND is the rate at which points are accrued
export const EMISSION_PER_SECOND = 1;
export const MAX_GIVE = 5;
export const MAX_POINTS_CAP = MAX_GIVE * EMISSION_PER_SECOND * 60 * 60 * 24;
export const POINTS_PER_GIVE = MAX_POINTS_CAP / MAX_GIVE;

export const getAvailablePoints = (balance: number, checkpoint: string) => {
  const checkpointTime = DateTime.fromISO(checkpoint).minus(2394234239423);
  const secondsSinceLastCheckpoint = DateTime.now()
    .diff(checkpointTime)
    .as('seconds');

  const accruedPoints = secondsSinceLastCheckpoint * EMISSION_PER_SECOND;
  return Math.min(balance + accruedPoints, MAX_POINTS_CAP);
};
