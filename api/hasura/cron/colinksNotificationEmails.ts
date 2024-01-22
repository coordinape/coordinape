import type { VercelRequest, VercelResponse } from '@vercel/node';

import { sendCoLinksNotificationsEmail } from '../../../api-lib/email/postmark';
import { order_by } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { isRejected } from '../../../src/common-lib/epochs';
import { IN_PRODUCTION } from '../../../src/config/env';

async function sendEmailAndUpdateProfile({
  profileId,
  email,
  notificationId,
}: {
  profileId: number;
  email: string;
  notificationId: number;
}) {
  await sendCoLinksNotificationsEmail({
    email,
    profile_id: profileId,
  });
  await adminClient.mutate(
    {
      update_profiles_by_pk: [
        {
          pk_columns: { id: profileId },
          _set: {
            last_emailed_notification_id: notificationId,
          },
        },
        { id: true },
      ],
    },
    { operationName: 'colinksNotificationEmail__updateLastEmailedId' }
  );
  return;
}

async function getColinksUsersWithEmails() {
  const profiles = await adminClient.query(
    {
      profiles: [
        {
          where: {
            _and: [
              { colinks_notification_emails: { _eq: true } },
              { links: { _gt: 0 } },
              { emails: { verified_at: { _is_null: false } } },
            ],
          },
        },
        {
          id: true,
          last_read_notification_id: true,
          last_emailed_notification_id: true,
          emails: [
            {
              where: {
                primary: { _eq: true },
                verified_at: { _is_null: false },
              },
            },
            { email: true },
          ],
        },
      ],
    },
    { operationName: 'colinksNotificationEmail__getUsersData' }
  );
  return profiles;
}

async function getLastUnreadNotification({
  profileId,
  lastReadNotificationId,
}: {
  profileId: number;
  lastReadNotificationId?: number;
}) {
  const { notifications } = await adminClient.query(
    {
      notifications: [
        {
          where: {
            profile_id: { _eq: profileId },
            id: { _gt: lastReadNotificationId ?? -1 }, //-1 in case of the user has not read any notifications
          },
          order_by: [{ id: order_by.desc }],
          limit: 1,
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
  return notifications?.[0]?.id;
}
async function handler(req: VercelRequest, res: VercelResponse) {
  if (!IN_PRODUCTION) {
    return res.status(200).json({ success: true });
  }

  try {
    const { profiles } = await getColinksUsersWithEmails();
    const responses = await Promise.allSettled(
      profiles.map(async profile => {
        if (!profile.emails?.[0]?.email) {
          return;
        }

        const lastUnreadNotificationId = await getLastUnreadNotification({
          profileId: profile.id,
          lastReadNotificationId: profile.last_read_notification_id,
        });
        if (
          lastUnreadNotificationId &&
          lastUnreadNotificationId >
            (profile.last_emailed_notification_id ?? -1)
        ) {
          await sendEmailAndUpdateProfile({
            profileId: profile.id,
            email: profile.emails[0].email,
            notificationId: lastUnreadNotificationId,
          });
        }
        return;
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
