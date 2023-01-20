/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

import { isUserAdmin } from 'lib/users';
import { DateTime } from 'luxon';

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

import { useReceiveInfo } from './useReceiveInfo';

export const QUERY_KEY_RECEIVE_INFO = 'getReceiveInfo';

export const ReceiveInfo = () => {
  const {
    myUser: { id: userId, role },
    circleId,
  } = useSelectedCircle();

  const {
    currentNonReceiver,
    data,
    gifts,
    totalReceived,
    noEpoch,
    showGives,
    tokenName,
    visibleGive,
  } = useReceiveInfo(circleId, userId);

  const [mouseEnterPopover, setMouseEnterPopover] = useState(false);
  const closePopover = () => {
    setMouseEnterPopover(false);
  };
  let timeoutId: ReturnType<typeof setTimeout>;
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
          size="small"
          color="surface"
          css={{ ml: '-9px' }}
        >
          {visibleGive} {tokenName}
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
