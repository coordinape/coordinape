import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse, UnprocessableError } from '../../../api-lib/HttpError';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let uuid: string | undefined;
    if (typeof req.query.uuid == 'string') {
      uuid = req.query.uuid;
    }

    assert(uuid, 'no uuid provided');

    // ensure there are no other verified emails for this email
    await checkForOtherVerifiedEmails(uuid);

    // then verify the email
    const data = await setVerifiedAt(uuid);
    return res.status(200).send({
      message:
        'Successfully verified email address: ' + data.returning[0].email,
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

async function checkForOtherVerifiedEmails(uuid: string) {
  const { emails } = await adminClient.query(
    {
      emails: [
        {
          where: {
            verification_code: { _eq: uuid },
          },
        },
        { email: true },
      ],
    },
    { operationName: 'verifyEmail__getEmail' }
  );

  const email = emails[0].email;
  assert(email, 'no email found for verification code');

  // check if this email is already verified
  const { emails: verified_emails } = await adminClient.query(
    {
      emails: [
        {
          where: {
            email: { _eq: emails[0].email },
            verified_at: { _is_null: false },
          },
        },
        { email: true },
      ],
    },
    { operationName: 'verifyEmail__checkForOtherEmails' }
  );

  if (verified_emails.length > 0) {
    throw new UnprocessableError(
      'email is already verified: ' + emails[0].email
    );
  }

  return emails;
}

async function setVerifiedAt(uuid: string) {
  // update the verified_at on the corresponding email
  const { update_emails } = await adminClient.mutate(
    {
      update_emails: [
        {
          where: {
            verification_code: { _eq: uuid },
            verified_at: { _is_null: true },
          },
          _set: { verified_at: 'now()' },
        },
        { affected_rows: true, returning: { email: true } },
      ],
    },
    { operationName: 'verifyEmail__markVerified' }
  );

  if (update_emails?.affected_rows != 1) {
    throw new UnprocessableError(
      'no unverified email found for verification code'
    );
  }

  return update_emails;
}
