import React from 'react';

import capitalize from 'lodash/capitalize';

import CopyCodeTextField from '../../components/CopyCodeTextField';
import { AlertTriangle } from '../../icons/__generated';
import { Box, Flex, Panel, Text } from '../../ui';

const InviteLink = ({
  inviteLink,
  groupType,
}: {
  inviteLink: string;
  groupType: 'circle' | 'organization';
}) => {
  return (
    <Box>
      <Flex alignItems="center" css={{ mb: '$xs' }}>
        <Text variant="label">{capitalize(groupType)} Invite Link</Text>
      </Flex>
      <CopyCodeTextField value={inviteLink} />

      <Panel alert css={{ mt: '$xl', mb: '$md' }}>
        <Flex alignItems="center">
          <AlertTriangle
            size="lg"
            css={{
              mr: '$md',
              flexShrink: 0,
            }}
          />
          <Text color="inherit">
            Anyone with this link can join this {groupType}. For added security,
            add new members using their wallet addresses.
          </Text>
        </Flex>
      </Panel>
    </Box>
  );
};

export default InviteLink;
