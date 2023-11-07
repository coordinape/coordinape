import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { isValidSignature } from '../../api-lib/alchemySignature';
import { errorResponse } from '../../api-lib/HttpError';
import { updateHoldersFromOneLog } from '../../src/features/colinks/api/updateHolders';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const signature = req.headers['x-alchemy-signature'] as string;
    assert(signature, 'Missing signature');

    const signingKey = process.env
      .KEY_TRADE_WEBHOOK_ALCHEMY_SIGNING_KEY as string;
    assert(signingKey, 'Missing alchemy signing key for key_trade');

    if (!isValidSignature(req, signature, signingKey)) {
      res.status(400).send('Webhook signature not valid');
      return;
    }

    const payload = req.body;

    // eslint-disable-next-line no-console
    console.log('RECEIVED WEBHOOK PAYLOAD:', JSON.stringify(payload));

    const {
      event: {
        data: {
          block: { logs },
        },
      },
    } = payload;

    for (const log of logs) {
      await updateHoldersFromOneLog(log);
    }

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
