import assert from 'assert';

import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { useAuthStore } from 'features/auth';
import { client } from 'lib/gql/client';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Button } from '../../ui';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { LoadingIndicator } from 'components/LoadingIndicator';

import { QUERY_KEY_COLINKS } from './CoLinksWizard';

export const QUERY_KEY_MUTES = 'query-key-mutes';

export const Mutes = ({
  targetProfileId,
  targetProfileAddress,
}: {
  targetProfileId: number;
  targetProfileAddress: string;
}) => {
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
        queryClient.invalidateQueries([
          QUERY_KEY_COLINKS,
          targetProfileAddress,
          'profile',
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
        queryClient.invalidateQueries([
          QUERY_KEY_COLINKS,
          targetProfileAddress,
          'profile',
        ]);
      },
    }
  );

  if (isLoading || !mutes) {
    return <LoadingIndicator />;
  }

  return mutes.mutedThem ? (
    <ConfirmationModal
      key={'unmute'}
      trigger={<Button>Unmute</Button>}
      action={() => unmuteThem()}
      description="Are you sure you want to unmute this person?"
      yesText="Yes, unmute them!"
    />
  ) : (
    <ConfirmationModal
      key={'mute'}
      trigger={<Button>Mute</Button>}
      action={() => muteThem()}
      description="Are you sure you want to mute this person?"
      yesText="Yes, mute them!"
    />
  );
};
