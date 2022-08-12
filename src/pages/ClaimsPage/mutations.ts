import { client } from 'lib/gql/client';
import { useMutation } from 'react-query';

export function useMarkClaimTaken() {
  return useMutation(
    ({
      claimId,
      circleId,
      txHash,
      vaultAddress,
    }: {
      claimId: number;
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
                id: { _lte: claimId },
                distribution: {
                  vault: { vault_address: { _eq: vaultAddress } },
                  epoch: { circle: { id: { _eq: circleId } } },
                },
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
