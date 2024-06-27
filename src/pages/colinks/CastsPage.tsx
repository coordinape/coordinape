import { useEffect, useState } from 'react';

import { artWidthMobile } from 'features/cosoul/constants';
import {
  link_holders_select_column,
  order_by,
} from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { LeaderboardMostLinks } from '../../features/colinks/LeaderboardMostLinks';
import { LeaderboardNewest } from '../../features/colinks/LeaderboardNewest';
import { RecentCoLinkTransactions } from '../../features/colinks/RecentCoLinkTransactions';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';
import { BarChart } from 'icons/__generated';

import TabButton, { Tab } from './explore/TabButton';

export const CastsPage = () => {
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

  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Casts / CoLinks</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Casts from CoLinks Community
          </Text>
          <Text inline>
            What <i>are</i> people saying?
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
              </Flex>
              <Flex css={{ justifyContent: 'flex-end', flexShrink: 0 }}>
                <TabLink currentTab={currentTab} />
              </Flex>
            </Flex>
            {currentTab === Tab.NEWEST && (
              <Flex column css={{ gap: '$md' }}>
                <CastsList />
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
          : currentTab === Tab.NEWEST
            ? coLinksPaths.exploreNewest
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

const CastsList = () => {
  const colinks_user_fids = [244292];

  const fetchColinksFids = async () => {
    const { link_holders } = await client.query(
      {
        link_holders: [
          {
            distinct_on: [link_holders_select_column.holder],
            limit: 1000,
          },
          {
            holder_profile_public: {
              farcaster_account: {
                fid: true,
                // followers_count: true,
              },
            },
          },
        ],
      },
      {
        operationName: 'CastsPage__fetchColinksFids @cached(ttl: 300)',
      }
    );

    if (!link_holders) return [];

    return link_holders.map(lh => {
      lh.holder_profile_public?.farcaster_account?.fid;
    });
  };

  const fetchCasts = async () => {
    const { farcaster_casts } = await client.query(
      {
        farcaster_casts: [
          {
            where: { fid: { _in: colinks_user_fids } },
            order_by: [{ created_at: order_by.desc }],
          },
          {
            created_at: true,
            text: true,
            hash: true,
            fid: true,
          },
        ],
      },
      {
        operationName: 'CastsPage__fetchCasts @cached(ttl: 300)',
      }
    );

    return farcaster_casts;
  };

  const { data: fids } = useQuery(['fids'], fetchColinksFids, {
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: casts } = useQuery(['casts'], fetchCasts, {
    enabled: !!fids,
  });

  useEffect(() => {
    console.log({ fids, casts });
  }, [fids, casts]);
};
