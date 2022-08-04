import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { DISTRIBUTION_TYPE } from '../../../../api-lib/constants';
import { formatCustomDate } from '../../../../api-lib/dateTimeHelpers';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getEpoch } from '../../../../api-lib/gql/queries';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { uploadCsv } from '../../../../api-lib/s3';
import { Awaited } from '../../../../api-lib/ts4.5shim';
import { isFeatureEnabled } from '../../../../src/config/features';
import {
  allocationCsvInput,
  composeHasuraActionRequestBody,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
  } = composeHasuraActionRequestBody(allocationCsvInput).parse(req.body);

  const { circle_id, epoch_id, epoch, form_gift_amount, gift_token_symbol } =
    payload;
  const epochObj = await getEpoch(circle_id, epoch_id, epoch);
  if (!epochObj) {
    return errorResponseWithStatusCode(
      res,
      { message: 'Epoch does not exist in this circle' },
      422
    );
  }
  const grant = payload.grant ?? epochObj.grant;

  const totalTokensSent = epochObj.token_gifts.length
    ? epochObj.token_gifts
        .map(g => g.tokens)
        .reduce((total, tokens) => tokens + total)
    : 0;
  const circle = await getCircleDetails(
    circle_id,
    epochObj.id,
    epochObj.end_date
  );
  assert(circle, 'No Circle Found');
  const fixedPaymentsEnabled =
    isFeatureEnabled('fixed_payments') && !!circle.fixed_payment_token_type;

  const userValues = generateCsvValues(
    circle,
    form_gift_amount,
    gift_token_symbol,
    totalTokensSent,
    fixedPaymentsEnabled,
    circle.fixed_payment_token_type,
    grant
  );

  const headers = [
    'No',
    'name',
    'address',
    'received',
    'sent',
    'givers',
    'percentage_of_give',
    'circle_rewards',
    'circle_rewards_token',
  ];
  if (fixedPaymentsEnabled) {
    headers.push('fixed_payment_amount');
    headers.push('fixed_payment_token_symbol');
  }
  if (grant) headers.push('Grant_amt');
  let csvText = `${headers.join(',')}\r\n`;
  userValues.map(rowValues => {
    csvText += `${rowValues.join(',')}\r\n`;
  });
  const fileName = `${epochObj.circle?.organization?.name}-${
    epochObj.circle?.name
  }-epoch-${epochObj.number}-date-${formatCustomDate(
    epochObj.start_date,
    'ddLLyy'
  )}-${formatCustomDate(epochObj.end_date, 'ddLLyy')}.csv`;
  const result = await uploadCsv(
    `${circle_id}/${epochObj.id}/${uuidv4()}/${fileName}`,
    csvText
  );

  console.debug(result.Location);
  res.status(200).json({
    file: result.Location,
  });
}

export function generateCsvValues(
  circle: CircleDetails,
  formGiftAmount: number,
  giftTokenSymbol: string | undefined,
  totalTokensSent: number,
  fixedPaymentsEnabled: boolean,
  fixedPaymentTokenType: string | undefined,
  grant: number | undefined
) {
  assert(circle, 'No Circle Found');
  assert(circle.epochs[0], 'No Epoch Found');

  const distEpoch = circle.epochs[0];
  const circleDist = distEpoch.distributions.find(
    d =>
      d.distribution_type === DISTRIBUTION_TYPE.GIFT ||
      d.distribution_type === DISTRIBUTION_TYPE.COMBINED
  );
  const fixedDist = distEpoch.distributions.find(
    d =>
      d.distribution_type === DISTRIBUTION_TYPE.FIXED ||
      d.distribution_type === DISTRIBUTION_TYPE.COMBINED
  );

  giftTokenSymbol = circleDist ? circleDist.vault.symbol : giftTokenSymbol;
  const { users } = circle;

  const userValues: (string | number)[][] = [];
  users.map((u, idx) => {
    const received = u.received_gifts.length
      ? u.received_gifts
          .map(g => g.tokens)
          .reduce((total, tokens) => tokens + total)
      : 0;
    const claimed = !fixedDist
      ? 0
      : fixedDist.claims
          .filter(c => c.profile_id === u.profile?.id)
          .reduce((t, g) => t + g.new_amount, 0) || 0;
    let circle_claimed = !circleDist
      ? 0
      : circleDist.claims
          .filter(c => c.profile_id === u.profile?.id)
          .reduce((t, g) => t + g.new_amount, 0) || 0;

    if (
      circleDist &&
      circleDist.distribution_type === DISTRIBUTION_TYPE.COMBINED
    )
      circle_claimed -= u.fixed_payment_amount;

    const rowValues: (string | number)[] = [
      idx + 1,
      u.name,
      u.address,
      received,
      u.sent_gifts.length
        ? u.sent_gifts
            .map(g => g.tokens)
            .reduce((total, tokens) => tokens + total)
        : 0,
      u.received_gifts.length,
      (givenPercent(received, totalTokensSent) * 100).toFixed(2),
      circle_claimed
        ? circle_claimed.toFixed(2)
        : (formGiftAmount * givenPercent(received, totalTokensSent)).toFixed(2),
      giftTokenSymbol || '',
    ];
    if (fixedPaymentsEnabled && fixedPaymentTokenType) {
      const fixedAmount =
        fixedDist && fixedDist.distribution_type === DISTRIBUTION_TYPE.FIXED
          ? claimed
          : u.fixed_payment_amount;
      rowValues.push(fixedAmount.toFixed(2));
      rowValues.push(fixedPaymentTokenType);
    }
    if (grant)
      rowValues.push(
        received
          ? Math.floor(((received * grant) / totalTokensSent) * 100) / 100
          : 0
      );
    userValues.push(rowValues);
  });

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
          fixed_payment_token_type: true,
          epochs: [
            {
              where: {
                id: { _eq: epochId },
              },
            },
            {
              distributions: [
                {
                  where: { tx_hash: { _is_null: false } },
                },
                {
                  distribution_type: true,
                  tx_hash: true,
                  vault: {
                    symbol: true,
                  },
                  claims: [
                    {},
                    {
                      profile_id: true,
                      new_amount: true,
                    },
                  ],
                },
              ],
            },
          ],
          users: [
            {
              where: {
                _or: [
                  {
                    deleted_at: { _is_null: true },
                  },
                  {
                    deleted_at: { _gt: epochEndDate },
                  },
                ],
              },
            },
            {
              id: true,
              name: true,
              address: true,
              fixed_payment_amount: true,
              profile: {
                id: true,
              },
              received_gifts: [
                { where: { epoch_id: { _eq: epochId } } },
                {
                  tokens: true,
                },
              ],
              sent_gifts: [
                { where: { epoch_id: { _eq: epochId } } },
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

  return circles_by_pk;
}

export default authCircleAdminMiddleware(handler);

const givenPercent = (received: number, totalGive: number) => {
  return received / totalGive;
};
