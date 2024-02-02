import { client } from 'lib/gql/client';

import { Awaited } from 'types/shim';

export const getCreateCircleData = async (profileId: number) => {
  const { users: myUsers, profiles } = await client.query(
    {
      users: [
        {
          where: {
            _and: [
              { circle: { deleted_at: { _is_null: true } } },
              { profile_id: { _eq: profileId } },
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
          where: { id: { _eq: profileId } },
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
