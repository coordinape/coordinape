import { abbreviateString } from 'abbreviateString';
import { order_by } from 'lib/anongql/__generated__/zeus';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';

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
    <Flex column css={{ gap: '$sm', flexGrow: 1, width: '100%' }}>
      <Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
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
            <Text h2 display>
              {profile.name}
            </Text>
            <Flex column css={{ gap: '$sm', flexWrap: 'wrap' }}>
              <PartyStats
                profileId={profile.id}
                links={profile.links ?? 0}
                score={profile.reputation_score?.total_score ?? 0}
                size={'medium'}
              />
              <Flex>
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
                      '&:hover': {
                        color: '$linkHover',
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
      <Flex css={{ gap: '$sm', flexWrap: 'wrap' }}>
        {details?.skills.map(s => (
          <Text
            key={s}
            tag
            css={{
              gap: '$xs',
              background: 'rgb(0 143 94 / 83%)',
              textDecoration: 'none',
              span: {
                color: 'white',
                '@sm': {
                  fontSize: '$xs',
                },
              },
            }}
          >
            {s}
          </Text>
        ))}
      </Flex>

      {profile.description && (
        <Flex css={{ mt: '$xs' }}>
          <Text color="secondary">{profile.description}</Text>
        </Flex>
      )}
    </Flex>
  );
};
