import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useMutation } from 'react-query';

const saveDistribution = async (
  distribution?: ValueTypes['distributions_insert_input']
) => {
  const { insert_distributions_one } = await client.mutate(
    {
      insert_distributions_one: [
        {
          object: { ...distribution },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'saveDistribution',
    }
  );
  return insert_distributions_one;
};

export function useSaveEpochDistribution() {
  return useMutation(saveDistribution);
}

export function useMarkDistributionSaved() {
  return useMutation(({ epochId, id }: { id: number; epochId: number }) => {
    return client.mutate(
      {
        update_distributions_by_pk: [
          {
            _set: {
              saved_on_chain: true,
              distribution_epoch_id: epochId,
            },
            pk_columns: { id },
          },
          { id: true },
        ],
      },
      {
        operationName: 'useMarkDistributionSaved',
      }
    );
  });
}
