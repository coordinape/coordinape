import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import dedent from 'dedent';
import { DateTime, Settings } from 'luxon';
import { z } from 'zod';

import { insertActivity } from '../../../api-lib/event_triggers/activity/mutations';
import { ValueTypes } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { getOverlappingEpoch } from '../../../api-lib/gql/queries';
import { errorLog } from '../../../api-lib/HttpError';
import { sendSocialMessage } from '../../../api-lib/sendSocialMessage';
import { Awaited } from '../../../api-lib/ts4.5shim';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { findMonthlyEndDate } from '../../../src/common-lib/epochs';
import {
  zCustomRepeatData,
  zMonthlyRepeatData,
} from '../actions/_handlers/createEpoch';

Settings.defaultZone = 'utc';

export const zEpochRepeatData = z.discriminatedUnion('type', [
  zCustomRepeatData,
  zMonthlyRepeatData,
]);

export type RepeatData = z.infer<typeof zEpochRepeatData>;

export type EpochsToNotify = Awaited<ReturnType<typeof getEpochsToNotify>>;

async function handler(req: VercelRequest, res: VercelResponse) {
  const epochResult = await getEpochsToNotify();

  const notifyStartResults = await notifyEpochStart(epochResult);
  const notifyEndResults = await notifyEpochEnd(epochResult);
  const endResults = await endEpoch(epochResult);

  res
    .status(200)
    .json({ message: [notifyStartResults, notifyEndResults, endResults] });
}

async function getEpochsToNotify() {
  const inTwentyFourHours = DateTime.now().plus({ hours: 24 }).toISO();

  return await adminClient.query(
    {
      __alias: {
        notifyStartEpochs: {
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
                organization: { id: true, name: true },
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
                discord_circle: {
                  discord_channel_id: true,
                  discord_role_id: true,
                  alerts: [{}, true],
                },
              },
            },
          ],
        },
        notifyEndEpochs: {
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
                token_name: true,
                discord_webhook: true,
                organization: { id: true, name: true },
                users: [
                  {
                    where: {
                      non_giver: { _eq: false },
                      deleted_at: { _is_null: true },
                      give_token_remaining: { _gt: 0 },
                    },
                  },
                  {
                    profile: {
                      name: true,
                    },
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
              repeat_data: [{}, true],
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
                  {
                    where: {
                      deleted_at: { _is_null: true },
                    },
                  },
                  {
                    id: true,
                    profile: {
                      name: true,
                    },
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
              token_gifts: [
                {
                  where: {
                    tokens: { _gt: 0 },
                  },
                },
                {
                  tokens: true,
                },
              ],
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
            },
          ],
        },
      },
    },
    {
      operationName: 'cron_epochsToNotify',
    }
  );
}

