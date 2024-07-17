import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient.ts';
import { errorResponse } from '../../../api-lib/HttpError.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let search: string | undefined;
  if (typeof req.query.search == 'string') {
    search = req.query.search;
  } else if (Array.isArray(req.query.address)) {
    search = req.query.search.pop();
  }

  assert(search, 'no address provided');

  adminClient.query(
    {
      farcaster_fnames: [
        {},
        {
          custody_address: true,
        },
      ],
    },
    {
      operationName: 'farcaster_user_search',
    }
  );

  if (!fcUser) {
    return errorResponse(
      res,
      'no CoLinks or Farcaster user found for this address'
    );
  }
  return res.status(200).json(fcUser);
}
