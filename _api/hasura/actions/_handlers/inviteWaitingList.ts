import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getWaitListGuardianProfileId } from '../../../../api-lib/colinks/helperAccounts';
import { order_by } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';
import { addInviteCodes } from '../../../../api-lib/invites';
import {
  fetchVerifiedEmail,
  sendCoLinksWaitlistInvitedEmail,
} from '../../../../api-lib/postmark';

const inviteWaitingListInput = z
  .object({
    limit: z.number(),
    invites: z.number().optional(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { payload } = await getInput(req, inviteWaitingListInput, {
      allowAdmin: true,
    });

    // lookup profile by address
    const { profiles } = await adminClient.query(
      {
        profiles: [
          {
            where: {
              invite_code_sent_at: { _is_null: true },
              invite_code_requested_at: { _is_null: false },
              emails: {
                verified_at: { _is_null: false },
                primary: { _eq: true },
              },
            },
            order_by: [{ invite_code_requested_at: order_by.asc_nulls_last }],
            limit: payload.limit,
          },
          { id: true },
        ],
      },
      { operationName: 'inviteWaitList__getProfiles' }
    );
    assert(profiles.length > 0, 'no profiles found to invite');

    // eslint-disable-next-line no-console
    console.log(
      'inviting',
      profiles.length,
      'profiles from the waitList',
      profiles
    );

    const bouncerId = await getWaitListGuardianProfileId();

    const inviteCodes = await addInviteCodes(bouncerId, profiles.length);
    await Promise.all(
      profiles.map(async p => {
        const email = await fetchVerifiedEmail(p.id);
        await sendCoLinksWaitlistInvitedEmail({
          email,
          inviteCode: inviteCodes.pop() as string,
        });
        await adminClient.mutate(
          {
            update_profiles_by_pk: [
              {
                pk_columns: { id: p.id },
                _set: {
                  invite_code_sent_at: new Date().toISOString(),
                },
              },
              {
                __typename: true,
              },
            ],
          },
          {
            operationName: 'inviteWaitList__update_sent_code',
          }
        );
        if (payload.invites) {
          await addInviteCodes(p.id, payload.invites);
        }
      })
    );
    // eslint-disable-next-line no-console
    console.log('invited', profiles.length, 'profiles from the waitList');

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
