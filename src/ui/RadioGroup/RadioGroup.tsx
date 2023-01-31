import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { styled } from 'stitches.config';

const StyledToggleGroupRoot = styled(RadioGroupPrimitive.Root, {
  '*': {
    cursor: 'pointer',
  },
});
const StyledRadio = styled(RadioGroupPrimitive.Item, {
  all: 'unset',
  backgroundColor: '$surface',
  width: 20,
  height: 20,
  borderRadius: '100%',
  boxShadow: '0 2px 10px $surface',
  border: '2px solid',
  borderColor: '$formRadioBorderSelected !important',
  "&[data-state='unchecked']": {
    borderColor: '$formRadioBorderUnselected !important',
  },
  '&:hover, &:focus': {
    backgroundColor: '$completeLight',
    borderColor: '$formRadioBorderSelected !important',
  },
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
    backgroundColor: '$formRadioBorderSelected',
  },
});

export const RadioGroupRoot = StyledToggleGroupRoot;
export const RadioGroupRadio = StyledRadio;
export const RadioGroupIndicator = StyledIndicator;
