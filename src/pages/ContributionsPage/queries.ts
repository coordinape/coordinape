import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

import { Awaited } from 'types/shim';

export const getContributionsAndEpochs = async ({
  circleId,
  epochId,
  memberAddress,
}: {
  circleId: number;
  epochId?: number;
  memberAddress?: string;
}) =>
  client.query({
    members: [
      {
        where: {
          circle_id: { _eq: circleId },
          address: { _eq: memberAddress?.toLowerCase() },
        },
      },
      { id: true },
    ],
    contributions: [
      {
        where: {
          circle_id: { _eq: circleId },
          member: memberAddress
            ? { address: { _eq: memberAddress.toLowerCase() } }
            : undefined,
        },
        order_by: [{ datetime_created: order_by.desc }],
      },
      { id: true, description: true, datetime_created: true, member_id: true },
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
export type Contribution = ContributionsAndEpochs['contributions'][0];
export type Epoch = ContributionsAndEpochs['epochs'][0];
