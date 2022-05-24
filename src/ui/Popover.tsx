import * as PopoverPrimitive from '@radix-ui/react-popover';
import { styled } from '@stitches/react';

const StyledContent = styled(PopoverPrimitive.Content, {
  padding: 0,
  borderRadius: 8,
  background: '$white',
  boxShadow: '$heavy',
  display: 'flex',
  flexDirection: 'column',
});

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverContent = StyledContent;
export const PopoverClose = PopoverPrimitive.Close;
export const PopoverArrow = PopoverPrimitive.Arrow;
