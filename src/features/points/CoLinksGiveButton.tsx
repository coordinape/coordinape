import { useState } from 'react';

import { useMutation } from 'react-query';

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

  const [skill, setSkill] = useState<string | undefined>(undefined);

  const myGive = gives.find(
    give => give.giver_profile_public?.id === profileId
  );

  const [createdGive, setCreatedGive] = useState<number | undefined>(
    myGive?.id
  );
  // TODO: invalidation after you give

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
    return client.mutate(
      {
        update_colinks_gives_by_pk: [
          {
            pk_columns: {
              id: myGive!.id,
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

  const { mutate: createGive } = useMutation(createGiveMutation, {
    onSuccess: data => {
      if (data.createCoLinksGive) {
        setCreatedGive(data.createCoLinksGive.id);
      }
    },
    onError: error => {
      showError(error);
    },
  });

  const { mutate: updateGiveSkill } = useMutation(updateSkillMutation, {
    // onSuccess: data => {
    //   // if (data.createCoLinksGive) {
    //   //   setCreatedGive(data.createCoLinksGive.id);
    //   // }
    // },
    onError: error => {
      showError(error);
    },
  });
  const { mutate: deleteGive } = useMutation(deleteGiveMutation, {
    // onSuccess: data => {
    //   // if (data.createCoLinksGive) {
    //   //   setCreatedGive(data.createCoLinksGive.id);
    //   // }
    // },
    onError: error => {
      showError(error);
    },
  });

  return (
    <>
      <Flex column css={{ gap: '$sm' }}>
        {!createdGive && (
          <Button
            size={'small'}
            color={'transparent'}
            css={{ '&:hover': { color: '$ctaHover' } }}
            onClick={() => createGive()}
          >
            +GIVE
          </Button>
        )}
        {createdGive && (
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
