import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../../../api-lib/HttpError';
import { fetchUserByFid } from '../../../../../api-lib/neynar';
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
  // Get Farcaster user data from Neynar
  const fcUser = await fetchUserByFid(fid);

  if (!fcUser) {
    return {
      farcasterUser: null,
      walletAddresses: [],
      tokenBalances: [],
      aggregation: {
        totalCO: '0',
        calculationSteps: ['No Farcaster user found for FID'],
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

  // Extract all wallet addresses (custody + verified)
  const addresses = [
    fcUser.custody_address,
    ...fcUser.verified_addresses.eth_addresses,
  ]
    .filter(addr => addr && addr !== '')
    .map(addr => addr.toLowerCase());

  const calculationSteps: string[] = [];
  calculationSteps.push(
    `Found ${addresses.length} wallet addresses for FID ${fid}`
  );

  if (addresses.length === 0) {
    calculationSteps.push('No valid wallet addresses found');
    return {
      farcasterUser: {
        fid: fcUser.fid,
        username: fcUser.username,
        custodyAddress: fcUser.custody_address,
        verifiedAddresses: fcUser.verified_addresses.eth_addresses,
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

  calculationSteps.push(`Addresses: ${addresses.join(', ')}`);

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
      operationName: 'api_give_balance_fid_debug_getDebugDataForFid',
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

  // Calculate points using existing logic (with mock profile data)
  const mockCheckpoint = new Date().toISOString();
  const points = getAvailablePoints(0, mockCheckpoint, totalTokenBalance);
  const give = Math.floor(points / POINTS_PER_GIVE);
  const canGive = give >= 1;
  const giveCap = getGiveCap(totalTokenBalance);
  const pointsCap = giveCap * POINTS_PER_GIVE;

  calculationSteps.push(
    `Points calculated: ${points} (using getAvailablePoints with 0 base, current time, ${totalTokenBalance.toString()} token balance)`
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
    farcasterUser: {
      fid: fcUser.fid,
      username: fcUser.username,
      custodyAddress: fcUser.custody_address,
      verifiedAddresses: fcUser.verified_addresses.eth_addresses,
      pfpUrl: fcUser.pfp_url,
      followerCount: fcUser.follower_count,
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
