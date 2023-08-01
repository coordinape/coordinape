import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse } from '../../api-lib/HttpError';
import { getMintInfofromLogs } from '../../src/features/cosoul/api/cosoul';
import { isValidSignature } from '../../api-lib/tenderlySignature';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const signature = req.headers['x-tenderly-signature'] as string;
    const timestamp = req.headers['date'] as string;

    assert(signature, 'Missing signature');
    assert(timestamp, 'Missing timestamp');
    if (!isValidSignature(signature, JSON.stringify(req.body), timestamp)) {
      res.status(400).send('Webhook signature not valid');
      return;
    }

    const payload = req.body;
    const { event_type, transaction } = payload;

    // eslint-disable-next-line no-console
    console.log({ event_type, transaction });
    const mintInfo = await getMintInfofromLogs(transaction.logs[0]);

    // eslint-disable-next-line no-console
    console.log(mintInfo);
    // TODO: verify info and reestablish database sanity

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
