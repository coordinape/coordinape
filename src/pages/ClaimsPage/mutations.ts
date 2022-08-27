import { client } from 'lib/gql/client';
import { useMutation } from 'react-query';

export function useMarkClaimTaken() {
  return useMutation(
    ({ claimIds, txHash }: { claimIds: number[]; txHash: string }) => {
      const idsToMark = claimIds.map(id => ({ id: { _eq: id } }));
      return client.mutate(
        {
          update_claims: [
            {
              _set: {
                txHash: txHash,
              },
              where: {
                txHash: { _is_null: true },
                _or: idsToMark,
              },
            },
            { returning: { id: true } },
          ],
          delete_pending_vault_transactions_by_pk: [
            { tx_hash: txHash },
            { __typename: true },
          ],
        },
        { operationName: 'markClaimTaken' }
      );
    }
  );
}
