import assert from 'assert';

import { VercelRequest, VercelResponse } from '@vercel/node';

import {
  decodeToken,
  EmailType,
  isEmailType,
} from '../../../api-lib/email/unsubscribe.ts';
import { adminClient } from '../../../api-lib/gql/adminClient.ts';
import { errorResponse, NotFoundError } from '../../../api-lib/HttpError.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // strip url to get raw unsubscribe token; using req.query.unsubscribeToken would decode the token improperly
    const unsubscribeToken = req.url?.replace('/api/email/unsubscribe/', '');

    if (!unsubscribeToken) {
      throw new NotFoundError('no unsubscription token provided');
    }

    const { profileId, emailType } = decodeToken(unsubscribeToken);

    return await unsubscribeEmail(res, profileId, emailType);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

export async function unsubscribeEmail(
  res: VercelResponse,
  profileId: string,
  emailType: EmailType
) {
  assert(isEmailType(emailType), 'invalid email type');
  await adminClient.mutate(
    {
      update_profiles_by_pk: [
        {
          pk_columns: { id: parseInt(profileId) },
          ...getEmailColumn(emailType),
        },
        { id: true },
      ],
    },
    { operationName: 'email_unsubscribtion' }
  );

  const display =
    emailType === 'notification'
      ? 'unread notifications emails'
      : emailType === 'colinks_happenings' || emailType === 'give_happenings'
        ? 'product emails'
        : 'circle emails';
  return res.status(200).send({
    message: `Email unsubscribed successfully from ${display}`,
  });
}

function getEmailColumn(emailType: EmailType) {
  switch (emailType) {
    case 'notification':
      return { _set: { colinks_notification_emails: false } };
    case 'give_happenings':
      return { _set: { product_emails: false } };
    case 'colinks_happenings':
      return { _set: { colinks_product_emails: false } };
    default:
      return { _set: { app_emails: false } };
  }
}
