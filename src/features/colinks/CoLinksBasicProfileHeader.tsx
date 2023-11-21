import React from 'react';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, Avatar, ContentHeader, Flex, Panel, Text } from '../../ui';

import { useCoLinksBasicProfile } from './useCoLinksBasicProfile';

export const CoLinksBasicProfileHeader = ({
  address,
  title,
}: {
  address: string;
  title: string;
}) => {
  const { data, isLoading } = useCoLinksBasicProfile(address);

  if (isLoading && data === undefined) {
    return <LoadingIndicator />;
  }
  if (data === undefined) {
    return <Panel>User not found</Panel>;
  }
  return (
    <ContentHeader>
      <Flex as={AppLink} to={coLinksPaths.profile(address)}>
        <Flex alignItems="center" css={{ gap: '$sm' }}>
          <Avatar
            size="large"
            name={data.name}
            path={data.avatar}
            margin="none"
            css={{ mr: '$sm' }}
          />
          <Flex column>
            <Text h2 display css={{ color: '$secondaryButtonText' }}>
              {data.name}
            </Text>
            <Text color={'default'}>{title}</Text>
          </Flex>
        </Flex>
      </Flex>
    </ContentHeader>
  );
};
