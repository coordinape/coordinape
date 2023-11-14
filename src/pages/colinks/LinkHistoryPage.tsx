import React from 'react';

import { useParams } from 'react-router-dom';

import { CoLinksBasicProfileHeader } from '../../features/colinks/CoLinksBasicProfileHeader';
import { CoLinksHistory } from '../../features/colinks/CoLinksHistory';
import { Panel } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const LinkHistoryPage = () => {
  const { address } = useParams();

  if (!address) {
    return <Panel>Missing address</Panel>;
  }

  return (
    <SingleColumnLayout>
      <CoLinksBasicProfileHeader address={address} title={'Links History'} />
      <CoLinksHistory target={address} />
    </SingleColumnLayout>
  );
};
