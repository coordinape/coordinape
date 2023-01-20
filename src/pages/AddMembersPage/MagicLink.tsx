import React from 'react';

import CopyCodeTextField from '../../components/CopyCodeTextField';
import { AlertTriangle } from '../../icons/__generated';
import { Box, Flex, Panel, Text } from '../../ui';

const MagicLink = ({ magicLink }: { magicLink: string }) => {
  return (
    <Box>
      <Flex alignItems="center" css={{ mb: '$xs' }}>
        <Text variant="label">Magic Circle Link</Text>
      </Flex>
      <CopyCodeTextField value={magicLink} />

      <Panel alert css={{ mt: '$xl', mb: '$md' }}>
        <Flex alignItems="center">
          <AlertTriangle
            size="lg"
            css={{
              mr: '$md',
            }}
          />
          <Text>
            Anyone with this link can join this circle and set their name. For
            added security, add new members using their wallet addresses.
          </Text>
        </Flex>
      </Panel>
    </Box>
  );
};

export default MagicLink;
