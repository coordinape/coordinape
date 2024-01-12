import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../api-lib/HttpError';

export async function profileInfo(req: VercelRequest, res: VercelResponse) {
  try {
    let address: string | undefined;
    if (typeof req.query.address == 'string') {
      address = req.query.address;
    }

    assert(address, 'no address provided');

    const profile = await getProfileInfo(address);

    if (!profile) {
      return res.status(404).send({
        message: 'No profile found',
      });
    }

    return res.status(200).send({
      avatar: profile.avatar,
      name: profile.name,
      links: profile.links,
      repScore: profile.reputation_score?.total_score ?? 0,
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return await profileInfo(req, res);
}

export const getProfileInfo = async (address: string) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            address: {
              _ilike: address,
            },
          },
        },
        {
          reputation_score: {
            total_score: true,
          },
          links: true,
          name: true,
          avatar: true,
          description: true,
        },
      ],
    },
    {
      operationName: 'profileInfoForOgTags',
    }
  );
  return profiles.pop();
};
