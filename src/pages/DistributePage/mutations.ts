import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useMutation } from 'react-query';

const saveDistribution = async (
  distribution?: ValueTypes['distributions_insert_input']
) => {
  const { insert_distributions_one } = await client.mutate({
    insert_distributions_one: [
      {
        object: { ...distribution },
      },
      {
        id: true,
      },
    ],
  });
  return insert_distributions_one;
};

export function useSaveEpochDistribution() {
  return useMutation(saveDistribution);
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
