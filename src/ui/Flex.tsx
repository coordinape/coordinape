import { styled } from 'stitches.config';

import { Box } from './Box/Box';

export const Flex = styled(Box, {
  display: 'flex',
  variants: {
    column: {
      true: {
        flexDirection: 'column',
      },
    },
    row: {
      true: {
        flexDirection: 'row',
      },
    },
  },
});
