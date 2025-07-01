import assert from 'assert';

import { DateTime } from 'luxon';
import { useQuery } from 'react-query';

import { client } from '../../lib/gql/client';
import useConnectedAddress from 'hooks/useConnectedAddress';

import { getEmissionTier, getGiveCap } from './emissionTiers';
import {
  POINTS_PER_GIVE,
  TOKENS,
  getAvailablePoints,
} from './getAvailablePoints';

export const POINTS_QUERY_KEY = 'points_query_key';

export const usePoints = () => {
  const address = useConnectedAddress();

  const { data } = useQuery(
    [POINTS_QUERY_KEY],
    async () => {
      return await getMyAvailablePoints();
    },
    {
      onError: (error: any) => {
        console.error(error);
      },
      enabled: !!address,
    }
  );

  const points = data?.points;
  const tokenBalance = data?.tokenBalance ?? 0n;

  const give = points ? Math.floor(points / POINTS_PER_GIVE) : undefined;
  const canGive = give ? give >= 1 : false;
  const nextGiveAt = points
    ? nextGiveAvailableAt(points, tokenBalance)
    : undefined;
  const giveCap = getGiveCap(tokenBalance);
  const pointsCap = giveCap * POINTS_PER_GIVE;

  return { points, give, canGive, nextGiveAt, giveCap, pointsCap };
};

const getMyAvailablePoints = async () => {
  const coContracts = TOKENS.filter(t => t.symbol === 'CO').map(t => ({
    contract: { _eq: t.contract },
    chain: { _eq: t.chain.toString() },
  }));

  const { profiles_private } = await client.query(
    {
      profiles_private: [
        {},
        {
          points_balance: true,
          points_checkpointed_at: true,
          token_balances: [
            {
              where: {
                _or: coContracts,
              },
            },
            {
              balance: true,
            },
          ],
        },
      ],
    },
    {
      operationName: 'getPoints',
    }
  );
  const profile = profiles_private.pop();

  if (!profile) {
    return {
      points: 0,
      tokenBalance: 0n,
    };
  }

  assert(profile.points_balance !== undefined);
  assert(profile.points_checkpointed_at !== undefined);

  const totalTokenBalance = profile.token_balances.reduce(
    (sum, b) => sum + BigInt(b.balance ?? 0),
    0n
  );

  return {
    points: getAvailablePoints(
      profile.points_balance,
      profile.points_checkpointed_at,
      totalTokenBalance
    ),
    tokenBalance: totalTokenBalance,
  };
};

const nextGiveAvailableAt = (currPoints: number, tokenBalance: bigint) => {
  const needed = POINTS_PER_GIVE - (currPoints % POINTS_PER_GIVE);
  const emissionTier = getEmissionTier(tokenBalance);
  const emissionsPerSecond = emissionTier.multiplier;
  const timeAt: DateTime = DateTime.now().plus({
    seconds: needed / emissionsPerSecond,
  });
  return timeAt;
};
