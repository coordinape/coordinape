import { order_by } from './__generated__/zeus';
import { client } from './client';

import { Awaited } from 'types/shim';

export const getCurrentEpoch = async (
  circle_id: number
): Promise<typeof currentEpoch | undefined> => {
  const {
    epochs: [currentEpoch],
  } = await client.query({
    epochs: [
      {
        where: {
          circle_id: { _eq: circle_id },
          end_date: { _gt: 'now()' },
          start_date: { _lt: 'now()' },
        },
      },
      { id: true },
    ],
  });
  return currentEpoch;
};

export const getPreviousDistribution = async (
  epoch_id: number
): Promise<typeof previousDistribution | undefined> => {
  const {
    distributions: [previousDistribution],
  } = await client.query({
    distributions: [
      {
        limit: 1,
        order_by: [{ id: order_by.desc }],
        where: {
          epoch_id: { _eq: epoch_id },
          saved_on_chain: { _eq: true },
        },
      },
      { distribution_json: [{}, true] },
    ],
  });
  return previousDistribution;
};

export type PreviousDistribution = Awaited<
  ReturnType<typeof getPreviousDistribution>
>;
