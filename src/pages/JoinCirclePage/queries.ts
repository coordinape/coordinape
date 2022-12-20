import { client } from 'lib/gql/client';

export const getProfilesWithAddress = async (address: string) => {
  const { profiles } = await client.query(
    {
      profiles: [{ where: { address: { _ilike: address } } }, { name: true }],
    },
    { operationName: `joinCircle_getProfilesWithAddress` }
  );

  return profiles.pop();
};
export const QUERY_KEY_PROFILE_BY_ADDRESS = 'joinCircle_getProfilesWithAddress';
