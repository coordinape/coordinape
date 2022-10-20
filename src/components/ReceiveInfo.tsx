import { useState } from 'react';

import iti from 'itiriri';
import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';

import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import {
  Avatar,
  AppLink,
  Box,
  Button,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverClose,
  PopoverContent,
  Text,
  POPOVER_TIMEOUT,
} from 'ui';

export const QUERY_KEY_RECEIVE_INFO = 'getReceiveInfo';

export const ReceiveInfo = () => {
  const {
    myUser: { id: userId },
    circleId,
  } = useSelectedCircle();

  const { data: circle } = useQuery(
    [QUERY_KEY_RECEIVE_INFO, circleId, userId],
    () => getReceiveInfo(circleId, userId),
    {
      enabled: !!userId && !!circleId,
      //minmize background refetch
      refetchOnWindowFocus: false,

      notifyOnChangeProps: ['data'],
    }
  );

  const noEpoch = !circle?.currentEpoch[0] && !circle?.pastEpochs[0];
  const gifts = circle?.currentEpoch[0]
    ? circle.currentEpoch[0].receivedGifts ?? []
    : (circle?.pastEpochs[0] && circle?.pastEpochs[0].receivedGifts) ?? [];
  const totalReceived = (gifts && iti(gifts).sum(({ tokens }) => tokens)) || 0;
  const [mouseEnterPopover, setMouseEnterPopover] = useState(false);
  const closePopover = () => {
    setMouseEnterPopover(false);
  };
  let timeoutId: ReturnType<typeof setTimeout>;

  return (
    <Popover open={mouseEnterPopover}>
      <PopoverTrigger>
        <Button
          as="a"
          size="small"
          color="surface"
          onMouseEnter={() => {
            clearTimeout(timeoutId);
            setMouseEnterPopover(true);
          }}
          onMouseLeave={() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(
              () => setMouseEnterPopover(false),
              POPOVER_TIMEOUT
            );
          }}
        >
          {totalReceived} {circle?.token_name ?? 'GIVE'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onMouseEnter={() => {
          clearTimeout(timeoutId);
          setMouseEnterPopover(true);
        }}
        onMouseLeave={() => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(
            () => setMouseEnterPopover(false),
            POPOVER_TIMEOUT
          );
        }}
        align="end"
        sideOffset={-38}
        alignOffset={-1}
      >
        <Box
          css={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '$small',
            p: '$md',
          }}
        >
          <PopoverClose asChild onClick={closePopover}>
            <Text
              p
              size="small"
              semibold
              css={{
                mb: '$md',
                textAlign: 'right',
                fontVariantNumeric: 'normal',
                cursor: 'pointer',
              }}
            >
              {noEpoch
                ? 'No Epochs in this Circle'
                : `You have received ${totalReceived ?? 0} ${
                    circle?.token_name ?? 'GIVE'
                  }`}
            </Text>
          </PopoverClose>
          {gifts
            ?.filter(
              tokenGift => tokenGift.tokens > 0 || tokenGift.gift_private?.note
            )
            ?.sort(
              (a, b) => +new Date(b.dts_created) - +new Date(a.dts_created)
            )
            ?.map(tokenGift => (
              <Box
                css={{
                  width: '100%',
                  borderTop: '1px solid $border',
                  pt: '$sm',
                  mb: '$sm',
                }}
                key={tokenGift.id}
              >
                <Flex css={{ justifyContent: 'space-between' }}>
                  <Text semibold css={{ mr: '$md' }}>
                    {tokenGift.tokens > 0
                      ? `+${tokenGift.tokens} Received from `
                      : 'From '}
                    {tokenGift.sender?.name}
                  </Text>
                  <Text color="neutral">
                    {DateTime.fromISO(tokenGift.dts_created).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                  </Text>
                </Flex>
                <Flex
                  css={{
                    gap: '$sm',
                    mt: '$sm',
                    maxWidth: '20rem',
                  }}
                >
                  <Avatar
                    path={tokenGift.sender.profile.avatar}
                    name={tokenGift.sender.name}
                  />
                  {tokenGift.gift_private?.note ? (
                    <Text p as="p" size="small">
                      {tokenGift.gift_private.note}
                    </Text>
                  ) : (
                    <Text color="neutral">-- Empty Note --</Text>
                  )}
                </Flex>
              </Box>
            ))}
          <Text css={{ mt: '$md' }}>
            <AppLink to={paths.history(circleId)}>View Epoch Overview</AppLink>
          </Text>
        </Box>
      </PopoverContent>
    </Popover>
  );
};

const getReceiveInfo = async (circleId: number, userId: number) => {
  const gq = await client.query(
    {
      circles_by_pk: [
        { id: circleId },
        {
          token_name: true,
          __alias: {
            currentEpoch: {
              epochs: [
                {
                  where: { ended: { _eq: false }, start_date: { _lt: 'now' } },
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
                          sender: { name: true, profile: { avatar: true } },
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
                  number: true,
                  start_date: true,
                  end_date: true,
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
                          sender: { name: true, profile: { avatar: true } },
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
    {
      operationName: 'getReceivedInfo',
    }
  );
  return gq.circles_by_pk;
};
