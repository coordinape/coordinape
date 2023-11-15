import { useQuery, useQueryClient } from 'react-query';

import { Github, X } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Avatar, Button, Flex, IconButton, Text } from '../../ui';
import { useAuthStore } from '../auth';

import { ConnectGitHubButton } from './ConnectGitHubButton';

export const ShowOrConnectGitHub = ({
  callbackPage,
  minimal,
}: {
  callbackPage?: string;
  minimal?: boolean;
}) => {
  const profileId =
    useAuthStore(state => state.profileId) ?? -1; /*this shouldn't happen*/

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['github', 'me'],
    async () => {
      const { github_accounts_by_pk } = await client.query(
        {
          github_accounts_by_pk: [
            {
              profile_id: profileId,
            },
            {
              username: true,
              avatar_url: true,
            },
          ],
        },
        {
          operationName: 'github_me',
        }
      );

      return github_accounts_by_pk;
    },
    {
      enabled: !!profileId,
    }
  );

  const deleteGitHub = async () => {
    await client.mutate(
      {
        delete_github_accounts_by_pk: [
          {
            profile_id: profileId,
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'delete_my_github',
      }
    );
    await queryClient.invalidateQueries(['github', 'me']);
  };

  if (isLoading) {
    return null;
  }
  if (data) {
    if (minimal) {
      return (
        <Text semibold css={{ alignItems: 'center', gap: '$sm' }}>
          <Github />
          <Text semibold>{data.username}</Text>
          <IconButton onClick={deleteGitHub}>
            <X />
          </IconButton>
        </Text>
      );
    }
    return (
      <Flex column css={{ gap: '$lg' }}>
        <Flex css={{ gap: '$md' }}>
          <Flex alignItems="center" css={{ gap: '$sm' }}>
            <Avatar size="large" name={data.username} path={data.avatar_url} />
            <Flex column>
              <Text semibold>{data.username}</Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Button
            size="xs"
            color="neutral"
            onClick={deleteGitHub}
            css={{ flexShrink: 1, flex: 0, flexGrow: 0, flexBasis: 'auto' }}
          >
            Disconnect
          </Button>
        </Flex>
      </Flex>
    );
  }
  return (
    <Flex>
      <ConnectGitHubButton callbackPage={callbackPage} />
    </Flex>
  );
};
