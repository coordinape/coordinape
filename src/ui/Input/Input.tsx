import { styled } from '../../stitches.config';

export const Input = styled('input', {
  appearance: 'none',
  borderWidth: '0',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  margin: '0',
  outline: 'none',
  padding: '0',
  width: '100%',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },

  // Custom
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  background: '$lightBackground',
  borderRadius: '8px',

  fontWeight: '$light',
  fontSize: '$4',
  lineHeight: '$base',

  textAlign: 'center',

  color: '$text',
  variants: {
    size: {
      sm: {
        width: '175px',
        height: '48px',
      },
      md: {
        width: '250px',
        height: '48px',
      },
    },
    variant: {
      token: {},
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
