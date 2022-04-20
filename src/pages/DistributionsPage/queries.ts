import {
  token_gifts_select_column,
  order_by,
} from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import useConnectedAddress from '../../hooks/useConnectedAddress';

import { Awaited } from 'types/shim';

export function useCurrentUserForEpoch(epochId: number | null | undefined) {
  const address = useConnectedAddress();

  return useQuery(
    ['user-for-epoch', epochId],
    async () => {
      const { users } = await client.query({
        users: [
          {
            where: {
              circle: {
                epochs: {
                  id: { _eq: epochId },
                },
              },
              address: {
                _ilike: address,
              },
            },
          },
          {
            id: true,
            name: true,
            address: true,
            role: true,
            circle_id: true,
          },
        ],
      });

      return users[0];
    },
    { enabled: !!epochId }
  );
}

export function useGetAllocations(epochId: number | null | undefined) {
  // FIXME (minor): if this query's structure were changed
  // from: epoch -> circle -> users -> gifts
  // to: epoch -> gifts -> users
  // that would remove the need to repeatedly pass epochId as an argument
  return useQuery(
    ['circle-for-epoch', epochId],
    async () => {
      const { epochs_by_pk } = await client.query({
        epochs_by_pk: [
          { id: Number(epochId) },
          {
            id: true,
            ended: true,
            circle_id: true,
            number: true,
            circle: {
              id: true,
              name: true,
              users: [
                { where: { received_gifts: { epoch_id: { _eq: epochId } } } },
                {
                  address: true,
                  name: true,
                  id: true,
                  circle_id: true,
                  received_gifts: [
                    { where: { epoch_id: { _eq: epochId } } },
                    { tokens: true },
                  ],
                  received_gifts_aggregate: [
                    { where: { epoch_id: { _eq: epochId } } },
                    {
                      aggregate: {
                        count: [
                          {
                            columns: [token_gifts_select_column.recipient_id],
                          },
                          true,
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
      return epochs_by_pk;
    },
    { enabled: !!epochId }
  );
}

export const getPreviousDistribution = async (
  circle_id: number | null | undefined
): Promise<typeof distributions | undefined> => {
  const { distributions } = await client.query({
    distributions: [
      {
        order_by: [{ id: order_by.desc }],
        where: {
          epoch: { circle_id: { _eq: circle_id } },
          saved_on_chain: { _eq: true },
        },
      },
      {
        id: true,
        vault_id: true,
        distribution_json: [{}, true],
      },
    ],
  });
  return distributions;
};

export type PreviousDistribution = Exclude<
  Awaited<ReturnType<typeof getPreviousDistribution>>,
  undefined
>[0];

export function usePreviousDistributions(circleId: number | null | undefined) {
  return useQuery(
    ['previous-distributions-', circleId],
    async () => getPreviousDistribution(circleId),
    { enabled: !!circleId }
  );
}
