import { useContext, useEffect, useState } from 'react';

import { BuyOrSellCoLinks } from 'features/colinks/BuyOrSellCoLinks';
import { CoLinksContext } from 'features/colinks/CoLinksContext';
import { useLinkingStatus } from 'features/colinks/useLinkingStatus';

import { LoadingIndicator } from 'components/LoadingIndicator';
import { Links } from 'icons/__generated';
import { Flex, Text, Panel, Link } from 'ui';

import { cardMinHeight } from './ProfileCards';

export const LinkUpCard = ({
  targetAddress,
  profileCard = false,
}: {
  targetAddress: string;
  profileCard?: boolean;
}) => {
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
            '@sm': {
              flexDirection: 'column',
            },
            ...(profileCard && {
              flexDirection: 'row',
              width: '100%',
            }),
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
              ...(profileCard && {
                flexDirection: 'row',
                height: '100%',
                width: 'auto',
                minHeight: cardMinHeight,
              }),
            }}
          ></Flex>

          <Panel
            css={{
              flex: profileCard ? undefined : 2,
              p: 0,
              border: 'none',
              borderRadius: 0,
              ...(profileCard && {
                alignItems: 'flex-start',
              }),
            }}
          >
            <Flex
              css={{
                p: '$lg $md $sm',
                gap: '$sm',
                alignItems: 'center',
                ...(profileCard && {
                  p: '$sm $md $sm',
                }),
              }}
              column
            >
              <Text semibold>
                {targetBalance === undefined ? (
                  <LoadingIndicator />
                ) : targetBalance > 0 ? (
                  <Flex
                    column
                    css={{
                      alignItems: 'center',
                      gap: '$xs',
                      ...(profileCard && {
                        alignItems: 'flex-start',
                      }),
                    }}
                  >
                    <Text size={profileCard ? 'medium' : 'large'} semibold>
                      Owns Your Link
                    </Text>
                    <Text size={profileCard ? 'small' : undefined}>
                      Buy theirs to become Mutual Friends
                    </Text>
                  </Flex>
                ) : (
                  <Flex
                    column
                    css={{
                      alignItems: 'center',
                      gap: '$xs',
                      ...(profileCard && {
                        alignItems: 'flex-start',
                      }),
                    }}
                  >
                    <Text size={profileCard ? 'medium' : 'large'} semibold>
                      Link Up
                    </Text>
                    <Text
                      size={profileCard ? 'small' : undefined}
                    >{`Connect to see each other's posts`}</Text>
                  </Flex>
                )}
              </Text>
            </Flex>
            <Flex
              css={{
                p: '$md $md',
                ...(profileCard && {
                  p: '0 $md $sm',
                  width: '100%',
                }),
              }}
            >
              <BuyOrSellCoLinks
                small={profileCard}
                css={{
                  alignItems: profileCard ? 'flex-start' : 'center',
                }}
                subject={targetAddress}
                address={currentUserAddress}
                hideTitle={true}
                constrainWidth={!profileCard}
              />
            </Flex>
          </Panel>
        </Flex>
      ) : (
        <Panel
          noBorder
          css={{
            display: 'none',
            gap: '$md',
            alignItems: 'center',
            flexDirection: 'row',
            '@tablet': { display: 'block', width: '100%' },
            ...(profileCard && {
              display: 'flex',
              width: '100%',
            }),
          }}
        >
          <Links fa size="2xl" />
          <Flex column css={{ flexGrow: 1 }}>
            <BuyOrSellCoLinks
              small={profileCard}
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
