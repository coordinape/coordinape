import { adminClient } from './gql/adminClient';

export const getProfilesWithName = async (source: string, name: string) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: { name: { _eq: name } },
        },
        {
          id: true,
          address: true,
          name: true,
        },
      ],
    },
    {
      operationName: `${source}_getProfilesWithName`,
    }
  );
  return profiles.pop();
};

export const getProfilesWithAddress = async (
  source: string,
  address: string
) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: { address: { _ilike: address } },
        },
        {
          id: true,
          name: true,
        },
      ],
    },
    {
      operationName: `${source}_getProfilesWithAddress`,
    }
  );

  return profiles.pop();
};
