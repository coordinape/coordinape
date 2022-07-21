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
  return useMutation(
    ({
      epochId,
      id,
      txHash,
      circleId,
      vaultId,
    }: {
      id: number;
      epochId: number;
      txHash: string;
      vaultId: number;
      circleId: number;
    }) => {
      return client.mutate(
        {
          update_distributions_by_pk: [
            {
              _set: {
                tx_hash: txHash,
                distribution_epoch_id: epochId,
              },
              pk_columns: { id },
            },
            { id: true },
          ],
          createVaultTx: [
            {
              payload: {
                tx_type: 'Distribution',
                vault_id: vaultId,
                tx_hash: txHash,
                distribution_id: id,
                circle_id: circleId,
              },
            },
            { id: true },
          ],
        },
        {
          operationName: 'useMarkDistributionSaved',
        }
      );
    }
  );
}
