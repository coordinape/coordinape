import { client } from 'lib/gql/client';

export const getProfilesWithAddress = async (address: string) => {
  const { profiles } = await client.query(
    {
      profiles: [
        { where: { address: { _ilike: address } } },
        {
          name: true,
          users: [
            {
              where: {
                deleted_at: { _is_null: true },
                circle: {
                  deleted_at: { _is_null: true },
                },
              },
            },
            {
              id: true,
              circle_id: true,
              circle: {
                logo: true,
                name: true,
                organization: { logo: true, name: true },
              },
            },
          ],
          org_members: [
            { where: { deleted_at: { _is_null: true } } },
            { org_id: true },
          ],
        },
      ],
    },
    { operationName: `joinCircle_getProfilesWithAddress` }
  );

  return profiles.pop();
};
export const QUERY_KEY_PROFILE_BY_ADDRESS = 'joinCircle_getProfilesWithAddress';
