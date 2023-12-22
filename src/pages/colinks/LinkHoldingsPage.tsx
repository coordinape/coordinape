import React from 'react';

import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import { CoLinksBasicProfileHeader } from '../../features/colinks/CoLinksBasicProfileHeader';
import { LinkHoldings } from '../../features/colinks/LinkHoldings';
import { Briefcase } from '../../icons/__generated';
import { Flex, Panel, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const LinkHoldingsPage = () => {
  const { address } = useParams();

  if (!address) {
    return <Panel>Missing address</Panel>;
  }

  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Holdings / CoLinks</title>
      </Helmet>
      <CoLinksBasicProfileHeader address={address} title={'Link Holdings'} />
      <LinkHoldings holder={address} limit={500}>
        {(list: React.ReactNode, heldCount?: number) => (
          <Flex column css={{ gap: '$lg' }}>
            <Text h1 css={{ gap: '$md' }}>
              <Briefcase size={'xl'} /> Holds {heldCount} Link
              {heldCount == 1 ? '' : 's'}
            </Text>
            {list}
          </Flex>
        )}
      </LinkHoldings>
    </SingleColumnLayout>
  );
};
