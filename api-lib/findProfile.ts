import { adminClient } from './gql/adminClient';

export const getProfilesWithName = async (name: string) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        { where: { name: { _eq: name } } },
        { id: true, address: true, name: true },
      ],
    },
    { operationName: 'getProfilesWithName' }
  );
  return profiles.pop();
};

export const getProfilesWithAddress = async (address: string) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        { where: { address: { _ilike: address } } },
        { id: true, name: true },
      ],
    },
    { operationName: 'getProfilesWithAddress' }
  );

  return profiles.pop();
};
