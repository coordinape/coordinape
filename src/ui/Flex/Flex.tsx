import { disabledStyle, styled } from 'stitches.config';

import { Box } from 'ui';

export const Flex = styled(Box, {
  display: 'flex',
  variants: {
    alignItems: {
      center: {
        alignItems: 'center',
      },
      start: {
        alignItems: 'flex-start',
      },
      end: {
        alignItems: 'flex-end',
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
      true: disabledStyle,
    },
    gap: {
      sm: { gap: '$sm' },
      md: { gap: '$md' },
      lg: { gap: '$lg' },
    },
  },
});
