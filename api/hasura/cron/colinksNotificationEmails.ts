import type { VercelRequest, VercelResponse } from '@vercel/node';

import { order_by } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../api-lib/HttpError';
import { sendCoLinksNotificationsEmail } from '../../../api-lib/postmark';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { isRejected } from '../../../src/common-lib/epochs';
import { IN_PRODUCTION } from '../../../src/config/env';

export const EMAIL_FOR_REPORTS = 'core@coordinape.com';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!IN_PRODUCTION) {
    return res.status(200).json({ success: true });
  }

  try {
    const { profiles } = await adminClient.query(
      {
        profiles: [
          {
            where: {
              _and: [
                { colinks_notification_emails: { _eq: true } },
                { last_read_notification_id: { _is_null: false } },
                { links_held: { _gt: 0 } },
                { links: { _gt: 0 } },
                { emails: {} },
              ],
            },
          },
          {
            id: true,
            last_read_notification_id: true,
            last_emailed_notification_id: true,
            emails: [{ where: { primary: { _eq: true } } }, { email: true }],
          },
        ],
      },
      { operationName: 'colinksNotificationEmail__getUsersData' }
    );
    const responses = await Promise.allSettled(
      profiles.map(async profile => {
        const { notifications } = await adminClient.query(
          {
            notifications: [
              {
                where: {
                  profile_id: { _eq: profile.id },
                  id: { _gt: profile.last_read_notification_id },
                },
                order_by: [{ id: order_by.desc }],
              },
              {
                id: true,
              },
            ],
          },
          {
            operationName: 'colinksNotificationEmails__getUnreadNotifications',
          }
        );
        const lastUnreadNotificationId = notifications?.[0]?.id;

        if (
          lastUnreadNotificationId &&
          lastUnreadNotificationId >
            (profile.last_emailed_notification_id ?? -1)
        ) {
          await sendCoLinksNotificationsEmail({
            email: profile.emails[0].email,
          });
          await adminClient.mutate(
            {
              update_profiles_by_pk: [
                {
                  pk_columns: { id: profile.id },
                  _set: {
                    last_emailed_notification_id: lastUnreadNotificationId,
                  },
                },
                { id: true },
              ],
            },
            { operationName: 'colinksNotificationEmail__updateLastEmailedId' }
          );
        }
      })
    );
    const errors = responses.filter(isRejected);

    if (errors.length > 0) {
      const errorMessages = errors.map(err => {
        if (err.reason instanceof Error) {
          return err.reason.stack;
        } else {
          return String(err.reason);
        }
      });
      console.error(
        `Error sending colinks notification emails: ${errorMessages.join('\n')}`
      );
      throw new Error(errorMessages.join('\n'));
    }
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

export default verifyHasuraRequestMiddleware(handler);
