import { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse, NotFoundError } from '../../../api-lib/HttpError';
import { storeCoSoulImage } from '../../../src/features/cosoul/art/screenshot';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let tokenId: number | undefined;
    if (typeof req.query.tokenId == 'string') {
      tokenId = parseInt(req.query.tokenId);
    }

    if (!tokenId) {
      throw new NotFoundError('no tokenId provided');
    }

    await storeCoSoulImage(tokenId);
    return res
      .status(200)
      .json('saved screenshot for tokenId ' + tokenId + ' to s3');
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
