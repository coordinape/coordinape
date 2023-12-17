/* eslint-disable no-console */
import { useEffect, useState } from 'react';

import { LeaderboardProfileResults } from 'features/colinks/LeaderboardProfileResults';
import { PostResultsBoard } from 'features/colinks/PostResultsBoard';
import { useNavigate, useParams } from 'react-router-dom';

import { coLinksPaths } from '../../routes/paths';
import { ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

import TabButton, { Tab } from './explore/TabButton';

export const SearchPage = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.POSTS);

  const { query, model: initialModel } = useParams();
  const [model, setModel] = useState<string | undefined>(initialModel);

  const navigate = useNavigate();

  useEffect(() => {
    if (query && model) {
      if (currentTab === Tab.PROFILES) {
        setModel('profiles');
      } else if (currentTab === Tab.POSTS) {
        setModel('posts');
      }
      navigate(coLinksPaths.searchResult(query, model));
    }
  }, [currentTab, model]);

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
                <PostResultsBoard query={query} />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
