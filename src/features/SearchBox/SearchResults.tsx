import { SetStateAction } from 'react';

import { Command, useCommandState } from 'cmdk';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useDebounce } from 'usehooks-ts';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { coLinksPaths } from '../../routes/paths';
import { Avatar, Flex, Text } from '../../ui';
import { SkillTag } from '../colinks/SkillTag';

import { FarcasterUserResult } from './FarcasterUserResult';
import { fetchFarcasterUserResults } from './fetchFarcasterUserResults';
import { fetchPartyProfileResults } from './fetchPartyProfileResults';
import { fetchPostSearchResults } from './fetchPostSearchResults';
import { PeopleResult } from './PeopleResult';
import { SearchBoxPages } from './SearchBoxPages';
import { useGiveSkills } from './useGiveSkills';

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

  const { data: partyProfileResults, isFetching: partyProfileFetching } =
    useQuery(
      [QUERY_KEY_SEARCH, 'partyProfiles', JSON.stringify(debouncedSearch)],
      async () =>
        await fetchPartyProfileResults({
          search: debouncedSearch,
        }),
      {
        enabled: debouncedSearch !== '',
        staleTime: Infinity,
        retry: false,
      }
    );

  const { data: farcasterUserResults, isFetching: farcasterUserFetching } =
    useQuery(
      [QUERY_KEY_SEARCH, 'farcasterUsers', JSON.stringify(debouncedSearch)],
      async () =>
        await fetchFarcasterUserResults({
          search: debouncedSearch,
        }),
      {
        enabled: debouncedSearch !== '',
        staleTime: Infinity,
        retry: false,
      }
    );

  const giveSkills = useGiveSkills(debouncedSearch);

  // TODO: dedupe farcaster results if they are in profile results

  const onSelectAddress = (address: string) => {
    navigate(coLinksPaths.profileGive(address));
  };

  const onSelectSkill = (name: string) => {
    navigate(coLinksPaths.giveSkill(name));
  };

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
        {(partyProfileFetching || farcasterUserFetching) && (
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
          {(giveSkills?.length ?? 0) > 0 && (
            <Command.Group heading={'Skills'}>
              {giveSkills
                ?.filter(skill => skill.skill)
                .map(skill => (
                  <Command.Item
                    key={skill.skill}
                    value={skill.skill}
                    onSelect={name => {
                      onSelectSkill(name);
                      setPopoverOpen(false);
                    }}
                  >
                    <SkillTag
                      give={true}
                      skill={skill.skill}
                      count={skill.gives}
                      size={'medium'}
                    />
                  </Command.Item>
                ))}
            </Command.Group>
          )}
          {(partyProfileResults?.length ?? 0) > 0 && (
            <Command.Group heading={'CoLinks Members'}>
              {partyProfileResults
                ?.filter(p => p.name && p.id)
                .map(profile => (
                  <Command.Item
                    key={'ppr_' + profile.id}
                    value={profile.address}
                    onSelect={address => {
                      onSelectAddress(address);
                      setPopoverOpen(false);
                    }}
                  >
                    <PeopleResult profile={profile} />
                  </Command.Item>
                ))}
            </Command.Group>
          )}
          {(farcasterUserResults?.length ?? 0) > 0 && (
            <Command.Group heading={'Farcaster Users'}>
              {farcasterUserResults
                ?.filter(u => u.fname && u.address)
                .map(user => (
                  <Command.Item
                    key={user.fname}
                    value={user.address}
                    onSelect={address => {
                      onSelectAddress(address);
                      setPopoverOpen(false);
                    }}
                  >
                    <FarcasterUserResult user={user} />
                  </Command.Item>
                ))}
            </Command.Group>
          )}
        </>
        {debouncedSearch !== '' && (
          <Command.Group heading={'Posts'}>
            {postResults?.posts?.map(post => (
              <Command.Item
                key={`${post.activity?.id}`}
                value={`${post.activity?.id}`}
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
      </Command.List>
    </>
  );
};
