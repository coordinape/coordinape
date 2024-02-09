import { useState } from 'react';

import { useMutation } from 'react-query';

import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Button, Text } from '../../ui';

export const CoLinksGiveButton = ({ activityId }: { activityId: number }) => {
  const [createdGive, setCreatedGive] = useState<number | undefined>(undefined);

  const { showError } = useToast();

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
        <Text>Yay you gave {createdGive}</Text>
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
