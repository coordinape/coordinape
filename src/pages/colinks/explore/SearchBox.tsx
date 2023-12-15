import { SetStateAction, useEffect, useRef, useState } from 'react';

import { Command, useCommandState } from 'cmdk';
import { flushSync } from 'react-dom';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';

import { ComboBox } from '../../../components/ComboBox';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { CoLinksStats } from '../../../features/colinks/CoLinksStats';
import { SkillTag } from '../../../features/colinks/SkillTag';
import useConnectedAddress from '../../../hooks/useConnectedAddress';
import {
  Award,
  BarChart,
  BoltFill,
  CertificateFill,
  HouseFill,
  PaperPlane,
  PlanetFill,
  Settings,
  ToolsFill,
  UserFill,
} from '../../../icons/__generated';
import { order_by, ValueTypes } from '../../../lib/gql/__generated__/zeus';
import { client } from '../../../lib/gql/client';
import { coLinksPaths } from '../../../routes/paths';
import { Avatar, Button, Flex, Modal, Text } from '../../../ui';

const QUERY_KEY_SEARCH = 'searchBoxQuery';

export const SearchBox = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const location = useLocation();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPopoverOpen(false);
  }, [location]);

  useEffect(() => {
    window.focus();
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  function isMacBrowser(): boolean {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

  const keyDownHandler = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      openPopover();
    }
  };

  const previouslyFocusedRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    previouslyFocusedRef.current?.focus();
    previouslyFocusedRef.current?.blur();
  }, [location]);

  const openPopover = () => {
    setPopoverOpen(true);
  };
  const closePopover = () => {
    flushSync(() => {
      setPopoverOpen(false);
    });
    previouslyFocusedRef.current?.focus();
  };

  return (
    <>
      <Button
        color="inputStyle"
        ref={previouslyFocusedRef}
        onClick={() => openPopover()}
        css={{ width: '100%' }}
      >
        <Flex
          css={{ justifyContent: 'space-between', width: '100%', px: '$sm' }}
        >
          <Text>Search Anything</Text>
          <Text>{isMacBrowser() ? '⌘' : 'Ctrl-'}K</Text>
        </Flex>
      </Button>

      <Modal
        onOpenChange={() => {
          closePopover();
        }}
        open={popoverOpen}
        css={{ maxWidth: '500px' }}
        cmdk
        closeButtonStyles={{ opacity: 0.2, right: '$md', top: '19px' }}
      >
        <ComboBox fullScreen filter={() => 1}>
          <SearchResults setPopoverOpen={setPopoverOpen} inputRef={inputRef} />
        </ComboBox>
        {/* <Flex
          css={{
            background: '$surface',
            p: '$md $md',
            borderTop: '1px solid $borderDim',
          }}
        >
          <Button size="small" color="primary">
            Search for real
          </Button>
        </Flex> */}
      </Modal>
    </>
  );
};

type ProfilesWhere = ValueTypes['profiles_public_bool_exp'];
type SkillsWhere = ValueTypes['skills_bool_exp'];

