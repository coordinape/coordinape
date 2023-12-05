import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';
import { addInviteCodes } from '../../../../api-lib/invites';

const addInviteCodesInput = z
  .object({
    profile_id: z.number(),
    count: z.number(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { payload } = await getInput(req, addInviteCodesInput, {
      allowAdmin: true,
    });

    await addInviteCodes(payload.profile_id, payload.count);

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
