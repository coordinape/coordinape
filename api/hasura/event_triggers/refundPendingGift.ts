import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { gql } from '../../../api-lib/Gql';
import { ErrorResponse } from '../../../api-lib/HttpError';
import { EventTriggerPayload } from '../../../api-lib/types';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { ValueTypes } from '../../../src/lib/gql/zeusHasuraAdmin';

async function handler(req: VercelRequest, res: VercelResponse) {
  // no parsing should be needed here since this data comes straight from
  // the database and zeus keeps this consistent for us
  const {
    event: { data },
  }: EventTriggerPayload<'users', 'UPDATE'> = req.body;

  const { address, circle_id } = data.new;

  const newNonGiver = !data.old.non_giver && data.new.non_giver;
  const newNonReceiver = !data.old.non_receiver && data.new.non_receiver;

  const results = [];
  try {
    const user = await gql.getUserAndCurrentEpoch(address, circle_id);
    assert(user, 'panic: user must exist');

    const { pending_sent_gifts, pending_received_gifts, id: userId } = user;

    const currentEpoch = user.circle.epochs.pop();
    if (
      !currentEpoch ||
      !(newNonGiver || newNonReceiver) ||
      (newNonGiver && pending_sent_gifts.length === 0) ||
      (newNonReceiver && pending_received_gifts.length === 0)
    ) {
      res.status(200).json({
        message: `Not a refund event.`,
      });
      return;
    }

    if (newNonGiver) {
      const totalRefund = pending_sent_gifts
        .map(gift => gift.tokens)
        .reduce((total, tokens) => tokens + total);

      const refundMutations = pending_sent_gifts.reduce((ops, gift) => {
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
      }, {} as { [aliasKey: number]: ValueTypes['mutation_root'] });

      const result = await gql.q('mutation')({
        delete_pending_token_gifts: [
          {
            where: {
              epoch_id: { _eq: currentEpoch.id },
              sender_id: { _eq: user.id },
              note: { _eq: '' },
            },
          },
          // something needs to be returned in the mutation
          { __typename: true, affected_rows: true },
        ],
        update_pending_token_gifts: [
          {
            _set: { tokens: 0 },
            where: {
              epoch_id: { _eq: currentEpoch.id },
              sender_id: { _eq: user.id },
              _not: { note: { _eq: '' } },
            },
          },
          { __typename: true, affected_rows: true },
        ],
        __alias: {
          refundToUser: {
            update_users_by_pk: [
              {
                pk_columns: { id: userId },
                _inc: { give_token_remaining: totalRefund },
              },
              { give_token_remaining: true, id: true },
            ],
          },
          ...refundMutations,
        },
      });
      results.push(result);
    }

    if (newNonReceiver) {
      const totalRefund = pending_received_gifts
        .map(gift => gift.tokens)
        .reduce((total, tokens) => tokens + total);

      const refundMutations = pending_received_gifts.reduce((muts, gift) => {
        if (gift.tokens > 0)
          muts[gift.id] = {
            update_users_by_pk: [
              {
                pk_columns: { id: gift.sender_id },
                _inc: { give_token_remaining: gift.tokens },
              },
              { give_token_remaining: true, id: true },
            ],
          };
        return muts;
      }, {} as { [aliasKey: number]: ValueTypes['mutation_root'] });

      const result = await gql.q('mutation')({
        delete_pending_token_gifts: [
          {
            where: {
              epoch_id: { _eq: currentEpoch.id },
              recipient_id: { _eq: user.id },
              note: { _eq: '' },
            },
          },
          // something needs to be returned in the mutation
          { __typename: true, affected_rows: true },
        ],
        update_pending_token_gifts: [
          {
            _set: { tokens: 0 },
            where: {
              epoch_id: { _eq: currentEpoch.id },
              recipient_id: { _eq: user.id },
              _not: { note: { _eq: '' } },
            },
          },
          { __typename: true, affected_rows: true },
        ],
        __alias: {
          refundFromUser: {
            update_users_by_pk: [
              {
                pk_columns: { id: userId },
                _inc: { give_token_received: -totalRefund },
              },
              { give_token_received: true, id: true },
            ],
          },
          ...refundMutations,
        },
      });
      results.push(result);
    }
  } catch (e) {
    ErrorResponse(res, e);
  }

  res.status(200).json({
    message: `refunds completed`,
    results,
  });
}

export default verifyHasuraRequestMiddleware(handler);
