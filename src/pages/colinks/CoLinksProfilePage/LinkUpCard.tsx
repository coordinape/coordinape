import { useContext, useEffect, useState } from 'react';

import { BuyOrSellCoLinks } from 'features/colinks/BuyOrSellCoLinks';
import { CoLinksContext } from 'features/colinks/CoLinksContext';
import { useLinkingStatus } from 'features/colinks/useLinkingStatus';

import { LoadingIndicator } from 'components/LoadingIndicator';
import { Flex, Text, Panel, Link } from 'ui';

export const LinkUpCard = ({ targetAddress }: { targetAddress: string }) => {
  const { address: currentUserAddress } = useContext(CoLinksContext);
  const { balance, targetBalance } = useLinkingStatus({
    address: currentUserAddress,
    target: targetAddress,
  });
  const targetIsCurrentUser =
    currentUserAddress &&
    targetAddress.toLowerCase() == currentUserAddress.toLowerCase();

  const [needsToBuyLink, setNeedsToBuyLink] = useState<boolean | undefined>(
    undefined
  );
  const balanceNumber = Number(balance);
  const needsBootstrapping = targetIsCurrentUser && balanceNumber == 0;

  useEffect(() => {
    if (balance !== undefined) {
      setNeedsToBuyLink(balanceNumber === 0);
    }
  }, [balance]);

  return (
    <>
      {needsToBuyLink === true ? (
        <Flex
          css={{
            alignItems: 'center',
            borderRadius: '$3',
            background: '$surface',
            overflow: 'clip',
            '@sm': { flexDirection: 'column' },
          }}
        >
          <Flex
            css={{
              flexGrow: 1,
              height: '100%',
              minHeight: '200px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom',
              backgroundSize: 'cover',
              backgroundImage: "url('/imgs/background/colink-other.jpg')",
              '@sm': {
                width: '100%',
                minHeight: '260px',
                height: 'auto',
              },
            }}
          ></Flex>

          <Panel
            css={{
              flex: 2,
              p: 0,
              border: 'none',
              borderRadius: 0,
            }}
          >
            <Flex
              css={{
                p: '$lg $md $sm',
                gap: '$sm',
                alignItems: 'center',
              }}
              column
            >
              <Text semibold>
                {targetBalance === undefined ? (
                  <LoadingIndicator />
                ) : targetBalance > 0 ? (
                  <Flex column css={{ alignItems: 'center', gap: '$xs' }}>
                    <Text size="large" semibold>
                      Owns Your Link
                    </Text>
                    <Text>Buy theirs to become Mutual Friends</Text>
                  </Flex>
                ) : (
                  <Flex column css={{ alignItems: 'center', gap: '$xs' }}>
                    <Text size="large" semibold>
                      Link Up
                    </Text>
                    <Text>{`Connect to see each other's posts`}</Text>
                  </Flex>
                )}
              </Text>
            </Flex>
            <Flex css={{ p: '$md $md' }}>
              <BuyOrSellCoLinks
                css={{ alignItems: 'center' }}
                subject={targetAddress}
                address={currentUserAddress}
                hideTitle={true}
                constrainWidth={true}
              />
            </Flex>
          </Panel>
        </Flex>
      ) : (
        <Panel
          css={{
            border: 'none',
            display: 'none',
            '@tablet': { display: 'block', width: '100%' },
          }}
        >
          <Flex column css={{ width: '100%' }}>
            <BuyOrSellCoLinks
              subject={targetAddress}
              address={currentUserAddress}
            />
            {needsBootstrapping && (
              <Panel info css={{ mt: '$lg', gap: '$md' }}>
                <Text inline>
                  <strong>Buy your first Link</strong> to allow other CoLink
                  holders to buy your Link.
                </Text>
                <Text>
                  Your link holders will gain access to X. You will receive Y%
                  of the price when they buy or sell.
                </Text>
                <Text>
                  <Link> Learn More about Links</Link>
                </Text>
              </Panel>
            )}
          </Flex>
        </Panel>
      )}
    </>
  );
};
