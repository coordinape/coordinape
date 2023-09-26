import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import {
  errorResponse,
  UnprocessableError,
} from '../../../../api-lib/HttpError';

const deleteEmailInput = z
  .object({
    email: z.string().email().toLowerCase(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      payload,
      session: { hasuraProfileId },
    } = await getInput(req, deleteEmailInput);

    // delete the passed in email, ensuring its current users email
    const { delete_emails } = await adminClient.mutate(
      {
        delete_emails: [
          {
            where: {
              profile_id: { _eq: hasuraProfileId },
              email: { _eq: payload.email },
            },
          },
          { affected_rows: true },
        ],
      },
      { operationName: 'deleteEmail__deleteEmail' }
    );

    assert(delete_emails);

    if (delete_emails.affected_rows == 0) {
      throw new UnprocessableError('error deleting email');
    }

    // get the other verified emails for this user and if there is at least one, make it primary
    const { emails } = await adminClient.query(
      {
        emails: [
          {
            where: {
              profile_id: { _eq: hasuraProfileId },
              verified_at: { _is_null: false },
            },
          },
          {
            email: true,
            primary: true,
          },
        ],
      },
      {
        operationName: 'deleteEmail__getEmails',
      }
    );

    // if they have some more emails but none are primary, set one as primary
    if (emails.length > 0 && !emails.some(e => e.primary)) {
      await adminClient.mutate(
        {
          update_emails: [
            {
              where: {
                profile_id: { _eq: hasuraProfileId },
                email: { _eq: emails[0].email },
              },
              _set: {
                primary: true,
              },
            },
            { affected_rows: true },
          ],
        },
        { operationName: 'deleteEmail_setPrimaryEmail' }
      );
    }

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
