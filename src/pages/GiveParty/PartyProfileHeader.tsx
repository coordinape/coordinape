import { abbreviateString } from 'abbreviateString';
import { order_by } from 'lib/anongql/__generated__/zeus';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { skillTextStyle } from 'stitches.config';

import { OrBar } from 'components/OrBar';
import { ExternalLink, Github, Twitter } from 'icons/__generated';
import { Avatar, Flex, Link, Text } from 'ui';

import { PublicProfile } from './PartyProfile';
import { PartyStats } from './PartyStats';

export const PartyProfileHeader = ({ profile }: { profile: PublicProfile }) => {
  const { data: details } = useQuery(['twitter', profile.id], async () => {
    const {
      twitter_accounts_by_pk: twitter,
      github_accounts_by_pk: github,
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
      },
      {
        operationName: 'twitter_profile',
      }
    );

    return {
      twitter: twitter ? twitter.username : undefined,
      github: github ? github.username : undefined,
      skills: profile_skills.map(ps => ps.skill_name),
    };
  });

  if (!profile) {
    return;
  }
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
            <Avatar
              size="xl"
              name={profile.name}
              path={profile.avatar}
              margin="none"
            />
          </Flex>
          <Flex column css={{ gap: '$sm', alignItems: 'center' }}>
            <Text h2 display>
              {profile.name}
            </Text>
            <Flex
              column
              css={{ gap: '$sm', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <PartyStats
                profileId={profile.id}
                links={profile.links ?? 0}
                score={profile.reputation_score?.total_score ?? 0}
                size={'medium'}
              />
              <Flex css={{ gap: '$md' }}>
                {details?.github && (
                  <Flex
                    as={Link}
                    href={`https://github.com/${details?.github}`}
                    target="_blank"
                    rel="noreferrer"
                    css={{
                      alignItems: 'center',
                      gap: '$xs',
                      fontWeight: '$semibold',
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
                      gap: '$xs',
                      fontWeight: '$medium',
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
                  color: 'rgb(41 235 131)',
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
      {profile.description && (
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
