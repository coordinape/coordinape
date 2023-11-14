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
        {(list: React.ReactNode, heldCount?: number) => (
          <Flex column css={{ gap: '$lg' }}>
            <Text h1 css={{ gap: '$md' }}>
              <Users size={'xl'} /> {heldCount} Link Holder
              {heldCount == 1 ? '' : 's'}
            </Text>
            {list}
          </Flex>
        )}
      </LinkHolders>
    </SingleColumnLayout>
  );
};
