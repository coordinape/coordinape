import type { VercelRequest, VercelResponse } from '@vercel/node';
import dedent from 'dedent';
import { DateTime, Duration, Interval, Settings } from 'luxon';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { formatShortDateTime } from '../../../../api-lib/dateTimeHelpers';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  getOverlappingEpoch,
  getRepeatingEpoch,
} from '../../../../api-lib/gql/queries';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { findSameDayNextMonth } from '../../../../src/common-lib/epochs';
import { zStringISODateUTC } from '../../../../src/lib/zod/formHelpers';

Settings.defaultZone = 'UTC';

type ErrorReturn = Error | undefined;

export const zTimeZone = z
  .string()
  .default('UTC')
  .transform(tz => {
    // returns the defaultZone if the provided string value is an invalid
    // or unsupported IANA time zone
    const dtWithZone = DateTime.now().setZone(tz);
    return dtWithZone.zone.name;
  });

export const zFrequencyUnits = z.enum(['days', 'weeks', 'months']);

export const zCustomRepeatData = z
  .object({
    type: z.literal('custom'),
    time_zone: zTimeZone,
    frequency: z.coerce.number().min(1),
    frequency_unit: zFrequencyUnits,
    duration: z.coerce.number().min(1),
    duration_unit: zFrequencyUnits,
  })
  .strict();

export const zMonthlyRepeatData = z
  .object({
    type: z.literal('monthly'),
    time_zone: zTimeZone,
    week: z.number().min(0),
  })
  .strict();

const zCustomInputSchema = zCustomRepeatData
  .extend({
    start_date: zStringISODateUTC,
    end_date: zStringISODateUTC,
  })
  .strict();

const zMonthlyInputSchema = zMonthlyRepeatData
  .extend({
    start_date: zStringISODateUTC,
    end_date: zStringISODateUTC,
  })
  .strict();

const zSingleInputSchema = z
  .object({
    type: z.literal('one-off'),
    time_zone: zTimeZone.optional(),
    start_date: zStringISODateUTC,
    end_date: zStringISODateUTC,
  })
  .strict();

export const zEpochInputParams = z.discriminatedUnion('type', [
  zSingleInputSchema,
  zCustomInputSchema,
  zMonthlyInputSchema,
]);

const EpochInputSchema = z.object({
  circle_id: z.number(),
  grant: z.number().optional(),
  params: zEpochInputParams,
});

async function handler(request: VercelRequest, response: VercelResponse) {
  const { payload, session } = await getInput(request, EpochInputSchema);
  const { circle_id, params } = payload;

  const results = await Promise.allSettled([
    checkOverlappingEpoch(payload),
    verifyFutureEndDate(params),
    verifyStartBeforeEnd(params),
    params.type !== 'one-off'
      ? checkMultipleRepeatingEpochs(circle_id)
      : Promise.resolve(),
  ]);
  for (const result of results) {
    if (result.status === 'rejected') {
      errorResponseWithStatusCode(response, result.reason, 422);
      return;
    }
  }

  let error;
  switch (params.type) {
    case 'custom':
      error = validateCustomInput(params);
      payload.params.end_date = eliminateUtcDrift(params);
      break;
    case 'monthly': {
      error = validateMonthlyInput(params);
      break;
    }
  }
  if (error) {
    errorResponseWithStatusCode(response, error, 422);
    return;
  }

  insertNewEpoch(response, payload, session.hasuraProfileId);
}

export function validateMonthlyInput(
  input: z.infer<typeof zMonthlyInputSchema>
): ErrorReturn {
  const { start_date, end_date } = input;
  const endDateIsValid =
    findSameDayNextMonth(start_date, input, input.time_zone).equals(end_date) ||
    findSameDayNextMonth(start_date, input, input.time_zone).equals(
      end_date.plus({ hours: 1 })
    ) ||
    findSameDayNextMonth(start_date, input, input.time_zone).equals(
      end_date.minus({ hours: 1 })
    );
  if (!endDateIsValid)
    return new Error(
      dedent`
        start day and week "${start_date.toISO()}" do not match the end date
        "${end_date.toISO()}"
      `
    );
}

