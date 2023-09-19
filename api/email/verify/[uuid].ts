import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../api-lib/HttpError';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let uuid: string | undefined;
    if (typeof req.query.uuid == 'string') {
      uuid = req.query.uuid;
    }

    assert(uuid, 'no uuid provided');

    const data = await setVerifiedAt(uuid);
    return res
      .status(200)
      .send('Successfully verified email address: ' + data.returning[0].email);
  } catch (error: any) {
    return errorResponse(res, error);
  }
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
    throw new Error('no unverified email found for verification code');
  }

  return update_emails;
}
