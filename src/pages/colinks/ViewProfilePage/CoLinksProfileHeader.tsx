import assert from 'assert';
import { Dispatch, useEffect, useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';
import { CoSoul } from 'features/colinks/fetchCoSouls';
import { PostForm } from 'features/colinks/PostForm';
import { useCoLinks } from 'features/colinks/useCoLinks';
import { client } from 'lib/gql/client';
import { useQuery, useQueryClient } from 'react-query';

import { Mutes } from '../../../features/colinks/Mutes';
import { SkillTag } from '../../../features/colinks/SkillTag';
import { QUERY_KEY_COLINKS } from '../../../features/colinks/wizard/CoLinksWizard';
import { order_by } from '../../../lib/gql/__generated__/zeus';
import { Github, Link as LinkIcon, Settings, Twitter } from 'icons/__generated';
import { Avatar, Button, ContentHeader, Flex, Link, Text } from 'ui';

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

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setShowMenu(false);
  }, [target]);

  return (
    <ContentHeader>
      <Flex column css={{ gap: '$md', flexGrow: 1, width: '100%' }}>
        <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Flex alignItems="center" css={{ gap: '$sm' }}>
            <Avatar
              size="large"
              name={profile.name}
              path={profile.avatar}
              margin="none"
              css={{ mr: '$sm' }}
            />
            <Flex column>
              <Text h2 display css={{ color: '$secondaryButtonText' }}>
                {profile.name}
              </Text>
            </Flex>
          </Flex>
          <Flex css={{ alignItems: 'center', gap: '$md' }}>
            {showMenu && (
              <Flex column>
                <Mutes
                  targetProfileId={target.profile.id}
                  targetProfileAddress={targetAddress}
                />
              </Flex>
            )}
            {!isCurrentUser && (
              <Button
                color="neutral"
                outlined
                css={{ borderRadius: 99999, aspectRatio: '1/1', padding: 0 }}
                onClick={() => setShowMenu(prevState => !prevState)}
              >
                <Settings size={'md'} css={{ ml: 4 }} />
              </Button>
            )}
          </Flex>
        </Flex>
        <Flex css={{ gap: '$sm', mt: '$xs', flexWrap: 'wrap' }}>
          {!isCurrentUser && superFriend && (
            <Text tag color={'secondary'}>
              You are mutual friends
            </Text>
          )}
          {imMuted && (
            <Text tag color={'alert'}>
              Has you muted
            </Text>
          )}
          {mutedThem && (
            <Text tag color={'alert'}>
              Muted
            </Text>
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
                color: '$neutral',
                '&:hover': {
                  color: '$text',
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
                color: '$neutral',
                '&:hover': {
                  color: '$text',
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
              css={{
                alignItems: 'center',
                gap: '$xs',
                color: '$neutral',
                '&:hover': {
                  color: '$text',
                },
              }}
            >
              <LinkIcon /> {profile.website as string}
            </Flex>
          )}
          {details?.skills.map(s => (
            <SkillTag key={s} skill={s} />
          ))}
        </Flex>

        {profile.description && (
          <Text color="secondary">{profile.description}</Text>
        )}

        {isCurrentUser && targetBalance !== undefined && targetBalance > 0 && (
          <Flex css={{ maxWidth: '$readable' }}>
            <PostForm
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
