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
    to_invitees: z.boolean().optional(),
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
      { operationName: 'addInviteCodes__getProfileByAddress' }
    );
    assert(profiles.length > 0, 'no profiles found for address');

    let profilesToInput = profiles;
    if (payload.to_invitees) {
      const { profiles: invitees } = await adminClient.query(
        {
          profiles: [
            { where: { invited_by: { _eq: profiles[0].id } } },
            { id: true },
          ],
        },
        { operationName: 'addInviteCodes__getInviteeByAddress' }
      );
      assert(invitees.length > 0, 'no invitees found for address');
      profilesToInput = invitees;
    }

    for (const profile of profilesToInput) {
      await addInviteCodes(profile.id, payload.count);
    }

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
