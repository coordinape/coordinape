import { useQueryClient } from 'react-query';

import useProfileId from '../../hooks/useProfileId';
import { Farcaster, X } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Avatar, Button, Flex, IconButton, Link, Text } from '../../ui';

import { ConnectFarcasterButton } from './ConnectFarcasterButton';
import { useMyFarcaster } from './useMyFarcaster';

export const ShowOrConnectFarcaster = ({ minimal }: { minimal?: boolean }) => {
  const profileId = useProfileId(true);

  const queryClient = useQueryClient();

  const { farcaster, isLoading } = useMyFarcaster(profileId);

  const deleteFarcaster = async () => {
    await client.mutate(
      {
        delete_farcaster_accounts_by_pk: [
          {
            profile_id: profileId,
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'delete_farcaster_accounts_by_pk',
      }
    );
    await queryClient.invalidateQueries(['farcaster', 'me']);
  };

  if (isLoading) {
    return null;
  }
  if (farcaster) {
    if (minimal) {
      return (
        <Text semibold css={{ alignItems: 'center', gap: '$sm' }}>
          {/*TODO: farcaster icon*/}
          <Farcaster fa />
          <Text semibold>{farcaster.username}</Text>
          <IconButton onClick={deleteFarcaster}>
            <X />
          </IconButton>
        </Text>
      );
    }
    return (
      <Flex column css={{ gap: '$lg' }}>
        <Flex css={{ gap: '$md' }}>
          <Link
            href={`https://warpcast.com/${farcaster.username}`}
            target="_blank"
            rel="noreferrer"
          >
            <Flex alignItems="center" css={{ gap: '$sm' }}>
              <Avatar
                size="large"
                name={farcaster.username}
                //TODO: how are we dealing with avatar
                path={farcaster.pfp_url}
              />
              <Flex column>
                <Text semibold>{farcaster.name ?? farcaster.username}</Text>
                <Text>@{farcaster.username}</Text>
              </Flex>
            </Flex>
          </Link>
        </Flex>
        <Flex>
          <Button
            size="xs"
            color="neutral"
            onClick={deleteFarcaster}
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
      <ConnectFarcasterButton />
    </Flex>
  );
};
