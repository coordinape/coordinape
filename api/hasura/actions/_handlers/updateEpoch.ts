import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { Awaited } from '../../../../api-lib/ts4.5shim';
import { composeHasuraActionRequestBody } from '../../../../src/lib/zod';

import {
  zEpochInputParams,
  checkOverlappingEpoch,
  eliminateUtcDrift,
  verifyFutureEndDate,
  verifyStartBeforeEnd,
  checkMultipleRepeatingEpochs,
  validateCustomInput,
  validateMonthlyInput,
} from './createEpoch';

Settings.defaultZone = 'utc';

const EpochUpdateSchema = z.object({
  id: z.number(),
  circle_id: z.number(),
  grant: z.number().optional(),
  description: z.string().optional(),
  params: zEpochInputParams,
});

async function handler(request: VercelRequest, response: VercelResponse) {
  const {
    input: { payload: input },
  } = composeHasuraActionRequestBody(EpochUpdateSchema).parse(request.body);
  const { params, circle_id } = input;
  const editingEpoch = await getExistingEpoch(input);

  if (!editingEpoch) {
    errorResponseWithStatusCode(
      response,
      {
        message: `Epoch not found`,
      },
      422
    );
    return;
  }

  const results = await Promise.allSettled([
    checkOverlappingEpoch(input),
    verifyFutureEndDate(params),
    verifyStartBeforeEnd(params),
    checkStartDateNotInPast(input, editingEpoch),
    params.type !== 'one-off' && !editingEpoch.repeat_data
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
      input.params.end_date = eliminateUtcDrift(params);
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

  return updateEpoch(response, editingEpoch, input);
}

async function updateEpoch(
  response: VercelResponse,
  existingEpoch: ExistingEpoch,
  {
    id,
    params: { start_date, end_date, ...repeatData },
  }: z.infer<typeof EpochUpdateSchema>
) {
  const { update_epochs_by_pk } = await adminClient.mutate(
    {
      update_epochs_by_pk: [
        {
          _set: {
            ...existingEpoch,
            start_date: start_date.toISO(),
            end_date: end_date.toISO(),
            repeat_data: repeatData.type !== 'one-off' ? repeatData : undefined,
          },
          pk_columns: { id },
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

  response.status(200).json(update_epochs_by_pk);
}

async function getExistingEpoch({
  circle_id,
  id,
}: z.infer<typeof EpochUpdateSchema>) {
  const {
    epochs: [editingEpoch],
  } = await adminClient.query(
    {
      epochs: [
        {
          limit: 1,
          where: {
            circle_id: { _eq: circle_id },
            id: { _eq: id },
            ended: { _eq: false },
          },
        },
        {
          id: true,
          start_date: true,
          end_date: true,
          repeat_data: [{}, true],
          description: true,
        },
      ],
    },
    {
      operationName: 'updateEpoch_getEpoch',
    }
  );

  return editingEpoch;
}

type ExistingEpoch = NonNullable<Awaited<ReturnType<typeof getExistingEpoch>>>;

async function checkStartDateNotInPast(
  { params: { start_date } }: z.infer<typeof EpochUpdateSchema>,
  existingEpoch: ExistingEpoch
) {
  const now = DateTime.now();
  if (now >= DateTime.fromISO(existingEpoch.start_date) && start_date >= now)
    throw new Error(
      `You cannot change the start date to later than now when epoch has already started`
    );
}

export default authCircleAdminMiddleware(handler);
