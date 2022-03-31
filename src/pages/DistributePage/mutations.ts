import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useMutation } from 'react-query';

export function useSaveEpochDistribution() {
  return useMutation(
    (distribution?: ValueTypes['distributions_insert_input']) => {
      return client.mutate({
        insert_distributions_one: [
          {
            object: { ...distribution },
          },
          {
            id: true,
            created_at: true,
            epoch_id: true,
            vault_id: true,
            created_by: true,
            merkle_root: true,
          },
        ],
      });
    }
  );
}

export function useUpdateDistribution() {
  return useMutation((id: number) => {
    return client.mutate({
      update_distributions_by_pk: [
        {
          _set: { saved_on_chain: true },
          pk_columns: { id },
        },
        { id: true },
      ],
    });
  });
}
