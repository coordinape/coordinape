import { SetStateAction } from 'react';

import { Command, useCommandState } from 'cmdk';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useDebounce } from 'usehooks-ts';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { AiLight } from '../../icons/__generated';
import { coLinksPaths } from '../../routes/paths';
import { Avatar, Flex, Text } from '../../ui';
import { SkillTag } from '../colinks/SkillTag';

import { fetchPostSearchResults } from './fetchPostSearchResults';
import { fetchSearchResults } from './fetchSearchResults';
import { fetchSimilarityResults } from './fetchSimilarityResults';
import { PeopleResult } from './PeopleResult';
import { SearchBoxPages } from './SearchBoxPages';

const QUERY_KEY_SEARCH = 'searchBoxQuery';
const QUERY_KEY_SEARCH_POSTS = 'searchBoxQueryPosts';

export const SearchResults = ({
  setPopoverOpen,
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  setPopoverOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const search = useCommandState(state => state.search);
  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();

  const searchIsEmpty = search === '';

  const { data: similarityResults, isFetching: similarityFetching } = useQuery(
    [QUERY_KEY_SEARCH, 'similarity', JSON.stringify(debouncedSearch)],
    async () =>
      await fetchSimilarityResults({ search: JSON.stringify(debouncedSearch) }),
    {
      enabled: debouncedSearch !== '',
      staleTime: Infinity,
      retry: false,
    }
  );

  const { data: results, isLoading } = useQuery(
    [QUERY_KEY_SEARCH, JSON.stringify(debouncedSearch)],
    () =>
      fetchSearchResults({
        where: {
          name: debouncedSearch
            ? { _ilike: `%${debouncedSearch}%` }
            : undefined,
        },
        skillsWhere: {
          name: debouncedSearch
            ? { _ilike: `%${debouncedSearch}%` }
            : undefined,
        },
      }),
    {
      // staleTime: Infinity,
    }
  );

  const { data: postResults } = useQuery(
    [QUERY_KEY_SEARCH_POSTS, JSON.stringify(debouncedSearch)],
    () =>
      fetchPostSearchResults({
        search: debouncedSearch,
      }),
    {
      // staleTime: Infinity,
    }
  );

  const onSelectProfile = (address: string) => {
    navigate(coLinksPaths.profile(address));
  };

  const onSelectInterest = (name: string) => {
    navigate(coLinksPaths.exploreSkill(name));
  };

  const onSelectPost = (id: string) => {
    navigate(coLinksPaths.post(id));
  };

  return (
    <>
      <Command.Input
        ref={inputRef}
        placeholder={'Search Anything'}
        maxLength={30}
      />

      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <SearchBoxPages search={search} />
        {/* || */}
        {/* (similarityFetching  */}
        {isLoading && (
          <Command.Loading>
            <Flex column css={{ width: '100%', alignItems: 'center' }}>
              <Flex css={{ alignItems: 'center', gap: '$md' }}>
                <LoadingIndicator size={16} />
                <Text size={'small'} semibold>
                  Loading
                </Text>
              </Flex>
            </Flex>
          </Command.Loading>
        )}
        <>
          <Command.Group heading={'People'}>
            {results?.profiles_public?.map(profile => (
              <Command.Item
                key={profile.id}
                value={profile.address}
                onSelect={address => {
                  onSelectProfile(address);
                  setPopoverOpen(false);
                }}
              >
                <PeopleResult profile={profile} />
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading={'Interests'}>
            {results?.interests?.map(interest => (
              <Command.Item
                key={interest.name}
                value={interest.name}
                onSelect={name => {
                  onSelectInterest(name);
                  setPopoverOpen(false);
                }}
              >
                <SkillTag
                  skill={interest.name}
                  count={interest.count}
                  size={'medium'}
                />
              </Command.Item>
            ))}
          </Command.Group>
          {!searchIsEmpty && (
            <Command.Group
              heading={
                <Flex
                  css={{
                    gap: '$sm',
                    alignItems: 'center',
                  }}
                >
                  <AiLight
                    size={'lg'}
                    nostroke
                    css={{ '*': { fill: '$text' } }}
                  />
                  Suggested People
                </Flex>
              }
            >
              {similarityFetching && (
                <Command.Item
                  key={'ai-loading'}
                  value="searchSimilarProfiles"
                  data-disabled={true}
                  data-selectable={false}
                >
                  <Text size={'xs'} color={'neutral'} css={{}}>
                    <AiLight
                      size={'lg'}
                      nostroke
                      css={{ mr: '$xs', '*': { fill: '$secondaryText' } }}
                    />
                    Searching for similar profiles ...{' '}
                  </Text>
                </Command.Item>
              )}
              {similarityResults?.map(
                res =>
                  res &&
                  res.profile_public && (
                    <Command.Item
                      key={res.profile_public?.id}
                      value={res.profile_public?.address}
                      onSelect={address => {
                        onSelectProfile(address);
                        setPopoverOpen(false);
                      }}
                    >
                      <PeopleResult
                        profile={res.profile_public}
                        score={res.similarity}
                      />
                    </Command.Item>
                  )
              )}
            </Command.Group>
          )}
          {debouncedSearch !== '' && (
            <Command.Group heading={'Posts'}>
              {postResults?.posts?.map(post => (
                <Command.Item
                  key={`${post.id}`}
                  value={`${post.id}`}
                  onSelect={id => {
                    onSelectPost(id);
                    setPopoverOpen(false);
                  }}
                >
                  <Avatar
                    size="xs"
                    name={post.profile_public?.name}
                    path={post.profile_public?.avatar}
                  />
                  <Flex
                    column
                    css={{
                      width: '100%',
                    }}
                  >
                    <Flex
                      css={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Flex
                        css={{
                          gap: '$sm',
                          alignItems: 'center',
                          flexGrow: 1,
                        }}
                      >
                        <Text semibold size={'xs'}>
                          {post.profile_public?.name}
                        </Text>
                      </Flex>
                      <Flex
                        css={{
                          justifyContent: 'flex-end',
                          flexShrink: 0,
                        }}
                      >
                        <Text
                          size="xs"
                          css={{
                            color: '$neutral',
                            ml: '$md',
                          }}
                        >
                          {DateTime.fromISO(post.created_at).toRelative({
                            style: 'narrow',
                          })}
                        </Text>
                      </Flex>
                    </Flex>
                    <Text size={'xs'}>
                      {post.description.slice(0, 100)}
                      {post.description.length > 100 ? '...' : ''}
                    </Text>
                  </Flex>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </>
      </Command.List>
    </>
  );
};
