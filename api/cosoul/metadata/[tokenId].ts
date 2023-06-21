import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { WEB_APP_BASE_URL } from '../../../api-lib/config';
import { member_epoch_pgives_select_column } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse, NotFoundError } from '../../../api-lib/HttpError';
import { Awaited } from '../../../api-lib/ts4.5shim';

// const CACHE_SECONDS = 60 * 5;
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let tokenId: number | undefined;
    if (typeof req.query.tokenId == 'string') {
      tokenId = parseInt(req.query.tokenId);
    }

    if (!tokenId) {
      throw new NotFoundError('no token Id provided');
    }

    let data;
    try {
      data = await getCosoulMetaData(tokenId);
    } catch (NotFoundError) {
      data = burntData();
    }

    // res.setHeader('Cache-Control', 'max-age=0, s-maxage=' + CACHE_SECONDS);
    return res.status(200).send(data);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

const burntData = () => {
  return {
    description: 'This CoSoul does not exist',
    external_url: `${WEB_APP_BASE_URL}/cosoul`,
    image:
      'https://coordinape-prod.s3.amazonaws.com/assets/static/images/burned_cosoul.png',
    name: `A Burnt CoSoul`,
  };
};

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
          token_id: true,
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

  if (!coSoulData?.token_id) {
    throw new NotFoundError('no cosoul exists for token id ' + tokenId);
  }
  assert(coSoulData?.pgive !== undefined, 'error fetching cosoul data');

  const { member_epoch_pgives: orgs } = await adminClient.query(
    {
      member_epoch_pgives: [
        {
          where: {
            user: { profile: { address: { _eq: coSoulData.profile.address } } },
          },
          distinct_on: [member_epoch_pgives_select_column.organization_id],
        },
        {
          organization: {
            name: true,
          },
        },
      ],
    },
    {
      operationName: 'cosoulApi__fetchOrgs',
    }
  );

  const org_names = orgs.map(org => org?.organization?.name);

  const createdAtUnix = Math.floor(
    new Date(coSoulData.created_at).getTime() / 1000
  );
  const pgiveLevel = Math.floor(coSoulData.pgive / 1000) + 1;

  const animation_url = `${WEB_APP_BASE_URL}/cosoul/art/${coSoulData.token_id}`;

  const external_url = `${WEB_APP_BASE_URL}/cosoul/${coSoulData.profile.address}`;
  const description =
    'CoSouls contain on-chain contributor statistics in the Coordinape ecosystem.\n\n' +
    (org_names.length > 0
      ? `This CoSoul represents history in the following organizations:\n\n${org_names
          .map(n => `- ${n}\n\n`)
          .join('')}`
      : '') +
    `For more details, visit this CoSoul [here](${external_url}).`;

  return {
    description: description,
    external_url: external_url,
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
