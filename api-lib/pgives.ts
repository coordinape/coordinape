import { DateTime, Settings } from 'luxon';

import {
  order_by,
  GraphQLTypes,
  ValueTypes,
} from '../api-lib/gql/__generated__/zeus';
import { adminClient } from '../api-lib/gql/adminClient';
import { Awaited } from '../api-lib/ts4.5shim';
import { PGIVE_CIRCLE_MAX_PER_CRON } from '../src/config/env';

Settings.defaultZone = 'utc';

/* These are the main variables used in the algo to calculate the pGive totals   */

const BASE_ACTIVE_POINTS =
  parseInt(process.env.BASE_ACTIVE_POINTS || '') || 100;
const MAX_BASE_ACTIVE_TOTAL =
  parseInt(process.env.MAX_BASE_ACTIVE_TOTAL || '') || 3000;
const PER_ACTIVE_MONTH_BONUS =
  parseInt(process.env.PER_ACTIVE_MONTH_BONUS || '') || 4;
const MAX_ACTIVE_MONTH_BONUS =
  parseInt(process.env.MAX_ACTIVE_MONTH_BONUS || '') || 48;
const MAX_NOTE_BONUS_PER_USER =
  parseInt(process.env.MAX_NOTE_BONUS_PER_USER || '') || 30;

