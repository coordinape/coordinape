import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';
import { addInviteCodes } from '../../../../api-lib/invites';
import { zEthAddressOnly } from '../../../../src/lib/zod/formHelpers';

const addInviteCodesInput = z
  .object({
    address: zEthAddressOnly,
    count: z.number(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { payload } = await getInput(req, addInviteCodesInput, {
      allowAdmin: true,
    });

    // lookup profile by address
    const { profiles } = await adminClient.query(
      {
        profiles: [
          { where: { address: { _ilike: payload.address } } },
          { id: true },
        ],
      },
      { operationName: 'getProfilebyAddress' }
    );

    const profile_id: number = profiles?.pop()?.id;
    assert(profile_id, 'profile_id not found for address');

    await addInviteCodes(profile_id, payload.count);

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
