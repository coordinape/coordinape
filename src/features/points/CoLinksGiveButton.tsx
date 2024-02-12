/* eslint-disable no-console */
import { useEffect, useState } from 'react';

import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useMutation, useQueryClient } from 'react-query';

import { useToast } from '../../hooks';
import useProfileId from '../../hooks/useProfileId';
import { client } from '../../lib/gql/client';
import { Button, Flex, Text, TextField } from '../../ui';

export const CoLinksGiveButton = ({
  activityId,
  gives,
}: {
  activityId: number;
  gives: {
    id: number;
    skill?: string;
    giver_profile_public?: {
      name?: string;
      id?: number;
    };
  }[];
}) => {
  const profileId = useProfileId(true);
  const { showError } = useToast();

  const queryClient = useQueryClient();
  const [skill, setSkill] = useState<string | undefined>(undefined);

  const myGive = gives.find(
    give => give.giver_profile_public?.id === profileId
  );

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ myGive, skill, gives });
  }, [myGive, skill, gives]);

  const createGiveMutation = () => {
    return client.mutate(
      {
        createCoLinksGive: [
          {
            payload: {
              activity_id: activityId,
            },
          },
          {
            id: true,
          },
        ],
      },
      {
        operationName: 'createCoLinksGive',
      }
    );
  };

  const updateSkillMutation = () => {
    if (!myGive?.id) {
      console.error('no give id');
      throw new Error('no give id');
    }
    return client.mutate(
      {
        update_colinks_gives_by_pk: [
          {
            pk_columns: {
              id: myGive?.id,
            },
            _set: {
              skill: skill,
            },
          },
          {
            id: true,
          },
        ],
      },
      {
        operationName: 'updateGiveSkill',
      }
    );
  };

  const deleteGiveMutation = async () => {
    if (!myGive?.id) {
      console.error('no give id');
      throw new Error('no give id');
    }
    return client.mutate(
      {
        deleteCoLinksGive: [
          {
            payload: {
              give_id: myGive!.id,
            },
          },
          {
            success: true,
          },
        ],
      },
      {
        operationName: 'updateGiveSkill',
      }
    );
  };

  const invalidateActivities = () => {
    queryClient.invalidateQueries([
      ACTIVITIES_QUERY_KEY,
      [QUERY_KEY_COLINKS, 'activity'],
    ]);
  };

  const { mutate: createGive } = useMutation(createGiveMutation, {
    onSuccess: () => {
      invalidateActivities();
    },
    onError: error => {
      showError(error);
    },
  });

  const { mutate: updateGiveSkill } = useMutation(updateSkillMutation, {
    onSuccess: () => {
      invalidateActivities();
    },
    onError: error => {
      showError(error);
    },
  });
  const { mutate: deleteGive } = useMutation(deleteGiveMutation, {
    onSuccess: () => {
      invalidateActivities();
    },
    onError: error => {
      showError(error);
    },
  });

  return (
    <>
      <Flex column css={{ gap: '$sm' }}>
        {!myGive && (
          <Button
            size={'small'}
            color={'transparent'}
            css={{ '&:hover': { color: '$ctaHover' } }}
            onClick={() => createGive()}
          >
            +GIVE
          </Button>
        )}
        {myGive && (
          <>
            {!myGive?.skill && (
              <>
                <TextField
                  placeholder={'enter a skill'}
                  value={skill}
                  onChange={e => setSkill(e.target.value)}
                />
                <Button onClick={() => updateGiveSkill()}>Save</Button>
              </>
            )}
            <Button onClick={() => deleteGive()}>Delete</Button>
          </>
        )}
        {gives.map(g => (
          <Text size="xs" semibold key={g.id}>
            +GIVE #{g.skill} from{' '}
            {g.giver_profile_public?.id === profileId
              ? 'You'
              : g.giver_profile_public?.name}
          </Text>
        ))}
      </Flex>
    </>
  );
};