export async function notifyEpochStart({
  notifyStartEpochs: epochs,
}: EpochsToNotify) {
  const sendNotifications = epochs.map(async epoch => {
    const { start_date, end_date, circle, number } = epoch;

    let epochNumber = number;
    if (epochNumber == null) {
      epochNumber = await setNextEpochNumber(epoch);
    }

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

    const {
      discord_channel_id: channelId,
      discord_role_id: roleId,
      alerts,
    } = circle?.discord_circle || {};

    if (channelId && roleId && alerts?.['epoch-start']) {
      await sendSocialMessage({
        message,
        circleId: circle.id,
        channels: {
          isDiscordBot: true,
          discordBot: {
            type: 'start' as const,
            channelId,
            roleId,
            epochName: `Epoch ${epochNumber}`,
            circleId: circle.id,
            circleName: `${circle.organization?.name}/${circle.name}`,
            startTime: start_date,
            endTime: end_date,
          },
        },
        sanitize: false,
      });
    }

    if (circle.discord_webhook) {
      await notifyEpochStatus(message, { discord: true }, epoch);
    }

    if (circle.telegram_id)
      await notifyEpochStatus(message, { telegram: true }, epoch);

    if (epoch.circle) {
      await insertEpochStartActivity({
        ...epoch,
        organization_id: epoch.circle.organization.id,
      });
    }
    await updateEpochStartNotification(epoch.id);
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
  notifyEndEpochs: epochs,
}: EpochsToNotify) {
  const notifyEpochsEnding = epochs
    .filter(({ circle }) => circle?.telegram_id || circle?.discord_webhook)
    .map(async epoch => {
      const { circle } = epoch;
      assert(circle, 'panic: no circle for epoch');

      const usersHodlingGive = circle.users.map(u => u.profile.name);

      const message = dedent`
      ${circle.organization?.name}/${
        circle.name
      } epoch ends in less than 24 hours!
      Users that have yet to fully allocate their ${
        circle.token_name || 'GIVE'
      }:
      ${usersHodlingGive.join(', ')}
    `;

      if (circle.discord_webhook) {
        await notifyEpochStatus(message, { discord: true }, epoch);
      }

      if (circle.telegram_id) {
        await notifyEpochStatus(message, { telegram: true }, epoch);
      }
      await updateEpochEndSoonNotification(epoch.id);
    });
  const results = await Promise.allSettled(notifyEpochsEnding);

  const errors = results
    .map(r => {
      if (r.status === 'rejected') return r.reason;
    })
    .filter(r => r);

  return errors;
}

export async function endEpoch({ endEpoch: epochs }: EpochsToNotify) {
  const endingPromises = epochs.map(async epoch => {
    await endEpochHandler(epoch);
  });

  const results = await Promise.allSettled(endingPromises);
  return results
    .map(r => {
      if (r.status === 'rejected') return r.reason;
    })
    .filter(r => r);
}

export async function endEpochHandler(
  epoch: Pick<EpochsToNotify, 'endEpoch'>['endEpoch'][number]
) {
  const { epoch_pending_token_gifts: pending_gifts, circle, circle_id } = epoch;
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
        operationName: 'endEpoch_insertAndDeleteGifts',
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
    if (userUserHasAllGive) usersWithStartingGive.push(user.profile.name);
    const optOutMutation =
      !user.non_giver &&
      !user.non_receiver &&
      circle.auto_opt_out &&
      userUserHasAllGive
        ? { non_receiver: true }
        : {};

    ops[`u${user.id}_history`] = {
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
    ops[`u${user.id}_userReset`] = {
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
      operationName: 'endEpoch_update',
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

  const {
    discord_channel_id: channelId,
    discord_role_id: roleId,
    alerts,
  } = circle?.discord_circle || {};

  if (channelId && roleId && alerts?.['epoch-end']) {
    await sendSocialMessage({
      message,
      circleId: circle.id,
      channels: {
        isDiscordBot: true,
        discordBot: {
          type: 'end' as const,
          channelId,
          roleId,
          epochName: `Epoch ${epoch.number}`,
          circleId: circle.id,
          circleName: `${circle.organization?.name}/${circle.name}`,
          endTime: epoch.end_date,
          // use the pending gifts because we don't have a handle on the permanent ones yet, but these are equivalent
          giveCount: pending_gifts?.reduce(
            (total, { tokens }) => tokens + total,
            0
          ),
          userCount: circle.users.length,
        },
      },
      sanitize: false,
    });
  }

  if (circle.discord_webhook)
    await notifyEpochStatus(message, { discord: true }, epoch);

  if (circle.telegram_id)
    await notifyEpochStatus(message, { telegram: true }, epoch);

  if (circle.organization?.telegram_id)
    await notifyEpochStatus(message, { telegram: true }, epoch, true);

  if (epoch.circle) {
    await insertEpochEndActivity({
      ...epoch,
      organization_id: epoch.circle.organization.id,
    });
  }

  await updateEndEpochNotification(epoch.id);

  // set up another repeating epoch if configured
  const { start_date, end_date, repeat_data } = epoch;
  assert(start_date, 'panic: no start date');
  assert(end_date, 'panic: no end date');
  if (repeat_data) {
    await createNextEpoch({ ...epoch, start_date, end_date, repeat_data });
  }
}

export async function createNextEpoch(epoch: {
  id: number;
  start_date: string;
  end_date: string;
  circle_id: number;
  repeat_data: unknown;
  circle?: { telegram_id?: string; discord_webhook?: string };
}) {
  const { repeat_data, id, circle } = epoch;
  const parseResult = zEpochRepeatData.safeParse(repeat_data);

  if (!parseResult.success) {
    errorLog(
      `epoch id ${id}: invalid repeat data: ${JSON.stringify(
        repeat_data
      )}: ${JSON.stringify(parseResult)}`
    );
    return;
  }

  const { nextStartDate, nextEndDate } = calculateNextEpoch(
    epoch,
    parseResult.data
  );
  const existingEpoch = await getOverlappingEpoch(
    nextStartDate,
    nextEndDate,
    epoch.circle_id
  );

  if (existingEpoch) {
    errorLog(
      dedent`
        For circle id ${epoch.circle_id},  ${nextStartDate} overlaps
        with the another epoch: existing epoch id: ${existingEpoch?.id},
        start: ${existingEpoch?.start_date}, end: ${existingEpoch?.end_date}
      `,
      false
    );
    return;
  }

  await adminClient.mutate(
    {
      insert_epochs_one: [
        {
          object: {
            circle_id: epoch.circle_id,
            start_date: nextStartDate.toISO(),
            end_date: nextEndDate.toISO(),
            repeat_data,
          },
        },
        { __typename: true },
      ],
    },
    {
      operationName: 'createNextEpoch',
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

export function calculateNextEpoch(
  {
    start_date,
    end_date,
  }: {
    start_date: string;
    end_date: string;
  },
  repeatData: z.infer<typeof zEpochRepeatData>
): { nextStartDate: DateTime; nextEndDate: DateTime } {
  switch (repeatData.type) {
    case 'custom': {
      const {
        duration,
        duration_unit,
        frequency,
        frequency_unit,
        time_zone: zone,
      } = repeatData;
      const nextStartDate = DateTime.fromISO(start_date, { zone }).plus({
        [frequency_unit]: frequency,
      });
      const nextEndDate = nextStartDate.plus({ [duration_unit]: duration });
      return { nextStartDate, nextEndDate };
    }
    case 'monthly': {
      const { time_zone: zone } = repeatData;
      const nextStartDate = DateTime.fromISO(end_date, { zone });
      const nextEndDate = findMonthlyEndDate(nextStartDate);
      return { nextStartDate, nextEndDate };
    }
  }
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
        `Error sending telegram/discord notification for epoch id ${epochId}: ${e.message}`
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
              end_date: { _lte: 'now()' },
            },
          },
          { aggregate: { max: { number: true } } },
        ],
      },
      {
        operationName: 'cron_setNextEpochNumber_getLastEpoch',
      }
    );
  } catch (e: unknown) {
    if (e instanceof Error)
      throw `Error getting next number for epoch id ${epochId}: ${e.message}`;
  }
  const currentEpochNumber =
    (lastEpochResult?.epochs_aggregate?.aggregate?.max?.number ?? 0) + 1;
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
        operationName: 'cron_setNextEpochNumber_update',
      }
    );

    return currentEpochNumber;
  } catch (e: unknown) {
    if (e instanceof Error)
      throw `Error setting next number for epoch id ${epochId}: ${e.message}`;
  }
}

