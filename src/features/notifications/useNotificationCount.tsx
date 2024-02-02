import assert from 'assert';

import { useAuthStore } from 'features/auth';
import { useQuery } from 'react-query';

import { client } from '../../lib/gql/client';

export const NOTIFICATIONS_QUERY_KEY = 'notifications';
export const NOTIFICATIONS_COUNT_QUERY_KEY = [NOTIFICATIONS_QUERY_KEY, 'count'];

export const useNotificationCount = () => {
  const profileId = useAuthStore(state => state.profileId);

  const { data } = useQuery(
    NOTIFICATIONS_COUNT_QUERY_KEY,
    async () => {
      assert(profileId);
      const last_read_notification_id =
        await fetchLastReadNotificationId(profileId);
      const count = await fetchNotificationsCount(
        profileId,
        last_read_notification_id
      );
      return { last_read_notification_id, count };
    },
    {
      enabled: !!profileId,
      refetchInterval: data1 => {
        if (document.visibilityState === 'visible') {
          return 1000 * 30; // 30 seconds
        } else {
          if (data1?.count !== undefined && data1.count > 0) {
            // we already have notifications badged so whatever, why update?
            return 1000 * 60 * 10; // 10 minutes
          }
          return 1000 * 60; // 1 minute
        }
      },
      refetchIntervalInBackground: true,
    }
  );

  return { ...data, profileId };
};

const fetchLastReadNotificationId = async (profileId: number) => {
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

  return profiles_by_pk?.last_read_notification_id ?? 0;
};

const fetchNotificationsCount = async (
  profileId: number,
  last_read_notification_id: number
) => {
  const { notifications_aggregate } = await client.query(
    {
      notifications_aggregate: [
        {
          where: {
            profile_id: { _eq: profileId },
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
};
