import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../../api-lib/config';
import { errorResponse } from '../../api-lib/HttpError';
import { publishCast } from '../../api-lib/neynar';
import { isValidSignature } from '../../api-lib/neynarSignature';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // if localhost don't validate signature
    if (!IS_LOCAL_ENV) {
      if (!(await isValidSignature(req))) {
        res.status(401).send('Webhook signature not valid');
        return;
      }
    }

    const {
      data: {
        hash,
        author: { username: author_username },
      },
    } = req.body;

    await publishCast(
      `@${author_username} whattup, I'm online tracking GIVE!`,
      {
        replyTo: hash,
      }
    );

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
