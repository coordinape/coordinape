import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

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
import { fetchCast } from '../../../../api-lib/neynar.ts';
import { getGiveCap } from '../../../../src/features/points/emissionTiers.ts';
import {
  CO_CHAIN,
  CO_CONTRACT,
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
  const { profiles_by_pk } = await adminClient.query(
    {
      profiles_by_pk: [
        { id: profileId },
        {
          points_balance: true,
          points_checkpointed_at: true,
          token_balances: [
            {
              where: {
                contract: {
                  _eq: CO_CONTRACT,
                },
                chain: { _eq: CO_CHAIN.toString() },
              },
              limit: 1,
            },
            {
              balance: true,
            },
          ],
        },
      ],
    },
    {
      operationName: 'getPointsForGiver',
    }
  );
  assert(profiles_by_pk, 'current user profile not found');

  const points = getAvailablePoints(
    profiles_by_pk.points_balance,
    profiles_by_pk.points_checkpointed_at,
    profiles_by_pk.token_balances[0]?.balance
  );

  const give = points ? Math.floor(points / POINTS_PER_GIVE) : 0;

  const canGive = points >= POINTS_PER_GIVE;

  const giveCap = getGiveCap(profiles_by_pk.token_balances[0]?.balance);

  return { points, give, canGive, giveCap };
};
