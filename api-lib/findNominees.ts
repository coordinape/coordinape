import { adminClient } from './gql/adminClient';

export const getNomineeWithName = async (source: string, name: string) => {
  const { nominees } = await adminClient.query(
    {
      nominees: [
        {
          where: { ended: { _eq: false }, name: { _ilike: name } },
        },
        {
          id: true,
          address: true,
          name: true,
        },
      ],
    },
    {
      operationName: `${source}_getNomineeWithName`,
    }
  );

  return nominees.pop();
};

export const getNomineeWithAddress = async (
  source: string,
  address: string
) => {
  const { nominees } = await adminClient.query(
    {
      nominees: [
        {
          where: { ended: { _eq: false }, address: { _ilike: address } },
        },
        {
          id: true,
          name: true,
        },
      ],
    },
    {
      operationName: `${source}_getNomineeWithName`,
    }
  );

  return nominees.pop();
};
