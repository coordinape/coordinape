import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../api-lib/HttpError';
import { getGiveCap } from '../../../src/features/points/emissionTiers';
import {
  POINTS_PER_GIVE,
  TOKENS,
  getAvailablePoints,
  nextGiveAvailableAt,
} from '../../../src/features/points/getAvailablePoints';

// Optional: adjust cache as needed for your use case
const CACHE_CONTENT = 'public, max-age=2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let { address } = req.query;
    if (!address || typeof address !== 'string') {
      return res
        .status(400)
        .json({ error: 'Missing or invalid address parameter' });
    }

    address = address.toLowerCase();

    const data = await getPointsDataForAddress(address);

    res.setHeader('Cache-Control', CACHE_CONTENT);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res, e);
  }
}

async function getPointsDataForAddress(address: string) {
  // Build token filter for CO tokens
  const coContracts = TOKENS.filter(t => t.symbol === 'CO').map(t => ({
    contract: { _eq: t.contract },
    chain: { _eq: t.chain.toString() },
  }));

  // Query Hasura for the user's private profile and token balances
  const { profiles_private } = await adminClient.query(
    {
      profiles_private: [
        { where: { address: { _eq: address } } },
        {
          points_balance: true,
          points_checkpointed_at: true,
          token_balances: [{ where: { _or: coContracts } }, { balance: true }],
        },
      ],
    },
    {
      operationName: 'api_give_balance_getPointsDataForAddress',
    }
  );

  const profile = profiles_private[0];

  if (!profile) {
    // If not found, return zeros
    return {
      points: 0,
      give: 0,
      canGive: false,
      nextGiveAt: null,
      giveCap: getGiveCap(0n).toString(),
      pointsCap: (getGiveCap(0n) * POINTS_PER_GIVE).toString(),
      tokenBalance: '0',
    };
  }

  assert(profile.points_balance !== undefined);
  assert(profile.points_checkpointed_at !== undefined);

  const totalTokenBalance = profile.token_balances.reduce(
    (sum: bigint, b: { balance?: string | number }) =>
      sum + BigInt(b.balance ?? 0),
    0n
  );

  const points = getAvailablePoints(
    profile.points_balance,
    profile.points_checkpointed_at,
    totalTokenBalance
  );
  const give = Math.floor(points / POINTS_PER_GIVE);
  const canGive = give >= 1;
  const giveCap = getGiveCap(totalTokenBalance);
  const pointsCap = giveCap * POINTS_PER_GIVE;

  // Use shared nextGiveAvailableAt function
  let nextGiveAt: string | null = null;
  if (typeof points === 'number') {
    nextGiveAt = nextGiveAvailableAt(points, totalTokenBalance).toISO();
  }

  return {
    points,
    give,
    canGive,
    nextGiveAt,
    giveCap: giveCap.toString(),
    pointsCap: pointsCap.toString(),
    tokenBalance: totalTokenBalance.toString(),
  };
}
