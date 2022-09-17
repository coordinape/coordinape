import React from 'react';

import CopyCodeTextField from '../../components/CopyCodeTextField';
import { AlertTriangle } from '../../icons/__generated';
import { Box, Flex, Panel, Text } from '../../ui';

const MagicLink = ({ magicLink }: { magicLink: string }) => {
  return (
    <Box>
      <Flex css={{ alignItems: 'center', mb: '$xs' }}>
        <Text variant="label">Magic Circle Link</Text>
      </Flex>
      <CopyCodeTextField value={magicLink} />

      <Panel alert css={{ mt: '$xl', mb: '$md' }}>
        <Flex>
          <AlertTriangle
            color="alert"
            size="xl"
            css={{
              mr: '$md',
              '& path': { stroke: 'none' },
              flexShrink: 0,
            }}
          />
          <Text size="large">
            Anyone with this link can join this circle and set their name. For
            added security, add new members using their wallet addresses.
          </Text>
        </Flex>
      </Panel>
    </Box>
  );
};

export default MagicLink;
