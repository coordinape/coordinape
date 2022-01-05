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

  px: '$sm2',
  py: '$sm',

  display: 'flex',
  justifyContent: 'center',
  fontSize: '$md',
  fontWeight: '$normal',
  borderRadius: '$xs',
  cursor: 'pointer',
  textAlign: 'center',

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
      small: {
        py: '$sm',
        px: '$lg',
        fontSize: '$2',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$3',
      },
    },
  },
  defaultVariants: {
    color: 'gray',
  },
});
