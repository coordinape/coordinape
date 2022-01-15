import { styled } from '../../stitches.config';

export const TextArea = styled('textarea', {
  '&:focus': {
    border: '1px solid $lightBlue',
    boxSizing: 'border-box',
  },
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  background: '$lightBackground',
  borderRadius: '8px',

  fontWeight: '$normal',
  fontSize: '$6',
  lineHeight: '29px',

  py: '$md',
  px: '$sm',

  textAlign: 'center',
  color: '$text',
});
