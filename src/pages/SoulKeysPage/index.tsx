import { isFeatureEnabled } from '../../config/features';
import { useLoginData } from '../../features/auth';
import { CoSoulGate } from '../../features/cosoul/CoSoulGate';
import { BuyOrSellSoulKeys } from '../../features/soulkeys/BuyOrSellSoulKeys';
import { CoSoulChainGate } from '../../features/soulkeys/CoSoulChainGate';
import { SoulKeyHistory } from '../../features/soulkeys/SoulKeyHistory';
import { Flex } from '../../ui';

export const SoulKeysPage = () => {
  const profile = useLoginData();
  const address = profile?.address;

  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  if (!address) {
    // FIXME: this shouldn't happen why do we allow this
    return <>Must be Logged In to View SoulKeys</>;
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
                  <BuyOrSellSoulKeys
                    subject={address}
                    address={currentUserAddress}
                    contracts={contracts}
                  />
                  <SoulKeyHistory subject={currentUserAddress} />
                </Flex>
              )}
            </CoSoulGate>
          )}
        </CoSoulChainGate>
      </Flex>
    </Flex>
  );
};
