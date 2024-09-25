import { SetStateAction } from 'react';

import { Command, useCommandState } from 'cmdk';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useDebounce } from 'usehooks-ts';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { coLinksPaths } from '../../routes/paths';
import { Flex, Text } from '../../ui';
import { SkillTag } from '../colinks/SkillTag';

import { FarcasterUserResult } from './FarcasterUserResult';
import { fetchFarcasterUserResults } from './fetchFarcasterUserResults';
import { fetchPartyProfileResults } from './fetchPartyProfileResults';
import { PeopleResult } from './PeopleResult';
import { useGiveSkills } from './useGiveSkills';

const QUERY_KEY_SEARCH = 'partySearchBoxQuery';

export const PartySearchResults = ({
  setPopoverOpen,
  inputRef,
  profileFunc = coLinksPaths.profileGive,
  skillFunc = coLinksPaths.giveSkill,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  setPopoverOpen: React.Dispatch<SetStateAction<boolean>>;
  profileFunc?(address: string): string;
  skillFunc?(skill: string): string;
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
    navigate(profileFunc(address));
  };

  const onSelectInterest = (name: string) => {
    navigate(skillFunc(name));
  };

  return (
    <>
      <Command.Input
        ref={inputRef}
        placeholder={'Search Anything'}
        maxLength={30}
      />
      <Command.List>
        <Command.Empty>Search for a Skill or Person</Command.Empty>
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
                      onSelectInterest(name);
                      setPopoverOpen(false);
                    }}
                  >
                    <SkillTag
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
                    key={profile.id}
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
      </Command.List>
    </>
  );
};
