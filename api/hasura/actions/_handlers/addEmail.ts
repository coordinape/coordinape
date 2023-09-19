import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import {
  errorResponse,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { sendVerifyEmail } from '../../../../api-lib/postmark';

const addEmailInput = z
  .object({
    email: z.string().email().toLowerCase(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      payload,
      session: { hasuraProfileId },
    } = await getInput(req, addEmailInput);

    // make sure this email isn't already verified for another account
    // it's ok if it exists but is not verified for another user
    // if it's already associated with the current account, we should just resend the verify email
    const { other_emails, my_emails } = await adminClient.query(
      {
        __alias: {
          other_emails: {
            emails: [
              {
                where: {
                  email: { _eq: payload.email },
                  profile_id: { _neq: hasuraProfileId },
                  verified_at: { _is_null: false },
                },
              },
              {
                profile_id: true,
              },
            ],
          },
          my_emails: {
            emails: [
              {
                where: {
                  email: { _eq: payload.email },
                  profile_id: { _eq: hasuraProfileId },
                },
              },
              {
                profile_id: true,
                verified_at: true,
                verification_code: true,
                profile: {
                  name: true,
                },
              },
            ],
          },
        },
      },
      { operationName: 'addEmail_check_existing_emails' }
    );

    // make sure nobody else has it verified
    if (other_emails.length > 0) {
      throw new UnprocessableError(
        'email is already verified for another account'
      );
    }

    const myEmail = my_emails.pop();

    let verifyData: Parameters<typeof sendVerifyEmail>[0] | undefined;
    if (myEmail) {
      if (myEmail.verified_at) {
        throw new UnprocessableError(
          'email is already verified for this account'
        );
      } else {
        // get the UUID/link and send it again
        verifyData = {
          verification_code: myEmail.verification_code,
          name: myEmail.profile.name,
          email: payload.email,
        };
      }
    } else {
      // ok insert it
      const { insert_emails_one } = await adminClient.mutate(
        {
          insert_emails_one: [
            {
              object: {
                email: payload.email,
                profile_id: hasuraProfileId,
              },
            },
            {
              verification_code: true,
              profile: {
                name: true,
              },
            },
          ],
        },
        { operationName: 'addEmail_insert_emails_one' }
      );
      assert(insert_emails_one);
      verifyData = {
        verification_code: insert_emails_one.verification_code,
        name: insert_emails_one.profile.name,
        email: payload.email,
      };
    }
    assert(verifyData);

    await sendVerifyEmail(verifyData);
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
