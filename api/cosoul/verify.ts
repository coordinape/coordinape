/* eslint-disable no-console */
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse } from '../../api-lib/HttpError';
import { getMintInfo } from '../../src/features/cosoul/api/cosoul';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload = req.body;
    const { event_type, transaction } = payload;

    console.log({ event_type, transaction });

    // fetch mintInfo
    const mintInfo = await getMintInfo(transaction.hash);

    console.log(mintInfo);
    // TODO: verify info and reestablish database sanity

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
