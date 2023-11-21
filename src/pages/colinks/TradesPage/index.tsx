import { isFeatureEnabled } from '../../../config/features';
import { CoLinksHistory } from '../../../features/colinks/CoLinksHistory';
import { ContentHeader, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

export const TradesPage = () => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Text h2 display>
          Last 100 Link Trades
        </Text>
      </ContentHeader>
      <CoLinksHistory />
    </SingleColumnLayout>
  );
};
