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
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { findSameDayNextMonth } from '../../../../src/common-lib/epochs';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';
import { zStringISODateUTC } from '../../../../src/lib/zod/formHelpers';

Settings.defaultZone = 'utc';

type ErrorReturn = Error | undefined;

const zFrequencyUnits = z.union([
  z.literal('days'),
  z.literal('weeks'),
  z.literal('months'),
]);

const zCustomInputSchema = z
  .object({
    type: z.literal('custom'),
    frequency: z.coerce.number().min(1),
    frequency_unit: zFrequencyUnits,
    start_date: zStringISODateUTC,
    end_date: zStringISODateUTC,
  })
  .strict();

const zMonthlyInputSchema = z
  .object({
    type: z.literal('monthly'),
    week: z.number().min(0),
    start_date: zStringISODateUTC,
    end_date: zStringISODateUTC,
  })
  .strict();

const zSingleInputSchema = z
  .object({
    type: z.literal('one-off'),
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
  const {
    input: { payload: input },
  } = composeHasuraActionRequestBodyWithSession(
    EpochInputSchema,
    HasuraUserSessionVariables
  ).parse(request.body);
  const { circle_id, params } = input;

  const results = await Promise.allSettled([
    checkOverlappingEpoch(input),
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

  insertNewEpoch(response, input);
}

export function validateMonthlyInput(
  input: z.infer<typeof zMonthlyInputSchema>
): ErrorReturn {
  const { start_date, end_date } = input;

  const endDateIsValid = findSameDayNextMonth(start_date, input).equals(
    end_date
  );
  if (!endDateIsValid)
    return new Error(
      dedent`
        start day and week "${start_date.toISO()}" do not match the end date
        "${end_date.toISO()}"
      `
    );
}

export function validateCustomInput(
  input: z.infer<typeof zCustomInputSchema>
): ErrorReturn {
  const { start_date, end_date, frequency_unit, frequency } = input;
  const interval = Interval.fromDateTimes(start_date, end_date);
  const frequencyDuration = Duration.fromObject({
    [frequency_unit]: frequency,
  });
  if (interval.length(frequency_unit) > frequencyDuration.as(frequency_unit))
    return new Error(
      dedent`
        epoch duration ${
          interval.length(frequency_unit) + ' ' + frequency_unit
        } is longer than chosen
        frequency ${frequencyDuration.as(frequency_unit) + ' ' + frequency_unit}
      `
    );
}

async function insertNewEpoch(
  response: VercelResponse,
  {
    circle_id,
    grant,
    params: { start_date, end_date, ...repeatData },
  }: z.infer<typeof EpochInputSchema>
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
