import { Dispatch } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';
import { PostForm } from 'features/colinks/PostForm';
import { useCoLinks } from 'features/colinks/useCoLinks';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { Github, Twitter } from 'icons/__generated';
import { Avatar, ContentHeader, Flex, Link, Text } from 'ui';

import { CoLinksProfile } from './ViewProfilePageContents';

export const CoLinksProfileHeader = ({
  showLoading,
  setShowLoading,
  profile,
  contract,
  currentUserAddress,
  targetAddress,
}: {
  showLoading: boolean;
  setShowLoading: Dispatch<React.SetStateAction<boolean>>;
  profile: CoLinksProfile;
  contract: CoLinks;
  currentUserAddress: string;
  targetAddress: string;
}) => {
  const { subjectBalance, superFriend } = useCoLinks({
    contract,
    address: currentUserAddress,
    subject: targetAddress,
  });
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

  return (
    <ContentHeader>
      <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
        <Flex css={{ justifyContent: 'space-between' }}>
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
                {socials?.github && (
                  <Link
                    href={`https://github.com/${socials?.github}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github nostroke /> {socials?.github}
                  </Link>
                )}
                {socials?.twitter && (
                  <Link
                    href={`https://twitter.com/${socials?.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Twitter nostroke /> {socials?.twitter}
                  </Link>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        {isCurrentUser && subjectBalance !== undefined && subjectBalance > 0 && (
          <Flex css={{ maxWidth: '$readable' }}>
            <PostForm
              showLoading={showLoading}
              onSave={() => setShowLoading(true)}
            />
          </Flex>
        )}
      </Flex>
    </ContentHeader>
  );
};
