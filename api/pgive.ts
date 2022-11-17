import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';

import { order_by } from '../api-lib/gql/__generated__/zeus';
import { adminClient } from '../api-lib/gql/adminClient';
import { uploadCsv } from '../api-lib/s3';
import { Awaited } from '../api-lib/ts4.5shim';

Settings.defaultZone = 'utc';

const BASE_ACTIVE_POINTS = 100;
const MAX_BASE_ACTIVE_TOTAL = 3000;
const PER_ACTIVE_MONTH_BONUS = 4;
const MAX_ACTIVE_MONTH_BONUS = 48;
const MAX_NOTE_BONUS_PER_USER = 30;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // try {

  const { offset, limit } = req.query;

  const circles = await getCircleGifts(limit || '250', offset || '0');
  const epochBasedData: Record<number, Record<string, UserData>> = [];
  circles.forEach(circle => {
    if (circle.epochs.length) {
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
            epochIndexed[monthKey] = {
              epochs: [],
              activeMonths,
              totalOptOutPgiveAlloc: {},
            };
            activeMonths++;
          }
          epochIndexed[monthKey].epochs.push(epoch);
        });

      /* calc base bonuses */
      Object.keys(epochIndexed).forEach(key => {
        epochIndexed[key].epochs.forEach(epoch => {
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
              epochIndexed[key].activeMonths * PER_ACTIVE_MONTH_BONUS,
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

          /* tabulate user received GIVES in epoch */
          epoch.token_gifts.forEach(g => {
            if (!(g.recipient_id.toString() in usersData)) {
              usersData[g.recipient_id.toString()] = {
                userId: g.recipient_id,
                name: g.recipient.name,
                address: g.recipient_address,
                givesReceived: g.tokens,
                notesOnly: g.tokens ? 0 : 1,
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
                possibleNotes,
                giftCount: 1,
                sentGifts: epoch.token_gifts.filter(
                  f => f.sender_id === g.recipient_id
                ).length,
                optOutBonusAlloc: 0,
              };
            } else {
              usersData[g.recipient_id].givesReceived += g.tokens;
              usersData[g.recipient_id].giftCount++;

              if (!g.tokens) usersData[g.recipient_id].notesOnly++;
            }
          });

          epochBasedData[epoch.id] = usersData;
        });
      });

      Object.keys(epochIndexed).forEach(key => {
        /* Calc Opt out bonus from potTotal */
        epochIndexed[key].epochs.forEach(epoch => {
          let totalOptOutPgiveAlloc = 0;
          const recipientIds = Object.keys(epochBasedData[epoch.id]);
          if (recipientIds.length) {
            const optOutShare =
              (0.5 * epochBasedData[epoch.id][recipientIds[0]].potTotal) /
              recipientIds.length;
            recipientIds.forEach(recipientId => {
              const recipient = epochBasedData[epoch.id][recipientId];
              if (
                recipient.pGive === 0 &&
                recipient.sentGifts > 0 &&
                recipient.notesOnly === recipient.giftCount
              ) {
                const optOutBonusAlloc =
                  Math.round(
                    (recipient.notesOnly / recipient.possibleNotes) *
                      optOutShare *
                      100
                  ) / 100;
                epochBasedData[epoch.id][recipientId].optOutBonusAlloc =
                  optOutBonusAlloc;
                totalOptOutPgiveAlloc += optOutBonusAlloc;
              }
            });
          }
          epochIndexed[key].totalOptOutPgiveAlloc[epoch.id] =
            totalOptOutPgiveAlloc;
        });

        epochIndexed[key].epochs.forEach(epoch => {
          const totalOptOutPgiveAlloc = 0;
          const recipientIds = Object.keys(epochBasedData[epoch.id]);
          if (recipientIds.length) {
            /* Calculate pGive per recipient */
            const totalOptOutPgiveAlloc =
              epochIndexed[key].totalOptOutPgiveAlloc[epoch.id];
            recipientIds.forEach(recipientId => {
              const recipient = epochBasedData[epoch.id][recipientId];
              if (recipient.givesReceived) {
                epochBasedData[epoch.id][recipientId].pGive =
                  (recipient.givesReceived / recipient.epochTotalGives) *
                  (recipient.potTotal - totalOptOutPgiveAlloc);
              }
              epochBasedData[epoch.id][recipientId].pGive +=
                epochBasedData[epoch.id][recipientId].optOutBonusAlloc;
            });
          }
          epochIndexed[key].totalOptOutPgiveAlloc[epoch.id] =
            totalOptOutPgiveAlloc;
        });

        /* Normalize the epochs pgives in the same month */
        epochIndexed[key].epochs.forEach(epoch => {
          Object.keys(epochBasedData[epoch.id]).forEach(recipientId => {
            if (epochIndexed[key].epochs.length > 1) {
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
            } else {
              epochBasedData[epoch.id][recipientId].normalizedPGive =
                epochBasedData[epoch.id][recipientId].pGive;
            }
          });
        });
      });
    }
  });

  const headers = [
    'userId',
    'userName',
    'address',
    'month',
    'year',
    'epochId',
    'circleId',
    'circleName',
    'givesReceived',
    'epochTotalGives',
    'pGive',
    'normalizedPGive',
    'normalizedEpochs',
    'potTotal',
    'givesReceiverBase',
    'activeMonthsBonus',
    'notesBonusTotal',
  ];
  let csvText = `${headers.join(',')}\r\n`;
  Object.keys(epochBasedData).forEach(epochId => {
    Object.keys(epochBasedData[parseInt(epochId)]).forEach(recipientId => {
      const u = epochBasedData[parseInt(epochId)][recipientId];
      csvText += `${[
        u.userId,
        u.name.replace(/,/g, ''),
        u.address,
        u.month,
        u.year,
        u.epochId,
        u.circleId,
        u.circleName.replace(/,/g, ''),
        u.givesReceived,
        u.epochTotalGives,
        u.pGive.toFixed(2),
        u.normalizedPGive.toFixed(2),
        u.normalizedEpochs.join(' '),
        u.potTotal.toFixed(2),
        u.givesReceiverBase.toFixed(2),
        u.activeMonthsBonus.toFixed(2),
        u.notesBonusTotal.toFixed(2),
      ].join(',')}\r\n`;
    });
  });

  const fileName = `testpgives.csv`;
  const result = await uploadCsv(`testpGives/${fileName}`, csvText);

  res.status(200).json({ message: result.Location });
}

interface UserData {
  userId: number;
  name: string;
  address: string;
  month: number;
  year: number;
  epochId: number;
  circleId: number;
  circleName: string;
  givesReceived: number;
  notesOnly: number;
  epochTotalGives: number;
  pGive: number;
  normalizedPGive: number;
  normalizedEpochs: Array<number>;
  potTotal: number;
  givesReceiverBase: number;
  activeMonthsBonus: number;
  notesBonusTotal: number;
  possibleNotes: number;
  giftCount: number;
  sentGifts: number;
  optOutBonusAlloc: number;
}

interface EpochIndexed {
  epochs: getCircleGiftsResult[0]['epochs'];
  activeMonths: number;
  totalOptOutPgiveAlloc: Record<number, number>;
}

type getCircleGiftsResult = Awaited<ReturnType<typeof getCircleGifts>>;
const getCircleGifts = async (
  limit: string | string[],
  offset: string | string[]
) => {
  const { circles } = await adminClient.query({
    circles: [
      {
        limit: limit ? +limit : 250,
        offset: offset ? +offset : 0,
        order_by: [{ id: order_by.asc }],
      },
      {
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
