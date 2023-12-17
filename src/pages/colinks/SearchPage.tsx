/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState } from 'react';

import { LeaderboardProfileResults } from 'features/colinks/LeaderboardProfileResults';
import { PostResultsBoard } from 'features/colinks/PostResultsBoard';
import { SearchResults } from 'features/SearchBox/SearchResults';
import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';

import { LeaderboardHoldingMost } from '../../features/colinks/LeaderboardHoldingMost';
import { RecentCoLinkTransactions } from '../../features/colinks/RecentCoLinkTransactions';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';
import { BarChart, ToolsFill } from 'icons/__generated';

import { Skills } from './explore/Skills';
import TabButton, { Tab } from './explore/TabButton';

export const SearchPage = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.POSTS);

  const { query } = useParams();

  const makeTab = (tab: Tab, content: string) => {
    const TabComponent = () => (
      <TabButton tab={tab} {...{ currentTab, setCurrentTab }}>
        {content}
      </TabButton>
    );
    TabComponent.displayName = `TabComponent(${content})`;
    return TabComponent;
  };

  const TabPosts = makeTab(Tab.POSTS, 'Posts');
  const TabProfiles = makeTab(Tab.PROFILES, 'Profiles');

  const [popoverOpen, setPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = query;

  const searchIsEmpty = search === '';

  // const { data: similarityResults, isFetching: similarityFetching } = useQuery(
  //   ['similarity', JSON.stringify(debouncedSearch)],
  //   async () =>
  //     await fetchSimilarityResults({ search: JSON.stringify(debouncedSearch) }),
  //   {
  //     enabled: debouncedSearch !== '',
  //     staleTime: Infinity,
  //     retry: false,
  //   }
  // );

  // const { data: results, isLoading } = useQuery(
  //   [QUERY_KEY_SEARCH, JSON.stringify(debouncedSearch)],
  //   () =>
  //     fetchSearchResults({
  //       where: {
  //         name: debouncedSearch
  //           ? { _ilike: `%${debouncedSearch}%` }
  //           : undefined,
  //       },
  //       skillsWhere: {
  //         name: debouncedSearch
  //           ? { _ilike: `%${debouncedSearch}%` }
  //           : undefined,
  //       },
  //     }),
  //   {
  //     // staleTime: Infinity,
  //   }
  // );

  // const { data: postResults } = useQuery(
  //   [QUERY_KEY_SEARCH_POSTS, JSON.stringify(debouncedSearch)],
  //   () =>
  //     fetchPostSearchResults({
  //       search: debouncedSearch,
  //     }),
  //   {
  //     // staleTime: Infinity,
  //   }
  // );

  // const onSelectProfile = (address: string) => {
  //   navigate(coLinksPaths.profile(address));
  // };

  // const onSelectInterest = (name: string) => {
  //   navigate(coLinksPaths.exploreSkill(name));
  // };

  // const onSelectPost = (id: string) => {
  //   navigate(coLinksPaths.post(id));
  // };

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display css={{ mb: '$xs' }}>
            Results for {query}
          </Text>
        </Flex>
      </ContentHeader>
      <Flex column css={{ mb: '$4xl', gap: '$2xl' }}>
        <Flex
          css={{
            display: 'grid',
            gap: '$4xl',
            gridTemplateColumns: '2fr 1fr',
          }}
        >
          <Flex column css={{ gap: '$md' }}>
            <Flex css={{ gap: '$md' }}>
              <Flex
                css={{ flexWrap: 'wrap', gap: '$sm', mb: '$sm', flexGrow: 1 }}
              >
                {/* // posts results */}
                <TabPosts />
                {/* // profiles results */}
                <TabProfiles />
              </Flex>
            </Flex>
            {currentTab === Tab.PROFILES && (
              <Flex column css={{ gap: '$md' }}>
                <LeaderboardProfileResults whereName={query || ''} />
              </Flex>
            )}
            {currentTab === Tab.POSTS && (
              <Flex column css={{ gap: '$md' }}>
                Matching posts
                <PostResultsBoard query={query} />
                <Flex column css={{ alignItems: 'flex-end' }}>
                  <TabLink currentTab={currentTab} />
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex column css={{ gap: '$xl' }}>
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
        <Flex column css={{ gap: '$xl', flexGrow: 1 }}>
          <Text
            as={NavLink}
            to={coLinksPaths.exploreSkills}
            h2
            semibold
            css={{ textDecoration: 'none', color: '$text' }}
          >
            <Flex
              css={{
                // justifyContent: 'space-between',
                alignItems: 'center',
                gap: '$sm',
                width: '100%',
              }}
            >
              <ToolsFill size="md" /> Top Interests
              <Text size="xs" color={'cta'}>
                View More
              </Text>
            </Flex>
          </Text>
          <Skills />
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
        currentTab === Tab.POSTS
          ? coLinksPaths.exploreMostLinks
          : currentTab === Tab.PROFILES
          ? coLinksPaths.exploreHoldingMost
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