export const genPgives = async (
  circleIds: number[],
  startFrom: DateTime,
  endTo: DateTime
) => {
  const epochBasedData: Record<
    number,
    Record<string, GraphQLTypes['member_epoch_pgives_insert_input']>
  > = [];
  const ops: { [aliasKey: string]: ValueTypes['mutation_root'] } = {};
  const memberObjects: Array<GraphQLTypes['member_epoch_pgives_insert_input']> =
    [];

  const { circles, epoch_pgive_data } = await getCircleGifts(
    circleIds,
    startFrom,
    endTo
  );

  circles.forEach(circle => {
    const epochs = circle.epochs.filter(e => !e.pgive_data);
    if (epochs.length) {
      let activeMonths =
        epoch_pgive_data.length &&
        epoch_pgive_data.filter(e => e.epoch.circle_id === circle.id).length
          ? Math.max(
              ...epoch_pgive_data
                .filter(e => e.epoch.circle_id === circle.id)
                .map(e => e.active_months)
            ) + 1
          : 0;

      const epochIndexed: Record<string, EpochIndexed> = {};

      /* Sort the epochs by end date first so we could backfill the active months in chronological order */

      epochs
        .sort((a, b) => {
          const endDateA = DateTime.fromISO(a.end_date);
          const endDateB = DateTime.fromISO(b.end_date);
          return endDateA > endDateB ? 1 : endDateB > endDateA ? -1 : 0;
        })
        .forEach(epoch => {
          /* Massage epoch data into year-month indexes so epochs in the same month are grouped to easier process normalizations */

          const endDate = DateTime.fromISO(epoch.end_date);
          const monthKey = `${endDate.get('year')}-${endDate.get('month')}`;
          if (!(monthKey in epochIndexed)) {
            epochIndexed[monthKey] = {
              epochs: [],
              activeMonths,
              totalOptOutPgiveAlloc: {},
            };
            activeMonths++;
          }
          epochIndexed[monthKey].epochs.push({
            ...epoch,
            normalizedEpochs: [],
          });

          /* Epoch based User Map  */

          const usersData: Record<
            number,
            GraphQLTypes['member_epoch_pgives_insert_input'] & {
              gives_received: number;
            }
          > = {};

          epoch.token_gifts.forEach(g => {
            if (!(g.recipient_id in usersData)) {
              usersData[g.recipient_id] = {
                user_id: g.recipient_id,
                gives_received: g.tokens,
                pgive: 0,
                normalized_pgive: 0,
                epoch_id: epoch.id,
                opt_out_bonus: 0,
              };
            } else {
              usersData[g.recipient_id].gives_received += g.tokens;
            }
          });

          epochBasedData[epoch.id] = usersData;
        });

      const epochObjects: Array<GraphQLTypes['epoch_pgive_data_insert_input']> =
        [];

      Object.values(epochIndexed).forEach(epochIndexedData => {
        epochIndexedData.epochs.forEach(epoch => {
          let totalOptOutPgiveAlloc = 0;

          /* Filter away users that were not created or already deleted to exclude for algo processing */
          const tokenGifts = epoch.token_gifts;
          const users = circle.users.filter(u => {
            const epochEndDate = DateTime.fromISO(epoch.end_date);
            const userCreatedDate = DateTime.fromISO(u.created_at);

            return !(
              userCreatedDate >= epochEndDate ||
              (u.deleted_at && DateTime.fromISO(u.deleted_at) < epochEndDate)
            );
          });

          const activeUsersCountInEpoch = users.length;
          const uniqueRecipients = [
            ...new Set(tokenGifts.map(g => g.recipient_id)),
          ].length;
          const giftWithNotes = tokenGifts.filter(g => !!g.note).length;

          /* Possible Notes that can be given by one contributer */

          const possibleNotes = activeUsersCountInEpoch
            ? activeUsersCountInEpoch * (activeUsersCountInEpoch - 1)
            : 0;

          /* Part 1: pGIVE Total for Epoch (The pGIVE “pot”) */
          /* ----------------------------------------------- */

          /* GIVE receivers Base */
          /* (Recipients in Epoch * BASE_ACTIVE_POINTS) capped at MAX_BASE_ACTIVE_TOTAL  */

          epoch.gives_receiver_base = Math.min(
            uniqueRecipients * BASE_ACTIVE_POINTS,
            MAX_BASE_ACTIVE_TOTAL
          );

          /* Active Months Bonus */
          /* (Prior Active Months for Circle * PER_ACTIVE_MONTH_BONUS) capped at MAX_ACTIVE_MONTH_BONUS  */

          epoch.active_months_bonus =
            Math.min(
              epochIndexedData.activeMonths * PER_ACTIVE_MONTH_BONUS,
              MAX_ACTIVE_MONTH_BONUS
            ) * uniqueRecipients;

          /* Notes Written Bonus */
          /* (% of giftWithNotes / possibleNotes) * MAX_NOTE_BONUS_PER_USER  */

          epoch.notes_bonus = possibleNotes
            ? (giftWithNotes / possibleNotes) *
              MAX_NOTE_BONUS_PER_USER *
              uniqueRecipients
            : 0;

          /* Epochs that fall inside the same month */

          epoch.normalizedEpochs = epochIndexedData.epochs.map(e => e.id);

          /* Pot Total allocated for this epoch based off Algo*/

          const potTotal =
            epoch.notes_bonus +
            epoch.active_months_bonus +
            epoch.gives_receiver_base;

          /* Part 2: pGIVE per Contributor (Splitting the “pot”) */

          const recipientIds = Object.keys(epochBasedData[epoch.id]).map(
            Number
          );
          if (recipientIds.length) {
            type recMap = Record<number, number>;
            const hasSentGifts: recMap = {};
            const giftCount: recMap = {};
            const notesOnly: recMap = {};
            tokenGifts.forEach(g => {
              hasSentGifts[g.sender_id] = 1;
              if (!(g.recipient_id in giftCount)) giftCount[g.recipient_id] = 0;
              giftCount[g.recipient_id]++;
              if (g.tokens === 0) {
                if (!(g.recipient_id in notesOnly))
                  notesOnly[g.recipient_id] = 0;

                notesOnly[g.recipient_id]++;
              }
            });

            /* Calc Opt out bonus from potTotal */

            /* Opted out users that received gifts with notes gets a bonus of up to 50% of the total pot */

            const optOutShare = (0.5 * potTotal) / recipientIds.length;
            recipientIds.forEach(recipientId => {
              /* Required to have at least sent a gift. 
              In the DB we did not track if a user was opted out during an epoch 
              so we assume it by checking if all gifts received were notes only */

              let optOutBonusAlloc = 0;
              if (
                possibleNotes &&
                recipientId in hasSentGifts &&
                recipientId in notesOnly &&
                giftCount[recipientId] === notesOnly[recipientId]
              ) {
                optOutBonusAlloc = roundNumbers(
                  (notesOnly[recipientId] / possibleNotes) * optOutShare
                );
              }
              epochBasedData[epoch.id][recipientId].opt_out_bonus =
                optOutBonusAlloc;
              totalOptOutPgiveAlloc += optOutBonusAlloc;
            });
          }
          epochIndexedData.totalOptOutPgiveAlloc[epoch.id] =
            totalOptOutPgiveAlloc;
        });

        epochIndexedData.epochs.forEach(epoch => {
          const recipients = Object.values(epochBasedData[epoch.id]);
          const potTotal =
            epoch.notes_bonus +
            epoch.active_months_bonus +
            epoch.gives_receiver_base;

          if (recipients.length) {
            const totalTokensSent = epoch.token_gifts.length
              ? epoch.token_gifts.reduce(
                  (total, { tokens }) => total + tokens,
                  0
                )
              : 0;

            /* Calculate pGive per recipient */

            const totalOptOutPgiveAlloc =
              epochIndexedData.totalOptOutPgiveAlloc[epoch.id];

            /* Per contributor allocated: 
            (Total Epoch pGIVE excluding Opt Out Bonus if any) * (% of GIVE received) */

            recipients.forEach(recipient => {
              if (recipient.gives_received) {
                recipient.pgive =
                  (recipient.gives_received / totalTokensSent) *
                  (potTotal - totalOptOutPgiveAlloc);
              }
              recipient.pgive += recipient.opt_out_bonus;
            });
          }

          // epoch insert objects
          epochObjects.push({
            pgive: potTotal ? roundNumbers(potTotal) : 0,
            gives_receiver_base: roundNumbers(epoch.gives_receiver_base),
            active_months_bonus: roundNumbers(epoch.active_months_bonus),
            notes_bonus: roundNumbers(epoch.notes_bonus),
            epoch_id: epoch.id,
            active_months: epochIndexedData.activeMonths,
          });
        });

        /* Normalize the epochs pgives in the same month for the recipients */

        epochIndexedData.epochs.forEach(epoch => {
          Object.keys(epochBasedData[epoch.id]).forEach(recipientId => {
            const recipient = epochBasedData[epoch.id][recipientId];
            if (epochIndexedData.epochs.length > 1) {
              let epochsTotalPGive = 0;
              epoch.normalizedEpochs.forEach(eId => {
                epochsTotalPGive +=
                  recipientId in epochBasedData[eId]
                    ? epochBasedData[eId][recipientId].pgive
                    : 0;
              });

              /* Epochs are normalized by simply dividing the total pGives and the number of epochs */

              recipient.normalized_pgive =
                epochsTotalPGive / epoch.normalizedEpochs.length;
            } else {
              recipient.normalized_pgive = recipient.pgive;
            }

            memberObjects.push({
              pgive: roundNumbers(recipient.pgive),
              user_id: recipient.user_id,
              normalized_pgive: roundNumbers(recipient.normalized_pgive),
              gives_received: recipient.gives_received,
              opt_out_bonus: roundNumbers(recipient.opt_out_bonus),
              epoch_id: epoch.id,
            });
          });
        });
      });

      if (epochObjects.length) {
        ops[`u${circle.id}_epoch_data`] = {
          insert_epoch_pgive_data: [
            {
              objects: epochObjects,
            },
            { __typename: true },
          ],
        };
      }
    }
    return;
  });

  if (memberObjects.length) {
    ops[`member_data`] = {
      insert_member_epoch_pgives: [
        {
          objects: memberObjects,
        },
        { __typename: true },
      ],
    };
  }
  if (Object.keys(ops).length) {
    await adminClient.mutate(
      {
        __alias: {
          ...ops,
        },
      },
      {
        operationName: 'insert_pGiveData',
      }
    );
  }
};

