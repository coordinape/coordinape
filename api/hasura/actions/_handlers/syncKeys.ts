import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';
import { updateHolders } from '../../../../src/features/soulkeys/api/updateHolders';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await getInput(req);
    await updateHolders();
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
