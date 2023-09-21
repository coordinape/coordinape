import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

import { Awaited } from 'types/shim';

export const getMembersPageData = async (circleId: number) => {
  return client.query(
    {
      circles_by_pk: [
        { id: circleId },
        {
          id: true,
          fixed_payment_token_type: true,
          fixed_payment_vault_id: true,
          name: true,
          only_giver_vouch: true,
          vouching: true,
          vouching_text: true,
          token_name: true,
          organization: { sample: true },
          epochs: [
            {
              where: {
                start_date: { _lt: 'now()' },
                ended: { _eq: false },
              },
            },
            { id: true },
          ],
          users: [
            { where: { deleted_at: { _is_null: true } } },
            {
              id: true,
              profile_id: true,
              bio: true,
              circle_id: true,
              created_at: true,
              deleted_at: true,
              epoch_first_visit: true,
              fixed_non_receiver: true,
              give_token_received: true,
              give_token_remaining: true,
              non_giver: true,
              non_receiver: true,
              role: true,
              starting_tokens: true,
              updated_at: true,
              profile: {
                avatar: true,
                id: true,
                address: true,
                skills: true,
                name: true,
                cosoul: {
                  id: true,
                },
              },
              user_private: { fixed_payment_amount: true },
              teammates: [{}, { teammate: { id: true } }],
            },
          ],
          nominees: [
            {
              where: {
                ended: { _eq: false },
                expiry_date: { _gt: 'now' },
              },
              order_by: [{ expiry_date: order_by.asc }],
            },
            {
              id: true,
              address: true,
              nominated_by_user_id: true,
              profile: { name: true },
              nominations: [
                {},
                {
                  created_at: true,
                  voucher_id: true,
                  id: true,
                  voucher: {
                    id: true,
                    profile_id: true,
                    profile: { name: true },
                  },
                },
              ],
              nominator: {
                profile_id: true,
                profile: { avatar: true, name: true },
              },
              description: true,
              nominated_date: true,
              expiry_date: true,
              vouches_required: true,
              ended: true,
            },
          ],
        },
      ],
    },
    { operationName: 'getMembersPageData' }
  );
};

export type QueryCircle = NonNullable<
  Awaited<ReturnType<typeof getMembersPageData>>['circles_by_pk']
>;

export type QueryUser = QueryCircle['users'][0];
export type QueryNominee = QueryCircle['nominees'][0];

export const QUERY_KEY_GET_MEMBERS_PAGE_DATA = 'getMembersPageData';
