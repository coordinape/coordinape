import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { formatCustomDate } from '../../../../api-lib/dateTimeHelpers';
import { order_by } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getEpoch } from '../../../../api-lib/gql/queries';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { uploadCsv } from '../../../../api-lib/s3';
import { Awaited } from '../../../../api-lib/ts4.5shim';
import { shortenAddress } from '../../../../src/utils';

const giveCsvInput = z
  .object({
    circle_id: z.number().int().positive(),
    epoch: z.number().int().optional(),
    epoch_id: z.number().int().optional(),
  })
  .strict()
  .refine(
    data => data.epoch || data.epoch_id,
    'Either epoch or a epoch_id must be provided.'
  );

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, giveCsvInput);

  const { circle_id, epoch_id, epoch } = payload;
  const epochObj = await getEpoch(circle_id, epoch_id, epoch);
  if (!epochObj) {
    return errorResponseWithStatusCode(
      res,
      { message: 'Epoch does not exist in this circle' },
      422
    );
  }

  const circle = await getCircleDetails(
    circle_id,
    epochObj.id,
    epochObj.end_date
  );
  assert(circle, 'No Circle Found');

  const userValues = generateCsvValues(circle);
  const headers = ['No', 'GIVEr', 'address'];
  circle.users?.map(u => {
    headers.push((u.deleted_at ? '(Deleted) ' : '') + u.profile.name);
  });
  let csvText = `${headers.join(',')}\r\n`;
  userValues.forEach(rowValues => {
    csvText += `${rowValues.join(',')}\r\n`;
  });
  const epochName = epochObj.description ?? `epoch-${epochObj.number}`;
  const fileName = `individual_gives_${epochObj.circle?.organization?.name}-${
    epochObj.circle?.name
  }-${epochName}-date-${formatCustomDate(
    epochObj.start_date,
    'ddLLyy'
  )}-${formatCustomDate(epochObj.end_date, 'ddLLyy')}.csv`;
  const result = await uploadCsv(
    `${circle_id}/${epochObj.id}/${uuidv4()}/${fileName}`,
    csvText
  );

  res.status(200).json({
    file: result.Location,
  });
}

export function generateCsvValues(circle: CircleDetails) {
  assert(circle, 'No Circle Found');
  const { users } = circle;
  assert(users, 'No users Found');
  const received: number[] = Array(users.length).fill(0);
  const userValues = users?.map((u, idx) => {
    const rowValues: (string | number)[] = [
      idx + 1,
      (u.deleted_at ? '(Deleted) ' : '') + u.profile.name,
      shortenAddress(u.address),
    ];
    users?.map(r => {
      const sent = u.sent_gifts.find(g => g.recipient_id === r.id);
      if (sent) {
        rowValues.push(sent.tokens);
      } else {
        rowValues.push(0);
      }
    });
    received[idx] = u.received_gifts.length
      ? u.received_gifts
          .map(u => u.tokens)
          .reduce((total, tokens) => tokens + total)
      : 0;
    return rowValues;
  });
  userValues.push(['', '', 'total received', ...received]);
  return userValues;
}

export type CircleDetails = Awaited<ReturnType<typeof getCircleDetails>>;

export async function getCircleDetails(
  circle_id: number,
  epochId: number,
  epochEndDate: string
) {
  const { circles_by_pk } = await adminClient.query(
    {
      circles_by_pk: [
        { id: circle_id },
        {
          users: [
            {
              order_by: [{ profile: { name: order_by.asc } }],
              where: {
                _or: [
                  { deleted_at: { _is_null: true } },
                  { deleted_at: { _gt: epochEndDate } },
                ],
              },
            },
            {
              id: true,
              address: true,
              deleted_at: true,
              profile: { id: true, name: true },
              received_gifts: [
                { where: { epoch_id: { _eq: epochId } } },
                { tokens: true },
              ],
              sent_gifts: [
                { where: { epoch_id: { _eq: epochId } } },
                { tokens: true, recipient_id: true },
              ],
            },
          ],
        },
      ],
    },
    { operationName: 'giveCsv_getGifts' }
  );
  return {
    ...circles_by_pk,
  };
}

export default authCircleAdminMiddleware(handler);
