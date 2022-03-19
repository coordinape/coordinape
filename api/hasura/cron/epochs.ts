import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import dedent from 'dedent';
import { DateTime, Settings } from 'luxon';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorLog } from '../../../api-lib/HttpError';
import { sendSocialMessage } from '../../../api-lib/sendSocialMessage';
import { Awaited } from '../../../api-lib/ts4.5shim';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

Settings.defaultZone = 'utc';

type EpochsToNotify = Awaited<ReturnType<typeof getEpochsToNotify>>;

async function handler(req: VercelRequest, res: VercelResponse) {
  const epochResult = await getEpochsToNotify();

  const results = await Promise.all([
    notifyEpochStart(epochResult),
    notifyEpochEnd(epochResult),
  ]);

  res.status(200).json({ message: results });
}

async function getEpochsToNotify() {
  const inTwentyFourHours = DateTime.now().plus({ hours: 24 }).toISO();

  const result = await adminClient.query({
    __alias: {
      notifyStart: {
        epochs: [
          {
            where: {
              end_date: { _gt: 'now()' },
              start_date: { _lt: 'now()' },
              notified_start: { _is_null: true },
            },
          },
          {
            id: true,
            circle_id: true,
            number: true,
            start_date: true,
            end_date: true,
            circle: {
              id: true,
              name: true,
              telegram_id: true,
              discord_webhook: true,
              organization: { name: true },
              users_aggregate: [
                { where: { non_giver: { _eq: false } } },
                {
                  aggregate: { count: [{}, true] },
                },
              ],
            },
          },
        ],
      },
      notifyEnd: {
        epochs: [
          {
            where: {
              _and: [
                { end_date: { _gt: 'now()' } },
                { end_date: { _lte: inTwentyFourHours } },
              ],
              start_date: { _lt: 'now()' },
              notified_before_end: { _is_null: true },
            },
          },
          {
            id: true,
            circle_id: true,
            number: true,
            end_date: true,
            circle: {
              id: true,
              name: true,
              telegram_id: true,
              discord_webhook: true,
              organization: { name: true },
              users: [
                {
                  where: {
                    non_giver: { _eq: false },
                    give_token_remaining: { _gt: 0 },
                  },
                },
                {
                  name: true,
                },
              ],
            },
          },
        ],
      },
      endEpoch: {
        epochs: [
          {
            where: {
              end_date: { _lt: 'now()' },
              notified_end: { _is_null: true },
            },
          },
          {
            repeat: true,
            repeat_day_of_month: true,
            circle: {
              telegram_id: true,
              discord_webhook: true,
              users: [{}, { circle_id: true, bio: true }],
            },
            epoch_pending_token_gifts: [
              {},
              {
                circle_id: true,
                epoch_id: true,
                note: true,
                sender_id: true,
                sender_address: true,
                recipient_id: true,
                recipient_address: true,
              },
            ],
          },
        ],
      },
    },
  });
  return result;
}

async function notifyEpochStart({ notifyStart: { epochs } }: EpochsToNotify) {
  const sendNotifications = epochs.map(async epoch => {
    const { start_date, end_date, circle, number: epochNumber } = epoch;

    if (epochNumber == null) await setNextEpochNumber(epoch);

    assert(circle, 'panic: no circle for epoch');
    const epochStartDate = DateTime.fromISO(start_date);
    const epochEndDate = DateTime.fromISO(end_date);
    const eligibleUsersCount = circle.users_aggregate.aggregate?.count;

    const message = dedent`
        A new ${circle.organization?.name}/${circle.name} epoch is active!
        ${eligibleUsersCount} users will be participating and the duration of the epoch will be:
        **${epochStartDate.toLocaleString(
          DateTime.DATETIME_FULL
        )}** to **${epochEndDate.toLocaleString(DateTime.DATETIME_FULL)}**
      `;

    if (circle.discord_webhook)
      await notifyAndUpdateEpoch(
        message,
        { discord: true },
        epoch,
        updateEpochStartNotification
      );

    if (circle.telegram_id)
      await notifyAndUpdateEpoch(
        message,
        { telegram: true },
        epoch,
        updateEpochStartNotification
      );
  });

  const results = await Promise.allSettled(sendNotifications);

  const errors = results
    .map(r => {
      if (r.status === 'rejected') return r.reason;
    })
    .filter(r => r);

  return errors;
}

