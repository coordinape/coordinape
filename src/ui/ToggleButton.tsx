import { styled } from '../stitches.config';

// ToggleButton is for turning something on or off, in this case the Yes/No of "Do you want to receive GIVE"
// it has sufficiently different styling from our main buttons so it is a unique component -g
export const ToggleButton = styled('button', {
  $$color: '$colors$primary',
  py: '$sm',
  px: '$md',
  border: '2px solid',
  borderRadius: '$3',
  borderColor: '$borderMedium',
  background: '$dim',
  fontSize: '$small',
  opacity: 0.25,
  display: 'flex',
  alignItems: 'center',
  color: '$headingText',
  gap: '$xs',
  'svg *': {
    color: '$text',
  },
  '&:enabled': {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
      borderColor: '$$color',
    },
  },
  variants: {
    color: {
      destructive: {
        $$color: '$colors$toggleButtonNo',
        borderColor: '$$color',
      },
      complete: {
        $$color: '$colors$toggleButtonYes',
        borderColor: '$$color',
      },
    },
    active: {
      true: {
        opacity: '1 !important',
        cursor: 'default !important',
        borderColor: '$$color',
      },
    },
  },
});
