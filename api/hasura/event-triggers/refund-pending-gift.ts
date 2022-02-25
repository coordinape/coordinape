import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { gql } from '../../../api-lib/Gql';
import { EventTriggerPayload } from '../../../api-lib/types';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

async function handler(req: VercelRequest, res: VercelResponse) {
  // no parsing should be needed here since this data comes straight from
  // the database and zeus keeps this consistent for us
  const payload: EventTriggerPayload<'pending_token_gifts', 'DELETE'> =
    req.body;
  const { sender_id, tokens: tokensToRefund } = payload.event.data.old;

  try {
    const { users_by_pk } = await gql.q('query')({
      users_by_pk: [
        { id: sender_id },
        {
          give_token_remaining: true,
          circle_id: true,
          name: true,
        },
      ],
    });
    assert(users_by_pk, `dangling give without user: ${sender_id}`);
    const {
      give_token_remaining: originalGive,
      name: senderName,
      circle_id,
    } = users_by_pk;

    if (tokensToRefund > 0) {
      const { update_users_by_pk: result } = await gql.q('mutation')({
        update_users_by_pk: [
          {
            pk_columns: { id: sender_id },
            _set: { give_token_remaining: originalGive + tokensToRefund },
          },
          { give_token_remaining: true },
        ],
      });
      assert(
        result,
        `GIVE refund mutation failed unexpectedly for ${senderName} in circle #${circle_id}`
      );
      res.status(200).json({
        message:
          `${tokensToRefund} GIVE refunded to ${senderName} in circle #${circle_id}, ` +
          `bringing their remaining GIVE to ${result.give_token_remaining}`,
      });
      return;
    }
    res.status(200).json({
      message: `No GIVE to refund for ${senderName} in circle #${circle_id}`,
    });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}

export default verifyHasuraRequestMiddleware(handler);
