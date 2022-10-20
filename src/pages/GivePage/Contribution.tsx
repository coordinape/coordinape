/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Panel, Text } from '../../ui';

import { Contributions } from './queries';

// Contribution renders an individual contribution in the GiveDrawer
export const Contribution = ({
  contribution,
}: {
  contribution: Contributions[number];
}) => {
  return (
    <Box
      css={{
        mb: '$xs',
        p: '$md $sm',
        borderBottom: '1px solid $border',
      }}
    >
      <Text p css={{ lineHeight: '$shorter' }}>
        {contribution.description}
      </Text>
    </Box>
  );
};
