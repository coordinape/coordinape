import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAddress } from 'viem';

import { errorResponseWithStatusCode } from '../../../api-lib/HttpError.ts';
import { fetchUserByAddress } from '../../../api-lib/neynar.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let address: string | undefined;
  if (typeof req.query.address == 'string') {
    address = req.query.address;
  } else if (Array.isArray(req.query.address)) {
    address = req.query.address.pop();
  }

  assert(address, 'no address provided');

  // validate address is valid
  if (!isAddress(address, { strict: false })) {
    return errorResponseWithStatusCode(
      res,
      { message: 'The provided address is not valid' },
      404
    );
  }

  const fcUser = await fetchUserByAddress(address);

  if (!fcUser) {
    return errorResponseWithStatusCode(
      res,
      'no CoLinks or Farcaster user found for this address',
      404
    );
  }
  return res.status(200).json(fcUser);
}
