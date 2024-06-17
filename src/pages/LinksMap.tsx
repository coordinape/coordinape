import { Box } from 'ui';

import { LinksGraph } from './NetworkViz/LinksGraph';

export const LinksMap = () => {
  return (
    <Box
      css={{
        background:
          'radial-gradient(circle at 25% 0%, #7516BF 30%, #00AEF9 100%)',
      }}
    >
      <LinksGraph />;
    </Box>
  );
};
