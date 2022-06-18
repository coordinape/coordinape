import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { styled } from 'stitches.config';

const StyledToggleGroupRoot = styled(RadioGroupPrimitive.Root, {});
const StyledRadio = styled(RadioGroupPrimitive.Item, {
  all: 'unset',
  backgroundColor: '$surface',
  width: 25,
  height: 25,
  borderRadius: '100%',
  boxShadow: '0 2px 10px $surface',
  '&:hover': { backgroundColor: '$radioHover' },
  '&:focus': { boxShadow: `0 0 0 2px surface` },
});

const StyledIndicator = styled(RadioGroupPrimitive.Indicator, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',
  '&::after': {
    content: '""',
    display: 'block',
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '$radioSelect',
  },
});

export const RadioGroupRoot = StyledToggleGroupRoot;
export const RadioGroupRadio = StyledRadio;
export const RadioGroupIndicator = StyledIndicator;
