import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { DateTime } from 'luxon';

import { IN_PRODUCTION } from 'config/env';

import { Awaited } from 'types/shim';

// avoid rendering any epochs from before the launch date
// yesterday
const endDateInProd = IN_PRODUCTION
  ? {
      _gt: DateTime.fromISO('2022-10-19T00:00:00Z').toISO(),
    }
  : undefined;

export const getContributionsAndEpochs = async ({
  circleId,
  epochId,
  userAddress,
}: {
  circleId: number;
  epochId?: number;
  userAddress?: string;
}) =>
  client.query(
    {
      users: [
        {
          where: {
            circle_id: { _eq: circleId },
            address: { _eq: userAddress?.toLowerCase() },
          },
        },
        { id: true },
      ],
      contributions: [
        {
          where: {
            circle_id: { _eq: circleId },
            user: userAddress
              ? { address: { _eq: userAddress.toLowerCase() } }
              : undefined,
          },
          order_by: [{ created_at: order_by.desc }],
        },
        { id: true, description: true, created_at: true, user_id: true },
      ],
      epochs: [
        {
          where: {
            circle_id: { _eq: circleId },
            id: epochId ? { _eq: epochId } : undefined,
            end_date: endDateInProd,
          },
          order_by: [{ end_date: order_by.desc }],
        },
        {
          id: true,
          number: true,
          start_date: true,
          end_date: true,
          ended: true,
          description: true,
        },
      ],
      circles_by_pk: [
        {
          id: circleId,
        },
        {
          cont_help_text: true,
        },
      ],
    },
    {
      operationName: 'getContributionsAndEpochs',
    }
  );

export type ContributionsAndEpochs = Awaited<
  ReturnType<typeof getContributionsAndEpochs>
>;
export type Contribution = ContributionsAndEpochs['contributions'][0];
export type Epoch = ContributionsAndEpochs['epochs'][0];
