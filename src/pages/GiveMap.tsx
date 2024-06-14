import { Box } from 'ui';

import { GiveGraph } from './NetworkViz/GiveGraph';

export const GiveMap = () => {
  return (
    <Box
      css={{
        background:
          'radial-gradient(circle at 25% 0%, #7516BF 30%, #00AEF9 100%)',
      }}
    >
      <GiveGraph />;
    </Box>
  );
};
