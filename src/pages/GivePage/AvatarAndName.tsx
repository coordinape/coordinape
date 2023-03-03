import React from 'react';

import { Avatar, Flex, Text } from '../../ui';

// AvatarAndName renders the avatar and a member name for inclusion in a GiveRow
export const AvatarAndName = ({
  name,
  avatar,
  roleCoordinape,
}: {
  name: string;
  avatar?: string;
  roleCoordinape?: boolean;
}) => {
  return (
    <Flex
      alignItems="center"
      css={{
        flexGrow: 0,
        minWidth: 0,
      }}
    >
      <Avatar
        size="small"
        name={name}
        roleCoordinape={roleCoordinape}
        path={avatar}
        css={{ mr: '$sm' }}
      />
      <Text ellipsis>
        {roleCoordinape && 'Support '}
        {name}
      </Text>
    </Flex>
  );
};
