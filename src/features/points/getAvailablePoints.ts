import { DateTime } from 'luxon';

export const MAX_POINTS_CAP = 1000;
export const EMISSION_PER_SECOND = 0.1;
export const POINTS_PER_GIVE = 1.0;

export const getAvailablePoints = (balance: number, checkpoint: DateTime) => {
  const secondsSinceLastCheckpoint = Math.floor(
    DateTime.now().diff(checkpoint).as('seconds')
  );

  const accruedPoints = secondsSinceLastCheckpoint * EMISSION_PER_SECOND;
  return Math.min(balance + accruedPoints, MAX_POINTS_CAP);
};
