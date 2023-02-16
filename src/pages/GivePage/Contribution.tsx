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
        borderBottom: '0.5px solid $border',
      }}
    >
      <MarkdownPreview display source={contribution.description} />
    </Box>
  );
};
