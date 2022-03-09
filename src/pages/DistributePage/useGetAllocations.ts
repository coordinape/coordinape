import { token_gifts_select_column } from 'lib/gql/zeusUser';

import { useTypedQuery, useTypedMutation } from '../../hooks/gql';

export interface IClaim {
  id?: number;
  address: string;
  amount: number;
  distribution_id?: number;
  flag: boolean;
  index: number;
  proof: string;
  user_id: number;
}

export interface IDistribution {
  created_by: number;
  epoch_id: number;
  id?: number;
  merkle_root: string;
  total_amount: number;
  vault_address: string;
  claims: {
    data: IClaim[];
  };
  created_at?: string;
  updated_at?: string;
}

export function useGetAllocations(epochId: number) {
  // FIXME (minor): if this query's structure were changed
  // from: epoch -> circle -> users -> gifts
  // to: epoch -> gifts -> users
  // that would remove the need to repeatedly pass epochId as an argument
  return useTypedQuery(`circle-for-epoch-${epochId}`, {
    epochs_by_pk: [
      { id: epochId },
      {
        id: true,
        ended: true,
        circle_id: true,
        number: true,
        circle: {
          id: true,
          name: true,
          users: [
            { where: { received_gifts: { epoch_id: { _eq: epochId } } } },
            {
              address: true,
              name: true,
              id: true,
              circle_id: true,
              received_gifts: [
                { where: { epoch_id: { _eq: epochId } } },
                { tokens: true },
              ],
              received_gifts_aggregate: [
                { where: { epoch_id: { _eq: epochId } } },
                {
                  aggregate: {
                    count: [
                      {
                        columns: [token_gifts_select_column.recipient_id],
                      },
                      true,
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  });
}

export function useSaveDistribution(distribution: IDistribution | undefined) {
  return useTypedMutation(`save-dist`, {
    insert_distributions_one: [
      {
        object: {
          created_by: distribution?.created_by,
          epoch_id: distribution?.epoch_id,
          merkle_root: distribution?.merkle_root,
          total_amount: distribution?.total_amount,
          vault_address: distribution?.vault_address,
          claims: distribution?.claims,
        },
      },
      {
        id: true,
        created_at: true,
        updated_at: true,
        epoch_id: true,
        vault_id: true,
        created_by: true,
        merkle_root: true,
      },
    ],
  });
}
