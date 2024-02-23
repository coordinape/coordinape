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
    const pathname = new URL('https://server' + req.url).pathname;
    const encodedToken = pathname?.replace('/api/email/unsubscribe/', '');

    if (!encodedToken) {
      throw new NotFoundError('no unsubscription token provided');
    }

    console.error({ encodedToken });

    const { profileId, emailType } = decodeToken(encodedToken);

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

  let display;
  switch (emailType) {
    case EmailType.COLINKS_NOTIFICATION:
      display = 'unread notifications emails';
      break;
    case EmailType.COLINKS_HOT_HAPPENINGS:
      display = 'hot happenings emails';
      break;
    case EmailType.GIVE_CIRCLE_HAPPENINGS:
      display = 'product emails';
      break;
    default:
      display = 'circle emails';
  }

  return res.status(200).send({
    message: `Email unsubscribed successfully from ${display}`,
  });
}

function getEmailColumn(emailType: string) {
  switch (emailType) {
    case EmailType.COLINKS_NOTIFICATION:
      return { _set: { colinks_notification_emails: false } };
    case EmailType.GIVE_CIRCLE_HAPPENINGS:
      return { _set: { product_emails: false } };
    case EmailType.COLINKS_HOT_HAPPENINGS:
      return { _set: { colinks_product_emails: false } };
    default:
      return { _set: { app_emails: false } };
  }
}
