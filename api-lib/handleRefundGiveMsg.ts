import assert from 'assert';

import { adminClient } from './gql/adminClient';
import * as queries from './gql/queries';
import { sendSocialMessage } from './sendSocialMessage';
import { EventTriggerPayload } from './types';

export default async function handleRefundGiveMsg(
  payload: EventTriggerPayload<'pending_token_gifts', 'DELETE' | 'UPDATE'>,
  channels: { discord?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;
  const { tokens: tokensToRefund } = payload.event.data.old;

  const newTokenAmount = payload.event.data.new?.tokens ?? 0;
  if (tokensToRefund === 0 || newTokenAmount != 0) {
    return false;
  }

  const currentEpoch = await queries.getCurrentEpoch(data.old.circle_id);
  if (currentEpoch) {
    const { users_by_pk: sender } = await adminClient.query(
      {
        users_by_pk: [
          { id: data.old.sender_id },
          { name: true, non_giver: true },
        ],
      },
      {
        operationName: 'refund-getSenders',
      }
    );
    const { users_by_pk: recipient } = await adminClient.query(
      {
        users_by_pk: [
          { id: data.old.recipient_id },
          { name: true, non_receiver: true },
        ],
      },
      {
        operationName: 'refund-getRecipients',
      }
    );
    assert(sender);
    assert(recipient);
    if (sender.non_giver || recipient.non_receiver) {
      await sendSocialMessage({
        // note: give_token_received is susceptible to inconsistencies
        // and will be deprecated. This total will be removed when the column
        // is removed
        message:
          `${sender.name} has been refunded ${data.old.tokens} GIVE ` +
          `from ${recipient.name}`,
        circleId: data.old.circle_id,
        channels,
      });
      return true;
    }
  }
  return false;
}
