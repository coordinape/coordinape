import { client } from 'lib/gql/client';

import type { Awaited } from 'types/shim';

export const getClaims = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  profileID: number
): Promise<typeof claims | undefined> => {
  const { claims } = await client.query(
    {
      claims: [
        {
          where: { profile_id: { _eq: profileID } },
        },
        {
          id: true,
          address: true,
          index: true,
          proof: true,
          amount: true,
          distribution: {
            id: true,
            distribution_epoch_id: true,
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
