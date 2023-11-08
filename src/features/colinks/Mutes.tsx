import assert from 'assert';

import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { useAuthStore } from 'features/auth';
import { client } from 'lib/gql/client';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Button, Flex, Text } from '../../ui';
import { LoadingIndicator } from 'components/LoadingIndicator';

import { QUERY_KEY_COLINKS } from './CoLinksWizard';

export const QUERY_KEY_MUTES = 'query-key-mutes';

export const Mutes = ({ targetProfileId }: { targetProfileId: number }) => {
  const profileId = useAuthStore(state => state.profileId);

  const queryClient = useQueryClient();
  assert(profileId, 'profileId required');

  const fetchMutes = async () => {
    const { mutedThem, imMuted } = await client.query(
      {
        __alias: {
          mutedThem: {
            mutes_by_pk: [
              {
                profile_id: profileId,
                target_profile_id: targetProfileId,
              },
              {
                profile_id: true,
                target_profile_id: true,
              },
            ],
          },
          imMuted: {
            mutes_by_pk: [
              {
                profile_id: targetProfileId,
                target_profile_id: profileId,
              },
              {
                profile_id: true,
                target_profile_id: true,
              },
            ],
          },
        },
      },
      {
        operationName: 'fetchMutes',
      }
    );

    return { mutedThem: !!mutedThem, imMuted: !!imMuted };
  };

  const { data: mutes, isLoading } = useQuery(
    [QUERY_KEY_MUTES, profileId, targetProfileId],
    fetchMutes
  );

  const { mutate: muteThem } = useMutation(
    async () => {
      const { insert_mutes_one } = await client.mutate(
        {
          insert_mutes_one: [
            {
              object: {
                profile_id: profileId,
                target_profile_id: targetProfileId,
              },
            },
            {
              created_at: true,
            },
          ],
        },
        {
          operationName: 'createMute',
        }
      );
      assert(insert_mutes_one);
      return insert_mutes_one;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_MUTES, profileId, targetProfileId],
        });
        queryClient.invalidateQueries([
          ACTIVITIES_QUERY_KEY,
          [QUERY_KEY_COLINKS, 'activity'],
        ]);
      },
    }
  );

  const { mutate: unmuteThem } = useMutation(
    async () => {
      const { delete_mutes_by_pk } = await client.mutate(
        {
          delete_mutes_by_pk: [
            {
              profile_id: profileId,
              target_profile_id: targetProfileId,
            },
            {
              created_at: true,
            },
          ],
        },
        {
          operationName: 'createMute',
        }
      );
      assert(delete_mutes_by_pk);
      return delete_mutes_by_pk;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_MUTES, profileId, targetProfileId],
        });
        queryClient.invalidateQueries([
          ACTIVITIES_QUERY_KEY,
          [QUERY_KEY_COLINKS, 'activity'],
        ]);
      },
    }
  );

  if (isLoading || !mutes) {
    return <LoadingIndicator />;
  }

  return (
    <Flex column css={{ gap: '$md' }}>
      {mutes.mutedThem ? (
        <>
          <Text>
            You muted this person. You will not see their posts or replies.
          </Text>
          <Button onClick={() => unmuteThem()}>Unmute</Button>
        </>
      ) : (
        <Button onClick={() => muteThem()}>Mute</Button>
      )}
      {mutes.imMuted && (
        <Text>
          This person has muted you. They will no longer see your posts or
          replies.
        </Text>
      )}
    </Flex>
  );
};
