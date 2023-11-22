import assert from 'assert';

import { useAuthStore } from 'features/auth';
import { useQuery } from 'react-query';

import { client } from '../../lib/gql/client';

export const NOTIFICATIONS_QUERY_KEY = 'notifications';
export const NOTIFICATIONS_COUNT_QUERY_KEY = [NOTIFICATIONS_QUERY_KEY, 'count'];
export const NOTIFICATIONS_LAST_READ_QUERY_KEY = [
  NOTIFICATIONS_QUERY_KEY,
  'last_seen_id',
];

export const useNotificationCount = () => {
  // fetch last seen notification id
  const profileId = useAuthStore(state => state.profileId);

  const { data: { last_read_notification_id } = {}, isLoading } = useQuery(
    NOTIFICATIONS_LAST_READ_QUERY_KEY,
    async () => {
      assert(profileId);
      const { profiles_by_pk } = await client.query(
        {
          profiles_by_pk: [
            { id: profileId },
            {
              last_read_notification_id: true,
            },
          ],
        },
        {
          operationName: 'useNotificationCount__last_seen_id',
        }
      );
      return {
        last_read_notification_id:
          profiles_by_pk?.last_read_notification_id ?? 0,
      };
    },
    {
      enabled: !!profileId,
    }
  );

  const { data: notif_count } = useQuery(
    NOTIFICATIONS_COUNT_QUERY_KEY,
    async () => {
      const { notifications_aggregate } = await client.query(
        {
          notifications_aggregate: [
            {
              where: {
                id: { _gt: last_read_notification_id },
              },
            },
            {
              aggregate: {
                count: [{}, true],
              },
            },
          ],
        },
        {
          operationName: 'notificationsAndCount',
        }
      );
      return notifications_aggregate.aggregate?.count ?? 0;
    },
    {
      enabled:
        !isLoading && !!profileId && last_read_notification_id !== undefined,
    }
  );

  return { count: notif_count, profileId, last_read_notification_id };
};
