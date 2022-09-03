import { styled } from '../../stitches.config';
import { Box } from '../../ui';

const ConstrainedBox = styled(Box, {
  width: '70%',
  '@md': {
    width: '100%',
  },
});

export default ConstrainedBox;
