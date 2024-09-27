import { useContext, useEffect, useState } from 'react';

import { BuyOrSellCoLinks } from 'features/colinks/BuyOrSellCoLinks';
import { CoLinksContext } from 'features/colinks/CoLinksContext';
import { useLinkingStatus } from 'features/colinks/useLinkingStatus';

import { LoadingIndicator } from 'components/LoadingIndicator';
import { Flex, Link, Panel, Text } from 'ui';

export const LinkUpCard = ({
  targetAddress,
  profileCardContext = false,
}: {
  targetAddress: string;
  profileCardContext?: boolean;
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
            ...(profileCardContext && {
              background: 'transparent',
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
              ...(profileCardContext && {
                display: 'none',
              }),
            }}
          ></Flex>

          <Panel
            css={{
              flex: profileCardContext ? undefined : 2,
              p: 0,
              border: 'none',
              borderRadius: 0,
              width: '100%',
              ...(profileCardContext && {
                background: 'transparent',
                alignItems: 'flex-start',
              }),
            }}
          >
            <Flex
              css={{
                p: '$lg $md $sm',
                gap: '$sm',
                alignItems: 'center',
                ...(profileCardContext && {
                  p: '$sm 0',
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
                      ...(profileCardContext && {
                        alignItems: 'flex-start',
                      }),
                    }}
                  >
                    <Text
                      size={profileCardContext ? 'medium' : 'large'}
                      semibold
                    >
                      Owns Your Link
                    </Text>
                    <Text size={profileCardContext ? 'small' : undefined}>
                      Buy theirs to become Mutual Friends
                    </Text>
                  </Flex>
                ) : (
                  <Flex
                    column
                    css={{
                      alignItems: 'center',
                      gap: '$xs',
                      ...(profileCardContext && {
                        alignItems: 'flex-start',
                      }),
                    }}
                  >
                    <Text
                      size={profileCardContext ? 'medium' : 'large'}
                      semibold
                    >
                      {targetIsCurrentUser ? 'Unlock Your Links' : 'Link Up'}
                    </Text>
                    <Text size={profileCardContext ? 'small' : undefined}>
                      {targetIsCurrentUser
                        ? 'Buy your first Link so others can too'
                        : `Connect to see each other's posts`}
                    </Text>
                  </Flex>
                )}
              </Text>
            </Flex>
            <Flex
              css={{
                p: '$md $md',
                ...(profileCardContext && {
                  p: 0,
                  width: '100%',
                }),
              }}
            >
              <BuyOrSellCoLinks
                small={profileCardContext}
                css={{
                  alignItems: profileCardContext ? 'flex-start' : 'center',
                }}
                subject={targetAddress}
                address={currentUserAddress}
                hideTitle={true}
                constrainWidth={!profileCardContext}
              />
            </Flex>
          </Panel>
        </Flex>
      ) : (
        <Panel
          noBorder
          css={{
            display: 'none',
            alignItems: 'center',
            flexDirection: 'row',
            '@tablet': { display: 'block', width: '100%' },
            ...(profileCardContext && {
              background: 'transparent',
              mt: '$sm',
              p: 0,
              display: 'flex',
              width: '100%',
            }),
          }}
        >
          <Flex column css={{ flexGrow: 1 }}>
            <BuyOrSellCoLinks
              small={profileCardContext}
              subject={targetAddress}
              address={currentUserAddress}
            />
            {needsBootstrapping && (
              <Panel
                info
                css={{
                  mt: '$lg',
                  gap: '$md',
                  ...(profileCardContext && {
                    background: 'transparent',
                  }),
                }}
              >
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
