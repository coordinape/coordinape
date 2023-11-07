import { useQuery, useQueryClient } from 'react-query';

import { client } from '../../lib/gql/client';
import { Avatar, Button, Flex, Text } from '../../ui';
import { useAuthStore } from '../auth';

import { ConnectTwitterButton } from './ConnectTwitterButton';

export const ShowOrConnectTwitter = () => {
  const profileId =
    useAuthStore(state => state.profileId) ?? -1; /*this shouldn't happen*/

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['twitter', 'me'],
    async () => {
      const { twitter_accounts_by_pk } = await client.query(
        {
          twitter_accounts_by_pk: [
            {
              profile_id: profileId,
            },
            {
              username: true,
              name: true,
            },
          ],
        },
        {
          operationName: 'twitter_me',
        }
      );

      return twitter_accounts_by_pk;
    },
    {
      enabled: !!profileId,
    }
  );

  const deleteTwitter = async () => {
    await client.mutate(
      {
        delete_twitter_accounts_by_pk: [
          {
            profile_id: profileId,
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'delete_twitter_accounts_by_pk',
      }
    );
    await queryClient.invalidateQueries(['twitter', 'me']);
  };

  if (isLoading) {
    return null;
  }
  if (data) {
    return (
      <Flex column css={{ gap: '$lg' }}>
        <Flex css={{ gap: '$md' }}>
          <Flex alignItems="center" css={{ gap: '$sm' }}>
            <Avatar
              size="large"
              name={data.username}
              path={`https://unavatar.io/twitter/${data.username}`}
            />
            <Flex column>
              <Text semibold>{data.name ?? data.username}</Text>
              <Text>@{data.username}</Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Button
            size="xs"
            color="neutral"
            onClick={deleteTwitter}
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
      <ConnectTwitterButton />
    </Flex>
  );
};
