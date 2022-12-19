import { DateTime } from 'luxon';

import { createEpochInput } from '../../src/lib/zod';

import type { GQLClientType } from './common';

type EpochInput = typeof createEpochInput['_type'];

export async function createEpoch(
  client: GQLClientType,
  object?: Partial<EpochInput>
): Promise<{ id: number }> {
  const dateNow = DateTime.now();
  const days = object?.days || 3;
  const start_date = object?.start_date || dateNow;
  const end_date = start_date.plus({ days });
  const { insert_epochs_one } = await client.mutate({
    insert_epochs_one: [
      {
        object: {
          repeat: 0,
          ...object,
          ended: end_date < DateTime.now(),
          days,
          start_date: start_date.toISO(),
          end_date: end_date.toISO(),
        },
      },
      {
        id: true,
        start_date: true,
        end_date: true,
        days: true,
        ended: true,
      },
    ],
  });
  if (!insert_epochs_one) {
    throw new Error('Epoch not created');
  }

  return insert_epochs_one;
}
