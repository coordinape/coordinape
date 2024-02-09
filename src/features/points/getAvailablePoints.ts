import assert from 'assert';

import { DateTime } from 'luxon';

import { client } from '../../lib/gql/client';

export const MAX_POINTS_CAP = 1000;
export const EMISSION_PER_SECOND = 0.1;

export const getAvailablePoints = async () => {
  const { profiles_private } = await client.query(
    {
      profiles_private: [
        {},
        {
          points_balance: true,
          points_checkpointed_at: true,
        },
      ],
    },
    {
      operationName: 'getPoints',
    }
  );
  const profile = profiles_private.pop();
  assert(profile, 'profiles_private doesnt exist for current user');
  assert(profile.points_balance !== undefined);
  assert(profile.points_checkpointed_at !== undefined);

  const checkpoint = DateTime.fromISO(profile.points_checkpointed_at);

  const secondsSinceLastCheckpoint = Math.floor(
    DateTime.now().diff(checkpoint).as('seconds')
  );

  const accruedPoints = secondsSinceLastCheckpoint * EMISSION_PER_SECOND;
  return Math.min(
    profile.points_balance + accruedPoints,
    MAX_POINTS_CAP
  ).toFixed(2);
};
