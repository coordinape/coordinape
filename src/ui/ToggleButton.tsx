import { styled } from '../stitches.config';

// ToggleButton is for turning something on or off, in this case the Yes/No of "Do you want to receive GIVE"
// it has sufficiently different styling from our main buttons so it is a unique component -g
export const ToggleButton = styled('button', {
  $$color: '$colors$primary',
  py: '$sm',
  px: '$md',
  borderWidth: '2px',
  borderRadius: '$3',
  outline: '1px solid $borderMedium',
  background: '$white',
  fontSize: '$small',
  opacity: 0.4,
  display: 'flex',
  alignItems: 'center',
  color: '$headingText',
  gap: '$xs',
  '&:enabled': {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
      outline: '2px solid $$color',
    },
  },
  variants: {
    color: {
      destructive: {
        $$color: '$colors$alert',
        'svg *': {
          color: '$alert',
        },
      },
      complete: {
        $$color: '$colors$complete',
        'svg *': {
          color: '$complete',
        },
      },
    },
    active: {
      true: {
        opacity: '1 !important',
        cursor: 'default !important',
        outline: '2px solid $$color',
      },
    },
  },
});
