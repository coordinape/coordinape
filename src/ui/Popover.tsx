/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { styled } from '@stitches/react';

const StyledContent = styled(PopoverPrimitive.Content, {
  padding: 0,
  borderRadius: 8,
  background: '$white',
  boxShadow:
    '0px 0px 3px 0px #0000001C, 0px 0px 16px 0px #0000001F, 0px 0px 87px 0px #0000003D',
  display: 'flex',
  flexDirection: 'column',
});

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverContent = StyledContent;
export const PopoverClose = PopoverPrimitive.Close;
