import { isFeatureEnabled } from '../../config/features';
import { CoSoulGate } from '../../features/cosoul/CoSoulGate';
import { CoSoulChainGate } from '../../features/soulkeys/CoSoulChainGate';
import { SoulKeyHistory } from '../../features/soulkeys/SoulKeyHistory';
import { ContentHeader, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const SoulKeysTradesPage = () => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <CoSoulChainGate actionName="Use SoulKeys">
      {(contracts, currentUserAddress) => (
        <CoSoulGate
          contracts={contracts}
          address={currentUserAddress}
          message={'to Use SoulKeys'}
        >
          {() => <PageContents />}
        </CoSoulGate>
      )}
    </CoSoulChainGate>
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
