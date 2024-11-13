import type { VercelRequest, VercelResponse } from '@vercel/node';

import { EnrichedCastSelector } from '../../../api-lib/farcaster/fetchCastsByIdOrHash.ts';
import { hydrateCasts } from '../../../api-lib/farcaster/hydration.ts';
import { adminClient } from '../../../api-lib/gql/adminClient.ts';
import { InternalServerError } from '../../../api-lib/HttpError.ts';

import { activitySelector } from './recentlikes.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cast_hashes } = req.body;

  try {
    const activities = await fetchCastsByHashes(cast_hashes);
    return res.status(200).json({ activities });
  } catch (e) {
    console.error(e);
    throw new InternalServerError('Error occurred searching profiles', e);
  }
}

const fetchCastsByHashes = async (hashes: string[]) => {
  const encoded_cast_hashes = hashes?.map(hash => '\\' + hash.substring(1));

  const { enriched_casts: casts } = await adminClient.query(
    {
      enriched_casts: [
        {
          where: {
            _or: encoded_cast_hashes.map(hash => ({
              hash: { _eq: hash },
            })),
          },
        },
        {
          ...EnrichedCastSelector,
          activity: activitySelector,
        },
      ],
    },
    {
      operationName: 'fetchCastsByHashes',
    }
  );

  const activitiesArray = casts.map((c: any) => c.activity);
  const enrichedCasts = await hydrateCasts(casts);

  const activitiesWithCasts = activitiesArray.map(
    (activity: any, index: number) => {
      return { ...activity, cast: enrichedCasts[index] };
    }
  );

  return activitiesWithCasts;
};