type EpochData = GraphQLTypes['epoch_pgive_data_insert_input'] &
  getCircleGiftsResult['circles'][0]['epochs'][0] & {
    normalizedEpochs: Array<number>;
  };

interface EpochIndexed {
  epochs: Array<EpochData>;
  activeMonths: number;
  totalOptOutPgiveAlloc: Record<number, number>;
}

type getCircleGiftsResult = Awaited<ReturnType<typeof getCircleGifts>>;
const getCircleGifts = async (
  circleIds: Array<number>,
  startFrom: DateTime,
  endTo: DateTime
) => {
  const { circles, epoch_pgive_data } = await adminClient.query(
    {
      circles: [
        {
          order_by: [{ id: order_by.asc }],
          where: {
            id: { _in: circleIds },
            epochs: {
              ended: { _eq: true },
            },
          },
        },
        {
          id: true,
          name: true,
          epochs: [
            {
              where: {
                ended: { _eq: true },
                end_date: { _gte: startFrom.toISO(), _lte: endTo.toISO() },
                _not: {
                  /* this filters away epochs that already has pgive data generated */
                  pgive_data: {},
                },
              },
            },
            {
              id: true,
              end_date: true,
              pgive_data: {
                id: true,
              },
              token_gifts: [
                {},
                {
                  sender_id: true,
                  sender_address: true,
                  recipient_id: true,
                  recipient_address: true,
                  recipient: {
                    name: true,
                  },
                  tokens: true,
                  note: true,
                },
              ],
            },
          ],
          users: [
            {},
            {
              id: true,
              name: true,
              deleted_at: true,
              created_at: true,
            },
          ],
        },
      ],
      epoch_pgive_data: [
        {
          where: {
            epoch: {
              circle_id: { _in: circleIds },
            },
          },
        },
        {
          active_months: true,
          epoch: {
            circle_id: true,
          },
        },
      ],
    },
    { operationName: 'GenPgiveCircleGiftQuery' }
  );

  return { circles, epoch_pgive_data };
};

export const getCirclesNoPgiveWithDateFilter = async (
  startFrom: DateTime,
  endTo: DateTime
): Promise<Array<number>> => {
  const { circles } = await adminClient.query(
    {
      circles: [
        {
          limit: PGIVE_CIRCLE_MAX_PER_CRON || 10,
          where: {
            epochs: {
              ended: { _eq: true },
              end_date: { _gte: startFrom.toISO(), _lte: endTo.toISO() },
              _not: {
                /* this filters away epochs that already has pgive data generated */
                pgive_data: {},
              },
            },
          },
        },
        {
          id: true,
        },
      ],
    },
    { operationName: 'GenPgiveCircleFetch' }
  );
  return circles.length ? circles.map(c => c.id) : [];
};

const roundNumbers = (value: number) => {
  return Math.round(value * 100) / 100;
};
