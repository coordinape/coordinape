import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../../../api-lib/config';
import { syncPoapDataForCoLinksUsers } from '../../../api-lib/poap/poap-api';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!IS_LOCAL_ENV) {
    await syncPoapDataForCoLinksUsers();
  }

  res.status(200).json({
    success: true,
  });
}

export default verifyHasuraRequestMiddleware(handler);
