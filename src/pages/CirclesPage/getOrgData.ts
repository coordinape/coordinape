import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

export const getOrgData = (address: string) =>
  client.query(
    {
      organizations: [
        { order_by: [{ name: order_by.asc }] },
        {
          id: true,
          name: true,
          logo: true,
          sample: true,
          created_by: true,
          circles: [
            { order_by: [{ name: order_by.asc }] },
            {
              id: true,
              name: true,
              vouching: true,
              users: [
                { where: { address: { _eq: address.toLowerCase() } } },
                { role: true, id: true },
              ],
              epochs: [
                {
                  where: { ended: { _eq: false }, end_date: { _gt: 'now' } },
                  order_by: [{ start_date: order_by.asc }],
                  limit: 1,
                },
                {
                  start_date: true,
                  end_date: true,
                  number: true,
                  description: true,
                },
              ],
              nominees_aggregate: [
                {
                  where: { ended: { _eq: false }, expiry_date: { _gt: 'now' } },
                },
                { aggregate: { count: [{}, true] } },
              ],
            },
          ],
          members: [
            { where: { profile: { address: { _eq: address.toLowerCase() } } } },
            { id: true, visible: true, profile_id: true },
          ],
        },
      ],
    },
    {
      operationName: 'getOrgData',
    }
  );
export const QUERY_KEY_MY_ORGS = 'AllMyOrgs';
