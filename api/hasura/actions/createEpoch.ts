import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { EPOCH_REPEAT } from '../../../api-lib/constants';
import { adminClient } from '../../../api-lib/gql/adminClient';
import {
  errorResponse,
  errorResponseWithStatusCode,
  zodParserErrorResponse,
} from '../../../api-lib/HttpError';
import {
  createEpochInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const {
      input: { payload: input },
    } = composeHasuraActionRequestBody(createEpochInput).parse(request.body);
    const { circle_id, repeat, start_date, days } = input;
    let repeat_day_of_month = 0;
    if (repeat > 0) {
      const { epochs } = await adminClient.query({
        epochs: [
          {
            limit: 1,
            where: {
              ended: { _eq: false },
              circle_id: { _eq: circle_id },
              repeat: { _gte: EPOCH_REPEAT.WEEKLY },
            },
          },
          {
            id: true,
          },
        ],
      });
      if (epochs.length) {
        errorResponseWithStatusCode(
          response,
          { message: 'You cannot have more than one repeating active epoch.' },
          422
        );
        return;
      }
      if (repeat === 2) {
        repeat_day_of_month = start_date.day;
      }
    }

    const end_date = start_date.plus({ days: days });
    const { epochs } = await adminClient.query({
      epochs: [
        {
          limit: 1,
          where: {
            start_date: { _lte: end_date },
            circle_id: { _eq: circle_id },
            end_date: { _gt: start_date },
          },
        },
        {
          id: true,
          start_date: true,
          end_date: true,
        },
      ],
    });
    if (epochs.length) {
      const epoch = epochs.pop();
      errorResponseWithStatusCode(
        response,
        {
          message:
            `This epoch overlaps with an existing epoch that occurs between ` +
            `${DateTime.fromISO(epoch?.start_date).toLocaleString(
              DateTime.DATETIME_SHORT
            )} and ` +
            `${DateTime.fromISO(epoch?.end_date).toLocaleString(
              DateTime.DATETIME_SHORT
            )}. ` +
            `Please adjust epoch settings to avoid overlapping with existing epochs`,
        },
        422
      );
      return;
    }

    const { insert_epochs_one } = await adminClient.mutate({
      insert_epochs_one: [
        {
          object: {
            ...input,
            end_date,
            repeat_day_of_month,
          },
        },
        {
          id: true,
        },
      ],
    });

    response.status(200).json(insert_epochs_one);
  } catch (err) {
    if (err instanceof z.ZodError) {
      zodParserErrorResponse(response, err.issues);
      return;
    }
    errorResponse(response, err);
    return;
  }
}

export default authCircleAdminMiddleware(handler);
