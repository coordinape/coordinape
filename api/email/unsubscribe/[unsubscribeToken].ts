import assert from 'assert';

import { VercelRequest, VercelResponse } from '@vercel/node';

import { decodeToken, isEmailType } from '../../../api-lib/email/unsubscribe';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { NotFoundError, errorResponse } from '../../../api-lib/HttpError';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let unsubscribeToken: string | undefined;
  if (typeof req.query.unsubscribeToken == 'string') {
    unsubscribeToken = req.query.unsubscribeToken;
  } else if (Array.isArray(req.query.unsubscribeToken)) {
    unsubscribeToken = req.query.unsubscribeToken.pop();
  }

  if (!unsubscribeToken) {
    throw new NotFoundError('no unsubscription token provided');
  }

  const { profileId, emailType } = decodeToken(unsubscribeToken);

  return await unsubscribeEmail(res, profileId, emailType);
}

export async function unsubscribeEmail(
  res: VercelResponse,
  profileId: string,
  emailType: string
) {
  try {
    assert(isEmailType(emailType), 'invalid email type');
    adminClient.mutate(
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
    return res.status(200).send({
      message: `Email unsubscribed successfully from ${
        emailType === 'notification'
          ? 'unread notifications emails'
          : emailType === 'product'
          ? 'product emails'
          : 'transactional emails'
      } list`,
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

function getEmailColumn(emailType: string) {
  if (emailType === 'notification') {
    return { _set: { colinks_notification_emails: false } };
  } else if (emailType === 'product') {
    return { _set: { product_emails: false } };
  } else {
    return { _set: { app_emails: false } };
  }
}
