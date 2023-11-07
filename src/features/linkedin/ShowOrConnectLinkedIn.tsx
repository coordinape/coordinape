import { useQuery, useQueryClient } from 'react-query';

import { client } from '../../lib/gql/client';
import { Avatar, Button, Flex, Text } from '../../ui';
import { useAuthStore } from '../auth';

import { ConnectLinkedInButton } from './ConnectLinkedInButton';

export const ShowOrConnectLinkedIn = () => {
  const profileId =
    useAuthStore(state => state.profileId) ?? -1; /*this shouldn't happen*/

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['linkedin', 'me'],
    async () => {
      const { linkedin_account_by_pk } = await client.query(
        {
          linkedin_account_by_pk: [
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

      return linkedin_account_by_pk;
    },
    {
      enabled: !!profileId,
    }
  );

  const deleteLinkedIn = async () => {
    await client.mutate(
      {
        delete_linkedin_account_by_pk: [
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
      <ConnectLinkedInButton />
    </Flex>
  );
};
