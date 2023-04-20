import { DateTime } from 'luxon';
import { z } from 'zod';

import { zStringISODateUTC } from '../../src/lib/zod/formHelpers';

import type { GQLClientType } from './common';

const createEpochInput = z
  .object({
    circle_id: z.number().int().positive(),
    start_date: zStringISODateUTC,
    description: z.string().min(10).max(100).optional(),
    repeat: z.number().int().min(0).max(3),
    days: z
      .number()
      .min(1, 'Must be at least one day.')
      .max(100, 'cant be more than 100 days'),
    grant: z.number().positive().min(1).max(1000000000).optional(),
  })
  .strict()
  .superRefine((val, ctx) => {
    let message;
    if (val.days > 7 && val.repeat === 1) {
      message =
        'You cannot have more than 7 days length for a weekly repeating epoch.';
    } else if (val.days > 28 && val.repeat === 2) {
      message =
        'You cannot have more than 28 days length for a monthly repeating epoch.';
    }

    if (message) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
      });
    }
  });

type EpochInput = typeof createEpochInput['_type'];

export async function createEpoch(
  client: GQLClientType,
  object?: Partial<EpochInput>
): Promise<{ id: number }> {
  const dateNow = DateTime.now();
  const days = object?.days || 3;
  const start_date = object?.start_date || dateNow;
  const end_date = start_date.plus({ days });
  const { insert_epochs_one } = await client.mutate(
    {
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
    },
    { operationName: 'createEpoch' }
  );
  if (!insert_epochs_one) {
    throw new Error('Epoch not created');
  }

  return insert_epochs_one;
}
