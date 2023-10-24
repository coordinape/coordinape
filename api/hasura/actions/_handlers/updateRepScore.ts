import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';
import { updateRepScore } from '../../../../src/features/rep/api/updateRepScore';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { session } = await getInput(req);

    const profileId = session.hasuraProfileId;
    const score = await updateRepScore(profileId);

    console.log('updated score for ', profileId, score);
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
