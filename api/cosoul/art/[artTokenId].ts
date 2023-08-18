import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse, NotFoundError } from '../../../api-lib/HttpError';
import { Awaited } from '../../../api-lib/ts4.5shim';

// const CACHE_SECONDS = 60 * 5;
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let artTokenId: number | undefined;
    if (typeof req.query.artTokenId == 'string') {
      artTokenId = parseInt(req.query.artTokenId);
    }

    if (!artTokenId) {
      throw new NotFoundError('no token Id provided');
    }
    const data = await getCosoulArtData(artTokenId);

    // res.setHeader('Cache-Control', 'max-age=0, s-maxage=' + CACHE_SECONDS);
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
          token_id: true,
          pgive: true,
          address: true,
        },
      ],
    },
    {
      operationName: 'cosoulApi__fetchArtData',
    }
  );

  const coSoulData = cosouls.pop();

  if (!coSoulData?.token_id) {
    throw new NotFoundError('no cosoul exists for token id ' + artTokenId);
  }

  return {
    address: coSoulData.address,
    pGive: coSoulData.pgive || 0,
  };
}

export type CosoulArtData = Awaited<ReturnType<typeof getCosoulArtData>>;
