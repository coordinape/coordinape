import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster/models/user';
import { abbreviateString } from 'abbreviateString';
import { order_by } from 'lib/anongql/__generated__/zeus';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { OrBar } from 'components/OrBar';
import { ExternalLink, Farcaster, Github, Twitter } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Avatar, Flex, Link, Text } from 'ui';

import { PartyStats } from './PartyStats';
import { useCoLinksProfile } from './useCoLinksProfile';

export const PartyProfileHeader = ({
  profile,
  fcUser,
}: {
  profile: ReturnType<typeof useCoLinksProfile>['data'];
  fcUser?: User;
}) => {
  const { data: details } = useQuery(
    ['partyProfileHeader', profile?.id],
    async () => {
      if (!profile) {
        return undefined;
      }
      const {
        twitter_accounts_by_pk: twitter,
        github_accounts_by_pk: github,
        farcaster_accounts_by_pk: farcaster,
        profile_skills,
      } = await anonClient.query(
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
          farcaster_accounts_by_pk: [
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
      enabled: !!profile,
    }
  );

  return (
    <Flex
      column
      css={{
        gap: '$sm',
        flexGrow: 1,
        width: '100%',
        mb: '$sm',
        pb: '$md',
        borderBottom: '1px solid #00000033',
      }}
    >
      <Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: '$md',
          flexWrap: 'wrap',
        }}
      >
        <Flex column alignItems="center" css={{ gap: '$sm', mb: '$sm' }}>
          <Flex column css={{ mb: '$sm' }}>
            <NavLink
              to={coLinksPaths.partyProfile(
                profile?.address ??
                  fcUser?.verified_addresses.eth_addresses[0] ??
                  fcUser?.custody_address ??
                  ''
              )}
            >
              <Avatar
                size="xl"
                name={profile?.name ?? fcUser?.username}
                path={profile?.avatar ?? fcUser?.pfp_url}
                margin="none"
              />
            </NavLink>
          </Flex>
          <Flex column css={{ gap: '$sm', alignItems: 'center' }}>
            <Text h2 display>
              {profile?.name ?? fcUser?.username}
            </Text>
            <Flex
              column
              css={{ gap: '$sm', flexWrap: 'wrap', alignItems: 'center' }}
            >
              {profile && (
                <PartyStats
                  profileId={profile.id}
                  links={profile.links ?? 0}
                  score={profile.reputation_score?.total_score ?? 0}
                  size={'medium'}
                />
              )}
              <Flex
                css={{ gap: '$lg', flexWrap: 'wrap', justifyContent: 'center' }}
              >
                {(details?.farcaster || fcUser) && (
                  <Flex
                    as={Link}
                    href={`https://warpcast.com/${details?.farcaster ?? fcUser?.username}`}
                    target="_blank"
                    rel="noreferrer"
                    css={{
                      alignItems: 'center',
                      ...skillTextStyle,
                      fontWeight: 'normal',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    <Farcaster fa css={{ mr: '$xs' }} /> {details?.farcaster}
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
                      ...skillTextStyle,
                      fontWeight: 'normal',
                      '&:hover': {
                        textDecoration: 'underline',
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
                      ...skillTextStyle,
                      fontWeight: 'normal',
                      gap: '$xs',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    <Twitter nostroke /> {details?.twitter}
                  </Flex>
                )}
                {profile?.website && (
                  <Flex
                    as={Link}
                    href={profile.website as string}
                    target="_blank"
                    rel="noreferrer"
                    title={profile.website as string}
                    css={{
                      alignItems: 'center',
                      gap: '$xs',
                      ...skillTextStyle,
                      fontWeight: 'normal',
                      'svg path': {
                        fill: 'none',
                      },
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    <ExternalLink />{' '}
                    {abbreviateString(
                      (profile.website as string).replace(/^https?:\/\//, ''),
                      20
                    )}
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      {details?.skills && (
        <>
          <Flex
            css={{
              justifyContent: 'center',
            }}
          >
            <OrBar>
              <Text css={{ fontWeight: '$normal', fontSize: '$medium' }}>
                Skills Bio
              </Text>
            </OrBar>
          </Flex>
          <Flex
            css={{
              gap: '$sm',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {details?.skills.map(s => (
              <Text
                key={s}
                tag
                css={{
                  ...skillTextStyle,
                  gap: '$xs',
                  background: '#00000054',
                  textDecoration: 'none',
                  color: 'rgb(41 235 131) !important',
                  span: {
                    '@xs': {
                      fontSize: '$xs',
                    },
                  },
                }}
              >
                {s}
              </Text>
            ))}
          </Flex>
        </>
      )}
      {profile?.description && (
        <Flex
          css={{
            mt: '$sm',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text css={{ textAlign: 'center', opacity: 0.8 }}>
            {profile.description}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
