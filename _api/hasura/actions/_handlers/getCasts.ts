import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { fetchCastsById } from '../../../../api-lib/farcaster/fetchCastsById.ts';
import { hydrateCasts } from '../../../../api-lib/farcaster/hydration.ts';
import { getAnonInput } from '../../../../api-lib/handlerHelpers.ts';
import { InternalServerError } from '../../../../api-lib/HttpError';

const getCastsSchema = z.object({
  fid: z.number().optional(),
  cast_ids: z.array(z.number()).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getAnonInput(req, getCastsSchema);

  try {
    const casts = await fetchCastsById(payload);
    const enrichedCasts = await hydrateCasts(casts);
    return res.status(200).json({ casts: enrichedCasts });
  } catch (e) {
    console.error(e);
    throw new InternalServerError('Error occurred searching profiles', e);
  }
}
