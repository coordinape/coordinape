import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse, NotFoundError } from '../../../api-lib/HttpError';
import { Awaited } from '../../../api-lib/ts4.5shim';

const CACHE_SECONDS = 60 * 5;
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let artTokenId: number | undefined;
    if (typeof req.query.artTokenId == 'string') {
      artTokenId = parseInt(req.query.artTokenId);
    }

    assert(artTokenId, 'no token Id provided');

    if (!artTokenId) {
      throw new NotFoundError('no cosoul exists for token id ' + artTokenId);
    }
    const data = await getCosoulArtData(artTokenId);

    res.setHeader('Cache-Control', 'max-age=0, s-maxage=' + CACHE_SECONDS);
    return res.status(200).send(data);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

async function getCosoulArtData(artTokenId: number) {
  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          where: {
            token_id: { _eq: artTokenId },
          },
          limit: 1,
        },
        {
          pgive: true,
          profile: {
            address: true,
          },
        },
      ],
    },
    {
      operationName: 'cosoulApi__fetchMetadata',
    }
  );

  const coSoulData = cosouls.pop();
  assert(coSoulData?.pgive !== undefined, 'error fetching cosoul data');
  return {
    address: coSoulData.profile.address,
    pGive: coSoulData.pgive,
  };
}

export type CosoulArtData = Awaited<ReturnType<typeof getCosoulArtData>>;
