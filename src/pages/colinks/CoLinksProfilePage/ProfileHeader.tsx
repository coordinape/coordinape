import assert from 'assert';

import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { CoLinksGiveButton } from 'features/points/CoLinksGiveButton';
import { anonClient } from 'lib/anongql/anonClient';
import { client } from 'lib/gql/client';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';

import { abbreviateString } from '../../../abbreviateString';
import { CoLinksStats } from '../../../features/colinks/CoLinksStats';
import { SkillTag } from '../../../features/colinks/SkillTag';
import { useLinkingStatus } from '../../../features/colinks/useLinkingStatus';
import { order_by } from '../../../lib/gql/__generated__/zeus';
import { LoadingIndicator } from 'components/LoadingIndicator';
import useConnectedAddress from 'hooks/useConnectedAddress';
import useMobileDetect from 'hooks/useMobileDetect';
import useProfileId from 'hooks/useProfileId';
import {
  ExternalLink,
  Farcaster,
  Github,
  Icebreaker,
  Settings,
  Twitter,
} from 'icons/__generated';
import { useFarcasterUser } from 'pages/GiveParty/useFarcasterUser';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Avatar, Button, ContentHeader, Flex, Link, Text } from 'ui';

import { ProfileNav } from './ProfileNav';

export const ProfileHeader = ({
  targetAddress,
  drawer = false,
}: {
  targetAddress: string;
  drawer?: boolean;
}) => {
  const currentUserProfileId = useProfileId(false);
  const { data: targetProfile } = useQuery(
    [QUERY_KEY_COLINKS, targetAddress, 'profile'],
    () => {
      if (!targetAddress) return;
      return fetchCoLinksProfile(targetAddress, currentUserProfileId);
    },
    {
      enabled: !!targetAddress,
    }
  );
  if (!targetProfile) return <LoadingIndicator />;
  return (
    <ProfileHeaderWithProfile
      targetProfile={targetProfile}
      targetAddress={targetAddress}
      drawer={drawer}
    />
  );
};
const ProfileHeaderWithProfile = ({
  targetProfile,
  targetAddress,
  drawer,
}: {
  targetProfile: CoLinksProfile;
  targetAddress: string;
  drawer: boolean;
}) => {
  const { isMobile } = useMobileDetect();
  const currentUserAddress = useConnectedAddress(false);
  const { data: fcUser } = useFarcasterUser(targetAddress!);
  const { superFriend } = useLinkingStatus({
    address: currentUserAddress,
    target: targetAddress,
  });

  const { profile, imMuted, mutedThem } = targetProfile;

  const isCurrentUser =
    currentUserAddress &&
    targetAddress.toLowerCase() == currentUserAddress.toLowerCase();

  const { data: details } = useQuery(
    ['profileDetails', profile.id],
    async () => {
      return await fetchProfileDetails(profile.id);
    },
    {
      enabled: !!profile?.id,
    }
  );

  return (
    <Flex column>
      {!drawer && (
        <Helmet>
          <title>{targetProfile.profile.name} / CoLinks</title>
        </Helmet>
      )}
      <ContentHeader
        css={{
          mb: 0,
          background: 'transparent',
          '@sm': {
            p: '$sm 0 $lg $xl',
            m: '-$lg 0 $lg -$xl',
          },
        }}
      >
        <Flex column css={{ gap: '$sm', width: '100%' }}>
          <Flex
            css={{
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              gap: '$md',
              flexWrap: 'wrap',
            }}
          >
            {isMobile ? (
              <Flex className="profileHeader" column css={{ gap: '$md' }}>
                <Flex
                  className="avatarName"
                  css={{ mr: '$md', ...(drawer && { mr: 0 }) }}
                >
                  <AppLink
                    to={coLinksPaths.profileGive(
                      profile?.address ??
                        fcUser?.verified_addresses.eth_addresses[0] ??
                        fcUser?.custody_address ??
                        ''
                    )}
                    css={{
                      display: 'flex',
                      gap: '$sm',
                    }}
                  >
                    <Avatar
                      size="small"
                      name={profile.name}
                      path={profile.avatar}
                      margin="none"
                    />
                    <Text
                      h2
                      display
                      css={{
                        color: '$secondaryButtonText',
                      }}
                    >
                      {profile.name}
                    </Text>
                  </AppLink>
                </Flex>
                <Flex css={{ gap: '$sm', flexWrap: 'wrap' }}>
                  {details && (
                    <SocialLinks
                      details={details}
                      targetAddress={targetAddress}
                      profileWebsite={profile?.website}
                    />
                  )}
                </Flex>
              </Flex>
            ) : (
              <>
                <Flex
                  alignItems="center"
                  css={{
                    gap: '$sm',
                    mb: '$sm',
                    '@xs': {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    },
                    ...(drawer && { flexDirection: 'column' }),
                  }}
                >
                  <Flex column css={{ mr: '$md', ...(drawer && { mr: 0 }) }}>
                    <AppLink
                      to={coLinksPaths.profileGive(
                        profile?.address ??
                          fcUser?.verified_addresses.eth_addresses[0] ??
                          fcUser?.custody_address ??
                          ''
                      )}
                    >
                      <Avatar
                        size="xl"
                        name={profile.name}
                        path={profile.avatar}
                        margin="none"
                      />
                    </AppLink>
                  </Flex>
                  <Flex
                    column
                    css={{
                      gap: '$sm',
                      ...(drawer && { alignItems: 'center' }),
                    }}
                  >
                    <Text
                      h2
                      display
                      css={{
                        color: '$secondaryButtonText',
                        '@xs': {
                          fontSize: '$h1',
                        },
                      }}
                    >
                      {profile.name}
                    </Text>
                    <CoLinksStats
                      address={profile.address}
                      links={profile.links ?? 0}
                      score={profile.reputation_score?.total_score ?? 0}
                      size={'medium'}
                      // We should this elsewhere i guess?
                      holdingCount={0}
                      // if we want to show this, this is how but probably needs a restyle
                      // holdingCount={targetBalance ?? 0}
                      css={{ ...(drawer && { justifyContent: 'center' }) }}
                    />
                    <Flex
                      css={{
                        columnGap: '$lg',
                        rowGap: '$sm',
                        flexWrap: 'wrap',
                        ...(drawer && { justifyContent: 'center' }),
                      }}
                    >
                      {details && (
                        <SocialLinks
                          details={details}
                          targetAddress={targetAddress}
                          profileWebsite={profile?.website}
                        />
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              </>
            )}
            {!drawer && (
              <Flex css={{ alignItems: 'flex-start', gap: '$sm', mb: '$md' }}>
                {isCurrentUser ? (
                  <Button
                    as={AppLink}
                    color="neutral"
                    outlined
                    size="small"
                    to={coLinksPaths.account}
                  >
                    <Settings />
                    Edit Profile
                  </Button>
                ) : (
                  <CoLinksGiveButton
                    cta
                    gives={[]}
                    targetProfileId={targetProfile?.profile.id}
                    targetAddress={targetAddress}
                  />
                )}
              </Flex>
            )}
          </Flex>
          <Flex
            css={{
              gap: '$sm',
              flexWrap: 'wrap',
              ...(drawer && { justifyContent: 'center' }),
            }}
          >
            {!isCurrentUser && superFriend && (
              <Text tag color={'secondary'}>
                Mutual Link
              </Text>
            )}
            {imMuted && (
              <Text tag color={'alert'}>
                Muted You
              </Text>
            )}
            {mutedThem && (
              <Text tag color={'alert'}>
                Muted
              </Text>
            )}
            {details?.skills.map(s => (
              <SkillTag key={s} skill={s} css={{ background: '$surface' }} />
            ))}
          </Flex>
          {/* {profile.address && (
            <Flex css={{ gap: '$sm' }}>
              <GiveReceived address={profile.address} size="large" />
            </Flex>
          )} */}
          {profile.description && (
            <Flex css={{ ...(drawer && { justifyContent: 'center' }) }}>
              <Text
                color="secondary"
                css={{ ...(drawer && { textAlign: 'center' }) }}
              >
                {profile.description}
              </Text>
            </Flex>
          )}
        </Flex>
      </ContentHeader>
      {!drawer && <ProfileNav targetAddress={targetAddress} />}
    </Flex>
  );
};

const SocialLinks = ({
  details,
  profileWebsite,
  targetAddress,
}: {
  details: ProfileDetails;
  profileWebsite?: string;
  targetAddress: string;
}) => {
  return (
    <>
      {details?.farcaster && (
        <Flex
          as={Link}
          href={`https://warpcast.com/${details?.farcaster}`}
          target="_blank"
          rel="noreferrer"
          css={{
            alignItems: 'center',
            gap: '$xs',
            color: '$secondaryText',
            fontWeight: '$medium',
            '&:hover': {
              color: '$linkHover',
              'svg path': {
                fill: '$linkHover',
              },
            },
          }}
        >
          <Farcaster fa /> {details?.farcaster}
        </Flex>
      )}
      {details?.github && (
        <Flex
          as={Link}
          href={`https://github.com/${details?.github}`}
          target="_blank"
          rel="noreferrer"
          css={{
            alignItems: 'center',
            gap: '$xs',
            color: '$secondaryText',
            fontWeight: '$semibold',
            '&:hover': {
              color: '$linkHover',
              'svg path': {
                fill: '$linkHover',
              },
            },
          }}
        >
          <Github nostroke /> {details?.github}
        </Flex>
      )}
      {details?.twitter && (
        <Flex
          as={Link}
          href={`https://twitter.com/${details?.twitter}`}
          target="_blank"
          rel="noreferrer"
          css={{
            alignItems: 'center',
            gap: '$xs',
            color: '$secondaryText',
            fontWeight: '$medium',
            '&:hover': {
              color: '$linkHover',
              'svg path': {
                fill: '$linkHover',
              },
            },
          }}
        >
          <Twitter nostroke /> {details?.twitter}
        </Flex>
      )}
      <Flex
        as={Link}
        href={`https://app.icebreaker.xyz/eth/${targetAddress}`}
        target="_blank"
        rel="noreferrer"
        css={{
          alignItems: 'center',
          gap: '$xs',
          color: '$secondaryText',
          fontWeight: '$medium',
          '&:hover': {
            color: '$linkHover',
            'svg path': {
              fill: '$linkHover',
            },
          },
        }}
      >
        <Icebreaker fa /> Icebreaker
      </Flex>
      {profileWebsite && (
        <Flex
          as={Link}
          href={profileWebsite as string}
          target="_blank"
          rel="noreferrer"
          title={profileWebsite as string}
          css={{
            fontWeight: '$medium',
            alignItems: 'center',
            gap: '$xs',
            color: '$secondaryText',
            '&:hover': {
              color: '$linkHover',
            },
          }}
        >
          <ExternalLink />{' '}
          {abbreviateString(
            (profileWebsite as string).replace(/^https?:\/\//, ''),
            30
          )}
        </Flex>
      )}
    </>
  );
};

export const fetchCoLinksProfile = async (
  address: string,
  currentProfileId?: number
) => {
  const { profiles_public } = await anonClient.query(
    {
      profiles_public: [
        {
          where: {
            address: {
              _ilike: address,
            },
          },
        },
        {
          id: true,
          name: true,
          avatar: true,
          address: true,
          website: true,
          links: true,
          description: true,
          reputation_score: {
            total_score: true,
          },
        },
      ],
    },
    {
      operationName: 'fetch_coLinks_profile_anonClient',
    }
  );

  // Need to check mutes only if currentProfileId is set
  if (!currentProfileId) {
    assert(profiles_public.length == 1, 'profile not found');
    const p = profiles_public.pop();
    assert(p, 'profile not found');
    return {
      profile: p,
      mutedThem: false,
      imMuted: false,
    };
  }

  const { mutedThem, imMuted } = await client.query(
    {
      __alias: {
        mutedThem: {
          mutes: [
            {
              where: {
                target_profile: {
                  address: {
                    _ilike: address,
                  },
                },
                profile_id: {
                  _eq: currentProfileId,
                },
              },
            },
            {
              profile_id: true,
              target_profile_id: true,
            },
          ],
        },
        imMuted: {
          mutes: [
            {
              where: {
                profile: {
                  address: {
                    _eq: address,
                  },
                },
                target_profile_id: {
                  _eq: currentProfileId,
                },
              },
            },
            {
              profile_id: true,
              target_profile_id: true,
            },
          ],
        },
      },
    },
    {
      operationName: 'coLinks_profile_fetch_mutes',
    }
  );
  const profile = profiles_public.pop();
  const mutedThemI = mutedThem.pop();
  const imMutedI = imMuted.pop();

  assert(profile, "profile doesn't exist");
  return {
    profile,
    mutedThem: !!mutedThemI,
    imMuted: !!imMutedI,
  };
};

const fetchProfileDetails = async (profileId: number) => {
  const {
    twitter_accounts_by_pk: twitter,
    github_accounts_by_pk: github,
    farcaster_accounts_by_pk: farcaster,
    profile_skills,
  } = await client.query(
    {
      profile_skills: [
        {
          where: {
            profile_id: {
              _eq: profileId,
            },
          },
          order_by: [{ skill_name: order_by.asc }],
        },
        {
          skill_name: true,
        },
      ],
      farcaster_accounts_by_pk: [
        {
          profile_id: profileId,
        },
        {
          username: true,
        },
      ],
      twitter_accounts_by_pk: [
        {
          profile_id: profileId,
        },
        {
          username: true,
        },
      ],
      github_accounts_by_pk: [
        {
          profile_id: profileId,
        },
        {
          username: true,
        },
      ],
    },
    {
      operationName: 'profile_details',
    }
  );

  return {
    twitter: twitter ? twitter.username : undefined,
    github: github ? github.username : undefined,
    farcaster: farcaster ? farcaster.username : undefined,
    skills: profile_skills.map(ps => ps.skill_name),
  };
};

export type ProfileDetails = Required<
  Awaited<ReturnType<typeof fetchProfileDetails>>
>;

export type CoLinksProfile = Required<
  Awaited<ReturnType<typeof fetchCoLinksProfile>>
>;
