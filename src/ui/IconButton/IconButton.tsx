import { styled } from '../../stitches.config';

export const IconButton = styled('button', {
  // Reset
  alignItems: 'center',
  appearance: 'none',
  borderWidth: '0',
  boxSizing: 'border-box',
  display: 'inline-flex',
  flexShrink: 0,
  fontFamily: 'inherit',
  fontSize: '$md',
  justifyContent: 'center',
  lineHeight: '1',
  outline: 'none',
  padding: '0',
  textDecoration: 'none',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
  color: '$gray400',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },
  backgroundColor: '$loContrast',
  border: '1px solid $gray400',
  '@hover': {
    '&:hover': {
      borderColor: '$lightGray',
    },
  },
  '&:active': {
    backgroundColor: '$gray400',
  },
  '&:disabled': {
    pointerEvents: 'none',
    backgroundColor: 'transparent',
    color: '$gray',
  },

  variants: {
    size: {
      xs: {
        borderRadius: '$1',
        height: '$lg',
        width: '$lg',
      },
      sm: {
        borderRadius: '$2',
        height: '$xl',
        width: '$xl',
      },
      md: {
        borderRadius: '$2',
        height: '$1xl',
        width: '$1xl',
      },
      lg: {
        borderRadius: '$3',
        height: '$2xl',
        width: '$2xl',
      },
    },
    variant: {
      shadow: {
        backgroundColor: 'transparent',
        borderWidth: '0',
        '@hover': {
          '&:hover': {
            backgroundColor: '$lightGray',
          },
        },
        '&:active': {
          backgroundColor: '$lightGray',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: '0',
        '@hover': {
          '&:hover': {
            backgroundColor: '$transparent',
          },
        },
        '&:active': {
          backgroundColor: '$transparent',
        },
      },
    },
  },
  defaultVariants: {
    size: 'xs',
    variant: 'shadow',
  },
});
