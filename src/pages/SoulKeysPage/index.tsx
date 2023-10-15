import { useLoginData } from '../../features/auth';
import { CoSoulGate } from '../../features/cosoul/CoSoulGate';
import { BuyOrSellSoulKeys } from '../../features/soulkeys/BuyOrSellSoulKeys';
import { CoSoulChainGate } from '../../features/soulkeys/CoSoulChainGate';
import { Flex } from '../../ui';

export const SoulKeysPage = () => {
  const profile = useLoginData();
  const address = profile?.address;

  if (!address) {
    // FIXME: this shouldn't happen why do we allow this
    return <>Must be Logged In to View SoulKeys</>;
  }

  return (
    <Flex css={{ justifyContent: 'center' }}>
      <Flex column css={{ maxWidth: '$readable' }}>
        <h1>SoulKeysPage</h1>
        <CoSoulChainGate actionName="Use SoulKeys">
          {(contracts, currentUserAddress) => (
            <CoSoulGate
              contracts={contracts}
              address={currentUserAddress}
              message={'to Use SoulKeys'}
            >
              {() => (
                <BuyOrSellSoulKeys
                  subject={address}
                  address={currentUserAddress}
                  contracts={contracts}
                />
              )}
            </CoSoulGate>
          )}
        </CoSoulChainGate>
      </Flex>
    </Flex>
  );
};
