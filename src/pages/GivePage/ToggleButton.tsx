import { styled } from '../../stitches.config';

// ToggleButton is for turning something on or off, in this case the Yes/No of "Do you want to receive GIVE"
// it has sufficiently different styling from our main buttons so it is a unique component -g
export const ToggleButton = styled('button', {
  $$color: '$colors$primary',
  py: '$sm',
  px: '$md',
  borderWidth: '2px',
  borderRadius: '$3',
  border: '2px solid $$color',
  borderColor: '$$color',
  background: 'white',
  fontSize: '$$size',
  opacity: 0.4,
  display: 'flex',
  alignItems: 'center',
  color: '$headingText',
  '> svg': {
    mr: '$xs',
  },
  '&:enabled': {
    cursor: 'pointer',
    '&:hover': {
      color: 'white',
      '> svg > path': {
        color: 'white',
      },
      opacity: 0.8,
      background: '$$color',
    },
  },
  variants: {
    color: {
      destructive: {
        $$color: '$colors$alert',
        '> svg > path': {
          color: '$alert',
        },
      },
      complete: {
        $$color: '$colors$complete',
        '> svg > path': {
          color: '$complete',
        },
      },
    },
    active: {
      true: {
        opacity: 1.0,
      },
    },
  },
});
