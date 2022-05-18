import { client } from 'lib/gql/client';
import { useMutation } from 'react-query';

export function useMarkClaimTaken() {
  return useMutation((claimId: number) => {
    return client.mutate(
      {
        update_claims_by_pk: [
          {
            _set: {
              claimed: true,
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
  });
}