async function notifyEpochEnd({ notifyEnd: { epochs } }: EpochsToNotify) {
  const notifyEpochsEnding = epochs
    .filter(e => e.circle?.telegram_id || e.circle?.discord_webhook)
    .map(async epoch => {
      const { circle } = epoch;
      assert(circle, 'panic: no circle for epoch');

      const usersHodlingGive = circle.users.map(u => u.name);

      const message = dedent`
      ${circle.organization?.name}/${
        circle.name
      } epoch ends in less than 24 hours!
      Users that have yet to fully allocate their GIVE:
      ${usersHodlingGive.join(', ')}
    `;

      if (circle.discord_webhook)
        await notifyAndUpdateEpoch(
          message,
          { discord: true },
          epoch,
          updateEpochEndNotification
        );

      if (circle.telegram_id)
        await notifyAndUpdateEpoch(
          message,
          { telegram: true },
          epoch,
          updateEpochEndNotification
        );
    });
  const results = await Promise.allSettled(notifyEpochsEnding);

  const errors = results
    .map(r => {
      if (r.status === 'rejected') return r.reason;
    })
    .filter(r => r);

  return errors;
}

async function notifyAndUpdateEpoch(
  message: string,
  channel: { telegram: true } | { discord: true },
  epoch: { id: number; circle_id: number },
  updateFn:
    | typeof updateEpochStartNotification
    | typeof updateEpochEndNotification
) {
  await notifyEpochStatus(message, channel, epoch);
  await updateFn(epoch.id);
}

async function updateEpochStartNotification(epochId: number) {
  try {
    await adminClient.mutate({
      update_epochs_by_pk: [
        {
          pk_columns: { id: epochId },
          _set: {
            notified_start: DateTime.now().toISO(),
          },
        },
        { id: true },
      ],
    });
  } catch (e: unknown) {
    if (e instanceof Error)
      throw `Error updating start notification for epoch id ${epochId}: ${e.message}`;
  }
}

async function updateEpochEndNotification(epochId: number) {
  try {
    await adminClient.mutate({
      update_epochs_by_pk: [
        {
          pk_columns: { id: epochId },
          _set: {
            notified_before_end: DateTime.now().toISO(),
          },
        },
        { id: true },
      ],
    });
  } catch (e: unknown) {
    if (e instanceof Error)
      throw `Error updating start notification for epoch id ${epochId}: ${e.message}`;
  }
}

async function notifyEpochStatus(
  message: string,
  channel: { telegram: true } | { discord: true },
  { id: epochId, circle_id }: { id: number; circle_id: number }
) {
  try {
    await sendSocialMessage({
      message,
      circleId: circle_id,
      channels: channel,
      sanitize: false,
    });
  } catch (e: unknown) {
    // throwing here creates a promise rejection
    if (e instanceof Error)
      errorLog(
        `Error sending telegram notification for epoch id ${epochId}: ${e.message}`
      );
    return false;
  }
  return true;
}

async function setNextEpochNumber({
  id: epochId,
  circle_id,
}: {
  id: number;
  circle_id: number;
}) {
  let lastEpochResult;
  try {
    lastEpochResult = await adminClient.query({
      epochs_aggregate: [
        {
          where: {
            circle_id: { _eq: circle_id },
            ended: { _eq: true },
          },
        },
        { aggregate: { max: { number: true } } },
      ],
    });
  } catch (e: unknown) {
    if (e instanceof Error)
      throw `Error getting next number for epoch id ${epochId}: ${e.message}`;
  }
  const currentEpochNumber =
    (lastEpochResult?.epochs_aggregate.aggregate?.max?.number ?? 0) + 1;
  try {
    await adminClient.mutate({
      update_epochs_by_pk: [
        {
          pk_columns: { id: epochId },
          _set: { number: currentEpochNumber },
        },
        { number: true },
      ],
    });
  } catch (e: unknown) {
    if (e instanceof Error)
      throw `Error setting next number for epoch id ${epochId}: ${e.message}`;
  }
}

export default verifyHasuraRequestMiddleware(handler);
