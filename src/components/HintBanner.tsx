import React from 'react';

import { styled } from '../stitches.config';
import { Box, Flex, Panel, Text } from '../ui';

const HintBanner = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Panel
      info
      css={{
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gap: '$md',
        mb: '$xl',
        '@sm': { gridTemplateColumns: '1fr' },
      }}
    >
      <Box>
        <Text h2 normal>
          {title}
        </Text>
      </Box>
      <Flex column css={{ width: '65%', '@sm': { width: '100%' } }}>
        {children}
      </Flex>
    </Panel>
  );
};

export default styled(HintBanner);
