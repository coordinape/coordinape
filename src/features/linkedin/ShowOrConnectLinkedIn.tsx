import { LinkedInLogoIcon } from '@radix-ui/react-icons';
import { useQuery, useQueryClient } from 'react-query';

import { X } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Avatar, Button, Flex, IconButton, Text } from '../../ui';
import { useAuthStore } from '../auth';

import { ConnectLinkedInButton } from './ConnectLinkedInButton';

export const ShowOrConnectLinkedIn = ({
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
    ['linkedin', 'me'],
    async () => {
      const { linkedin_accounts_by_pk } = await client.query(
        {
          linkedin_accounts_by_pk: [
            {
              profile_id: profileId,
            },
            {
              name: true,
              picture: true,
            },
          ],
        },
        {
          operationName: 'github_me',
        }
      );

      return linkedin_accounts_by_pk;
    },
    {
      enabled: !!profileId,
    }
  );

  const deleteLinkedIn = async () => {
    await client.mutate(
      {
        delete_linkedin_accounts_by_pk: [
          {
            profile_id: profileId,
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'delete_my_linkedin',
      }
    );
    await queryClient.invalidateQueries(['linkedin', 'me']);
  };

  if (isLoading) {
    return null;
  }
  if (data) {
    if (minimal) {
      return (
        <Text semibold css={{ alignItems: 'center', gap: '$sm' }}>
          <LinkedInLogoIcon />
          <Text semibold>{data.name}</Text>
          <IconButton onClick={deleteLinkedIn}>
            <X />
          </IconButton>
        </Text>
      );
    }
    return (
      <Flex column css={{ gap: '$lg' }}>
        <Flex css={{ gap: '$md' }}>
          <Flex alignItems="center" css={{ gap: '$sm' }}>
            <Avatar size="large" name={data.name} path={data.picture} />
            <Flex column>
              <Text semibold>{data.name}</Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Button
            size="xs"
            color="neutral"
            onClick={deleteLinkedIn}
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
      <ConnectLinkedInButton callbackPage={callbackPage} />
    </Flex>
  );
};
