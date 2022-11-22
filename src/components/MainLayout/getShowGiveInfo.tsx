import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import type { Awaited } from 'types/shim';

export const getShowGiveInfo = async (circleId: number) => {
  const { circle } = await client.query(
    {
      __alias: {
        circle: {
          circles_by_pk: [
            {
              id: circleId,
            },
            {
              show_pending_gives: true,
              __alias: {
                currentEpoch: {
                  epochs: [
                    {
                      where: {
                        ended: { _eq: false },
                        start_date: { _lt: 'now' },
                      },
                      limit: 1,
                    },
                    {
                      id: true,
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
    {
      operationName: 'getShowGiveInfo',
    }
  );
  return {
    showGiveInfo: circle?.show_pending_gives || !circle?.currentEpoch[0],
  };
};

export const QUERY_KEY_GIVE_INFO = 'getShowGiveInfo';

export const useShowGiveInfoQuery = (circleId: number) => {
  return useQuery(
    [QUERY_KEY_GIVE_INFO, circleId],
    () => getShowGiveInfo(circleId),
    {
      enabled: !!circleId,
      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
      refetchOnWindowFocus: false,
    }
  );
};

export type ShowGiveInfoResult = Awaited<ReturnType<typeof getShowGiveInfo>>;
