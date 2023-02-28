import { client } from 'lib/gql/client';

import { Awaited } from 'types/shim';

export const getCreateCircleData = async (address: string) => {
  const { users: myUsers, profiles } = await client.query(
    {
      users: [
        {
          where: {
            _and: [
              { circle: { deleted_at: { _is_null: true } } },
              { address: { _ilike: address } },
            ],
          },
        },
        {
          role: true,
          circle: {
            organization: {
              id: true,
              name: true,
              sample: true,
            },
          },
        },
      ],
      profiles: [
        {
          where: { address: { _ilike: address } },
          limit: 1,
        },
        {
          name: true,
        },
      ],
    },
    {
      operationName: 'getCreateCircleData',
    }
  );
  const myProfile = profiles.pop();
  return { myUsers, myProfile };
};

export const QUERY_KEY_CREATE_CIRCLE = 'getCreateCircleData';
export type CreateCircleQueryData = Awaited<
  ReturnType<typeof getCreateCircleData>
>;
