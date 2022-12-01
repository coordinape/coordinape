import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { Contracts } from 'lib/vaults';

import type { Awaited } from 'types/shim';

export const getClaims = async (
  profileId: number,
  contracts: Contracts
): Promise<typeof claims | undefined> => {
  const { claims } = await client.query(
    {
      claims: [
        {
          where: {
            profile_id: { _eq: profileId },
            distribution: {
              tx_hash: { _is_null: false },
              vault: { chain_id: { _eq: Number(contracts.chainId) } },
            },
          },
          order_by: [{ created_at: order_by.desc }],
        },
        {
          id: true,
          address: true,
          index: true,
          proof: true,
          amount: true,
          new_amount: true,
          txHash: true,
          distribution: {
            id: true,
            created_at: true,
            distribution_epoch_id: true,
            distribution_json: [{}, true],
            merkle_root: true,
            tx_hash: true,
            distribution_type: true,
            vault: {
              id: true,
              chain_id: true,
              vault_address: true,
              token_address: true,
              simple_token_address: true,
              symbol: true,
              decimals: true,
              price_per_share: true,
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
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      ],
    },
    { operationName: 'getClaims' }
  );

  type ClaimWithUnwrappedAmount = Exclude<typeof claims, undefined>[0] & {
    unwrappedAmount: number;
    unwrappedNewAmount: number;
  };

  for (const claim of claims) {
    const { price_per_share } = claim.distribution.vault;

    (claim as ClaimWithUnwrappedAmount).unwrappedAmount =
      claim.amount * price_per_share;
    (claim as ClaimWithUnwrappedAmount).unwrappedNewAmount =
      claim.new_amount * price_per_share;
  }
  return claims;
};

type Claim = Exclude<Awaited<ReturnType<typeof getClaims>>, undefined>[0];

export type QueryClaim = Claim & {
  unwrappedAmount?: number;
  unwrappedNewAmount?: number;
};