interface EpochActivityInput {
  id: number;
  circle_id: number;
  organization_id: number;
  start_date?: string;
  end_date?: string;
}

export async function insertEpochStartActivity(epoch: EpochActivityInput) {
  const action = 'epochs_started';

  const activityExists = await epochActivityExists(epoch.id, action);
  if (!activityExists) {
    await insertActivity({
      epoch_id: epoch.id,
      action: action,
      circle_id: epoch.circle_id,
      created_at: epoch.start_date,
      organization_id: epoch.organization_id,
    });
  }
}

export async function insertEpochEndActivity(epoch: EpochActivityInput) {
  const action = 'epochs_ended';

  const activityExists = await epochActivityExists(epoch.id, action);
  if (!activityExists) {
    await insertActivity({
      epoch_id: epoch.id,
      action: action,
      circle_id: epoch.circle_id,
      created_at: epoch.end_date,
      organization_id: epoch.organization_id,
    });
  }
}

async function epochActivityExists(
  epoch_id: number,
  action: string
): Promise<boolean> {
  const { epochs_by_pk } = await adminClient.query(
    {
      epochs_by_pk: [
        { id: epoch_id },
        {
          activities_aggregate: [
            {
              where: {
                action: { _eq: action },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
      ],
    },
    {
      operationName: 'cron_epochs_getEpochActivity',
    }
  );

  if (epochs_by_pk) {
    return (epochs_by_pk.activities_aggregate.aggregate?.count || 0) > 0;
  } else {
    return false;
  }
}

export default verifyHasuraRequestMiddleware(handler);
