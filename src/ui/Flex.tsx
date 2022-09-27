import { styled } from 'stitches.config';

import { Box } from './Box/Box';

export const Flex = styled(Box, {
  display: 'flex',
  variants: {
    alignItems: {
      center: {
        alignItems: 'center',
      },
    },
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
    disabled: {
      true: {
        opacity: 0.3,
        pointerEvents: 'none',
      },
    },
  },
});
