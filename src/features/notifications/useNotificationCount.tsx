import { useQuery } from 'react-query';

import { client } from '../../lib/gql/client';

export const useNotificationCount = () => {
  const { data } = useQuery(['notifications', 'count'], async () => {
    const { notifications_aggregate } = await client.query(
      {
        notifications_aggregate: [
          {},
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
  });
  return data;
};
