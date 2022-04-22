import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

const getVouchesNeeded = (
  vouchesRequired: number,
  nominationsLength = 0
): number => {
  return Math.max(0, vouchesRequired - nominationsLength - 1);
};

export interface IActiveNominee {
  id: number;
  name: string;
  address: string;
  nominated_by_user_id: number;
  description: string;
  nominated_date: string;
  expiry_date: string;
  vouches_required: number;
  ended: boolean;
  nominations: Array<{
    id: number;
    created_at?: any;
    voucher_id: number;
    voucher?: {
      name: string;
      id: number;
      address: string;
    };
  }>;
  nominator?: {
    address: string;
    name: string;
  };
}

export const getActiveNominees = async (circleId: number) => {
  const { nominees } = await client.query(
    {
      nominees: [
        {
          where: {
            _and: [
              {
                circle_id: { _eq: circleId },
                ended: { _eq: false },
                expiry_date: { _gt: 'now' },
              },
            ],
          },
          order_by: [{ expiry_date: order_by.asc }],
        },
        {
          id: true,
          name: true,
          address: true,
          nominated_by_user_id: true,
          nominations: [
            {},
            {
              created_at: true,
              voucher_id: true,
              id: true,
              voucher: {
                name: true,
                id: true,
                address: true,
              },
            },
          ],
          nominator: {
            address: true,
            name: true,
          },
          description: true,
          nominated_date: true,
          expiry_date: true,
          vouches_required: true,
          ended: true,
        },
      ],
    },
    {
      operationName: 'getActiveNominees',
    }
  );

  const activeNominees = nominees.filter(
    nominee =>
      getVouchesNeeded(nominee.vouches_required, nominee.nominations.length) > 0
  );
  return activeNominees;
};
