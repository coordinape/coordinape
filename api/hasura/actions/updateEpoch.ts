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
  updateEpochInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

Settings.defaultZone = 'utc';

async function handler(request: VercelRequest, response: VercelResponse) {
  const now = DateTime.now();
  const {
    input: { payload: input },
  } = composeHasuraActionRequestBody(updateEpochInput).parse(request.body);
  const { circle_id, repeat, start_date, days, id } = input;
  const end_date = start_date.plus({ days: days });
  if (now > end_date) {
    errorResponseWithStatusCode(
      response,
      {
        message: `You cannot set an epoch that ends before now`,
      },
      422
    );
    return;
  }
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
          repeat: true,
          repeat_day_of_month: true,
        },
      ],
    },
    {
      operationName: 'updateEpoch-getEpoch',
    }
  );

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

  if (now >= DateTime.fromISO(editingEpoch.start_date) && start_date >= now) {
    errorResponseWithStatusCode(
      response,
      {
        message: `You cannot change the start date to later than now when epoch has already started`,
      },
      422
    );
    return;
  }
  let repeat_day_of_month = editingEpoch.repeat_day_of_month;
  if (repeat > 0 && editingEpoch.repeat === 0) {
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
    circle_id,
    id
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

  const { update_epochs_by_pk } = await adminClient.mutate(
    {
      update_epochs_by_pk: [
        {
          _set: {
            ...editingEpoch,
            ...input,
            repeat_day_of_month,
            end_date,
          },
          pk_columns: { id },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'updateEpoch-update',
    }
  );

  response.status(200).json(update_epochs_by_pk);
}

export default authCircleAdminMiddleware(handler);
