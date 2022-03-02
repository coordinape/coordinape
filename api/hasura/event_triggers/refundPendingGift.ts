import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { gql } from '../../../api-lib/Gql';
import { EventTriggerPayload } from '../../../api-lib/types';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

async function handler(req: VercelRequest, res: VercelResponse) {
  // no parsing should be needed here since this data comes straight from
  // the database and zeus keeps this consistent for us
  const payload: EventTriggerPayload<
    'pending_token_gifts',
    'DELETE' | 'UPDATE'
  > = req.body;
  const {
    recipient_id,
    sender_id,
    tokens: tokensToRefund,
    circle_id,
  } = payload.event.data.old;

  const newTokenAmount = payload.event.data.new?.tokens ?? 0;

  if (tokensToRefund === 0 || newTokenAmount != 0) {
    res.status(200).json({
      message: `Not a refund event.`,
    });
    return;
  }

  try {
    const { users_by_pk: sender } = await gql.q('query')({
      users_by_pk: [
        { id: sender_id },
        {
          non_giver: true,
          give_token_remaining: true,
          name: true,
        },
      ],
    });
    const { users_by_pk: recipient } = await gql.q('query')({
      users_by_pk: [
        { id: recipient_id },
        {
          non_receiver: true,
          give_token_received: true,
          name: true,
        },
      ],
    });
    assert(sender, `dangling give without user: ${sender_id}`);
    assert(recipient, `dangling give without user: ${recipient_id}`);
    const {
      give_token_remaining: originalGive,
      name: senderName,
      non_giver,
    } = sender;

    const {
      give_token_received: originalReceived,
      name: recipientName,
      non_receiver,
    } = recipient;

    if (tokensToRefund > 0 && (non_giver || non_receiver)) {
      const { update_users_by_pk: remainingResult } = await gql.q('mutation')({
        update_users_by_pk: [
          {
            pk_columns: { id: sender_id },
            _set: { give_token_remaining: originalGive + tokensToRefund },
          },
          { give_token_remaining: true },
        ],
      });
      const { update_users_by_pk: receivedResult } = await gql.q('mutation')({
        update_users_by_pk: [
          {
            pk_columns: { id: recipient_id },
            _set: { give_token_received: originalReceived - tokensToRefund },
          },
          { give_token_received: true },
        ],
      });
      assert(
        remainingResult && receivedResult,
        `GIVE refund mutation failed unexpectedly for ${senderName} in circle #${circle_id}`
      );
      res.status(200).json({
        message:
          `${tokensToRefund} GIVE refunded to ${senderName} from ${recipientName} in circle #${circle_id}, ` +
          `bringing their remaining GIVE to ${remainingResult.give_token_remaining}`,
      });
      return;
    }
    res.status(200).json({
      message: `No GIVE to refund to ${senderName} in circle #${circle_id}`,
    });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}

export default verifyHasuraRequestMiddleware(handler);
