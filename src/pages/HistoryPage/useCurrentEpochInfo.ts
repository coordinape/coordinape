import assert from 'assert';

import { useQuery } from 'react-query';

import { client } from '../../lib/gql/client';

export const QUERY_KEY_CURRENT_EPOCH_INFO = 'getCurrentEpochInfo';

export const useCurrentEpochInfo = (circleId: number, userId?: number) => {
  const { data } = useQuery(
    [QUERY_KEY_CURRENT_EPOCH_INFO, circleId, userId],
    () => {
      assert(circleId);
      return getCurrentEpochInfo(circleId);
    },
    {
      enabled: !!circleId,
      //minimize background refetch
      refetchOnWindowFocus: false,
      notifyOnChangeProps: ['data'],
    }
  );
  const currentEpochEndDate =
    data?.myReceived?.currentEpoch[0] &&
    data?.myReceived?.currentEpoch[0].end_date;
  const tokenName = data?.myReceived?.token_name ?? 'GIVE';
  return {
    currentEpochEndDate,
    data,
    tokenName,
  };
};

const getCurrentEpochInfo = async (circleId: number) => {
  return await client.query(
    {
      __alias: {
        myReceived: {
          circles_by_pk: [
            { id: circleId },
            {
              token_name: true,
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
                      start_date: true,
                      end_date: true,
                    },
                  ],
                },
              },
            },
          ],
        },
        // user: {
        //   users_by_pk: [{ id: userId }, { non_receiver: true }],
        // },
      },
    },
    {
      operationName: 'getCurrentEpochInfo',
    }
  );
};
