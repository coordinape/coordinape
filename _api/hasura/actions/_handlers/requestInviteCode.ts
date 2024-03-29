import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  checkEligibleEmail,
  insertEmail,
} from '../../../../_api/hasura/actions/_handlers/addEmail';
import {
  sendCoLinksWaitlistVerifyEmail,
  sendCoLinksWaitlistWelcomeEmail,
} from '../../../../api-lib/email/postmark';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../../../api-lib/gql/mutations';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';

const requestInviteCodeInput = z
  .object({
    email: z.string(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      payload,
      session: { hasuraProfileId },
    } = await getInput(req, requestInviteCodeInput);

    let verifyData:
      | Parameters<typeof sendCoLinksWaitlistVerifyEmail>[0]
      | undefined;
    const myEmail = await checkEligibleEmail(payload.email, hasuraProfileId);
    const hostname = req.headers.host;

    if (myEmail) {
      if (myEmail.verified_at) {
        // already verified - add to waitlist
        await addToWaitlist(hasuraProfileId, payload.email);

        await insertInteractionEvent({
          profileId: hasuraProfileId,
          verifiedEmail: true,
          email: payload.email,
          hostname: hostname,
        });

        return res.status(200).json({ success: true });
      } else {
        // get the UUID/link and send it again
        verifyData = {
          verification_code: myEmail.verification_code,
          email: payload.email,
        };
      }
    } else {
      const insert_emails_one = await insertEmail(
        hasuraProfileId,
        payload.email
      );

      verifyData = {
        verification_code: insert_emails_one.verification_code,
        email: payload.email,
      };
    }
    assert(verifyData);
    await sendCoLinksWaitlistVerifyEmail(verifyData);

    await insertInteractionEvent({
      profileId: hasuraProfileId,
      verifiedEmail: false,
      email: verifyData.email,
      hostname: hostname,
    });

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

const insertInteractionEvent = async ({
  profileId,
  verifiedEmail,
  email,
  hostname,
}: {
  profileId: number;
  verifiedEmail: boolean;
  email: string;
  hostname?: string;
}) => {
  return await insertInteractionEvents({
    event_type: 'colinks_request_invite_code',
    profile_id: profileId,
    data: {
      hostname,
      verified_email: verifiedEmail,
      email: email,
    },
  });
};

export const addToWaitlist = async (profileId: number, email: string) => {
  await setInviteCodeRequestedAt(profileId);
  await sendCoLinksWaitlistWelcomeEmail({
    email: email,
  });
};

const setInviteCodeRequestedAt = async (profileId: number) => {
  return await adminClient.mutate(
    {
      update_profiles: [
        {
          where: {
            id: { _eq: profileId },
            invite_code_requested_at: { _is_null: true },
          },
          _set: {
            invite_code_requested_at: 'now()',
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'requestInviteCode_setInviteCodeRequestedAt',
    }
  );
};
