import { useParams } from 'react-router-dom';

import { CoLinksBasicProfileHeader } from '../../features/colinks/CoLinksBasicProfileHeader';
import { RecentCoLinkTransactions } from '../../features/colinks/RecentCoLinkTransactions';
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
      <RecentCoLinkTransactions target={address} />
    </SingleColumnLayout>
  );
};
