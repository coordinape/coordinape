import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import dedent from 'dedent';
import { DateTime, Settings, Duration } from 'luxon';

import { ValueTypes } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { getOverlappingEpoch } from '../../../api-lib/gql/queries';
import { errorLog } from '../../../api-lib/HttpError';
import { sendSocialMessage } from '../../../api-lib/sendSocialMessage';
import { Awaited } from '../../../api-lib/ts4.5shim';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

Settings.defaultZone = 'utc';

export type EpochsToNotify = Awaited<ReturnType<typeof getEpochsToNotify>>;

async function handler(req: VercelRequest, res: VercelResponse) {
  const epochResult = await getEpochsToNotify();

  const results = await Promise.all([
    notifyEpochStart(epochResult),
    notifyEpochEnd(epochResult),
    endEpoch(epochResult),
  ]);

  res.status(200).json({ message: results });
}

async function getEpochsToNotify() {
  const inTwentyFourHours = DateTime.now().plus({ hours: 24 }).toISO();

  const result = await adminClient.query(
    {
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
                  {
                    where: {
                      non_giver: { _eq: false },
                      deleted_at: { _is_null: true },
                    },
                  },
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
                      deleted_at: { _is_null: true },
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
                ended: { _eq: false },
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
                organization: { name: true, telegram_id: true },
                users: [
                  {
                    where: {
                      deleted_at: { _is_null: true },
                    },
                  },
                  {
                    id: true,
                    name: true,
                    non_giver: true,
                    non_receiver: true,
                    circle_id: true,
                    bio: true,
                    starting_tokens: true,
                    give_token_remaining: true,
                  },
                ],
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
                },
              ],
            },
          ],
        },
      },
    },
    {
      operationName: 'cron-epochsToNotify',
    }
  );
  return result;
}

