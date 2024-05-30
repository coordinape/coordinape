import assert from 'assert';

import { useQueryClient } from 'react-query';

import { useToast } from '../../hooks';
import { Farcaster } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Button } from '../../ui';

export const ConnectFarcasterButton = () => {
  const queryClient = useQueryClient();

  const { showError, showSuccess } = useToast();

  const onAdd = async () => {
    try {
      const { addFarcaster } = await client.mutate(
        {
          addFarcaster: {
            success: true,
            error: true,
          },
        },
        {
          operationName: 'addFarcaster',
        }
      );
      assert(addFarcaster);
      if (!addFarcaster.success) {
        showError(addFarcaster.error);
      } else {
        queryClient.invalidateQueries(['farcaster', 'me']);
        showSuccess('Farcaster connected successfully');
      }
    } catch (e: any) {
      showError(e);
    }
  };

  return (
    <Button onClick={onAdd}>
      <Farcaster fa /> Connect Farcaster
    </Button>
  );
};
