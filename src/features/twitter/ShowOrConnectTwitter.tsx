import { useQueryClient } from 'react-query';

import { Twitter, X } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Avatar, Button, Flex, IconButton, Text } from '../../ui';
import { useAuthStore } from '../auth';

import { ConnectTwitterButton } from './ConnectTwitterButton';
import { useMyTwitter } from './useMyTwitter';

export const ShowOrConnectTwitter = ({
  callbackPage,
  minimal,
}: {
  callbackPage?: string;
  minimal?: boolean;
}) => {
  const profileId =
    useAuthStore(state => state.profileId) ?? -1; /*this shouldn't happen*/

  const queryClient = useQueryClient();

  const { twitter, isLoading } = useMyTwitter(profileId);

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
  if (twitter) {
    if (minimal) {
      return (
        <Text semibold css={{ alignItems: 'center', gap: '$sm' }}>
          <Twitter />
          <Text semibold>{twitter.username}</Text>
          <IconButton onClick={deleteTwitter}>
            <X />
          </IconButton>
        </Text>
      );
    }
    return (
      <Flex column css={{ gap: '$lg' }}>
        <Flex css={{ gap: '$md' }}>
          <Flex alignItems="center" css={{ gap: '$sm' }}>
            <Avatar
              size="large"
              name={twitter.username}
              path={twitter.profile_image_url}
            />
            <Flex column>
              <Text semibold>{twitter.name ?? twitter.username}</Text>
              <Text>@{twitter.username}</Text>
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
      <ConnectTwitterButton callbackPage={callbackPage} />
    </Flex>
  );
};
