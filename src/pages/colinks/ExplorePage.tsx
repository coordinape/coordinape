import { useState } from 'react';

import { LeaderboardMostGive } from 'features/colinks/LeaderboardMostGive';
import { LeaderboardMostGiven } from 'features/colinks/LeaderboardMostGiven';
import { artWidthMobile } from 'features/cosoul/constants';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import { LeaderboardHoldingMost } from '../../features/colinks/LeaderboardHoldingMost';
import { LeaderboardMostLinks } from '../../features/colinks/LeaderboardMostLinks';
import { LeaderboardNewest } from '../../features/colinks/LeaderboardNewest';
import { LeaderboardRepScore } from '../../features/colinks/LeaderboardRepScore';
import { RecentCoLinkTransactions } from '../../features/colinks/RecentCoLinkTransactions';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';
import { BarChart } from 'icons/__generated';

import TabButton, { Tab } from './explore/TabButton';

export const ExplorePage = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.NEWEST);

  const makeTab = (tab: Tab, content: string) => {
    const TabComponent = () => (
      <TabButton size="xs" tab={tab} {...{ currentTab, setCurrentTab }}>
        {content}
      </TabButton>
    );
    TabComponent.displayName = `TabComponent(${content})`;
    return TabComponent;
  };

  const TabNewest = makeTab(Tab.NEWEST, 'Newest');
  const TabMostLinks = makeTab(Tab.MOST_LINKS, 'Most Links');
  const TabHoldingMost = makeTab(Tab.MOST_HOLDING, 'Holding Most Links');
  const TabHighestRepScore = makeTab(Tab.MOST_REPUTABLE, 'Highest Rep Score');
  const TabMostGive = makeTab(Tab.MOST_GIVE, 'Most GIVE Received');
  const TabMostGiven = makeTab(Tab.MOST_GIVEN, 'Most GIVE Given');

  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Explore / Coordinape</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text inline>
            Who <i>are</i> these people?
          </Text>
        </Flex>
      </ContentHeader>
      <Flex column css={{ mb: '$4xl', gap: '$2xl' }}>
        <Flex
          css={{
            gap: '$xl',
            '@tablet': {
              flexWrap: 'wrap',
            },
          }}
        >
          <Flex
            column
            css={{
              gap: '$md',
              flexGrow: 1,
              maxWidth: '$readable',
            }}
          >
            <Flex css={{ gap: '$md' }}>
              <Flex
                css={{ flexWrap: 'wrap', gap: '$sm', mb: '$sm', flexGrow: 1 }}
              >
                <TabNewest />
                <TabMostLinks />
                <TabHoldingMost />
                <TabHighestRepScore />
                <TabMostGive />
                <TabMostGiven />
              </Flex>
              <Flex css={{ justifyContent: 'flex-end', flexShrink: 0 }}>
                <TabLink currentTab={currentTab} />
              </Flex>
            </Flex>
            {currentTab === Tab.NEWEST && (
              <Flex column css={{ gap: '$md' }}>
                <LeaderboardNewest limit={5} />
                <Flex column css={{ alignItems: 'flex-end' }}>
                  <TabLink currentTab={currentTab} />
                </Flex>
              </Flex>
            )}
            {currentTab === Tab.MOST_LINKS && (
              <Flex column css={{ gap: '$md' }}>
                <LeaderboardMostLinks limit={5} />
                <Flex column css={{ alignItems: 'flex-end' }}>
                  <TabLink currentTab={currentTab} />
                </Flex>
              </Flex>
            )}
            {currentTab === Tab.MOST_HOLDING && (
              <Flex column css={{ gap: '$md' }}>
                <LeaderboardHoldingMost limit={5} />
                <Flex column css={{ alignItems: 'flex-end' }}>
                  <TabLink currentTab={currentTab} />
                </Flex>
              </Flex>
            )}
            {currentTab === Tab.MOST_REPUTABLE && (
              <Flex column css={{ gap: '$md' }}>
                <LeaderboardRepScore limit={5} />
                <Flex column css={{ alignItems: 'flex-end' }}>
                  <TabLink currentTab={currentTab} />
                </Flex>
              </Flex>
            )}
            {currentTab === Tab.MOST_GIVE && (
              <Flex column css={{ gap: '$md' }}>
                <LeaderboardMostGive limit={5} />
                <Flex column css={{ alignItems: 'flex-end' }}>
                  <TabLink currentTab={currentTab} />
                </Flex>
              </Flex>
            )}
            {currentTab === Tab.MOST_GIVEN && (
              <Flex column css={{ gap: '$md' }}>
                <LeaderboardMostGiven limit={5} />
                <Flex column css={{ alignItems: 'flex-end' }}>
                  <TabLink currentTab={currentTab} />
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex column css={{ gap: '$xl', maxWidth: `${artWidthMobile}` }}>
            <Text
              as={NavLink}
              to={coLinksPaths.linking}
              h2
              semibold
              css={{ textDecoration: 'none', color: '$text' }}
            >
              <Flex
                css={{
                  // justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '$md',
                  width: '100%',
                }}
              >
                <BarChart /> Linking Activity
                <Text size="xs" color={'cta'}>
                  View More
                </Text>
              </Flex>
            </Text>

            <RecentCoLinkTransactions limit={14} />
          </Flex>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};

const TabLink = ({ currentTab }: { currentTab: Tab }) => {
  return (
    <Text
      as={AppLink}
      to={
        currentTab === Tab.MOST_LINKS
          ? coLinksPaths.exploreMostLinks
          : currentTab === Tab.MOST_HOLDING
            ? coLinksPaths.exploreHoldingMost
            : currentTab === Tab.NEWEST
              ? coLinksPaths.exploreNewest
              : currentTab === Tab.MOST_GIVE
                ? coLinksPaths.exploreMostGive
                : currentTab === Tab.MOST_GIVEN
                  ? coLinksPaths.exploreMostGiven
                  : coLinksPaths.exploreRepScore
      }
      semibold
      h2
      css={{
        textDecoration: 'none',
        color: '$text',
      }}
    >
      <Text size="xs" color={'cta'}>
        View More
      </Text>
    </Text>
  );
};
