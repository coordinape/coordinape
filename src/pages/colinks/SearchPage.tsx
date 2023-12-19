import { useEffect, useState } from 'react';

import { LeaderboardProfileResults } from 'features/colinks/LeaderboardProfileResults';
import { PostResults } from 'features/colinks/PostResults';
import { SearchBox } from 'features/SearchBox/SearchBox';
import { useNavigate, useParams } from 'react-router-dom';

import { coLinksPaths } from '../../routes/paths';
import { Text, ContentHeader, Flex } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

import TabButton, { Tab } from './explore/TabButton';

const PROFILES = 'profiles';
export const POSTS = 'posts';

export const SearchPage = () => {
  const { query, model: initialModel } = useParams();
  const [currentTab, setCurrentTab] = useState<Tab>(
    initialModel === POSTS ? Tab.POSTS : Tab.PROFILES
  );

  const navigate = useNavigate();

  useEffect(() => {
    let model: string;
    if (query) {
      if (currentTab === Tab.PROFILES) {
        model = PROFILES;
      } else {
        model = POSTS;
      }
      navigate(coLinksPaths.searchResult(query, model));
    }
  }, [currentTab, initialModel]);

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
        <Flex column css={{ gap: '$md' }}>
          <Text h2 display>
            Search Results
          </Text>
          <SearchBox size="large" placeholder={query} />
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
                <TabPosts />
                <TabProfiles />
              </Flex>
            </Flex>
            {currentTab === Tab.PROFILES && (
              <Flex column css={{ gap: '$md' }}>
                <LeaderboardProfileResults
                  whereName={`%${query?.toLowerCase()}%` || ''}
                />
              </Flex>
            )}
            {currentTab === Tab.POSTS && (
              <Flex column css={{ gap: '$md' }}>
                <PostResults query={query} />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
