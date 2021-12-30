import { styled } from '../../stitches.config';

export const Button = styled('button', {
  // Reset
  all: 'unset',
  alignItems: 'center',
  boxSizing: 'border-box',
  userSelect: 'none',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },
  '& img': {
    paddingRight: '$sm',
  },
  paddingLeft: '$sm2',
  paddingRight: '$sm2',
  paddingTop: '$sm',
  paddingBottom: '$sm',

  display: 'flex',
  justifyContent: 'center',
  height: '$xl2',
  fontSize: '$md',
  fontWeight: '$normal',
  borderRadius: '$xs',

  color: 'White',
  variants: {
    color: {
      red: {
        backgroundColor: '$red400',
        color: 'white',
        '&:hover': {
          backgroundColor: '$red500',
        },
      },
      gray: {
        backgroundColor: '$gray400',
        color: 'white',
        '&:hover': {
          backgroundColor: '$lightGray',
        },
      },
    },
    size: {
      large: {
        alignItems: 'center',
        padding: '10px 24px',
        py: '$sm1',
        px: '$lg',
        fontSize: '$5plus05px',
        lineHeight: '$tall2',
        fontWeight: '$semibold',
        textTransform: 'none',
        borderRadius: '$4',
        '& > *': {
          my: 0,
          mx: '$sm',
        },
      },
    },
    type: {
      icon: {
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
  },
  defaultVariants: {
    color: 'gray',
    size: 'small',
  },
});
