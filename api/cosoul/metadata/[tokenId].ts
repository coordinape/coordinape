import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { WEB_APP_BASE_URL } from '../../../api-lib/config';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse, NotFoundError } from '../../../api-lib/HttpError';
import { Awaited } from '../../../api-lib/ts4.5shim';

const CACHE_SECONDS = 60 * 5;
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let tokenId: number | undefined;
    if (typeof req.query.tokenId == 'string') {
      tokenId = parseInt(req.query.tokenId);
    }

    assert(tokenId, 'no token Id provided');

    if (!tokenId) {
      throw new NotFoundError('no cosoul exists for token id ' + tokenId);
    }

    const data = await getCosoulMetaData(tokenId);

    res.setHeader('Cache-Control', 'max-age=0, s-maxage=' + CACHE_SECONDS);
    return res.status(200).send(data);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

async function getCosoulMetaData(tokenId: number) {
  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          where: {
            token_id: { _eq: tokenId },
          },
          limit: 1,
        },
        {
          id: true,
          pgive: true,
          profile: {
            name: true,
            address: true,
          },
          created_at: true,
        },
      ],
    },
    {
      operationName: 'cosoulApi__fetchMetadata',
    }
  );

  const coSoulData = cosouls.pop();
  assert(coSoulData?.pgive !== undefined, 'error fetching cosoul data');

  const createdAtUnix = Math.floor(
    new Date(coSoulData.created_at).getTime() / 1000
  );
  const pgiveLevel = Math.floor(coSoulData.pgive / 1000) + 1;

  const animation_url = `${WEB_APP_BASE_URL}/cosoul/art?address=${coSoulData.profile.address}&pgive=${coSoulData.pgive}&animate=true`;

  return {
    description: 'A Coordinape Cosoul',
    external_url: `${WEB_APP_BASE_URL}/cosoul/${coSoulData.profile.address}`,
    //TODO: Update this placeholder image
    image:
      'https://coordinape-prod.s3.amazonaws.com/assets/static/images/cosoul-thumb.png',
    name: `${coSoulData.profile.name}'s CoSoul`,
    animation_url: animation_url,
    attributes: [
      { trait_type: 'pGive', value: coSoulData.pgive },
      {
        display_type: 'date',
        trait_type: 'mint date',
        value: createdAtUnix,
      },
      { trait_type: 'level', value: pgiveLevel },
    ],
  };
}

export type CosoulMetaData = Awaited<ReturnType<typeof getCosoulMetaData>>;
