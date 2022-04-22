import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import dedent from 'dedent';
import { DateTime, DurationObjectUnits, Settings } from 'luxon';

import { CIRCLES } from '../../../api-lib/constants';
import { pending_token_gifts_select_column } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorLog } from '../../../api-lib/HttpError';
import { sendSocialMessage } from '../../../api-lib/sendSocialMessage';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

Settings.defaultZone = 'utc';

async function handler(req: VercelRequest, res: VercelResponse) {
  const yesterday = DateTime.now().minus({ days: 1 }).toISO();
  try {
    const updateResult = await adminClient.query(
      {
        epochs: [
          {
            where: {
              end_date: { _gt: 'now()' },
              start_date: { _lt: 'now()' },
              ended: { _eq: false },
            },
          },
          {
            number: true,
            start_date: true,
            end_date: true,

            circle: {
              organization: {
                id: true,
                name: true,
                telegram_id: true,
              },
              id: true,
              name: true,
              token_name: true,
              discord_webhook: true,
              telegram_id: true,

              __alias: {
                optOuts: {
                  users_aggregate: [
                    {
                      where: {
                        non_receiver: { _eq: true },
                        deleted_at: { _is_null: true },
                      },
                    },
                    {
                      aggregate: { count: [{}, true] },
                    },
                  ],
                },
                receiversTotal: {
                  users_aggregate: [
                    {
                      where: {
                        non_receiver: { _eq: false },
                        role: { _lt: 2 },
                        deleted_at: { _is_null: true },
                      },
                    },
                    { aggregate: { count: [{}, true] } },
                  ],
                },
                emptyBio: {
                  users: [
                    {
                      where: {
                        bio: { _is_null: true },
                        non_receiver: { _eq: false },
                        // for YEARN COMMUNITY circle only
                        circle_id: { _eq: CIRCLES.YEARN.COMMUNITY },
                        deleted_at: { _is_null: true },
                      },
                    },
                    {
                      name: true,
                    },
                  ],
                },
              },
            },

            __alias: {
              allocationTotals: {
                epoch_pending_token_gifts_aggregate: [
                  {},
                  {
                    aggregate: {
                      sum: { __alias: { sumGive: { tokens: true } } },
                      __alias: { totalAllocations: { count: [{}, true] } },
                    },
                  },
                ],
              },
              sendersCount: {
                epoch_pending_token_gifts_aggregate: [
                  {
                    distinct_on: [
                      pending_token_gifts_select_column.sender_address,
                    ],
                  },
                  { aggregate: { count: [{}, true] } },
                ],
              },
              sendersToday: {
                epoch_pending_token_gifts_aggregate: [
                  {
                    where: { updated_at: { _gte: yesterday } },
                    distinct_on: [
                      pending_token_gifts_select_column.sender_address,
                    ],
                  },
                  {
                    nodes: {
                      sender: {
                        name: true,
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      {
        operationName: 'cron-dailyUpdate',
      }
    );

    for (const epoch of updateResult.epochs) {
      const {
        start_date,
        end_date,
        sendersCount,
        sendersToday: dailySenders,
        allocationTotals,
        circle,
      } = epoch;
      assert(circle, 'epoch somehow missing circle');
      const epochStartDate = DateTime.fromISO(start_date);
      const epochEndDate = DateTime.fromISO(end_date);
      const epochTimeRemaining = epochEndDate
        .diffNow()
        .shiftTo('weeks', 'days', 'hours')
        .toObject();

      const sendersToday =
        dailySenders.epoch_pending_token_gifts_aggregate.nodes.map(
          node => node.sender.name
        );
      const totalAllocations =
        allocationTotals.epoch_pending_token_gifts_aggregate.aggregate
          ?.totalAllocations.count;
      const tokensSent =
        allocationTotals.epoch_pending_token_gifts_aggregate.aggregate?.sum
          ?.sumGive.tokens;
      const optOuts = circle?.optOuts.users_aggregate.aggregate?.count;
      const usersAllocated =
        sendersCount.epoch_pending_token_gifts_aggregate.aggregate?.count;
      const optedInUsers =
        circle.receiversTotal.users_aggregate.aggregate?.count;

      const emptyBioNotif =
        circle.id === CIRCLES.YEARN.COMMUNITY
          ? dedent`
              Opted in contributors who have NOT entered a statement for Epoch:
              ${circle.emptyBio.users.map(u => u.name).join(', ')}
          `
          : ``;

      const message = dedent`
        ${circle.organization?.name} / ${circle.name} Epoch #${epoch.number}

        ${epochStartDate.toLocaleString(
          DateTime.DATETIME_FULL
        )} to ${epochEndDate.toLocaleString(DateTime.DATETIME_FULL)}
        Total Allocations: ${totalAllocations ?? 0}
        ${circle.token_name || 'GIVE'} sent: ${tokensSent ?? 0}
        Opt outs: ${optOuts ?? 0}
        Users Allocated: ${usersAllocated ?? 0} / ${optedInUsers ?? 0}
        epoch ending ${timeStringFromDuration(epochTimeRemaining)} from now!
        Users that made new allocations today:
          ${sendersToday.join(', ')}
        ${emptyBioNotif}
      `;

      if (circle.telegram_id) {
        try {
          await sendSocialMessage({
            message,
            circleId: circle.id,
            channels: { telegram: true },
            sanitize: false,
          });
        } catch (e: unknown) {
          if (e instanceof Error)
            errorLog(
              `Telegram Daily Update error for circle #${circle.id}: ` +
                e.message
            );
        }
      }

      if (circle.organization?.telegram_id) {
        try {
          await sendSocialMessage({
            message,
            circleId: circle.id,
            channels: { telegram: true },
            sanitize: false,
            notifyOrg: true,
          });
        } catch (e: unknown) {
          if (e instanceof Error)
            errorLog(
              `Telegram Daily Update error for organisation #${circle.organization?.id}: ` +
                e.message
            );
        }
      }

      if (circle.discord_webhook) {
        try {
          await sendSocialMessage({
            message,
            circleId: circle.id,
            channels: { discord: true },
            sanitize: false,
          });
        } catch (e: unknown) {
          if (e instanceof Error)
            errorLog(
              `Discord Daily Update error for circle #${circle.id}: ` +
                e.message
            );
        }
      }
    }

    res.status(200).json({ message: 'updates sent' });
  } catch (e) {
    res.status(401).json({
      error: '401',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}

function timeExists(t: number | undefined, unit: string) {
  return t ? Math.floor(t) + unit : '';
}

function timeStringFromDuration({ weeks, days, hours }: DurationObjectUnits) {
  const weeksString = timeExists(weeks, 'w');
  const daysString = timeExists(days, 'd');
  const hoursString = timeExists(hours, 'h');
  // filter out empty strings to avoid double-spaces during the join
  return [weeksString, daysString, hoursString].filter(str => str).join(' ');
}

export default verifyHasuraRequestMiddleware(handler);
