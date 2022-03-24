import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { EPOCH_REPEAT } from '../../../api-lib/constants';
import { formatShortDateTime } from '../../../api-lib/dateTimeHelpers';
import { adminClient } from '../../../api-lib/gql/adminClient';
import {
  errorResponse,
  errorResponseWithStatusCode,
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
            start_date: true,
            end_date: true,
          },
        ],
      });
      if (epochs.length) {
        const repeatingEpoch = epochs.pop();
        errorResponseWithStatusCode(
          response,
          {
            message:
              `You cannot have more than one repeating active epoch. ` +
              `Dates overlap with epoch id #${repeatingEpoch?.id} ` +
              `that occurs between ` +
              `${formatShortDateTime(repeatingEpoch?.start_date)} and ` +
              `${formatShortDateTime(repeatingEpoch?.end_date)}`,
          },
          422
        );
        return;
      }
      if (repeat === EPOCH_REPEAT.MONTHLY) {
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
      const overlappingEpoch = epochs.pop();
      errorResponseWithStatusCode(
        response,
        {
          message:
            `This epoch overlaps with an existing epoch that occurs between ` +
            `${formatShortDateTime(overlappingEpoch?.start_date)} and ` +
            `${formatShortDateTime(overlappingEpoch?.end_date)}. ` +
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
    errorResponse(response, err);
    return;
  }
}

export default authCircleAdminMiddleware(handler);
