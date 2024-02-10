import { useState } from 'react';

import { useMutation } from 'react-query';

import { useToast } from '../../hooks';
import useProfileId from '../../hooks/useProfileId';
import { client } from '../../lib/gql/client';
import { Button, Text } from '../../ui';

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

  const myGive = gives.find(
    give => give.giver_profile_public?.id === profileId
  );

  const [createdGive, setCreatedGive] = useState<number | undefined>(
    myGive?.id
  );

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

  return (
    <>
      {createdGive ? (
        <Text>Yay you gave! {createdGive}</Text>
      ) : (
        <Button
          size={'small'}
          color={'transparent'}
          css={{ '&:hover': { color: '$ctaHover' } }}
          onClick={() => createGive()}
        >
          +GIVE
        </Button>
      )}
    </>
  );
};
