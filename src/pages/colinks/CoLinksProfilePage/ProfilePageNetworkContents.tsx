import { useContext, useState } from 'react';

import { isAddress } from 'ethers/lib/utils';
import { BuyOrSellCoLinks } from 'features/colinks/BuyOrSellCoLinks';
import { CoLinksContext } from 'features/colinks/CoLinksContext';
import { LinkHolders } from 'features/colinks/LinkHolders';
import { LinkHoldings } from 'features/colinks/LinkHoldings';
import { RecentCoLinkTransactions } from 'features/colinks/RecentCoLinkTransactions';
import { RightColumnSection } from 'features/colinks/RightColumnSection';
import { SimilarProfiles } from 'features/colinks/SimilarProfiles';
import { useLinkingStatus } from 'features/colinks/useLinkingStatus';
import { useParams } from 'react-router-dom';

import { NotFound } from '../NotFound';
import useMobileDetect from 'hooks/useMobileDetect';
import { BarChart, Briefcase, Links, Users } from 'icons/__generated';
import { ProfileNetwork } from 'pages/GiveParty/ProfileNetwork';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Box, Button, Flex, Panel, Text } from 'ui';

import { ProfileCards, cardMaxWidth } from './ProfileCards';

const LINK_HOLDERS_LIMIT = 5;
const LINKS_HOLDING_LIMIT = 5;

export const ProfilePageNetworkContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
  const { address } = useContext(CoLinksContext);

  if (!isAddress(targetAddress) && !targetAddress.endsWith('.eth')) {
    return <NotFound />;
  }

  return (
    <PageContents currentUserAddress={address} targetAddress={targetAddress} />
  );
};

export const PageContents = ({
  currentUserAddress,
  targetAddress,
}: {
  currentUserAddress?: string;
  targetAddress: string;
}) => {
  const { address } = useParams();
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const { balance, targetBalance } = useLinkingStatus({
    address: currentUserAddress,
    target: targetAddress,
  });
  const { isMobile } = useMobileDetect();

  const ownedByTarget = targetBalance !== undefined && targetBalance > 0;
  const ownedByMe = balance !== undefined && balance > 0;
  const weAreLinked = ownedByTarget || ownedByMe;

  if (!address) {
    return <Box>address query param required</Box>;
  }

  return (
    <Flex
      css={{
        alignItems: 'flex-start',
        gap: '$xl',
        '@sm': {
          flexDirection: 'column ',
        },
      }}
    >
      <Flex
        css={{
          margin: '0 auto',
        }}
      >
        <ProfileNetwork targetAddress={targetAddress} />
      </Flex>
      <Flex column css={{ gap: '$md', width: cardMaxWidth, margin: '0 auto' }}>
        <ProfileCards targetAddress={targetAddress} />
        {isMobile && (
          <Panel
            noBorder
            css={{ gap: '$md', alignItems: 'center', flexDirection: 'row' }}
          >
            <Links fa size="2xl" />
            <BuyOrSellCoLinks
              small
              css={{ flexGrow: 1, width: 'auto' }}
              subject={targetAddress}
              address={currentUserAddress}
              hideTitle={false}
              constrainWidth={false}
            />
          </Panel>
        )}
        {!weAreLinked ? (
          <ProfileLinkDetails targetAddress={targetAddress} />
        ) : (
          <>
            <Button
              onClick={() => setShowProfileDetails(prev => !prev)}
              css={{ width: '100%' }}
            >
              {showProfileDetails ? 'Hide' : 'Show'} Network Details
            </Button>
            {showProfileDetails && (
              <>
                <ProfileLinkDetails targetAddress={targetAddress} />
              </>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};

const ProfileLinkDetails = ({ targetAddress }: { targetAddress: string }) => {
  return (
    <>
      <LinkHolders target={targetAddress} limit={LINK_HOLDERS_LIMIT}>
        {(
          list: React.ReactNode,
          counts?: { link_holders: number; total_links: number }
        ) => (
          <RightColumnSection
            title={
              <Flex css={{ justifyContent: 'space-between', width: '100%' }}>
                <Text
                  as={AppLink}
                  to={coLinksPaths.holders(targetAddress)}
                  color={'default'}
                  semibold
                >
                  <Users /> {counts?.link_holders} Link Holders
                </Text>
                <Text
                  as={AppLink}
                  to={coLinksPaths.holders(targetAddress)}
                  color={'default'}
                  semibold
                >
                  {counts?.total_links} Total Links
                </Text>
              </Flex>
            }
          >
            <Flex column css={{ width: '100%' }}>
              {list}
              {counts?.link_holders &&
                counts.link_holders > LINK_HOLDERS_LIMIT && (
                  <Flex css={{ justifyContent: 'flex-end' }}>
                    <AppLink to={coLinksPaths.holders(targetAddress)}>
                      <Text size="xs">
                        View all {counts.link_holders} Holders
                      </Text>
                    </AppLink>
                  </Flex>
                )}
            </Flex>
          </RightColumnSection>
        )}
      </LinkHolders>
      <LinkHoldings holder={targetAddress} limit={LINKS_HOLDING_LIMIT}>
        {(list: React.ReactNode, heldCount?: number) => (
          <RightColumnSection
            title={
              <Text
                as={AppLink}
                to={coLinksPaths.holdings(targetAddress)}
                color={'default'}
                semibold
              >
                <Briefcase /> Holding {heldCount} Link
                {heldCount == 1 ? '' : 's'}
              </Text>
            }
          >
            <Flex column css={{ width: '100%' }}>
              {list}
              {heldCount && heldCount > LINKS_HOLDING_LIMIT && (
                <Flex css={{ justifyContent: 'flex-end' }}>
                  <AppLink to={coLinksPaths.holdings(targetAddress)}>
                    <Text size="xs">View all {heldCount} Holdings</Text>
                  </AppLink>
                </Flex>
              )}
            </Flex>
          </RightColumnSection>
        )}
      </LinkHoldings>
      <RightColumnSection
        title={
          <Flex as={AppLink} to={coLinksPaths.history(targetAddress)}>
            <Text color={'default'} semibold>
              <BarChart /> Recent Linking Activity
            </Text>
          </Flex>
        }
      >
        <RecentCoLinkTransactions target={targetAddress} limit={5} />
      </RightColumnSection>
      <SimilarProfiles address={targetAddress} />
    </>
  );
};
