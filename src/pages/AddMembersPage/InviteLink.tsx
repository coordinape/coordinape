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

      <Panel css={{ mt: '$xl', mb: '$md', backgroundColor: '$cta' }}>
        <Flex alignItems="center">
          <AlertTriangle
            size="lg"
            css={{
              mr: '$md',
              flexShrink: 0,
              color: '$primary',
            }}
          />
          <Text color="primary">
            Please be aware, anyone who has this link can join this {groupType}.
            For added privacy and security, add new members using their wallet
            addresses.
          </Text>
        </Flex>
      </Panel>
    </Box>
  );
};

export default InviteLink;