const SearchResults = ({
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
      staleTime: Infinity,
    }
  );

  const onSelectProfile = (address: string) => {
    navigate(coLinksPaths.profile(address));
  };

  const onSelectInterest = (name: string) => {
    navigate(coLinksPaths.exploreSkill(name));
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
        <NavigableItems search={search} />
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
            <Command.Group heading={'Suggested People'}>
              {similarityFetching && (
                <Text size={'small'} semibold>
                  Analyzing neural nets for similar people...
                </Text>
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
        </>
      </Command.List>
    </>
  );
};

const PeopleResult = ({
  profile,
  score,
}: {
  profile: {
    name?: string;
    avatar?: string;
    links?: number;
    reputation_score?: { total_score: number };
  };
  score?: number;
}) => {
  return (
    <Flex
      css={{
        width: '100%',
        alignItems: 'center',
        gap: '$md',
        justifyContent: 'space-between',
      }}
    >
      <Flex
        css={{
          alignItems: 'center',
          gap: '$md',
        }}
      >
        <Avatar size="small" name={profile.name} path={profile.avatar} />
        <Text semibold>{profile.name}</Text>
      </Flex>
      <Flex css={{ gap: '$md' }}>
        <CoLinksStats
          links={profile.links ?? 0}
          score={profile.reputation_score?.total_score ?? 0}
          holdingCount={0}
        />
        {score && (
          // ADD AI ICON
          <Text size={'xs'} color={'secondary'}>
            Score: {(score * 100).toString().substring(0, 5)}%
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

const fetchSimilarityResults = async ({ search }: { search: string }) => {
  const { searchProfiles } = await client.query(
    {
      searchProfiles: [
        {
          payload: { search_query: search },
        },
        {
          similarity: true,
          profile_public: {
            id: true,
            name: true,
            avatar: true,
            address: true,
            links: true,
            reputation_score: {
              total_score: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'searchProfiles__searchBoxQuery',
    }
  );
  return searchProfiles;
};

const fetchSearchResults = async ({
  where,
  skillsWhere,
}: {
  where: ProfilesWhere;
  skillsWhere: SkillsWhere;
}) => {
  const { profiles_public, skills } = await client.query(
    {
      profiles_public: [
        {
          where: {
            ...where,
            links_held: { _gt: 0 },
          },
          limit: 5,
          order_by: [{ links: order_by.desc }],
        },
        {
          id: true,
          name: true,
          avatar: true,
          address: true,
          links: true,
          reputation_score: {
            total_score: true,
          },
        },
      ],
      skills: [
        {
          where: skillsWhere,
          limit: 5,
          order_by: [{ count: order_by.desc }],
        },
        {
          name: true,
          count: true,
        },
      ],
    },
    {
      operationName: 'searchBoxQuery',
    }
  );
  return { profiles_public, interests: skills };
};

const NavigableSearch = (address: string) => [
  {
    name: 'Home',
    path: coLinksPaths.home,
    icon: <HouseFill size="lg" nostroke />,
  },
  {
    name: 'Explore',
    path: coLinksPaths.explore,
    icon: <PlanetFill size="lg" nostroke />,
  },
  {
    name: 'Notifications',
    path: coLinksPaths.notifications,
    icon: <BoltFill size="lg" nostroke />,
  },
  {
    name: 'Profile',
    path: coLinksPaths.profile(address),
    icon: <UserFill size="lg" nostroke />,
  },
  {
    name: 'Edit Profile',
    path: coLinksPaths.account,
    icon: <Settings css={{ path: { fill: 'transparent !important' } }} />,
  },
  {
    name: 'Rep Score',
    path: coLinksPaths.score(address),
    icon: <CertificateFill size="lg" nostroke />,
  },
  {
    name: 'Invites',
    path: coLinksPaths.invites,
    icon: <PaperPlane size="lg" nostroke />,
  },
  {
    name: 'Top Interests',
    path: coLinksPaths.exploreSkills,
    icon: <ToolsFill size="lg" />,
  },
  {
    name: 'Most Links',
    path: coLinksPaths.exploreMostLinks,
    icon: <Award size="lg" />,
  },
  {
    name: 'Holding Most Links',
    path: coLinksPaths.exploreHoldingMost,
    icon: <Award size="lg" />,
  },
  {
    name: 'Linking Activity',
    path: coLinksPaths.linking,
    icon: <BarChart size="lg" />,
  },
  {
    name: 'Highest Rep Score',
    path: coLinksPaths.exploreRepScore,
    icon: <CertificateFill size="lg" nostroke />,
  },
];

const NavigableItems = ({ search }: { search: string }) => {
  const navigate = useNavigate();
  const address = useConnectedAddress(true);

  return (
    <Command.Group heading={'Pages'}>
      {NavigableSearch(address)
        .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5)
        .map(item => (
          <Command.Item
            key={item.name}
            value={item.path}
            onSelect={() => navigate(item.path)}
          >
            <Flex
              css={{
                width: '100%',
                alignItems: 'center',
                gap: '$md',
                'svg path': {
                  fill: '$text',
                },
              }}
            >
              {item.icon}
              <Text size={'medium'}>{item.name}</Text>
            </Flex>
          </Command.Item>
        ))}
    </Command.Group>
  );
};
