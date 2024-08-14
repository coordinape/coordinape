import assert from 'assert';

import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { anonClient } from 'lib/anongql/anonClient';
import { client } from 'lib/gql/client';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';

import { abbreviateString } from '../../../abbreviateString';
import { CoLinksStats } from '../../../features/colinks/CoLinksStats';
import { Mutes } from '../../../features/colinks/Mutes';
import { SkillTag } from '../../../features/colinks/SkillTag';
import { useLinkingStatus } from '../../../features/colinks/useLinkingStatus';
import { order_by } from '../../../lib/gql/__generated__/zeus';
import { LoadingIndicator } from 'components/LoadingIndicator';
import useConnectedAddress from 'hooks/useConnectedAddress';
import useProfileId from 'hooks/useProfileId';
import {
  ExternalLink,
  Farcaster,
  Github,
  Icebreaker,
  Settings,
  Twitter,
} from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Avatar, Button, ContentHeader, Flex, Link, Text } from 'ui';

import { ProfileNav } from './ProfileNav';

export const ProfileHeader = ({ targetAddress }: { targetAddress: string }) => {
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
    />
  );
};
const ProfileHeaderWithProfile = ({
  targetProfile,
  targetAddress,
}: {
  targetProfile: CoLinksProfile;
  targetAddress: string;
}) => {
  const currentUserAddress = useConnectedAddress(false);
  const { superFriend } = useLinkingStatus({
    address: currentUserAddress,
    target: targetAddress,
  });

  const { profile, imMuted, mutedThem } = targetProfile;

  const isCurrentUser =
    currentUserAddress &&
    targetAddress.toLowerCase() == currentUserAddress.toLowerCase();

  const { data: details } = useQuery(
    ['twitter', profile.id],
    async () => {
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
                  _eq: profile.id,
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
              profile_id: profile.id,
            },
            {
              username: true,
            },
          ],
          twitter_accounts_by_pk: [
            {
              profile_id: profile.id,
            },
            {
              username: true,
            },
          ],
          github_accounts_by_pk: [
            {
              profile_id: profile.id,
            },
            {
              username: true,
            },
          ],
        },
        {
          operationName: 'twitter_profile',
        }
      );

      return {
        twitter: twitter ? twitter.username : undefined,
        github: github ? github.username : undefined,
        farcaster: farcaster ? farcaster.username : undefined,
        skills: profile_skills.map(ps => ps.skill_name),
      };
    },
    {
      enabled: !!profile?.id,
    }
  );

  return (
    <Flex column css={{ gap: '$lg' }}>
      <Helmet>
        <title>{targetProfile.profile.name} / CoLinks</title>
      </Helmet>
      <ContentHeader css={{ mb: 0, background: 'transparent' }}>
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
            <Flex alignItems="center" css={{ gap: '$sm', mb: '$sm' }}>
              <Flex column css={{ mr: '$md' }}>
                <Avatar
                  size="xl"
                  name={profile.name}
                  path={profile.avatar}
                  margin="none"
                />
              </Flex>
              <Flex column css={{ gap: '$sm' }}>
                <Text h2 display css={{ color: '$secondaryButtonText' }}>
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
                />
                <Flex css={{ gap: '$lg', flexWrap: 'wrap' }}>
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
                  {profile?.website && (
                    <Flex
                      as={Link}
                      href={profile.website as string}
                      target="_blank"
                      rel="noreferrer"
                      title={profile.website as string}
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
                        (profile.website as string).replace(/^https?:\/\//, ''),
                        30
                      )}
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </Flex>
            <Flex css={{ alignItems: 'flex-start', gap: '$md' }}>
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
                <Mutes
                  targetProfileId={targetProfile?.profile.id}
                  targetProfileAddress={targetAddress}
                />
              )}
            </Flex>
          </Flex>
          <Flex css={{ gap: '$sm', flexWrap: 'wrap' }}>
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
            <Flex css={{ mt: '$xs' }}>
              <Text color="secondary">{profile.description}</Text>
            </Flex>
          )}
        </Flex>
      </ContentHeader>
      <ProfileNav targetAddress={targetAddress} />
    </Flex>
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

export type CoLinksProfile = Required<
  Awaited<ReturnType<typeof fetchCoLinksProfile>>
>;
