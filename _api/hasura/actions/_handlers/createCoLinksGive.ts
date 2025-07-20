import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { UNLIMITED_GIVE_PROFILES } from '../../../../api-lib/give.ts';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import {
  errorResponse,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { checkPointsAndCreateGive } from '../../../../api-lib/insertCoLinksGive.ts';
import {
  findOrCreateProfileByAddress,
  findOrCreateProfileByFid,
} from '../../../../api-lib/neynar/findOrCreate.ts';
import { fetchCast, fetchUserByFid } from '../../../../api-lib/neynar.ts';
import {
  EMISSION_TIERS,
  getGiveCap,
} from '../../../../src/features/points/emissionTiers.ts';
import {
  TOKENS,
  getAvailablePoints,
  POINTS_PER_GIVE,
} from '../../../../src/features/points/getAvailablePoints';
import { zEthAddress } from '../../../../src/lib/zod/formHelpers.ts';

const createCoLinksGiveInput = z
  .object({
    activity_id: z.number().optional(),
    address: zEthAddress.optional(),
    cast_hash: z.string().optional(),
    skill: z.string().optional(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      payload,
      session: { hasuraProfileId: profileId },
    } = await getInput(req, createCoLinksGiveInput);

    let targetProfileId: number | undefined;

    if (payload.cast_hash) {
      // remove the db nonsense
      payload.cast_hash = payload.cast_hash.replace('\\', '0');
      try {
        const { cast } = await fetchCast(payload.cast_hash);
        const fid = cast.author.fid;
        const profile = await findOrCreateProfileByFid(fid);
        targetProfileId = profile?.id;
      } catch (e: any) {
        throw new UnprocessableError('invalid cast_hash');
      }
    } else if (payload.activity_id) {
      // lookup activity by address
      // make sure its not deleted, and not us
      const { activities } = await adminClient.query(
        {
          activities: [
            {
              where: {
                id: { _eq: payload.activity_id },
                contribution: { deleted_at: { _is_null: true } },
              },
            },
            { id: true, actor_profile_id: true },
          ],
        },
        { operationName: 'createCoLinksGive__fetchActivity' }
      );

      const activity = activities.pop();

      if (!activity) {
        throw new UnprocessableError('post not found');
      }

      targetProfileId = activity.actor_profile_id;
    } else if (payload.address) {
      const profile = await findOrCreateProfileByAddress(payload.address);
      targetProfileId = profile?.id;
    }

    if (!targetProfileId) {
      throw new UnprocessableError('invalid target for giving');
    }

    if (targetProfileId === profileId) {
      throw new UnprocessableError('cannot give to self');
    }

    const { giveId } = await checkPointsAndCreateGive(
      profileId,
      targetProfileId,
      payload
    );

    return res.status(200).json({ id: giveId });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

export const fetchPoints = async (profileId: number) => {
  // Get profile with farcaster account info
  const { profiles_by_pk } = await adminClient.query(
    {
      profiles_by_pk: [
        { id: profileId },
        {
          address: true,
          points_balance: true,
          points_checkpointed_at: true,
          farcaster_account: {
            fid: true,
          },
        },
      ],
    },
    {
      operationName: 'getPointsForGiver_profile',
    }
  );
  assert(profiles_by_pk, 'current user profile not found');

  if (!profiles_by_pk) {
    return {
      points: 0,
      give: 0,
      canGive: false,
      giveCap: 0,
    };
  }

  // Get ALL wallet addresses for this user (profile + Neynar addresses)
  let addresses = [profiles_by_pk.address.toLowerCase()];

  // If user has a connected Farcaster account, get all their addresses
  if (profiles_by_pk.farcaster_account?.fid) {
    try {
      const fcUser = await fetchUserByFid(profiles_by_pk.farcaster_account.fid);
      if (fcUser) {
        const neynarAddresses = [
          fcUser.custody_address,
          ...fcUser.verified_addresses.eth_addresses,
        ]
          .filter(addr => addr && addr !== '')
          .map(addr => addr.toLowerCase());

        // Combine and deduplicate addresses
        addresses = [...new Set([...addresses, ...neynarAddresses])];
      }
    } catch (e) {
      // If Neynar fails, just use profile address
      console.warn(
        'Failed to fetch Neynar addresses for profile',
        profileId,
        e
      );
    }
  }

  // Build token filter for CO tokens
  const coContracts = TOKENS.filter(t => t.symbol === 'CO').map(t => ({
    contract: { _eq: t.contract },
    chain: { _eq: t.chain.toString() },
  }));

  // Query token balances for ALL addresses
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
      operationName: 'getPointsForGiver_tokenBalances',
    }
  );

  // Aggregate total CO balance across all addresses and chains
  const totalTokenBalance = token_balances.reduce(
    (sum: bigint, b: { balance?: string | number }) =>
      sum + BigInt(b.balance ?? 0),
    0n
  );

  const points = getAvailablePoints(
    profiles_by_pk.points_balance,
    profiles_by_pk.points_checkpointed_at,
    totalTokenBalance
  );

  const give = points ? Math.floor(points / POINTS_PER_GIVE) : 0;

  const canGive = points >= POINTS_PER_GIVE;

  if (!canGive && UNLIMITED_GIVE_PROFILES.includes(profileId)) {
    return {
      points,
      give,
      canGive: true,
      giveCap: EMISSION_TIERS[EMISSION_TIERS.length - 1].giveCap,
    };
  }

  const giveCap = getGiveCap(totalTokenBalance);

  return { points, give, canGive, giveCap };
};
