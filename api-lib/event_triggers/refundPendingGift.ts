import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { ValueTypes } from '../gql/__generated__/zeus';
import { adminClient } from '../gql/adminClient';
import * as queries from '../gql/queries';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // no parsing should be needed here since this data comes straight from
  // the database and zeus keeps this consistent for us
  const {
    event: { data },
  }: EventTriggerPayload<'users', 'UPDATE'> = req.body;

  const { address, circle_id } = data.new;

  const userDeleted = !data.old.deleted_at && data.new.deleted_at;

  const newNonGiver =
    (!data.old.non_giver && data.new.non_giver) || userDeleted;
  const newNonReceiver =
    (!data.old.non_receiver && data.new.non_receiver) || userDeleted;

  const results = [];
  try {
    const user = await queries.getUserAndCurrentEpoch(address, circle_id);
    assert(user, 'panic: user must exist');

    const { pending_sent_gifts, pending_received_gifts, id: userId } = user;

    const currentEpoch = user.circle.epochs.pop();
    if (
      !currentEpoch ||
      !(newNonGiver || newNonReceiver) ||
      (!userDeleted && newNonGiver && pending_sent_gifts.length === 0) ||
      (!userDeleted && newNonReceiver && pending_received_gifts.length === 0) ||
      (userDeleted &&
        pending_received_gifts.length === 0 &&
        pending_sent_gifts.length === 0)
    ) {
      res.status(200).json({
        message: `Not a refund event.`,
      });
      return;
    }

    if (newNonGiver && pending_sent_gifts.length > 0) {
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

      const newNonGiverResult = await adminClient.mutate({
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
          ...refundFromCounterpartyMutations,
        },
      });
      results.push(newNonGiverResult);
    }

    if (newNonReceiver && pending_received_gifts.length > 0) {
      const totalRefund = pending_received_gifts
        .map(gift => gift.tokens)
        .reduce((total, tokens) => tokens + total);

      const refundToCounterpartyMutations = pending_received_gifts.reduce(
        (muts, gift) => {
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
        },
        {} as { [aliasKey: number]: ValueTypes['mutation_root'] }
      );

      const newNonReceiverResult = await adminClient.mutate({
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
          ...refundToCounterpartyMutations,
        },
      });
      results.push(newNonReceiverResult);
    }
  } catch (e) {
    errorResponse(res, e);
    return;
  }

  res.status(200).json({
    message: `refunds completed`,
    results,
  });
}
