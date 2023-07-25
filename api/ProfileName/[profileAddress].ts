import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAddress } from 'ethers/lib/utils';

import { adminClient } from '../../api-lib/gql/adminClient';
import { errorResponse, NotFoundError } from '../../api-lib/HttpError';

const CACHE_SECONDS = 60 * 5;
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let address: string | undefined;
    if (typeof req.query.profileAddress == 'string') {
      address = req.query.profileAddress;
    } else if (Array.isArray(req.query.address)) {
      address = req.query.profileAddress.pop();
    }

    if (!address || !isAddress(address)) {
      throw new NotFoundError('no valid address provided');
    }

    address = address.toLowerCase();

    const data = await getProfileName(address);

    res.setHeader('Cache-Control', 'max-age=0, s-maxage=' + CACHE_SECONDS);
    return res.status(200).send(data);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

async function getProfileName(address: string) {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            address: { _ilike: address },
          },
          limit: 1,
        },
        {
          id: true,
          name: true,
        },
      ],
    },
    {
      operationName: 'ProfileNameAPI__fetchProfileName',
    }
  );

  assert(profiles, 'error fetching user profile');
  return {
    name: profiles?.[0]?.name ?? '',
  };
}
