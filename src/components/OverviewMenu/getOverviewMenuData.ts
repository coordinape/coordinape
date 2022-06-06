import { client } from 'lib/gql/client';

export const getOverviewMenuData = (address: string) =>
  client.query(
    {
      organizations: [
        {},
        {
          id: true,
          name: true,
          logo: true,
          circles: [
            {},
            {
              id: true,
              name: true,
              users: [
                { where: { address: { _eq: address.toLowerCase() } } },
                { role: true },
              ],
            },
          ],
        },
      ],
    },
    {
      operationName: 'getOverviewMenuData',
    }
  );
