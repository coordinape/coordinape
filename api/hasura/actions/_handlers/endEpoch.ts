import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { endEpochHandler } from '../../cron/epochs';

Settings.defaultZone = 'utc';

const EpochEndSchema = z.object({
  id: z.number(),
  circle_id: z.number(),
});

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, EpochEndSchema, { allowAdmin: true });

  const endingEpoch = await getExistingEpoch(payload);

  if (!endingEpoch) {
    errorResponseWithStatusCode(res, { message: `Epoch not found` }, 422);
    return;
  }

  const { update_epochs_by_pk: endedEpoch } = await adminClient.mutate(
    {
      update_epochs_by_pk: [
        {
          _set: { end_date: DateTime.now().toISO() },
          pk_columns: { id: payload.id },
        },
        { id: true },
      ],
    },
    { operationName: 'endEpoch_updateEpoch' }
  );

  // Refetch endingEpoch after update, since the end_data is no longer accurate
  const updatedEndingEpoch = await getExistingEpoch(payload);
  await endEpochHandler(updatedEndingEpoch);
  return res.status(200).json(endedEpoch);
}

async function getExistingEpoch({
  circle_id,
  id,
}: z.infer<typeof EpochEndSchema>) {
  const {
    epochs: [endingEpoch],
  } = await adminClient.query(
    {
      epochs: [
        {
          limit: 1,
          where: {
            circle_id: { _eq: circle_id },
            id: { _eq: id },
            _and: [{ ended: { _eq: false } }, { start_date: { _lt: 'now' } }],
          },
        },
        {
          id: true,
          circle_id: true,
          repeat: true,
          number: true,
          days: true,
          repeat_day_of_month: true,
          start_date: true,
          end_date: true,
          circle: {
            id: true,
            name: true,
            token_name: true,
            auto_opt_out: true,
            telegram_id: true,
            discord_webhook: true,
            organization: { id: true, name: true, telegram_id: true },
            users: [
              { where: { deleted_at: { _is_null: true } } },
              {
                id: true,
                profile: { id: true, name: true },
                non_giver: true,
                non_receiver: true,
                circle_id: true,
                bio: true,
                starting_tokens: true,
                give_token_remaining: true,
              },
            ],
            discord_circle: {
              discord_channel_id: true,
              discord_role_id: true,
              alerts: [{}, true],
            },
          },
          epoch_pending_token_gifts: [
            {},
            {
              circle_id: true,
              epoch_id: true,
              note: true,
              sender_id: true,
              tokens: true,
              sender_address: true,
              recipient_id: true,
              recipient_address: true,
              dts_created: true,
              created_at: true,
              updated_at: true,
            },
          ],
          token_gifts: [{ where: { tokens: { _gt: 0 } } }, { tokens: true }],
        },
      ],
    },
    { operationName: 'endEpoch_getEpoch' }
  );

  return endingEpoch;
}

export default authCircleAdminMiddleware(handler);
