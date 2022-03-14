import { client } from 'lib/gql/client';
import { ValueTypes } from 'lib/gql/zeusUser';
import { useMutation } from 'react-query';

import { useTypedMutation } from '../../hooks/gql';

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

export function useSaveEpochDistribution(
  distribution: ValueTypes['distributions_insert_input']
) {
  return useMutation(`save-epoch-dist`, () => {
    return client.mutate({
      insert_distributions_one: [
        {
          object: distribution,
        },
        {
          id: true,
        },
      ],
    });
  });
}
