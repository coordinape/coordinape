import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { formatShortDateTime } from '../../../../api-lib/dateTimeHelpers';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getEpoch } from '../../../../api-lib/gql/queries';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { uploadCsv } from '../../../../api-lib/s3';
import isFeatureEnabled from '../../../../src/config/features';
import {
  allocationCsvInput,
  composeHasuraActionRequestBody,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
  } = composeHasuraActionRequestBody(allocationCsvInput).parse(req.body);

  const { circle_id, epoch_id, epoch } = payload;
  const epochObj = await getEpoch(circle_id, epoch_id, epoch);
  if (!epochObj) {
    return errorResponseWithStatusCode(
      res,
      { message: 'Epoch does not exist in this circle' },
      422
    );
  }
  const { circles_by_pk } = await adminClient.query(
    {
      circles_by_pk: [
        { id: circle_id },
        {
          fixed_payment_token_type: true,
          users: [
            {
              where: {
                _or: [
                  {
                    deleted_at: { _is_null: true },
                  },
                  {
                    deleted_at: { _gt: epochObj.end_date },
                  },
                ],
              },
            },
            {
              id: true,
              name: true,
              address: true,
              fixed_payment_amount: true,
              received_gifts: [
                { where: { epoch_id: { _eq: epochObj.id } } },
                {
                  tokens: true,
                },
              ],
              sent_gifts: [
                { where: { epoch_id: { _eq: epochObj.id } } },
                {
                  tokens: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      operationName: 'allocationCsv_getGifts',
    }
  );
  assert(circles_by_pk, 'No Circle Found');
  const fixedPaymentsEnabled =
    isFeatureEnabled('fixed_payments') &&
    circles_by_pk.fixed_payment_token_type;
  const users = circles_by_pk.users;
  const grant = payload.grant ?? epochObj.grant;
  const totalTokensSent = epochObj.token_gifts.length
    ? epochObj.token_gifts
        .map(g => g.tokens)
        .reduce((total, tokens) => tokens + total)
    : 0;
  const dateRange = `${formatShortDateTime(
    epochObj.start_date
  )} - ${formatShortDateTime(epochObj.end_date)}`.replace(/,/g, '');
  const headers = [
    'No',
    'name',
    'address',
    'received',
    'sent',
    'epoch_number',
    'Date',
  ];
  if (fixedPaymentsEnabled) {
    headers.push('fixed_payment_amount');
    headers.push('fixed_payment_token_symbol');
  }
  if (grant) headers.push('Grant_amt');

  let csvText = `${headers.join(',')}\r\n`;
  users.map((u, idx) => {
    const received = u.received_gifts.length
      ? u.received_gifts
          .map(g => g.tokens)
          .reduce((total, tokens) => tokens + total)
      : 0;
    const rowValues = [
      idx + 1,
      u.name,
      u.address,
      received,
      u.sent_gifts.length
        ? u.sent_gifts
            .map(g => g.tokens)
            .reduce((total, tokens) => tokens + total)
        : 0,
      epochObj.number,
      dateRange,
    ];
    if (fixedPaymentsEnabled) {
      rowValues.push(u.fixed_payment_amount);
      rowValues.push(circles_by_pk.fixed_payment_token_type);
    }
    if (grant)
      rowValues.push(
        received
          ? Math.floor(((received * grant) / totalTokensSent) * 100) / 100
          : 0
      );
    return (csvText += `${rowValues.join(',')}\r\n`);
  });
  const fileName = `${epochObj.circle?.organization?.name}-${epochObj.circle?.name}-${epochObj?.number}.csv`;
  const result = await uploadCsv(
    `${circle_id}/${epochObj.id}/${uuidv4()}/${fileName}`,
    csvText
  );

  res.status(200).json({
    file: result.Location,
  });
}

export default authCircleAdminMiddleware(handler);
