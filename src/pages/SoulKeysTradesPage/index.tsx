import { isFeatureEnabled } from '../../config/features';
import { CoSoulGate } from '../../features/cosoul/CoSoulGate';
import { SoulKeyHistory } from '../../features/soulkeys/SoulKeyHistory';
import { SoulKeysChainGate } from '../../features/soulkeys/SoulKeysChainGate';
import { ContentHeader, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const SoulKeysTradesPage = () => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <SoulKeysChainGate actionName="Use SoulKeys">
      {(contracts, currentUserAddress) => (
        <CoSoulGate
          contracts={contracts}
          address={currentUserAddress}
          message={'to Use SoulKeys'}
        >
          {() => <PageContents />}
        </CoSoulGate>
      )}
    </SoulKeysChainGate>
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
      <SoulKeyHistory />
    </SingleColumnLayout>
  );
};
