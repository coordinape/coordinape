/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

import iti from 'itiriri';
import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { isUserAdmin } from 'lib/users';
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
  MarkdownPreview,
} from 'ui';

export const QUERY_KEY_RECEIVE_INFO = 'getReceiveInfo';

export const ReceiveInfo = () => {
  const {
    myUser: { id: userId, role },
    circleId,
  } = useSelectedCircle();

  const { data } = useQuery(
    [QUERY_KEY_RECEIVE_INFO, circleId, userId],
    () => getReceiveInfo(circleId, userId),
    {
      enabled: !!userId && !!circleId,
      //minmize background refetch
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
  const [mouseEnterPopover, setMouseEnterPopover] = useState(false);
  const closePopover = () => {
    setMouseEnterPopover(false);
  };
  let timeoutId: ReturnType<typeof setTimeout>;
  const showGives =
    data?.myReceived?.show_pending_gives || !data?.myReceived?.currentEpoch[0];
  if (!(showGives || isUserAdmin({ role }))) return <></>;
  return (
    <Popover open={mouseEnterPopover}>
      <PopoverTrigger
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            clearTimeout(timeoutId);
            setMouseEnterPopover(true);
          }
        }}
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
        <Button
          as="div"
          tabIndex={-1}
          size="tag"
          color="surface"
          css={{ ml: '-9px' }}
        >
          {!currentNonReceiver ? totalReceived : 0}{' '}
          {data?.myReceived?.token_name ?? 'GIVE'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onKeyDown={e => {
          if (e.key === 'Escape') {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(
              () => setMouseEnterPopover(false),
              POPOVER_TIMEOUT
            );
          }
        }}
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
        css={{
          maxHeight: '90vh',
          overflowY: 'scroll',
          zIndex: 4,
        }}
      >
        <Box
          css={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '$small',
            width: '30rem',
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
                : `You have received ${
                    !currentNonReceiver ? totalReceived : 0
                  } ${data?.myReceived?.token_name ?? 'GIVE'}`}
            </Text>
          </PopoverClose>
          {gifts
            ?.filter(
              tokenGift =>
                tokenGift.sender &&
                (tokenGift.tokens > 0 || tokenGift.gift_private?.note)
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
                  <Text semibold color="secondary" css={{ mr: '$md' }}>
                    {tokenGift.tokens > 0 && !currentNonReceiver
                      ? `+${tokenGift.tokens} Received from `
                      : 'From '}
                    {tokenGift.sender?.profile.name ?? tokenGift.sender?.name}
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
                    maxWidth: '100%',
                  }}
                >
                  <Avatar
                    path={tokenGift.sender.profile.avatar}
                    name={
                      tokenGift.sender.profile.name ?? tokenGift.sender.name
                    }
                  />
                  {tokenGift.gift_private?.note ? (
                    <MarkdownPreview
                      render
                      source={tokenGift.gift_private.note}
                    />
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
  return gq;
};
