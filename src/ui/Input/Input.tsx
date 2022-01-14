import { styled } from '../../stitches.config';

export const Input = styled('input', {
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
