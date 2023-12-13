/* eslint-disable  */
import { SetStateAction, useEffect, useRef, useState } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { Command, useCommandState } from 'cmdk';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useDebounce } from '@uidotdev/usehooks';

import { ComboBox } from '../../../components/ComboBox';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { order_by, ValueTypes } from '../../../lib/gql/__generated__/zeus';
import { client } from '../../../lib/gql/client';
import { Avatar, Flex, PopoverContent, Text, TextField } from '../../../ui';
import { coLinksPaths } from '../../../routes/paths';
import { SkillTag } from '../../../features/colinks/SkillTag';
import useConnectedAddress from '../../../hooks/useConnectedAddress';
import { useLocation } from 'react-router-dom';
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
import { CoLinksStats } from '../../../features/colinks/CoLinksStats';

const QUERY_KEY_SEARCH = 'searchBoxQuery';

export const SearchBox = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const location = useLocation();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPopoverOpen(false);
    // TODO: these don't work, active state and can't Cmd+K unless you click
    document.body.focus();
    inputRef.current?.blur();
  }, [location]);

  useEffect(() => {
    console.log('adding');
    window.focus();
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      console.log('removing');
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  const keyDownHandler = (event: KeyboardEvent) => {
    console.log('kdh');
    // eslint-disable-next-line no-console
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      console.log('setting it open');
      // inputRef.current?.focus();
      setPopoverOpen(true);
    }
  };

  return (
    <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
      <Flex
        column
        as={Popover.Trigger}
        css={{
          alignItems: 'flex-start',
          gap: '$sm',
          borderRadius: '$3',
        }}
      >
        {/* This TextField is just a popover trigger */}
        <TextField
          placeholder="Search Anything   ⌘K"
          css={{ width: '302px' }}
        />
      </Flex>
      <PopoverContent
        avoidCollisions={false}
        align={'start'}
        css={{
          background: 'transparent',
          mt: 'calc(-$1xl + 0.5px)',
          p: 0,
        }}
      >
        <ComboBox filter={() => 1}>
          <SearchResults setPopoverOpen={setPopoverOpen} inputRef={inputRef} />
        </ComboBox>
      </PopoverContent>
    </Popover.Root>
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
      })
  );

  useEffect(() => {
    console.log('2DBSearch', debouncedSearch);
  }, [debouncedSearch]);

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
          {/*<AddItem*/}
          {/*  addSkill={addSkill}*/}
          {/*  mySkills={Array.from(profileSkills)}*/}
          {/*  allSkills={skills}*/}
          {/*/>*/}

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
                    <Avatar
                      size="small"
                      name={profile.name}
                      path={profile.avatar}
                    />
                    <Text semibold>{profile.name}</Text>
                  </Flex>
                  <CoLinksStats
                    links={profile.links ?? 0}
                    score={profile.reputation_score?.total_score ?? 0}
                    holdingCount={0}
                  />
                </Flex>
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
                  size={'large'}
                />
              </Command.Item>
            ))}
          </Command.Group>
          <NavigableItems search={debouncedSearch} />
          {/*{skills*/}
          {/*  .filter(*/}
          {/*    sk =>*/}
          {/*      !profileSkills.some(*/}
          {/*        ps => ps.toLowerCase() === sk.name.toLowerCase()*/}
          {/*      )*/}
          {/*  )*/}
          {/*  .map(skill => (*/}
          {/*    <Command.Item*/}
          {/*      key={skill.name}*/}
          {/*      value={skill.name}*/}
          {/*      onSelect={addSkill}*/}
          {/*      defaultChecked={false}*/}
          {/*      disabled={profileSkills.some(*/}
          {/*        ps => ps.toLowerCase() === skill.name.toLowerCase()*/}
          {/*      )}*/}
          {/*    >*/}
          {/*      <Flex*/}
          {/*        css={{*/}
          {/*          justifyContent: 'space-between',*/}
          {/*          width: '100%',*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <Text semibold>{skill.name}</Text>*/}
          {/*        <Text tag color={'secondary'} size={'xs'}>*/}
          {/*          <User /> {skill.count}*/}
          {/*        </Text>*/}
          {/*      </Flex>*/}
          {/*    </Command.Item>*/}
          {/*  ))}*/}
        </>
      </Command.List>
    </>
  );
};

const fetchSearchResults = async ({
  where,
  skillsWhere,
}: {
  where: ProfilesWhere;
  skillsWhere: SkillsWhere;
}) => {
  console.log('FETCH', where);
  const { profiles_public, skills } = await client.query(
    {
      profiles_public: [
        {
          where,
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
