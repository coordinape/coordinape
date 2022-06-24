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
                txHash,
              },
              where: {
                distribution: {
                  vault: { vault_address: { _eq: vaultAddress } },
                  epoch: { circle_id: { _eq: circleId } },
                },
              },
            },
            {},
          ],
        },
        {
          operationName: 'useMarkClaimTaken',
        }
      );
    }
  );
}
