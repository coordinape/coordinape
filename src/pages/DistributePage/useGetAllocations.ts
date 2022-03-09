import { token_gifts_select_column } from 'lib/gql/__generated__/zeusUser';

import { useTypedQuery } from '../../hooks/gql';

export function useGetAllocations(epochId: number) {
  // FIXME (minor): if this query's structure were changed
  // from: epoch -> circle -> users -> gifts
  // to: epoch -> gifts -> users
  // that would remove the need to repeatedly pass epochId as an argument
  return useTypedQuery(`circle-for-epoch-${epochId}`, {
    epochs_by_pk: [
      { id: epochId },
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
}
