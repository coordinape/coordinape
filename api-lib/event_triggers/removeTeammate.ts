import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { ValueTypes } from '../gql/__generated__/zeus';
import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // no parsing should be needed here since this data comes straight from
  // the database and zeus keeps this consistent for us
  const {
    event: { data },
  }: EventTriggerPayload<'teammates', 'DELETE'> = req.body;

  const { user_id, team_mate_id } = data.old;

  const results = [];
  try {
    const { users_by_pk } = await adminClient.query(
      {
        users_by_pk: [
          {
            id: user_id,
          },
          {
            pending_sent_gifts: [
              {
                where: {
                  recipient_id: {
                    _eq: team_mate_id,
                  },
                },
              },
              {
                id: true,
                recipient_id: true,
                tokens: true,
              },
            ],
            circle: {
              epochs: [
                {
                  where: {
                    end_date: { _gt: 'now()' },
                    start_date: { _lt: 'now()' },
                  },
                },
                {
                  id: true,
                },
              ],
            },
          },
        ],
      },
      {
        operationName: 'removeTeammates-findUser',
      }
    );
    assert(users_by_pk, 'panic: user must exist');

    const { pending_sent_gifts, circle } = users_by_pk;

    const currentEpoch = circle.epochs.pop();
    if (!currentEpoch || pending_sent_gifts.length === 0) {
      res.status(200).json({
        message: `Not a refund event.`,
      });
      return;
    }

    const totalRefund = pending_sent_gifts
      .map(gift => gift.tokens)
      .reduce((total, tokens) => tokens + total);

    const refundFromCounterpartyMutations = pending_sent_gifts.reduce(
      (ops, gift) => {
        if (gift.tokens > 0)
          ops[gift.id] = {
            update_users_by_pk: [
              {
                pk_columns: { id: gift.recipient_id },
                _inc: { give_token_received: -gift.tokens },
              },
              { give_token_received: true },
            ],
          };
        return ops;
      },
      {} as { [aliasKey: number]: ValueTypes['mutation_root'] }
    );

    const newNonGiverResult = await adminClient.mutate(
      {
        delete_pending_token_gifts: [
          {
            where: {
              epoch_id: { _eq: currentEpoch.id },
              sender_id: { _eq: user_id },
              recipient_id: { _eq: team_mate_id },
            },
          },
          // something needs to be returned in the mutation
          { __typename: true, affected_rows: true },
        ],
        __alias: {
          refundToUser: {
            update_users_by_pk: [
              {
                pk_columns: { id: user_id },
                _inc: { give_token_remaining: totalRefund },
              },
              { give_token_remaining: true, id: true },
            ],
          },
          ...refundFromCounterpartyMutations,
        },
      },
      {
        operationName: 'removeTeammates-deleteAndRefund',
      }
    );
    results.push(newNonGiverResult);
  } catch (e) {
    errorResponse(res, e);
  }

  res.status(200).json({
    message: `refunds completed`,
    results,
  });
}
