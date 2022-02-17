import { styled } from '../../stitches.config';

export const Text = styled('span', {
  lineHeight: '1',
  margin: '0',
  fontWeight: '$normal',
  fontVariantNumeric: 'tabular-nums',
  display: 'flex',
  alignItems: 'center',
  height: 'calc($md + 2)',
});

export default Text;
