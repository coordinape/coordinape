import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { Contracts, getUnwrappedAmount } from 'lib/vaults';

import type { Awaited } from 'types/shim';

export const getClaims = async (
  profileId: number,
  contracts?: Contracts
): Promise<typeof claims | undefined> => {
  const { claims } = await client.query(
    {
      claims: [
        {
          where: { profile_id: { _eq: profileId } },
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
                organization: {
                  name: true,
                },
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

  if (!contracts) return claims;

  type ClaimWithUnwrappedAmount = Exclude<typeof claims, undefined>[0] & {
    unwrappedAmount: number;
  };

  for (const claim of claims) {
    const { distribution } = claim;
    const pricePerShare = await contracts.getPricePerShare(
      distribution.vault.vault_address,
      distribution.vault.symbol,
      distribution.vault.decimals
    );

    const unwrappedAmount = getUnwrappedAmount(claim.amount, pricePerShare);

    (claim as ClaimWithUnwrappedAmount).unwrappedAmount = unwrappedAmount;
  }
  return claims;
};

type Claims = Exclude<Awaited<ReturnType<typeof getClaims>>, undefined>[0];

export type ClaimsResult = Claims & { unwrappedAmount?: number };
