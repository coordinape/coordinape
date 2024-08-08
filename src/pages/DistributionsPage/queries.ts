import assert from 'assert';

import { client } from 'lib/gql/client';

import type { Awaited } from 'types/shim';

export const getProfileIds = async (addresses: string[]) => {
  const { profiles } = await client.query(
    {
      profiles: [
        { where: { address: { _in: addresses } } },
        {
          id: true,
          address: true,
        },
      ],
    },
    {
      operationName: 'getProfileIds__DistributionPage',
    }
  );
  return profiles;
};

export const getEpochData = async (epochId: number, myAddress?: string) => {
  assert(myAddress);

  const gq = await client.query(
    {
      epochs_by_pk: [
        { id: epochId },
        {
          id: true,
          number: true,
          ended: true,
          start_date: true,
          end_date: true,
          description: true,
          circle: {
            id: true,
            name: true,
            fixed_payment_token_type: true,
            fixed_payment_vault_id: true,
            token_name: true,
            users: [
              {},
              {
                id: true,
                user_private: {
                  fixed_payment_amount: true,
                },
                profile: {
                  id: true,
                  address: true,
                  avatar: true,
                  name: true,
                },
              },
            ],
          },
          token_gifts: [
            { where: { tokens: { _gt: 0 } } },
            {
              recipient_address: true,
              recipient_id: true,
              recipient: {
                id: true,
                profile: { avatar: true, id: true, name: true, address: true },
              },
              tokens: true,
            },
          ],
          distributions: [
            { where: { tx_hash: { _is_null: false } } },
            {
              created_at: true,
              total_amount: true,
              tx_hash: true,
              distribution_type: true,
              distribution_json: [{}, true],
              gift_amount: true,
              fixed_amount: true,
              vault: {
                id: true,
                decimals: true,
                symbol: true,
                vault_address: true,
                simple_token_address: true,
                chain_id: true,
                // price_per_share: true,
              },
              epoch: {
                number: true,
                circle: { id: true, name: true },
              },
              claims: [
                {},
                {
                  id: true,
                  new_amount: true,
                  address: true,
                  profile_id: true,
                  profile: { avatar: true },
                },
              ],
            },
          ],
        },
      ],
    },
    { operationName: 'getEpochData' }
  );

  const epoch = gq.epochs_by_pk;
  return { ...epoch, distributions: epoch?.distributions || [] };
};

export type EpochDataResult = Awaited<ReturnType<typeof getEpochData>>;
export type Gift = Exclude<EpochDataResult['token_gifts'], undefined>[0];
