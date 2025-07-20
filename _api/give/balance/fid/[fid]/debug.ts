import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../../../api-lib/HttpError';
import { fetchUserByFid } from '../../../../../api-lib/neynar';
import { findOrCreateProfileByFid } from '../../../../../api-lib/neynar/findOrCreate';
import { getGiveCap } from '../../../../../src/features/points/emissionTiers';
import {
  POINTS_PER_GIVE,
  TOKENS,
  getAvailablePoints,
  nextGiveAvailableAt,
} from '../../../../../src/features/points/getAvailablePoints';

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

    const data = await getDebugDataForFid(fidNumber);

    res.setHeader('Cache-Control', CACHE_CONTENT);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res, e);
  }
}

async function getDebugDataForFid(fid: number) {
  const calculationSteps: string[] = [];

  // Get or create Coordinape profile for this FID
  calculationSteps.push(`Looking up Coordinape profile for FID ${fid}`);
  const profile = await findOrCreateProfileByFid(fid);

  if (!profile) {
    calculationSteps.push('Failed to find or create Coordinape profile');
    return {
      farcasterUser: null,
      coordinapeProfile: null,
      walletAddresses: [],
      tokenBalances: [],
      aggregation: {
        totalCO: '0',
        calculationSteps,
      },
      giveData: {
        points: 0,
        give: 0,
        canGive: false,
        nextGiveAt: null,
        giveCap: getGiveCap(0n).toString(),
        pointsCap: (getGiveCap(0n) * POINTS_PER_GIVE).toString(),
        tokenBalance: '0',
      },
    };
  }

  calculationSteps.push(
    `Found/created Coordinape profile: ${profile.name} (${profile.address})`
  );

  // Get Farcaster user data for display
  const fcUser = await fetchUserByFid(fid);

  // Get the profile's private data including points balance
  calculationSteps.push(
    `Fetching points balance for profile ${profile.address}`
  );
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
      operationName:
        'api_give_balance_fid_debug_getDebugDataForFid_profilesPrivate',
    }
  );

  const privateProfile = profiles_private[0];
  if (!privateProfile) {
    calculationSteps.push('No private profile data found');
    return {
      farcasterUser: fcUser
        ? {
            fid: fcUser.fid,
            username: fcUser.username,
            custodyAddress: fcUser.custody_address,
            verifiedAddresses: fcUser.verified_addresses.eth_addresses,
            pfpUrl: fcUser.pfp_url,
            followerCount: fcUser.follower_count,
          }
        : null,
      coordinapeProfile: {
        id: profile.id,
        name: profile.name,
        address: profile.address,
      },
      walletAddresses: [],
      tokenBalances: [],
      aggregation: {
        totalCO: '0',
        calculationSteps,
      },
      giveData: {
        points: 0,
        give: 0,
        canGive: false,
        nextGiveAt: null,
        giveCap: getGiveCap(0n).toString(),
        pointsCap: (getGiveCap(0n) * POINTS_PER_GIVE).toString(),
        tokenBalance: '0',
      },
    };
  }

  calculationSteps.push(
    `Profile points balance: ${privateProfile.points_balance}, checkpoint: ${privateProfile.points_checkpointed_at}`
  );

  // Get all wallet addresses for this profile
  const addresses = [profile.address].map(addr => addr.toLowerCase());
  calculationSteps.push(
    `Addresses to check for CO balances: ${addresses.join(', ')}`
  );

  // Build token filter for CO tokens
  const coContracts = TOKENS.filter(t => t.symbol === 'CO');
  calculationSteps.push(
    `Looking for CO tokens on chains: ${coContracts.map(c => `${c.symbol} on chain ${c.chain} (${c.contract})`).join(', ')}`
  );

  const coContractFilters = coContracts.map(t => ({
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
            _or: coContractFilters,
          },
        },
        {
          balance: true,
          address: true,
          chain: true,
          contract: true,
          symbol: true,
        },
      ],
    },
    {
      operationName:
        'api_give_balance_fid_debug_getDebugDataForFid_tokenBalances',
    }
  );

  calculationSteps.push(`Found ${token_balances.length} token balance entries`);

  // Add per-balance breakdown
  token_balances.forEach(balance => {
    const chainName =
      balance.chain === '1'
        ? 'ETH'
        : balance.chain === '8453'
          ? 'Base'
          : `Chain ${balance.chain}`;
    calculationSteps.push(
      `  ${balance.address}: ${balance.balance} ${balance.symbol} on ${chainName}`
    );
  });

  // Aggregate total CO balance across all addresses and chains
  const totalTokenBalance = token_balances.reduce(
    (sum: bigint, b: { balance?: string | number }) =>
      sum + BigInt(b.balance ?? 0),
    0n
  );

  calculationSteps.push(`Total CO aggregated: ${totalTokenBalance.toString()}`);

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

  calculationSteps.push(
    `Points calculated: ${points} (using getAvailablePoints with ${privateProfile.points_balance} base points, checkpoint ${privateProfile.points_checkpointed_at}, ${totalTokenBalance.toString()} token balance)`
  );
  calculationSteps.push(
    `Give calculated: ${give} (${points} points ÷ ${POINTS_PER_GIVE} points per give)`
  );
  calculationSteps.push(
    `Give cap: ${giveCap.toString()} (based on ${totalTokenBalance.toString()} CO balance)`
  );

  // Use shared nextGiveAvailableAt function
  let nextGiveAt: string | null = null;
  if (typeof points === 'number') {
    nextGiveAt = nextGiveAvailableAt(points, totalTokenBalance).toISO();
    calculationSteps.push(`Next give available at: ${nextGiveAt}`);
  }

  return {
    farcasterUser: fcUser
      ? {
          fid: fcUser.fid,
          username: fcUser.username,
          custodyAddress: fcUser.custody_address,
          verifiedAddresses: fcUser.verified_addresses.eth_addresses,
          pfpUrl: fcUser.pfp_url,
          followerCount: fcUser.follower_count,
        }
      : null,
    coordinapeProfile: {
      id: profile.id,
      name: profile.name,
      address: profile.address,
      pointsBalance: privateProfile.points_balance,
      pointsCheckpointedAt: privateProfile.points_checkpointed_at,
    },
    walletAddresses: addresses,
    tokenBalances: token_balances.map(b => ({
      address: b.address,
      chain: b.chain,
      contract: b.contract,
      symbol: b.symbol,
      balance: b.balance,
    })),
    aggregation: {
      totalCO: totalTokenBalance.toString(),
      calculationSteps,
    },
    giveData: {
      points,
      give,
      canGive,
      nextGiveAt,
      giveCap: giveCap.toString(),
      pointsCap: pointsCap.toString(),
      tokenBalance: totalTokenBalance.toString(),
    },
  };
}
