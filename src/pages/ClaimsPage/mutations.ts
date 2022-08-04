import { client } from 'lib/gql/client';
import { useMutation } from 'react-query';

export function useMarkClaimTaken() {
  return useMutation(
    ({
      circleId,
      txHash,
      vaultAddress,
    }: {
      circleId: number;
      txHash: string;
      vaultAddress: string;
    }) => {
      return client.mutate(
        {
          update_claims: [
            {
              _set: {
                txHash: txHash,
              },
              where: {
                txHash: { _is_null: true },
                distribution: {
                  vault: { vault_address: { _eq: vaultAddress } },
                  epoch: { circle: { id: { _eq: circleId } } },
                },
              },
            },
            {
              returning: {
                id: true,
              },
            },
          ],
        },
        {
          operationName: 'useMarkClaimTaken',
        }
      );
    }
  );
}