export function eliminateUtcDrift({
  start_date,
  end_date,
  time_zone,
  duration,
  duration_unit,
}: z.infer<typeof zCustomInputSchema>): DateTime {
  // if we're dealing with an unknown timezone we need to eliminate
  // any timezone-related drift by ensuring the end_date matches the
  // duration math exactly
  if (time_zone === 'UTC') {
    return start_date.plus({
      [duration_unit]: duration,
    });
  }
  return end_date;
}

export function validateCustomInput({
  start_date,
  end_date,
  frequency_unit,
  frequency,
  duration,
  time_zone,
  duration_unit,
}: z.infer<typeof zCustomInputSchema>): ErrorReturn {
  const interval = Interval.fromDateTimes(start_date, end_date);
  const repeatDuration = Duration.fromObject({ [duration_unit]: duration });
  const frequencyDuration = Duration.fromObject({
    [frequency_unit]: frequency,
  });
  if (
    interval.length(frequency_unit) >
    frequencyDuration.plus({ hours: 1 }).as(frequency_unit)
  )
    return new Error(
      dedent`
        epoch duration ${
          interval.length(frequency_unit) + ' ' + frequency_unit
        } is longer than chosen
        frequency ${frequencyDuration.as(frequency_unit) + ' ' + frequency_unit}
      `
    );

  // allow for some wiggle-room to account for seasonal time shifts
  // in days, weeks and months
  if (
    time_zone === 'UTC'
      ? Math.abs(duration - interval.length(duration_unit)) > 0.03
      : !end_date
          .setZone(time_zone)
          .equals(start_date.setZone(time_zone).plus(repeatDuration))
  )
    return new Error(
      dedent`
        epoch date range ${
          interval.length(duration_unit) + ' ' + duration_unit
        } does not match the specified duration ${
        repeatDuration.as(duration_unit) + ' ' + duration_unit
      }
      `
    );
}

async function insertNewEpoch(
  response: VercelResponse,
  {
    circle_id,
    grant,
    params: { start_date, end_date, ...repeatData },
  }: z.infer<typeof EpochInputSchema>,
  creatorProfileId: number
) {
  const { insert_epochs_one } = await adminClient.mutate(
    {
      insert_epochs_one: [
        {
          object: {
            circle_id,
            grant,
            start_date: start_date.toISO(),
            end_date: end_date.toISO(),
            repeat_data: repeatData.type !== 'one-off' ? repeatData : undefined,
            created_by: creatorProfileId,
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'createEpoch_insert',
    }
  );

  response.status(200).json(insert_epochs_one);
}

export async function verifyFutureEndDate({
  end_date,
}: {
  end_date: DateTime;
}) {
  if (DateTime.now() > end_date)
    throw new Error(`You cannot create an epoch that ends before now`);
}

export async function verifyStartBeforeEnd({
  start_date,
  end_date,
}: {
  start_date: DateTime;
  end_date: DateTime;
}) {
  if (start_date >= end_date)
    throw new Error(`Start date must precede end date`);
}

export async function checkMultipleRepeatingEpochs(circle_id: number) {
  const repeatingEpoch = await getRepeatingEpoch(circle_id);
  if (repeatingEpoch) {
    throw new Error(
      dedent`
        You cannot have more than one repeating active epoch.
        Repeating Epoch id #${repeatingEpoch?.id} occurs between
        ${formatShortDateTime(repeatingEpoch?.start_date)}
        and
        ${formatShortDateTime(repeatingEpoch?.end_date)}
      `
    );
  }
}

export async function checkOverlappingEpoch({
  id,
  circle_id,
  params: { start_date, end_date },
}: z.infer<typeof EpochInputSchema> & { id?: number }) {
  const overlappingEpoch = await getOverlappingEpoch(
    start_date,
    end_date,
    circle_id,
    id
  );
  if (overlappingEpoch) {
    throw new Error(
      dedent`
        This epoch overlaps with an existing epoch that occurs between
        ${formatShortDateTime(overlappingEpoch?.start_date)}
        and
        ${formatShortDateTime(overlappingEpoch?.end_date)}
        Please adjust epoch settings to avoid overlapping with existing epochs
      `
    );
  }
}

export default authCircleAdminMiddleware(handler);
