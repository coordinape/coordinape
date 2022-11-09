/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, MarkdownPreview } from 'ui';

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
        p: '$md $sm',
        borderBottom: '1px solid $border',
      }}
    >
      <MarkdownPreview source={contribution.description} />
    </Box>
  );
};
