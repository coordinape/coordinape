import * as PopoverPrimitive from '@radix-ui/react-popover';
import { styled } from 'stitches.config';

const StyledPopover = styled(PopoverPrimitive.Root, {});
const StyledContent = styled(PopoverPrimitive.Content, {
  padding: 0,
  borderRadius: '$3',
  background: '$surface',
  boxShadow: '$heavy',
  display: 'flex',
  flexDirection: 'column',
  outline: 'none !important',
  position: 'relative',
  zIndex: '3000',
});

export const POPOVER_TIMEOUT = 300;
export const Popover = StyledPopover;
export const PopoverTrigger = styled(PopoverPrimitive.Trigger, {});
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverPortal = PopoverPrimitive.Portal;
export const PopoverContent = StyledContent;
export const PopoverClose = PopoverPrimitive.Close;
export const PopoverArrow = PopoverPrimitive.Arrow;
