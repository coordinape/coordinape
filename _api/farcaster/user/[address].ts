import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse } from '../../../api-lib/HttpError.ts';
import { fetchUserByAddress } from '../../../api-lib/neynar.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let address: string | undefined;
  if (typeof req.query.address == 'string') {
    address = req.query.address;
  } else if (Array.isArray(req.query.address)) {
    address = req.query.address.pop();
  }

  assert(address, 'no address provided');
  const fcUser = await fetchUserByAddress(address);

  if (!fcUser) {
    return errorResponse(
      res,
      'no CoLinks or Farcaster user found for this address'
    );
  }
  return res.status(200).json(fcUser);
}
