import { styled } from '../../stitches.config';

export const Divider = styled('hr', {
  boxSizing: 'border-box',
  border: 'none',
  height: 1,
  my: '$xs',
  mx: 0,
  alignSelf: 'stretch',
  flexShrink: 0,
  backgroundColor: '$lightBorder',
});

export default Divider;
