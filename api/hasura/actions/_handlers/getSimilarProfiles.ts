import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';

const SIMILARITY_THRESHOLD = 0.5;

const schema = z.object({ address: z.string() }).strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, schema);

  const address = payload.address;

  try {
    const { similar_profiles } = await adminClient.query(
      {
        similar_profiles: [
          {
            args: {
              match_threshold: SIMILARITY_THRESHOLD,
              profile_address: address,
              limit_count: 10,
            },
          },
          {
            id: true,
          },
        ],
      },

      {
        operationName: 'getSimilarProfile_getSimilar',
      }
    );

    return res.status(200).json(
      similar_profiles.map(p => ({
        profile_id: p.id,
      }))
    );
  } catch (e) {
    console.error(JSON.stringify(e));
    throw new InternalServerError('Unable to fetch similar profiles', e);
  }
}
