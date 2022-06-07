import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

import type { Awaited } from 'types/shim';

export const getClaims = async (
  profileID: number
): Promise<typeof claims | undefined> => {
  const { claims } = await client.query(
    {
      claims: [
        {
          where: { profile_id: { _eq: profileID } },
          order_by: [{ created_at: order_by.desc }],
        },
        {
          id: true,
          address: true,
          index: true,
          proof: true,
          amount: true,
          txHash: true,
          distribution: {
            id: true,
            distribution_epoch_id: true,
            distribution_json: [{}, true],
            merkle_root: true,
            vault: {
              id: true,
              vault_address: true,
              token_address: true,
              simple_token_address: true,
              symbol: true,
              decimals: true,
              protocol: {
                id: true,
                name: true,
              },
            },
            epoch: {
              id: true,
              start_date: true,
              end_date: true,
              number: true,
              circle: {
                id: true,
                logo: true,
                name: true,
              },
            },
          },
        },
      ],
    },
    {
      operationName: 'getClaims',
    }
  );
  return claims;
};

export type ClaimsResults = Awaited<ReturnType<typeof getClaims>>;
export type ClaimsResult = Exclude<
  Awaited<ReturnType<typeof getClaims>>,
  undefined
>[0];
