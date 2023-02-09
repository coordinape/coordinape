import React from 'react';

import type { CSS } from 'stitches.config';

import { MinusCircle, PlusCircle } from '../../icons/__generated';
import { Box, Button, Flex, Text, TextField, InfoTooltip } from 'ui';

import { Gift } from './index';

type GiveAllocatorProps = {
  adjustGift(recipientId: number, amount: number | null): void;
  gift: Gift;
  disabled: boolean;
  maxedOut: boolean;
  optedOut: boolean;
  small?: boolean;
  css?: CSS;
};

// GiveAllocator is the widget that shows the GIVE you have allocated to someone and lets you increment/decrement
export const GiveAllocator = ({
  adjustGift,
  gift,
  disabled,
  maxedOut,
  optedOut,
  small = false,
  css,
}: GiveAllocatorProps) => {
  const iconSize = small ? 32 : 38;

  //incGift increments the gift by 1
  const incGift = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    // TODO: non-giver handling
    adjustGift(gift.recipient_id, 1);
  };

  //decGift decrements the gift by 1
  const decGift = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if ((gift.tokens ?? 0) > 0) {
      adjustGift(gift.recipient_id, -1);
    }
  };

  //setGiftTokens sets the gift to a specific value (on manual entry in the textfield)
  const setGiftTokens = (value: string) => {
    if (value.length > 5) {
      return;
    }
    const adjustment = value !== '' ? +value - (gift.tokens ?? 0) : null;
    // TODO: can never erase the 0 cuz empty string evaluates to 0 here, need gift.tokens to be optional for this -g
    // https://github.com/coordinape/coordinape/issues/1401
    adjustGift(gift.recipient_id, adjustment);
  };

  return (
    <Flex
      css={{
        minWidth: small ? 0 : '13.5rem',
        width: small ? '10.5rem' : 'auto',
        minHeight: 'calc($2xl + $xs - 1px)',
        alignItems: 'center',
        ...css,
      }}
    >
      {optedOut ? (
        <Flex
          css={{
            flexGrow: 1,
            justifyContent: 'center',
            pr: '$xs',
          }}
        >
          <Text
            variant="label"
            css={{
              pr: '$xs',
            }}
          >
            OPTED OUT OF GIVE
          </Text>
          <InfoTooltip>
            This member has either opted-out of receiving GIVE or has been
            blocked from receiving by the circle admin.
          </InfoTooltip>
        </Flex>
      ) : (
        <Flex
          alignItems="center"
          css={{
            display: optedOut ? 'none' : 'flex',
          }}
        >
          <Flex
            css={{
              position: 'relative',
              width: iconSize,
              height: iconSize,
            }}
          >
            <Button
              data-testid="decrement"
              size="small"
              onClick={decGift}
              disabled={(gift.tokens ?? 0) < 1 || disabled}
              color="transparent"
              css={{
                padding: 0,
                color: '$cta',
                transition: '0.1s all ease-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                '&:active': {
                  transform: 'scale(0.9)',
                },
                '> svg': {
                  // This override mr: $xs set in Button for some reason, almost lost my mind over this -g
                  mr: '0',
                },
              }}
            >
              <MinusCircle css={{ width: iconSize, height: iconSize }} />
            </Button>
            {((gift.tokens ?? 0) < 1 || disabled) && <ClickTrapperIcon />}
          </Flex>
          <TextField
            data-testid="tokenCount"
            value={gift.tokens ?? ''}
            onChange={evt => {
              setGiftTokens(evt.target.value ? evt.target.value : '0');
            }}
            maxLength={5}
            disabled={disabled}
            onClick={e => e.stopPropagation()}
            css={{
              width: '100%',
              height: iconSize,
              minHeight: 0,
              textAlign: 'center',
              m: '0 $sm !important',
              py: '$xs',
              my: '$xs',
              fontWeight: '$semibold',
              fontSize: '$h2Temp',
              backgroundColor: '$formInputBackground !important',
            }}
            type="number"
            min="0"
          />
          <Flex
            css={{
              position: 'relative',
              width: iconSize,
              height: iconSize,
            }}
          >
            <Button
              data-testid="increment"
              size="small"
              onClick={incGift}
              color="transparent"
              disabled={disabled || maxedOut}
              css={{
                padding: 0,
                color: '$cta',
                transition: '0.1s all ease-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                '&:active': {
                  transform: 'scale(0.9)',
                },
                '> svg': {
                  // This override mr: $xs set in Button for some reason, almost lost my mind over this -g
                  mr: '0',
                },
              }}
            >
              <PlusCircle css={{ width: iconSize, height: iconSize }} />
            </Button>
            {(disabled || maxedOut) && <ClickTrapperIcon />}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

// ClickTrapperIcon is a shim that goes over the minus/plus buttons when they are disabled so that their
// click events don't bubble up and cause the drawer to show
const ClickTrapperIcon = () => (
  <Box
    onClick={e => {
      e.stopPropagation();
    }}
    css={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    }}
  ></Box>
);
