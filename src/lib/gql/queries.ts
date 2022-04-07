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
  circle_id: number
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

export type PreviousDistribution = Awaited<
  ReturnType<typeof getPreviousDistribution>
>;
