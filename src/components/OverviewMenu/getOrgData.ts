import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

export const getOrgData = (address: string) =>
  client.query(
    {
      organizations: [
        {},
        {
          id: true,
          name: true,
          circles: [
            {},
            {
              id: true,
              name: true,
              vouching: true,
              users: [
                { where: { address: { _eq: address.toLowerCase() } } },
                { role: true },
              ],
              epochs: [
                {
                  where: { ended: { _eq: false }, end_date: { _gt: 'now' } },
                  order_by: [{ start_date: order_by.asc }],
                  limit: 1,
                },
                { start_date: true, end_date: true, number: true },
              ],
              nominees_aggregate: [
                {
                  where: { ended: { _eq: false }, expiry_date: { _gt: 'now' } },
                },
                { aggregate: { count: [{}, true] } },
              ],
            },
          ],
        },
      ],
    },
    {
      operationName: 'getOrgData',
    }
  );
