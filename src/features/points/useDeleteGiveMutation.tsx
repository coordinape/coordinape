import { useMutation } from 'react-query';

import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';

type UseDeleteGiveMutationProps = {
  giveId: number | undefined;
  onSuccess: () => void;
};

export const useDeleteGiveMutation = ({
  giveId,
  onSuccess,
}: UseDeleteGiveMutationProps) => {
  const { showError } = useToast();
  const deleteGiveMutation = async () => {
    if (!giveId) {
      throw new Error('no give id');
    }
    return client.mutate(
      {
        deleteCoLinksGive: [
          {
            payload: {
              give_id: giveId,
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
  const { mutate: deleteGive } = useMutation(deleteGiveMutation, {
    onSuccess: onSuccess,
    onError: error => {
      showError(error);
    },
  });
  return deleteGive;
};
