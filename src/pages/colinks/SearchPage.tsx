import { useEffect, useState } from 'react';

import { LeaderboardProfileResults } from 'features/colinks/LeaderboardProfileResults';
import { PostResults } from 'features/colinks/PostResults';
import { SearchBox } from 'features/SearchBox/SearchBox';
import { useNavigate, useParams } from 'react-router-dom';

import { coLinksPaths } from '../../routes/paths';
import { ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

import { Skills } from './explore/Skills';
import TabButton, { Tab } from './explore/TabButton';

const PROFILES = 'profiles';
export const POSTS = 'posts';
const INTERESTS = 'interests';

export const SearchPage = () => {
  const { query, model: initialModel } = useParams();

  const [currentTab, setCurrentTab] = useState<Tab>(getTab(initialModel));
  const navigate = useNavigate();

  useEffect(() => {
    let model: string;
    if (query) {
      switch (currentTab) {
        case Tab.PROFILES:
          model = PROFILES;
          break;
        case Tab.POSTS:
          model = POSTS;
          break;
        case Tab.INTERESTS:
          model = INTERESTS;
          break;
        default:
          model = POSTS;
          break;
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
  const TabProfiles = makeTab(Tab.PROFILES, 'People');
  const TabInterests = makeTab(Tab.INTERESTS, 'Interests');

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$md' }}>
          <Text h2 display>
            Search Results
          </Text>
          <SearchBox size="large" placeholder={query} registerKeyDown={false} />
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
                <TabInterests />
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
            {currentTab === Tab.INTERESTS && <Skills query={query} />}
          </Flex>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};

function getTab(initialModel: string | undefined): Tab {
  switch (initialModel) {
    case PROFILES:
      return Tab.PROFILES;
    case POSTS:
      return Tab.POSTS;
    case INTERESTS:
      return Tab.INTERESTS;
    default:
      return Tab.POSTS;
  }
}
