import { isFeatureEnabled } from '../../../config/features';
import { CoLinksChainGate } from '../../../features/colinks/CoLinksChainGate';
import { CoLinksHistory } from '../../../features/colinks/CoLinksHistory';
import { CoSoulGate } from '../../../features/cosoul/CoSoulGate';
import { ContentHeader, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

export const TradesPage = () => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <CoLinksChainGate actionName="Use CoLinks">
      {(contracts, currentUserAddress) => (
        <CoSoulGate
          contracts={contracts}
          address={currentUserAddress}
          message={'to Use CoLinks'}
        >
          {() => <PageContents />}
        </CoSoulGate>
      )}
    </CoLinksChainGate>
  );
};

const PageContents = () => {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Text h2 display>
          Last 100 Key Trades
        </Text>
      </ContentHeader>
      <CoLinksHistory />
    </SingleColumnLayout>
  );
};
