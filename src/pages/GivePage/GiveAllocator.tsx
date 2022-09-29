import React from 'react';

import { ApeInfoTooltip } from '../../components';
import { MinusCircle, PlusCircle } from '../../icons/__generated';
import { Box, Button, Flex, Text, TextField } from '../../ui';

import { Gift } from './index';

const iconSize = 40;

type GiveAllocatorProps = {
  adjustGift(recipientId: number, amount: number): void;
  gift: Gift;
  inPanel?: boolean;
  disabled: boolean;
  maxedOut: boolean;
  optedOut: boolean;
};

// GiveAllocator is the widget that shows the GIVE you have allocated to someone and lets you increment/decrement
export const GiveAllocator = ({
  adjustGift,
  gift,
  inPanel = false,
  disabled,
  maxedOut,
  optedOut,
}: GiveAllocatorProps) => {
  //incGift increments the gift by 1
  const incGift = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    // TODO: non-giver handling
    adjustGift(gift.recipient_id, 1);
  };

  //decGift decrements the gift by 1
  const decGift = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (gift.tokens > 0) {
      adjustGift(gift.recipient_id, -1);
    }
  };

  //setGiftTokens sets the gift to a specific value (on manual entry in the textfield)
  const setGiftTokens = (value: string) => {
    if (value.length > 5) {
      return;
    }
    const newValue = +value;
    const adjustment = newValue - gift.tokens;
    // TODO: can never erase the 0 cuz empty string evaluates to 0 here, need gift.tokens to be optional for this -g
    // https://github.com/coordinape/coordinape/issues/1401
    adjustGift(gift.recipient_id, adjustment);
  };

  return (
    <Box css={{ position: 'relative' }}>
      {optedOut && (
        <Flex
          css={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text variant="label" css={{ pr: '$xs' }}>
            OPTED OUT OF GIVE
          </Text>
          <ApeInfoTooltip>
            This member has either opted-out of receiving GIVE or has been
            blocked from receiving by the circle admin.
          </ApeInfoTooltip>
        </Flex>
      )}
      <Flex
        alignItems="center"
        css={{ visibility: optedOut ? 'hidden' : 'visible' }}
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
            disabled={gift.tokens < 1 || disabled}
            color="transparent"
            css={{
              padding: 0,
              color: '$primary',
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
          {(gift.tokens < 1 || disabled) && <ClickTrapperIcon />}
        </Flex>
        <TextField
          data-testid="tokenCount"
          value={gift.tokens}
          onChange={evt => setGiftTokens(evt.target.value)}
          maxLength={5}
          disabled={disabled}
          onClick={e => e.stopPropagation()}
          css={{
            width: '5em',
            textAlign: 'center',
            mx: '$sm',
            py: '$xs',
            my: '$xs',
            fontWeight: '$semibold',
            fontSize: '$h3',
            backgroundColor: inPanel ? '$white' : '$surface',
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
              color: '$primary',
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
    </Box>
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
      width: iconSize,
      height: iconSize,
    }}
  ></Box>
);
