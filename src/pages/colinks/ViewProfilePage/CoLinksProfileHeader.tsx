import assert from 'assert';
import { Dispatch, useEffect, useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';
import { CoSoul } from 'features/colinks/fetchCoSouls';
import { PostForm } from 'features/colinks/PostForm';
import { useCoLinks } from 'features/colinks/useCoLinks';
import { client } from 'lib/gql/client';
import { useQuery, useQueryClient } from 'react-query';

import { Mutes } from '../../../features/colinks/Mutes';
import { QUERY_KEY_COLINKS } from '../../../features/colinks/wizard/CoLinksWizard';
import { Github, Settings, Twitter } from 'icons/__generated';
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

  const { data: socials } = useQuery(['twitter', profile.id], async () => {
    const { twitter_accounts_by_pk: twitter, github_accounts_by_pk: github } =
      await client.query(
        {
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

              <Flex css={{ gap: '$md', mt: '$xs' }}>
                {!isCurrentUser && superFriend && (
                  <Text tag color={'alert'}>
                    You are superfriends!
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
                {socials?.github && (
                  <Flex
                    as={Link}
                    href={`https://github.com/${socials?.github}`}
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
                    <Github nostroke /> {socials?.github}
                  </Flex>
                )}
                {socials?.twitter && (
                  <Flex
                    as={Link}
                    href={`https://twitter.com/${socials?.twitter}`}
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
                    <Twitter nostroke /> {socials?.twitter}
                  </Flex>
                )}
              </Flex>
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
        {profile.description && (
          <Flex>
            <Text>{profile.description}</Text>
          </Flex>
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
