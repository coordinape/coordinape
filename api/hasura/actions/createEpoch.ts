import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { EPOCH_REPEAT } from '../../../api-lib/constants';
import { formatShortDateTime } from '../../../api-lib/dateTimeHelpers';
import { adminClient } from '../../../api-lib/gql/adminClient';
import {
  getOverlappingEpoch,
  getRepeatingEpoch,
} from '../../../api-lib/gql/queries';
import { errorResponseWithStatusCode } from '../../../api-lib/HttpError';
import {
  createEpochInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

Settings.defaultZone = 'utc';

async function handler(request: VercelRequest, response: VercelResponse) {
  const {
    input: { payload: input },
  } = composeHasuraActionRequestBody(createEpochInput).parse(request.body);
  const { circle_id, repeat, start_date, days } = input;
  let repeat_day_of_month = 0;
  const end_date = start_date.plus({ days: days });
  if (DateTime.now() > end_date) {
    errorResponseWithStatusCode(
      response,
      {
        message: `You cannot create an epoch that ends before now`,
      },
      422
    );
    return;
  }

  if (repeat > 0) {
    const repeatingEpoch = await getRepeatingEpoch(circle_id);
    if (repeatingEpoch) {
      errorResponseWithStatusCode(
        response,
        {
          message:
            `You cannot have more than one repeating active epoch. ` +
            `Repeating Epoch id #${repeatingEpoch?.id} ` +
            `occurs between ` +
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

  const overlappingEpoch = await getOverlappingEpoch(
    start_date,
    end_date,
    circle_id
  );
  if (overlappingEpoch) {
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

  const { insert_epochs_one } = await adminClient.mutate(
    {
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
    },
    {
      operationName: 'createEpoch-insert',
    }
  );

  response.status(200).json(insert_epochs_one);
}

export default authCircleAdminMiddleware(handler);
