import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../../api-lib/HttpError';
import { findOrCreateProfileByFid } from '../../../../api-lib/neynar/findOrCreate';
import { getGiveCap } from '../../../../src/features/points/emissionTiers';
import {
  POINTS_PER_GIVE,
  TOKENS,
  getAvailablePoints,
  nextGiveAvailableAt,
} from '../../../../src/features/points/getAvailablePoints';

// Optional: adjust cache as needed for your use case
const CACHE_CONTENT = 'public, max-age=2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all origins and handle preflight requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { fid } = req.query;
    if (!fid || typeof fid !== 'string') {
      return res
        .status(400)
        .json({ error: 'Missing or invalid fid parameter' });
    }

    const fidNumber = parseInt(fid, 10);
    if (isNaN(fidNumber) || fidNumber <= 0) {
      return res.status(400).json({ error: 'FID must be a positive number' });
    }

    const data = await getPointsDataForFid(fidNumber);

    res.setHeader('Cache-Control', CACHE_CONTENT);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res, e);
  }
}

async function getPointsDataForFid(fid: number) {
  // Get or create Coordinape profile for this FID
  const profile = await findOrCreateProfileByFid(fid);

  if (!profile) {
    // If profile creation failed, return zeros
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

  // Get the profile's private data including points balance
  const { profiles_private } = await adminClient.query(
    {
      profiles_private: [
        { where: { address: { _eq: profile.address } } },
        {
          points_balance: true,
          points_checkpointed_at: true,
        },
      ],
    },
    {
      operationName: 'api_give_balance_fid_getPointsDataForFid_profilesPrivate',
    }
  );

  const privateProfile = profiles_private[0];
  if (!privateProfile) {
    // Profile exists but no private data found, return zeros
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

  // Get all wallet addresses for this profile (from Neynar data in findOrCreate)
  const addresses = [profile.address].map(addr => addr.toLowerCase());

  // Build token filter for CO tokens
  const coContracts = TOKENS.filter(t => t.symbol === 'CO').map(t => ({
    contract: { _eq: t.contract },
    chain: { _eq: t.chain.toString() },
  }));

  // Query token balances for all addresses
  const { token_balances } = await adminClient.query(
    {
      token_balances: [
        {
          where: {
            address: { _in: addresses },
            _or: coContracts,
          },
        },
        { balance: true, address: true, chain: true, contract: true },
      ],
    },
    {
      operationName: 'api_give_balance_fid_getPointsDataForFid_tokenBalances',
    }
  );

  // Aggregate total CO balance across all addresses and chains
  const totalTokenBalance = token_balances.reduce(
    (sum: bigint, b: { balance?: string | number }) =>
      sum + BigInt(b.balance ?? 0),
    0n
  );

  // Calculate points using existing logic with real profile data
  const points = getAvailablePoints(
    privateProfile.points_balance,
    privateProfile.points_checkpointed_at,
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