export async function notifyEpochStart({
  notifyStart: { epochs },
}: EpochsToNotify) {
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

export async function notifyEpochEnd({
  notifyEnd: { epochs },
}: EpochsToNotify) {
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
          updateEpochEndSoonNotification
        );

      if (circle.telegram_id)
        await notifyAndUpdateEpoch(
          message,
          { telegram: true },
          epoch,
          updateEpochEndSoonNotification
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

export async function endEpoch({ endEpoch: { epochs } }: EpochsToNotify) {
  const endingPromises = epochs.map(async epoch => {
    const {
      epoch_pending_token_gifts: pending_gifts,
      circle,
      circle_id,
    } = epoch;
    assert(circle, `panic: circle #${circle_id} does not exist`);

    // copy pending_gift_tokens to token_gifts
    // delete pending_gift_tokens
    if (pending_gifts.length) {
      await adminClient.mutate(
        {
          insert_token_gifts: [
            { objects: pending_gifts },
            { __typename: true, affected_rows: true },
          ],
          delete_pending_token_gifts: [
            { where: { epoch_id: { _eq: epoch.id } } },
            { affected_rows: true },
          ],
        },
        {
          operationName: 'endEpoch-insertAndDeleteGifts',
        }
      );
    }

    const usersWithStartingGive = [] as Array<string>;
    // if auto_opt_out is true, set users where `starting_tokens == give_tokens_remaining to non_receiver = true
    // copy user bios to histories
    // reset give_tokens_received = 0, give_token_remaining = starting tokens, epoch_first_visit = 1, bio = null
    const userUpdateMutations = circle.users.reduce((ops, user) => {
      const userUserHasAllGive =
        user.give_token_remaining === user.starting_tokens;
      if (userUserHasAllGive) usersWithStartingGive.push(user.name);
      const optOutMutation =
        !user.non_giver &&
        !user.non_receiver &&
        circle.auto_opt_out &&
        userUserHasAllGive
          ? { non_receiver: true }
          : {};

      ops[user.id + '_history'] = {
        insert_histories_one: [
          {
            object: {
              user_id: user.id,
              bio: user.bio,
              epoch_id: epoch.id,
              circle_id: circle_id,
            },
          },
          { __typename: true },
        ],
      };
      ops[user.id + '_userReset'] = {
        update_users_by_pk: [
          {
            pk_columns: { id: user.id },
            _set: {
              give_token_received: 0,
              give_token_remaining: user.starting_tokens,
              epoch_first_visit: true,
              bio: null,
              ...optOutMutation,
            },
          },
          { __typename: true },
        ],
      };
      return ops;
    }, {} as { [aliasKey: string]: ValueTypes['mutation_root'] });

    await adminClient.mutate(
      {
        update_epochs_by_pk: [
          {
            pk_columns: { id: epoch.id },
            _set: {
              ended: true,
            },
          },
          { __typename: true },
        ],
        __alias: {
          ...userUpdateMutations,
        },
      },
      {
        operationName: 'endEpoch-update',
      }
    );

    // set epoch number if not existent yet
    if (epoch.number == null) await setNextEpochNumber(epoch);

    // send message if notification channel is enabled
    const message = dedent`
      ${circle.organization?.name}/${circle.name} epoch has just ended!
      Users who did not allocate any ${circle.token_name}:
      ${usersWithStartingGive.join(', ')}
    `;
    if (circle.discord_webhook)
      await notifyAndUpdateEpoch(
        message,
        { discord: true },
        epoch,
        updateEndEpochNotification
      );

    if (circle.telegram_id)
      await notifyAndUpdateEpoch(
        message,
        { telegram: true },
        epoch,
        updateEndEpochNotification
      );

    if (circle.organization?.telegram_id)
      await notifyEpochStatus(message, { telegram: true }, epoch, true);

    // set up another repeating epoch if configured
    // key: repeat 0 - no repeat, 1 - weekly, 2 - monthly
    // if weekly add seven days to start date
    if (epoch.repeat > 0) {
      const { start_date, end_date } = epoch;
      assert(start_date, 'panic: no start date');
      assert(end_date, 'panic: no end date');
      await createNextEpoch({ ...epoch, start_date, end_date });
    }
  });

  const results = await Promise.allSettled(endingPromises);
  return results
    .map(r => {
      if (r.status === 'rejected') return r.reason;
    })
    .filter(r => r);
}

async function createNextEpoch(epoch: {
  id: number;
  start_date: string;
  end_date: string;
  circle_id: number;
  repeat: number;
  days?: number;
  repeat_day_of_month: number;
  circle?: { telegram_id?: string; discord_webhook?: string };
}) {
  const {
    start_date,
    end_date,
    repeat,
    repeat_day_of_month,
    circle,
    days: epochLengthInDays,
  } = epoch;
  const start = DateTime.fromISO(start_date);
  const end = DateTime.fromISO(end_date);
  const days = epochLengthInDays
    ? Duration.fromObject({ days: epochLengthInDays })
    : end.diff(start, 'days');
  const nextStartDate =
    repeat === 1
      ? start.plus({ days: 7 })
      : DateTime.fromObject({
          month: start.plus({ months: 1 }).month,
          day: Math.min(
            repeat_day_of_month ?? start.toFormat('d'),
            getDaysInNextMonth(start)
          ),
        });

  if (nextStartDate < end) {
    errorLog(
      `For circle id ${epoch.circle_id},  ${nextStartDate} overlaps with the prior epoch's end date: ${end}`
    );

    return;
  }

  const nextEndDate = nextStartDate.plus(days);

  const existingEpoch = await getOverlappingEpoch(
    nextStartDate,
    nextEndDate,
    epoch.circle_id
  );

  if (existingEpoch) {
    errorLog(
      `For circle id ${epoch.circle_id},  ${nextStartDate} overlaps with the another epoch: existing epoch id: ${existingEpoch?.id}, start: ${existingEpoch?.start_date}, end: ${existingEpoch?.end_date}`
    );
    return;
  }

  await adminClient.mutate(
    {
      insert_epochs_one: [
        {
          object: {
            circle_id: epoch.circle_id,
            repeat: repeat,
            repeat_day_of_month: repeat_day_of_month,
            days: Math.floor(days.days),
            start_date: nextStartDate.toISO(),
            end_date: nextEndDate.toISO(),
          },
        },
        { __typename: true },
      ],
    },
    {
      operationName: 'creatNextEpoch',
    }
  );

  const message = dedent`
      A new repeating epoch has been created: ${nextStartDate.toLocaleString(
        DateTime.DATETIME_FULL
      )} to ${nextEndDate.toLocaleString(DateTime.DATETIME_FULL)}
    `;

  if (circle?.discord_webhook)
    await notifyEpochStatus(message, { discord: true }, epoch);

  if (circle?.telegram_id)
    await notifyEpochStatus(message, { telegram: true }, epoch);
}

function getDaysInNextMonth(date: DateTime) {
  const next = date.plus({ months: 1 });
  return daysInMonth(next.month, next.year);
}

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

async function notifyAndUpdateEpoch(
  message: string,
  channel: { telegram: true } | { discord: true },
  epoch: { id: number; circle_id: number },
  updateFn:
    | typeof updateEpochStartNotification
    | typeof updateEpochEndSoonNotification
    | typeof updateEndEpochNotification
) {
  await notifyEpochStatus(message, channel, epoch);
  await updateFn(epoch.id);
}

async function updateEpochStartNotification(epochId: number) {
  try {
    await adminClient.mutate(
      {
        update_epochs_by_pk: [
          {
            pk_columns: { id: epochId },
            _set: {
              notified_start: DateTime.now().toISO(),
            },
          },
          { id: true },
        ],
      },
      {
        operationName: 'updateEpochStartNotification',
      }
    );
  } catch (e: unknown) {
    if (e instanceof Error)
      throw new Error(
        `Error updating start notification for epoch id ${epochId}: ${e.message}`
      );
  }
}

async function updateEpochEndSoonNotification(epochId: number) {
  try {
    await adminClient.mutate(
      {
        update_epochs_by_pk: [
          {
            pk_columns: { id: epochId },
            _set: {
              notified_before_end: DateTime.now().toISO(),
            },
          },
          { id: true },
        ],
      },
      {
        operationName: 'updateEpochEndSoonNotification',
      }
    );
  } catch (e: unknown) {
    if (e instanceof Error)
      throw new Error(
        `Error updating before-end notification for epoch id ${epochId}: ${e.message}`
      );
  }
}

async function updateEndEpochNotification(epochId: number) {
  try {
    await adminClient.mutate(
      {
        update_epochs_by_pk: [
          {
            pk_columns: { id: epochId },
            _set: {
              notified_end: DateTime.now().toISO(),
            },
          },
          { id: true },
        ],
      },
      {
        operationName: 'updateEndEpochNotification',
      }
    );
  } catch (e: unknown) {
    if (e instanceof Error)
      throw new Error(
        `Error updating end notification for epoch id ${epochId}: ${e.message}`
      );
  }
}

async function notifyEpochStatus(
  message: string,
  channel: { telegram: true } | { discord: true },
  { id: epochId, circle_id }: { id: number; circle_id: number },
  notifyOrg = false
) {
  try {
    await sendSocialMessage({
      message,
      circleId: circle_id,
      channels: channel,
      sanitize: false,
      notifyOrg,
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
    lastEpochResult = await adminClient.query(
      {
        epochs_aggregate: [
          {
            where: {
              circle_id: { _eq: circle_id },
              ended: { _eq: true },
            },
          },
          { aggregate: { max: { number: true } } },
        ],
      },
      {
        operationName: 'cron-setNextEpochNumber-getLastEpoch',
      }
    );
  } catch (e: unknown) {
    if (e instanceof Error)
      throw `Error getting next number for epoch id ${epochId}: ${e.message}`;
  }
  const currentEpochNumber =
    (lastEpochResult?.epochs_aggregate.aggregate?.max?.number ?? 0) + 1;
  try {
    await adminClient.mutate(
      {
        update_epochs_by_pk: [
          {
            pk_columns: { id: epochId },
            _set: { number: currentEpochNumber },
          },
          { number: true },
        ],
      },
      {
        operationName: 'cron-setNextEpochNumber-update',
      }
    );
  } catch (e: unknown) {
    if (e instanceof Error)
      throw `Error setting next number for epoch id ${epochId}: ${e.message}`;
  }
}

export default verifyHasuraRequestMiddleware(handler);
