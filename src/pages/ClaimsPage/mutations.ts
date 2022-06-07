import { client } from 'lib/gql/client';
import { useMutation } from 'react-query';

export function useMarkClaimTaken() {
  return useMutation(
    ({ claimId, txHash }: { claimId: number; txHash: string }) => {
      return client.mutate(
        {
          update_claims_by_pk: [
            {
              _set: {
                txHash,
              },
              pk_columns: { id: claimId },
            },
            { id: true },
          ],
        },
        {
          operationName: 'useMarkClaimTaken',
        }
      );
    }
  );
}
