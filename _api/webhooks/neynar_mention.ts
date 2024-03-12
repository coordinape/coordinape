import type { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse } from '../../api-lib/HttpError';
import { isValidSignature } from '../../api-lib/neynarSignature';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!(await isValidSignature(req))) {
      res.status(401).send('Webhook signature not valid');
      return;
    }

    const payload = req.body;
    // eslint-disable-next-line no-console
    console.log({ payload, headers: req.headers });

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
