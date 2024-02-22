import { DateTime } from 'luxon';

export const MAX_POINTS_CAP = 1800;
export const EMISSION_PER_SECOND = 180;
export const MAX_GIVE = 5;
export const POINTS_PER_GIVE = MAX_POINTS_CAP / MAX_GIVE;

export const getAvailablePoints = (balance: number, checkpoint: string) => {
  const checkpointTime = DateTime.fromISO(checkpoint);
  const secondsSinceLastCheckpoint = DateTime.now()
    .diff(checkpointTime)
    .as('seconds');

  const accruedPoints = secondsSinceLastCheckpoint * EMISSION_PER_SECOND;
  return Math.min(balance + accruedPoints, MAX_POINTS_CAP);
};
