import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../../../api-lib/gql/mutations';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';

const redeemInviteCodeInput = z
  .object({
    code: z.string(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      payload,
      session: { hasuraProfileId },
    } = await getInput(req, redeemInviteCodeInput);

    const hostname = req.headers.host;
    // make sure the code is valid and the user is ok
    const { inviter_id, error } = await validateCode(
      hasuraProfileId,
      payload.code
    );

    if (error) {
      return res.status(200).json({ success: false, error: error });
    }

    // ok this code is ok to use!
    await recordRedemption(hasuraProfileId, inviter_id, payload.code);

    await insertInteractionEvents({
      event_type: 'colinks_redeem_invite_code',
      profile_id: hasuraProfileId,
      data: {
        hostname,
        inviter_id,
      },
    });

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

const validateCode = async (profileId: number, code: string) => {
  const { invite_code, used_other_code } = await adminClient.query(
    {
      __alias: {
        invite_code: {
          invite_codes_by_pk: [
            {
              code: code,
            },
            {
              code: true,
              invited_id: true,
              inviter_id: true,
            },
          ],
        },
        used_other_code: {
          invite_codes: [
            {
              where: {
                invited_id: { _eq: profileId },
              },
            },
            {
              code: true,
            },
          ],
        },
      },
    },
    { operationName: 'addEmail_check_existing_emails' }
  );

  // make sure the invite code exists and that it wasn't already used by someone else
  if (!invite_code) {
    return { error: 'invalid invite code' };
  } else if (invite_code.invited_id && invite_code.invited_id !== profileId) {
    return { error: 'invite code already used' };
  } else if (invite_code.inviter_id === profileId) {
    return { error: 'cannot use your own code' };
  }
  // make handler idempotent: if same invite code as initial user respond with success
  if (used_other_code.some(c => c.code.toLowerCase() !== code.toLowerCase())) {
    return { error: 'you have already redeemed a different code' };
  }
  return { inviter_id: invite_code.inviter_id };
};

async function recordRedemption(
  hasuraProfileId: number,
  inviter_id: number,
  code: string
) {
  // set the inviter_id and mark the user ready 2 go
  await adminClient.mutate(
    {
      update_profiles_by_pk: [
        {
          pk_columns: { id: hasuraProfileId },
          _set: {
            invite_code_redeemed_at: 'now()',
            invited_by: inviter_id,
          },
        },
        {
          __typename: true,
        },
      ],
      update_invite_codes_by_pk: [
        {
          pk_columns: { code: code },
          _set: {
            invited_id: hasuraProfileId,
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'recordInviteCodeRedemption',
    }
  );
}
