import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';

import { ValueTypes } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { Awaited } from '../../../api-lib/ts4.5shim';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

Settings.defaultZone = 'utc';

const BASE_ACTIVE_POINTS = 100;
const MAX_BASE_ACTIVE_TOTAL = 3000;
const PER_ACTIVE_MONTH_BONUS = 8;
const MAX_ACTIVE_MONTH_BONUS = 96;
const MAX_NOTE_BONUS_PER_USER = 30;

async function handler(req: VercelRequest, res: VercelResponse) {
  // console.log('cron Running');
  // try {
  const counter = 0;
  const circles = await getCircleGifts();
  const ops: { [aliasKey: string]: ValueTypes['mutation_root'] } = {};
  const epochBasedData: Record<number, Record<string, UserData>> = [];
  circles.some(async circle => {
    if (counter >= 200) return true;
    if (circle.circle_pgives.length === 0 && circle.epochs.length) {
      let activeMonths = 0;
      const epochIndexed: Record<string, EpochIndexed> = {};

      /* Sort the epochs by end date first so we could backfill the active months in chronological order */

      circle.epochs
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
            epochIndexed[monthKey] = { epochs: [], activeMonths };
            activeMonths++;
          }
          epochIndexed[monthKey].epochs.push(epoch);
        });

      const epochKeys = Object.keys(epochIndexed);
      for (const key in epochKeys) {
        const epochs = epochIndexed[key].epochs;
        for (const eKey in epochs) {
          const epoch = epochs[eKey];
          const epochEndDate = DateTime.fromISO(epoch.end_date);
          const users = circle.users.filter(u => {
            const userCreatedDate = DateTime.fromISO(u.created_at);
            return !(
              userCreatedDate >= epochEndDate ||
              (u.deleted_at && DateTime.fromISO(u.deleted_at) < epochEndDate)
            );
          });

          const activeUsersCountInEpoch = users.length;
          const uniqueRecipients = [
            ...new Set(epoch.token_gifts.map(g => g.recipient_id)),
          ].length;
          const giftWithNotes = epoch.token_gifts.filter(g => !!g.note).length;
          const possibleNotes = activeUsersCountInEpoch
            ? activeUsersCountInEpoch * (activeUsersCountInEpoch - 1)
            : 0;

          /* Part 1: pGIVE Total for Epoch (The pGIVE “pot”) */
          /* ----------------------------------------------- */
          /* GIVE receivers Base */
          const baseValuePoints = Math.min(
            uniqueRecipients * BASE_ACTIVE_POINTS,
            MAX_BASE_ACTIVE_TOTAL
          );

          /* Active Months Bonus */
          const activeMonthsBonusTotal =
            Math.min(
              activeMonths * PER_ACTIVE_MONTH_BONUS,
              MAX_ACTIVE_MONTH_BONUS
            ) * uniqueRecipients;

          /* Notes Written Bonus */
          const notesBonusTotal = possibleNotes
            ? (giftWithNotes / possibleNotes) *
              MAX_NOTE_BONUS_PER_USER *
              uniqueRecipients
            : 0;

          const potTotal =
            notesBonusTotal + activeMonthsBonusTotal + baseValuePoints;

          /* Part 2: pGIVE per Contributor (Splitting the “pot”) */

          const totalTokensSent = epoch.token_gifts.length
            ? epoch.token_gifts.reduce((total, { tokens }) => total + tokens, 0)
            : 0;

          const endDate = DateTime.fromISO(epoch.end_date);
          const usersData: Record<string, UserData> = {};
          const monthKey = `${epochEndDate.get('year')}-${endDate.get(
            'month'
          )}`;
          const { insert_circle_pgives_one } = await adminClient.mutate(
            {
              insert_circle_pgives_one: [
                {
                  object: {
                    circle_id: circle.id,
                    month: epochEndDate.get('month'),
                    year: epochEndDate.get('year'),
                    active_months: epochIndexed[monthKey].activeMonths,
                  },
                },
                { id: true },
              ],
            },
            {
              operationName: 'testtto',
            }
          );

          // ops[`e${epoch.id}_circle`] = {
          //   insert_circle_pgives_one: [
          //     {
          //       object: {
          //         circle_id: circle.id,
          //       month: epochEndDate.get('month'),
          //         year: epochEndDate.get('year'),
          //         active_months: epochIndexed[monthKey].activeMonths,
          //       },
          //     },
          //     { id: true}
          //   ],
          // };

          if (insert_circle_pgives_one) {
            ops[`e${epoch.id}_epoch`] = {
              update_epochs_by_pk: [
                {
                  pk_columns: { id: epoch.id },
                  _set: {
                    pgive: potTotal,
                    gives_receiver_base: baseValuePoints,
                    active_months_bonus: activeMonthsBonusTotal,
                    notes_bonus: notesBonusTotal,
                    circle_pgives_id: insert_circle_pgives_one.id,
                  },
                },
                { __typename: true },
              ],
            };
          }

          /* tabulate user received GIVES in epoch */
          epoch.token_gifts.forEach(g => {
            if (!(g.recipient_id.toString() in usersData)) {
              usersData[g.recipient_id.toString()] = {
                userId: g.recipient_id,
                name: g.recipient.name,
                givesReceived: g.tokens,
                epochTotalGives: totalTokensSent,
                pGive: 0,
                normalizedPGive: 0,
                circleId: circle.id,
                circleName: circle.name,
                normalizedEpochs: epochIndexed[key].epochs.map(e => e.id),
                month: endDate.get('month'),
                year: endDate.get('year'),
                potTotal,
                epochId: epoch.id,
                givesReceiverBase: baseValuePoints,
                activeMonthsBonus: activeMonthsBonusTotal,
                notesBonusTotal: notesBonusTotal,
              };
            } else {
              usersData[g.recipient_id].givesReceived += g.tokens;
            }
          });

          /* Calculate pGive for epoch */
          Object.keys(usersData).forEach(uK => {
            usersData[uK].pGive = usersData[uK].givesReceived
              ? (usersData[uK].givesReceived / usersData[uK].epochTotalGives) *
                usersData[uK].potTotal
              : 0;
          });
          epochBasedData[epoch.id] = usersData;
        }

        /* Normalize the pGive if there is more than 1 epoch in that month */

        epochIndexed[key].epochs.forEach(epoch => {
          Object.keys(epochBasedData[epoch.id]).forEach(recipientId => {
            let epochsTotalPGive = 0;
            epochBasedData[epoch.id][recipientId].normalizedEpochs.forEach(
              eId => {
                epochsTotalPGive +=
                  recipientId in epochBasedData[eId]
                    ? epochBasedData[eId][recipientId].pGive
                    : 0;
              }
            );
            epochBasedData[epoch.id][recipientId].normalizedPGive =
              epochsTotalPGive /
              epochBasedData[epoch.id][recipientId].normalizedEpochs.length;
          });
        });
      }
    }
  });

  if (Object.keys(ops).length) {
    await adminClient.mutate(
      {
        __alias: {
          ...ops,
        },
      },
      {
        operationName: 'endEpoch_update',
      }
    );
  }

  // const headers = [
  //   'userId',
  //   'userName',
  //   'month',
  //   'year',
  //   'epochId',
  //   'circleId',
  //   'circleName',
  //   'givesReceived',
  //   'epochTotalGives',
  //   'pGive',
  //   'normalizedPGive',
  //   'normalizedEpochs',
  //   'potTotal',
  //   'givesReceiverBase',
  //   'activeMonthsBonus',
  //   'notesBonusTotal',
  // ];
  // let csvText = `${headers.join(',')}\r\n`;
  // Object.keys(epochBasedData).forEach(epochId => {
  //   Object.keys(epochBasedData[parseInt(epochId)]).forEach(recipientId => {
  //     const u = epochBasedData[parseInt(epochId)][recipientId];
  //     csvText += `${[
  //       u.userId,
  //       u.name,
  //       u.month,
  //       u.year,
  //       u.epochId,
  //       u.circleId,
  //       u.circleName,
  //       u.givesReceived,
  //       u.epochTotalGives,
  //       u.pGive.toFixed(2),
  //       u.normalizedPGive.toFixed(2),
  //       u.normalizedEpochs.join(' '),
  //       u.potTotal,
  //       u.givesReceiverBase,
  //       u.activeMonthsBonus,
  //       u.notesBonusTotal,
  //     ].join(',')}\r\n`;
  //   });
  // });

  // const fileName = `testpgives.csv`;
  // const result = await uploadCsv(`testpGives/${fileName}`, csvText);

  res.status(200).json({ message: 'yess' });
}

interface UserData {
  userId: number;
  name: string;
  month: number;
  year: number;
  epochId: number;
  circleId: number;
  circleName: string;
  givesReceived: number;
  epochTotalGives: number;
  pGive: number;
  normalizedPGive: number;
  normalizedEpochs: Array<number>;
  potTotal: number;
  givesReceiverBase: number;
  activeMonthsBonus: number;
  notesBonusTotal: number;
}

interface EpochIndexed {
  epochs: getCircleGiftsResult[0]['epochs'];
  activeMonths: number;
}

type getCircleGiftsResult = Awaited<ReturnType<typeof getCircleGifts>>;
const getCircleGifts = async () => {
  const { circles } = await adminClient.query({
    circles: [
      {
        // limit: 250,
      },
      {
        circle_pgives: [
          {},
          {
            id: true,
          },
        ],
        id: true,
        name: true,
        epochs: [
          {
            where: {
              ended: { _eq: true },
            },
          },
          {
            id: true,
            end_date: true,
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
  });

  return circles;
};

export default verifyHasuraRequestMiddleware(handler);
