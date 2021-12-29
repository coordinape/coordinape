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
    paddingRight: '$2',
  },
  paddingLeft: '$3',
  paddingRight: '$3',
  paddingTop: '$2',
  paddingBottom: '$2',

  display: 'flex',
  justifyContent: 'center',
  height: '$9',
  fontSize: '$4',
  fontWeight: '$normal',
  borderRadius: '$1',

  color: 'White',
  variants: {
    color: {
      red: {
        backgroundColor: '$red400',
        color: 'white',
        '&:hover': {
          backgroundColor: '$red300',
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
      small: {},
    },
  },
  defaultVariants: {
    color: 'gray',
    size: 'small',
  },
});
