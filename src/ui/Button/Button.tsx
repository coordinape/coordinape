import { styled } from '../../stitches.config';

export const Button = styled('button', {
  '& img': {
    paddingRight: '$sm',
  },
  px: '$lg',
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
        backgroundColor: '$red',
        color: 'white',
        '&:hover': {
          backgroundColor: '$redHover',
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
        fontSize: '$5',
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
        fontSize: '$2',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$3',
      },
    },
  },
  defaultVariants: {
    color: 'gray',
    size: 'small',
  },
});
