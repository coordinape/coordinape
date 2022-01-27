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
    variant: {
      wallet: {
        fontSize: '15px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '$text',
        border: 'solid',
        margin: '1.6px 0px',
        padding: '12px 17.6px',
        boxShadow: '0px 4px 6px rgb(181 193 199 / 30%)',
        borderWidth: '2px',
        borderRadius: '13px',
        backgroundColor: '#0000',
        minWidth: '64px',
        '& svg': {
          height: '$lg',
          width: '$lg',
        },
        '&:hover': {
          color: '$selected',
          background: '$third',
        },
        '&:disabled': {
          color: '$text',
          opacity: 0.5,
        },
      },
    },
    fullWidth: {
      true: {
        width: '$full',
      },
    },
  },
});
