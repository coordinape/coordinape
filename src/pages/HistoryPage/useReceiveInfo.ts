import iti from 'itiriri';
import { useQuery } from 'react-query';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';

export const QUERY_KEY_RECEIVE_INFO = 'getReceiveInfo';

export const useReceiveInfo = (circleId: number, userId: number) => {
  const { data } = useQuery(
    [QUERY_KEY_RECEIVE_INFO, circleId, userId],
    () => getReceiveInfo(circleId, userId),
    {
      enabled: !!userId && !!circleId,
      //minimize background refetch
      refetchOnWindowFocus: false,
      notifyOnChangeProps: ['data'],
    }
  );
  const noEpoch =
    !data?.myReceived?.currentEpoch[0] && !data?.myReceived?.pastEpochs[0];
  //handle if member was a receiver and no current epoch
  const currentNonReceiver =
    data?.user?.non_receiver && data?.myReceived?.currentEpoch[0];
  const gifts = data?.myReceived?.currentEpoch[0]
    ? data.myReceived.currentEpoch[0].receivedGifts ?? []
    : (data?.myReceived?.pastEpochs[0] &&
        data.myReceived.pastEpochs[0].receivedGifts) ??
      [];
  const totalReceived = (gifts && iti(gifts).sum(({ tokens }) => tokens)) || 0;

  const showGives =
    data?.myReceived?.show_pending_gives || !data?.myReceived?.currentEpoch[0];
  const visibleGive = !currentNonReceiver ? totalReceived : 0;
  const tokenName = data?.myReceived?.token_name ?? 'GIVE';
  return {
    currentNonReceiver,
    gifts,
    noEpoch,
    totalReceived,
    data,
    showGives,
    visibleGive,
    tokenName,
  };
};

const getReceiveInfo = async (circleId: number, userId: number) => {
  return await client.query(
    {
      __alias: {
        myReceived: {
          circles_by_pk: [
            { id: circleId },
            {
              token_name: true,
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
                      start_date: true,
                      __alias: {
                        receivedGifts: {
                          epoch_pending_token_gifts: [
                            { where: { recipient_id: { _eq: userId } } },
                            {
                              id: true,
                              tokens: true,
                              sender: {
                                name: true,
                                profile: { avatar: true, name: true },
                              },
                              gift_private: { note: true },
                              dts_created: true,
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
                pastEpochs: {
                  epochs: [
                    {
                      where: { ended: { _eq: true } },
                      order_by: [{ start_date: order_by.desc }],
                      limit: 1,
                    },
                    {
                      id: true,
                      start_date: true,
                      token_gifts_aggregate: [
                        {},
                        { aggregate: { sum: { tokens: true } } },
                      ],
                      __alias: {
                        receivedGifts: {
                          token_gifts: [
                            { where: { recipient_id: { _eq: userId } } },
                            {
                              id: true,
                              tokens: true,
                              sender: {
                                name: true,
                                profile: { avatar: true, name: true },
                              },
                              gift_private: { note: true },
                              dts_created: true,
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        user: {
          users_by_pk: [{ id: userId }, { non_receiver: true }],
        },
      },
    },
    {
      operationName: 'getReceivedInfo',
    }
  );
};
