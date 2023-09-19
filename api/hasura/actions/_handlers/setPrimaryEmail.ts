import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import {
  errorResponse,
  UnprocessableError,
} from '../../../../api-lib/HttpError';

const setPrimaryEmailInput = z
  .object({
    email: z.string().email().toLowerCase(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      payload,
      session: { hasuraProfileId },
    } = await getInput(req, setPrimaryEmailInput);

    // set given email as primary for user, make all other users' email not primary
    const { primaryEmail } = await adminClient.mutate(
      {
        __alias: {
          primaryEmail: {
            update_emails: [
              {
                where: {
                  profile_id: { _eq: hasuraProfileId },
                  email: { _eq: payload.email },
                },
                _set: {
                  primary: true,
                },
              },
              { affected_rows: true },
            ],
          },
          otherEmails: {
            update_emails: [
              {
                where: {
                  profile_id: { _eq: hasuraProfileId },
                  email: { _neq: payload.email },
                },
                _set: {
                  primary: false,
                },
              },
              { affected_rows: true },
            ],
          },
        },
      },
      { operationName: 'setPrimaryEmail__update_emails' }
    );

    assert(primaryEmail);
    if (primaryEmail.affected_rows == 0) {
      throw new UnprocessableError('error setting email as primary');
    }

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
