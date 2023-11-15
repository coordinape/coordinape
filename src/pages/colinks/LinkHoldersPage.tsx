import React from 'react';

import { useParams } from 'react-router-dom';

import { CoLinksBasicProfileHeader } from '../../features/colinks/CoLinksBasicProfileHeader';
import { LinkHolders } from '../../features/colinks/LinkHolders';
import { Users } from '../../icons/__generated';
import { Flex, Panel, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const LinkHoldersPage = () => {
  const { address } = useParams();

  if (!address) {
    return <Panel>Missing address</Panel>;
  }

  return (
    <SingleColumnLayout>
      <CoLinksBasicProfileHeader address={address} title={'Link Holders'} />
      <LinkHolders target={address}>
        {(
          list: React.ReactNode,
          counts?: { link_holders: number; total_links: number }
        ) => (
          <Flex column css={{ gap: '$lg' }}>
            <Text h1 css={{ gap: '$lg' }}>
              <Users size={'xl'} />
              <Flex>
                {counts?.link_holders} Link Holder
                {counts?.link_holders == 1 ? '' : 's'}
              </Flex>
              <Flex>
                {counts?.total_links} Total Link
                {counts?.total_links == 1 ? '' : 's'}
              </Flex>
            </Text>
            {list}
          </Flex>
        )}
      </LinkHolders>
    </SingleColumnLayout>
  );
};
