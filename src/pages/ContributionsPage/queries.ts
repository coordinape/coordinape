import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

import { Awaited } from 'types/shim';

export const getContributionsAndEpochs = async ({
  circleId,
  epochId,
  userAddress,
}: {
  circleId: number;
  epochId?: number;
  userAddress?: string;
}) =>
  client.query({
    contributions: [
      {
        where: {
          circle_id: { _eq: circleId },
          user: userAddress
            ? { address: { _eq: userAddress.toLowerCase() } }
            : undefined,
        },
        order_by: [{ datetime_created: order_by.desc }],
      },
      { id: true, description: true, datetime_created: true, user_id: true },
    ],
    epochs: [
      {
        where: {
          circle_id: { _eq: circleId },
          id: epochId ? { _eq: epochId } : undefined,
        },
        order_by: [{ end_date: order_by.desc }],
      },
      {
        id: true,
        number: true,
        start_date: true,
        end_date: true,
        ended: true,
      },
    ],
  });

export type ContributionsAndEpochs = Awaited<
  ReturnType<typeof getContributionsAndEpochs>
>;
