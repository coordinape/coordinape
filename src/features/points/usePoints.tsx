import assert from 'assert';

import { useQuery } from 'react-query';

import { client } from '../../lib/gql/client';

import { POINTS_PER_GIVE, getAvailablePoints } from './getAvailablePoints';

export const POINTS_QUERY_KEY = 'points_query_key';

export const usePoints = () => {
  const { data: points } = useQuery(
    [POINTS_QUERY_KEY],
    async () => {
      return await getMyAvailablePoints();
    },
    {
      onError: error => {
        console.error(error);
      },
    }
  );

  const give = points ? Math.floor(points / POINTS_PER_GIVE) : undefined;
  const canGive = give ? give >= 1 : false;

  return { points, give, canGive };
};

const getMyAvailablePoints = async () => {
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

  return getAvailablePoints(
    profile.points_balance,
    profile.points_checkpointed_at
  );
};
