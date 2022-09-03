import { useState } from 'react';

import iti from 'itiriri';
import { DateTime } from 'luxon';

import { ApeAvatar } from 'components/index';
import { useUserGifts } from 'recoilState/allocation';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import {
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

export const ReceiveInfo = () => {
  const {
    myUser,
    circle: selectedCircle,
    circleEpochsStatus: { currentEpoch, previousEpoch },
  } = useSelectedCircle();
  const { forUserByEpoch: myReceived } = useUserGifts(myUser.id);

  const noEpoch = !currentEpoch && !previousEpoch;
  const gifts = currentEpoch
    ? myReceived.get(currentEpoch.id) ?? []
    : (previousEpoch && myReceived.get(previousEpoch.id)) ?? [];
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
          size="small"
          color="surface"
          css={{ mr: '$sm' }}
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
          {totalReceived} {selectedCircle?.tokenName}
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
                    selectedCircle?.tokenName
                  }`}
            </Text>
          </PopoverClose>
          {gifts
            ?.filter(tokenGift => tokenGift.tokens > 0 || tokenGift.note)
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
                  <ApeAvatar user={tokenGift.sender} />
                  {tokenGift.note ? (
                    <Text p as="p" size="small">
                      {tokenGift.note}
                    </Text>
                  ) : (
                    <Text color="neutral">-- Empty Note --</Text>
                  )}
                </Flex>
              </Box>
            ))}
          <Text css={{ mt: '$md' }}>
            <AppLink to={paths.history(selectedCircle.id)}>
              View Epoch Overview
            </AppLink>
          </Text>
        </Box>
      </PopoverContent>
    </Popover>
  );
};
