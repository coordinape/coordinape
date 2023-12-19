import assert from 'assert';
import { Dispatch, useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';
import { CoSoul } from 'features/colinks/fetchCoSouls';
import { PostForm } from 'features/colinks/PostForm';
import { useCoLinks } from 'features/colinks/useCoLinks';
import { client } from 'lib/gql/client';
import { useQuery, useQueryClient } from 'react-query';

import { abbreviateString } from '../../../abbreviateString';
import { CoLinksStats } from '../../../features/colinks/CoLinksStats';
import { Mutes } from '../../../features/colinks/Mutes';
import { SkillTag } from '../../../features/colinks/SkillTag';
import { QUERY_KEY_COLINKS } from '../../../features/colinks/wizard/CoLinksWizard';
import { order_by } from '../../../lib/gql/__generated__/zeus';
import { currentPrompt } from '../ActivityPage';
import { ExternalLink, Github, Settings, Twitter } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Avatar, Button, ContentHeader, Flex, Link, Text } from 'ui';

import { CoLinksProfile } from './ViewProfilePageContents';

export const CoLinksProfileHeader = ({
  showLoading,
  setShowLoading,
  target,
  contract,
  currentUserAddress,
  targetAddress,
}: {
  showLoading: boolean;
  setShowLoading: Dispatch<React.SetStateAction<boolean>>;
  target: CoLinksProfile;
  contract: CoLinks;
  currentUserAddress: string;
  targetAddress: string;
}) => {
  const { targetBalance, superFriend } = useCoLinks({
    contract,
    address: currentUserAddress,
    target: targetAddress,
  });

  const { profile, imMuted, mutedThem } = target;

  const queryClient = useQueryClient();
  const isCurrentUser =
    targetAddress.toLowerCase() == currentUserAddress.toLowerCase();
  const [promptOffset, setPromptOffset] = useState(0);
  const bumpPromptOffset = () => {
    setPromptOffset(prev => prev + 1);
  };

  const { data: details } = useQuery(['twitter', profile.id], async () => {
    const {
      twitter_accounts_by_pk: twitter,
      github_accounts_by_pk: github,
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

  return (
    <ContentHeader css={{ '@sm': { mb: 0 } }}>
      <Flex column css={{ gap: '$md', flexGrow: 1, width: '100%' }}>
        <Flex
          css={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Flex alignItems="center" css={{ gap: '$sm' }}>
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
              <Flex css={{ gap: '$md', flexWrap: 'wrap' }}>
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
                      color: '$secondaryText',
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
          <Flex css={{ alignItems: 'flex-start', gap: '$md' }}>
            {isCurrentUser ? (
              <Button
                as={AppLink}
                color="neutral"
                outlined
                to={coLinksPaths.account}
              >
                <Settings />
                Edit Profile
              </Button>
            ) : (
              <Mutes
                targetProfileId={target.profile.id}
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
            <SkillTag key={s} skill={s} />
          ))}
        </Flex>

        {profile.description && (
          <Text color="secondary">{profile.description}</Text>
        )}

        {isCurrentUser && targetBalance !== undefined && targetBalance > 0 && (
          <Flex css={{ pt: '$md' }}>
            <PostForm
              label={
                <Text size={'medium'} semibold color={'heading'}>
                  {currentPrompt(promptOffset)}
                </Text>
              }
              refreshPrompt={bumpPromptOffset}
              showLoading={showLoading}
              onSuccess={() =>
                queryClient.setQueryData<CoSoul>(
                  [QUERY_KEY_COLINKS, targetAddress, 'cosoul'],
                  oldData => {
                    assert(oldData);
                    return {
                      ...oldData,
                      profile_public: {
                        ...oldData.profile_public,
                        post_count: oldData.profile_public?.post_count + 1,
                        post_count_last_30_days:
                          oldData.profile_public?.post_count_last_30_days + 1,
                      },
                    };
                  }
                )
              }
              onSave={() => setShowLoading(true)}
            />
          </Flex>
        )}
      </Flex>
    </ContentHeader>
  );
};
