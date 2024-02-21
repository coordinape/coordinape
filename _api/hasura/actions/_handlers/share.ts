import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { genToken } from '../../../../api-lib/colinks/share';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';

const shareSchemaInput = z
  .object({
    activity_id: z.number(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { session, payload } = await getInput(req, shareSchemaInput);

    const profileId = session.hasuraProfileId;

    const { activities_by_pk } = await adminClient.query(
      {
        activities_by_pk: [
          {
            id: payload.activity_id,
          },
          {
            actor_profile_id: true,
          },
        ],
      },
      {
        operationName: 'share__getActivities_by_pk',
      }
    );

    // TODO: these should 401 probably
    assert(activities_by_pk?.actor_profile_id === profileId);

    const token = genToken(
      profileId.toString(),
      payload.activity_id.toString()
    );

    return res.status(200).json({ token });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
