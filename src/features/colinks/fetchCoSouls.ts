import { Selector, ValueTypes } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';

export type Where = ValueTypes['cosouls_bool_exp'];
export type OrderBy = ValueTypes['cosouls_order_by'];

const selection = Selector('cosouls')({
  address: true,
  id: true,
  token_id: true,
  pgive: true,
  profile_public: {
    name: true,
    avatar: true,
    reputation_score: {
      total_score: true,
    },
  },
  link_holders_aggregate: [
    {},
    {
      aggregate: {
        sum: {
          amount: true,
        },
      },
    },
  ],
});

export const fetchCoSouls = async (
  where: Where | null,
  orderBy: OrderBy[],
  page: number,
  pageSize: number
) => {
  const { cosouls } = await client.query(
    {
      cosouls: [
        {
          where,
          order_by: orderBy,
          offset: page * pageSize,
          limit: pageSize,
        },
        selection,
      ],
    },
    {
      operationName: 'cosouls_fetch_with_withLinks',
    }
  );
  return cosouls;
};

export const fetchCoSoul = async (address: string) => {
  const { cosouls } = await client.query(
    {
      cosouls: [
        {
          where: { address: { _ilike: address } },
          limit: 1,
        },
        {
          address: true,
          id: true,
          token_id: true,
          pgive: true,
          profile_public: {
            name: true,
            avatar: true,
            reputation_score: {
              total_score: true,
            },
          },
          link_holders_aggregate: [
            {},
            {
              aggregate: {
                sum: {
                  amount: true,
                },
              },
            },
          ],
        },
      ],
    },
    {
      operationName: 'cosoul_fetch_one_with_links',
    }
  );
  return cosouls.pop();
};

export type CoSoul = Awaited<ReturnType<typeof fetchCoSouls>>[number];
