import { isFeatureEnabled } from '../../config/features';
import { CoSoulGate } from '../../features/cosoul/CoSoulGate';
import { CoSoulChainGate } from '../../features/soulkeys/CoSoulChainGate';
import { SoulKeyHistory } from '../../features/soulkeys/SoulKeyHistory';
import { Flex } from '../../ui';

export const SoulKeysTradesPage = () => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <Flex css={{ justifyContent: 'center' }}>
      <Flex column css={{ maxWidth: '$readable' }}>
        <CoSoulChainGate actionName="Use SoulKeys">
          {(contracts, currentUserAddress) => (
            <CoSoulGate
              contracts={contracts}
              address={currentUserAddress}
              message={'to Use SoulKeys'}
            >
              {() => (
                <Flex column css={{ gap: '$xl' }}>
                  <h3>Last 100 Trades</h3>
                  <SoulKeyHistory />
                </Flex>
              )}
            </CoSoulGate>
          )}
        </CoSoulChainGate>
      </Flex>
    </Flex>
  );
};
