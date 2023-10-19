/* eslint-disable no-console */
import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';

import { isValidSignatureForStringBody } from '../../api-lib/alchemySignature';
import { errorResponse } from '../../api-lib/HttpError';
import { parseEventLog } from '../../src/features/soulkeys/api/getTradeLogs';
import { getSoulKeysContract } from '../../src/features/soulkeys/api/soulkeys';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const signature = req.headers['x-alchemy-signature'] as string;
    assert(signature, 'Missing signature');

    // uncomment to test webhook
    const signingKey = process.env.COSOUL_WEBHOOK_ALCHEMY_SIGNING_KEY as string;
    assert(signingKey, 'Missing alchemy signing key');

    if (!isValidSignatureForStringBody(signature, req.body, signingKey)) {
      res.status(400).send('Webhook signature not valid');
      return;
    }

    const payload = req.body;

    const {
      event: {
        data: {
          block: { logs },
        },
      },
    } = payload;

    // iterate over logs
    for (const log of logs) {
      await handleLog(log);
    }

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

const handleLog = async (log: any) => {
  // get trade info
  const soulkeys = getSoulKeysContract();
  assert(soulkeys, 'Missing soulKeys contract');
  const data = parseEventLog(soulkeys, log);

  console.log({ data });

  // TODO: update the buys
};
