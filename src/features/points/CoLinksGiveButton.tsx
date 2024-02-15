import { useState } from 'react';

import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useMutation, useQueryClient } from 'react-query';

import { useToast } from '../../hooks';
import useProfileId from '../../hooks/useProfileId';
import { client } from '../../lib/gql/client';
import { PickOneSkill } from '../../pages/AccountPage/AccountPage';
import { Button, Flex, Text } from '../../ui';

export const CoLinksGiveButton = ({
  activityId,
  isMyPost,
  gives,
}: {
  activityId: number;
  isMyPost: boolean;
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

  const myGive = gives.find(
    give => give.giver_profile_public?.id === profileId
  );

  const [skill, setSkill] = useState<string | undefined>(myGive?.skill);

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

  const updateSkillMutation = async (newSkill: string | undefined) => {
    if (!myGive?.id) {
      throw new Error('no give id');
    }
    const { update_colinks_gives_by_pk } = await client.mutate(
      {
        update_colinks_gives_by_pk: [
          {
            pk_columns: {
              id: myGive?.id,
            },
            _set: {
              skill: newSkill,
            },
          },
          {
            id: true,
            skill: true,
          },
        ],
      },
      {
        operationName: 'updateGiveSkill',
      }
    );
    return update_colinks_gives_by_pk?.skill;
  };

  const deleteGiveMutation = async () => {
    if (!myGive?.id) {
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
    onSuccess: skill => {
      invalidateActivities();
      setSkill(skill);
    },
    onError: error => {
      showError(error);
    },
  });
  const { mutate: deleteGive } = useMutation(deleteGiveMutation, {
    onSuccess: () => {
      invalidateActivities();
      setSkill(undefined);
    },
    onError: error => {
      showError(error);
    },
  });

  return (
    <>
      <Flex column css={{ gap: '$sm' }}>
        {!isMyPost && !myGive && (
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
            <PickOneSkill
              setSkill={skill => updateGiveSkill(skill)}
              skill={skill}
              placeholder={'Choose a GIVE Reason'}
              clearSkill={() => deleteGive()}
            />
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
